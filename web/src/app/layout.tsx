import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { OrganizationSchema, WebSiteSchema } from "./structured-data";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Pokhara College of Management | BBA, BCSIT in Pokhara",
    template: "%s | Pokhara College of Management"
  },
  description:
    "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
  metadataBase: new URL("https://www.pcm.edu.np"),
  keywords: [
    "Pokhara College of Management",
    "PCM",
    "BBA in Pokhara",
    "BCSIT in Pokhara",
    "Management College",
    "IT Education Nepal"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, poppins.variable)}>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
