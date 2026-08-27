import * as fs from "fs";
import * as path from "path";

const BACKUPS_ROOT = path.join(process.cwd(), "backups");

export interface BackupEntry {
  timestamp: string;
  collections: number;
  size: string;
  createdAt: string;
}

function getDbName(): string {
  return process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || "test";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function parseTimestamp(ts: string): string {
  const [datePart, timePart] = ts.split("_");
  const y = datePart.slice(0, 4);
  const m = datePart.slice(4, 6);
  const d = datePart.slice(6, 8);
  const hh = timePart?.slice(0, 2) || "00";
  const mm = timePart?.slice(2, 4) || "00";
  const ss = timePart?.slice(4, 6) || "00";
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

export function listBackups(): BackupEntry[] {
  const dbName = getDbName();
  const dbDir = path.join(BACKUPS_ROOT, dbName);
  if (!fs.existsSync(dbDir)) return [];

  return fs
    .readdirSync(dbDir)
    .filter((e) => {
      const full = path.join(dbDir, e);
      return fs.statSync(full).isFile() && e.endsWith(".json");
    })
    .sort()
    .reverse()
    .map((filename) => {
      const ts = filename.replace(".json", "");
      const filePath = path.join(dbDir, filename);
      const stat = fs.statSync(filePath);
      let collections = 0;
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        collections = content.metadata?.collections?.length ?? 0;
      } catch {
        collections = 0;
      }
      return {
        timestamp: ts,
        collections,
        size: formatBytes(stat.size),
        createdAt: parseTimestamp(ts),
      };
    });
}

export function getBackupFilePath(timestamp: string): string {
  const dbName = getDbName();
  return path.join(BACKUPS_ROOT, dbName, `${timestamp}.json`);
}
