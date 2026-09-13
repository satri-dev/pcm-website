import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { OrganizationSchema, WebSiteSchema } from "./structured-data";
import AnalyticsTracker from "./admin/_components/analytics/AnalyticsTracker";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

// Environment-driven base URL for SEO
const getBaseUrl = () => {
  // 1. Use explicit NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Use Vercel URL if available (for preview deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3. Fallback to localhost for development
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  title: {
    default: "Pokhara College of Management | BBA, BCSIT in Pokhara",
    template: "%s | Pokhara College of Management",
  },
  description:
    "Pokhara College of Management — affordable, quality management and IT education in Pokhara. BBA, BBA-Finance and BCSIT degrees affiliated to Pokhara University.",
  metadataBase: new URL(getBaseUrl()),
  keywords: [
    "Pokhara College of Management",
    "PCM",
    "BBA in Pokhara",
    "BCSIT in Pokhara",
    "Management College",
    "IT Education Nepal",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, poppins.variable)}
    >
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body>
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
