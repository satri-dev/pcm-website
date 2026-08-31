import { getNoticesSettings } from "@/lib/data/notices-page-settings";
import { getPublishedNotices } from "@/lib/data/notices";
import NoticesClient from "./NoticesClient";

export default async function NoticesServer() {
  const [settings, noticeItems] = await Promise.all([
    getNoticesSettings(),
    getPublishedNotices(),
  ]);
  return <NoticesClient settings={settings} noticeItems={noticeItems} />;
}
