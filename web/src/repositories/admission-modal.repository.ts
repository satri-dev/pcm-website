// src/repositories/admission-modal.repository.ts
import { getDb } from "@/core/lib/db";
import {
  AdmissionModalData,
  AdmissionModalDocument,
  AdmissionModalUpdateInput,
  ADMISSION_MODAL_COLLECTION,
  DEFAULT_ADMISSION_MODAL_DATA,
} from "@/types/admission-modal";

function fromDocument(doc: AdmissionModalDocument): AdmissionModalData {
  return {
    id: doc._id!.toString(),
    settings: doc.settings,
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

/**
 * Get the admission modal configuration.
 * Creates it from defaults if it doesn't exist.
 */
export async function getAdmissionModal(): Promise<AdmissionModalData> {
  const db = await getDb();
  const col = db.collection<AdmissionModalDocument>(ADMISSION_MODAL_COLLECTION);
  let doc = await col.findOne({});
  
  if (!doc) {
    const now = new Date();
    const insert = { ...DEFAULT_ADMISSION_MODAL_DATA, createdAt: now, updatedAt: now };
    const result = await col.insertOne(insert as AdmissionModalDocument);
    doc = { ...insert, _id: result.insertedId };
  }
  
  return fromDocument(doc);
}

/**
 * Update the admission modal configuration.
 */
export async function updateAdmissionModal(
  patch: AdmissionModalUpdateInput
): Promise<AdmissionModalData> {
  const db = await getDb();
  const col = db.collection<AdmissionModalDocument>(ADMISSION_MODAL_COLLECTION);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.settings !== undefined) {
    set.settings = patch.settings;
  }

  // Ensure document exists
  const existing = await col.findOne({});
  if (!existing) {
    const now = new Date();
    await col.insertOne({
      ...DEFAULT_ADMISSION_MODAL_DATA,
      ...set,
      createdAt: now,
      updatedAt: now,
    } as AdmissionModalDocument);
  } else {
    await col.updateOne({ _id: existing._id }, { $set: set });
  }

  return getAdmissionModal();
}
