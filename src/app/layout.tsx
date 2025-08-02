import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lini Aksara",
  description: "Lini Aksara is a platform for sharing and discovering Indonesian Works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <SessionWrapper>
          {/* <CustomCursor /> */}
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
