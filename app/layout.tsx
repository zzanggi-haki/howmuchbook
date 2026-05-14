import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SunsetStripe } from "@/components/SunsetStripe";

export const metadata: Metadata = {
  title: "AllTheBooks — 책 한 번에 비교",
  description: "한 권의 책을 알라딘 중고/매장/eBook에서 한눈에 비교",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface text-ink overflow-x-hidden">
        <div className="flex-1 flex flex-col">{children}</div>
        <SunsetStripe />
        <Footer />
      </body>
    </html>
  );
}
