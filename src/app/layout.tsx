import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/layout";
import ClientProviders from "@/components/client-providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Real-time exchange rates and gold prices in Iranian market | Zartrack",
  description:
    "Real-time exchange rates and gold prices in Iranian Toman with Zartrack. Get updated values for major currencies, gold coins, and bullion in an easy-to-read format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Zartrack" />
      </head>
      <body>
        <ClientProviders>
          <Layout>{children}</Layout>
        </ClientProviders>
      </body>
    </html>
  );
}
