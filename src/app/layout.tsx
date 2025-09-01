import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/header";

const mont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Try It On",
  description: "made by anurag - > anuragmaurya.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${mont.className}`}
      >
        <Providers>
          <Header/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
