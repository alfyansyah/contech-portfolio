import React from 'react'; // <--- INI OBATNYA
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import Chat Widget (Pastikan path ini benar atau hapus jika belum ada)


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConTech Labs | Digital Construction Solutions",
  description: "Jasa pembuatan Web App dan Sistem Otomatisasi khusus Konstruksi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        {/* Widget Chat */}
       
      </body>
    </html>
  );
}