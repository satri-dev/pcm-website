import type { ReactNode } from "react";
import { Suspense } from "react";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/shared/ChatbotWidget";
import ChatWidget from "@/components/shared/ChatWidget";
import AdmissionModal from "@/components/shared/AdmissionModal";
import { getNavbarItems } from "@/lib/data/navigation";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnnouncementTicker />
      </Suspense>
      <Suspense fallback={null}>
        <TopBar />
      </Suspense>
      <Suspense fallback={null}>
        <NavbarWithData />
      </Suspense>
      <main id="main">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <ChatWidget />
      <ChatbotWidget />
    </>
  );
}

async function NavbarWithData() {
  const navItems = await getNavbarItems();
  return <Navbar items={navItems} />;
}
