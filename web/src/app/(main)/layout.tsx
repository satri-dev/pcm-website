import type { ReactNode } from "react";
import { Suspense } from "react";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import AdmissionModal from "@/components/shared/AdmissionModal";
import { getNavbarItems } from "@/lib/data/navigation";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const navItems = await getNavbarItems();

  return (
    <>
      <Suspense fallback={null}>
        <AnnouncementTicker />
      </Suspense>
      <TopBar />
      <Navbar items={navItems} />
      <main id="main">{children}</main>
      <Footer />
      <ChatWidget />
      
    </>
  );
}
