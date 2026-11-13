import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AppProviders from "@/components/AppProviders";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PTIROS — Roadmap to Your Dreams | Career Building & Mentorship",
  description:
    "PTIROS is a next-generation education platform bridging school and real-world success. Career building, skill development, government-verified certifications, and personalized mentorship for students.",
  keywords: [
    "PTIROS",
    "career test",
    "student mentorship",
    "career guidance India",
    "NEP 2020",
    "skill development",
    "education platform",
  ],
  openGraph: {
    title: "PTIROS — Roadmap to Your Dreams",
    description:
      "Career building, skill development & mentorship platform for Indian students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${workSans.variable}`}>
      <body className="antialiased">
        <AppProviders>
          <SmoothScroll>{children}</SmoothScroll>
        </AppProviders>
      </body>
    </html>
  );
}
