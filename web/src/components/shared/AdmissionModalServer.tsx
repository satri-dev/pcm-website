// src/components/shared/AdmissionModalServer.tsx
// Server wrapper that fetches the admission modal settings and the latest 5
// news/notice/result/event items (via the cached data layer) and passes them
// down to the client-facing AdmissionModal. Keeps all data fetching on the
// server and reuses ISR/cache-tag revalidation so the database is hit on
// cache expiry or explicit revalidation only.
import { getAdmissionModal } from "@/lib/data/admission-modal";
import { getAdmissionModalContent } from "@/lib/data/admission-modal-content";
import AdmissionModal from "./AdmissionModal";

export default async function AdmissionModalServer() {
  const [data, content] = await Promise.all([
    getAdmissionModal(),
    getAdmissionModalContent(),
  ]);

  return (
    <AdmissionModal
      settings={data.settings}
      newsItems={content.news}
      noticeItems={content.notices}
      resultItems={content.results}
      eventItems={content.events}
    />
  );
}
