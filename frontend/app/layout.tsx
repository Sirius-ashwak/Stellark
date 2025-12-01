import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellark - IP Rights Management on Story Protocol",
  description: "Register and manage your intellectual property rights on the blockchain with Story Protocol",
  keywords: ["IP", "intellectual property", "blockchain", "Story Protocol", "NFT", "licensing"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}