import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  listBackups,
  getBackupFilePath,
} from "@/core/lib/backup-utils";

// Collections to skip during backup (sessions are not useful to restore)
const SKIP_COLLECTIONS = ["session"];

function getDbName(): string {
  return process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || "test";
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  return uri;
}

function formatDate(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    "_",
    String(d.getHours()).padStart(2, "0"),
    String(d.getMinutes()).padStart(2, "0"),
    String(d.getSeconds()).padStart(2, "0"),
  ].join("");
}

// Convert MongoDB Extended JSON ($oid, $date, etc.) back to native types
function reviveMongoDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      if (obj.$oid !== undefined) {
        result[key] = new ObjectId(obj.$oid as string);
      } else if (obj.$date !== undefined) {
        result[key] = new Date(obj.$date as string | number);
      } else if (obj.$numberInt !== undefined) {
        result[key] = parseInt(obj.$numberInt as string, 10);
      } else if (obj.$numberLong !== undefined) {
        result[key] = parseInt(obj.$numberLong as string, 10);
      } else if (obj.$numberDouble !== undefined) {
        result[key] = parseFloat(obj.$numberDouble as string);
      } else if (obj.$numberDecimal !== undefined) {
        result[key] = parseFloat(obj.$numberDecimal as string);
      } else if (obj.$binary !== undefined) {
        const binary = obj.$binary as Record<string, unknown>;
        result[key] = Buffer.from(binary.base64 as string, "base64");
      } else {
        result[key] = reviveMongoDoc(obj);
      }
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          return reviveMongoDoc(item as Record<string, unknown>);
        }
        return item;
      });
    } else {
      result[key] = value;
    }
  }
  return result;
}

// GET — list backups
export async function GET() {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  try {
    const backups = listBackups();
    return NextResponse.json({ backups });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list backups";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — create backup or restore
export async function POST(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  // ---- CREATE BACKUP (pure JSON export) ----
  if (!action || action === "backup") {
    const dbName = getDbName();
    const uri = getUri();
    const timestamp = formatDate();
    const backupPath = getBackupFilePath(timestamp);

    try {
      fs.mkdirSync(require("path").dirname(backupPath), { recursive: true });

      const client = new MongoClient(uri);
      await client.connect();

      try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        const collectionNames = collections
          .map((c) => c.name)
          .filter((name) => !SKIP_COLLECTIONS.includes(name));

        const data: Record<string, unknown[]> = {};

        for (const name of collectionNames) {
          const docs = await db
            .collection(name)
            .find({})
            .toArray();
          data[name] = JSON.parse(JSON.stringify(docs));
        }

        const backup = {
          metadata: {
            timestamp,
            database: dbName,
            createdAt: new Date().toISOString(),
            collections: collectionNames,
          },
          data,
        };

        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

        const backups = listBackups();
        const created = backups.find((b) => b.timestamp === timestamp);

        return NextResponse.json({
          success: true,
          message: `Backup created — ${collectionNames.length} collections exported`,
          backup: created,
        });
      } finally {
        await client.close();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Backup failed";
      if (fs.existsSync(backupPath)) {
        fs.rmSync(backupPath, { force: true });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // ---- RESTORE BACKUP ----
  if (action === "restore") {
    const timestamp = body.timestamp as string;
    if (!timestamp) {
      return NextResponse.json(
        { error: "Missing timestamp parameter" },
        { status: 400 }
      );
    }

    const dbName = getDbName();
    const uri = getUri();
    const backupPath = getBackupFilePath(timestamp);

    if (!fs.existsSync(backupPath)) {
      return NextResponse.json(
        { error: `Backup not found: ${timestamp}` },
        { status: 404 }
      );
    }

    try {
      const raw = JSON.parse(fs.readFileSync(backupPath, "utf8"));
      const collectionNames: string[] = raw.metadata?.collections ?? [];
      const data: Record<string, Record<string, unknown>[]> = raw.data ?? {};

      const client = new MongoClient(uri);
      await client.connect();

      try {
        const db = client.db(dbName);
        let totalDocs = 0;

        for (const name of collectionNames) {
          const docs = data[name];
          if (!docs || !Array.isArray(docs)) continue;

          try {
            await db.collection(name).drop();
          } catch {
            // collection may not exist, ignore
          }

          if (docs.length === 0) continue;

          const revived = docs.map(reviveMongoDoc);
          await db.collection(name).insertMany(revived);
          totalDocs += revived.length;
        }

        return NextResponse.json({
          success: true,
          message: `Restored ${totalDocs} documents across ${collectionNames.length} collections`,
        });
      } finally {
        await client.close();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Restore failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// DELETE — remove a backup
export async function DELETE(req: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const timestamp = searchParams.get("timestamp");

  if (!timestamp) {
    return NextResponse.json(
      { error: "Missing timestamp parameter" },
      { status: 400 }
    );
  }

  const backupPath = getBackupFilePath(timestamp);

  if (!fs.existsSync(backupPath)) {
    return NextResponse.json(
      { error: `Backup not found: ${timestamp}` },
      { status: 404 }
    );
  }

  try {
    fs.rmSync(backupPath, { force: true });
    return NextResponse.json({
      success: true,
      message: `Backup ${timestamp} deleted`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
