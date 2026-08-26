import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import ChatbotManager from "./_components/chatbot-manager";
import { listChatbotEntries } from "@/repositories/chatbot.repository";

export const metadata: Metadata = {
  title: "Chatbot Knowledge Base",
  description:
    "Manage chatbot responses, keywords, and channel configurations for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function ChatbotPage() {
  const { items } = await listChatbotEntries({ pageSize: 100 });

  return (
    <>
      <PageHeader title="Chatbot KB" subtitle="System · Chatbot" />
      <ChatbotManager initialData={items} />
    </>
  );
}
