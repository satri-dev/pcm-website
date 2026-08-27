import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { requireApiSession } from "@/core/lib/api-guard";

const BACKUPS_ROOT = path.join(process.cwd(), "backups");

function getDbName(): string {
  return process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || "test";
}

// GET — download a backup file
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ timestamp: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { timestamp } = await params;
  const dbName = getDbName();
  const backupPath = path.join(BACKUPS_ROOT, dbName, `${timestamp}.json`);

  if (!fs.existsSync(backupPath)) {
    return NextResponse.json(
      { error: `Backup not found: ${timestamp}` },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(backupPath);
  const stat = fs.statSync(backupPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="pcm-backup-${timestamp}.json"`,
      "Content-Length": stat.size.toString(),
    },
  });
}
