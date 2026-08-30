import type { Metadata } from "next";
import { connection } from "next/server";
import PageHeader from "../../_components/dashboard/page-header";
import TickersManager from "./_components/tickers-manager";
import { listAllTickers } from "@/repositories/ticker.repository";

export const metadata: Metadata = {
  title: "Announcement Tickers | PCM Admin",
  description: "Manage announcement ticker messages",
};

export const instant = false;

export default async function TickersPage() {
  await connection();
  const tickers = await listAllTickers();

  return (
    <div className="admin-page">
      <PageHeader
        title="Announcement Tickers"
        description="Manage scrolling announcement messages displayed at the top of the website"
      />
      <TickersManager tickers={tickers} />
    </div>
  );
}
