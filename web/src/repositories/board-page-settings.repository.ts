// src/repositories/board-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  BOARD_PAGE_SETTINGS_DEFAULTS,
  BOARD_PAGE_SETTINGS_KEY,
  BoardPageSettings,
} from "@/types/board-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): BoardPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...BOARD_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as BoardPageSettings;
}

export async function getBoardPageSettings(): Promise<BoardPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: BOARD_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateBoardPageSettings(
  input: Partial<BoardPageSettings>
): Promise<BoardPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(BOARD_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof BoardPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof BoardPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: BOARD_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: BOARD_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: BOARD_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
