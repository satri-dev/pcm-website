import type { ReactNode } from "react";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/shared/FloatingButtons";
import AdmissionModal from "@/components/shared/AdmissionModal";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementTicker />
      <TopBar />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <FloatingButtons />
      <AdmissionModal />
    </>
  );
}
