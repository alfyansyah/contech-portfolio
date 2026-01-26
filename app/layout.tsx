import React from 'react'; // <--- INI OBATNYA
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import Chat Widget (Pastikan path ini benar atau hapus jika belum ada)


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ConTech Labs | Aplikasi RAB & Manajemen Konstruksi Digital",
    template: "%s | ConTech Labs"
  },
  description: "Software kontraktor Indonesia untuk hitung RAB otomatis, manajemen proyek, dan laporan harian. Dilengkapi fitur White Label PDF dan Analisa Harga Satuan (AHSP).",
  keywords: ["automation ai", "Aplikasi RAB", "Software Konstruksi", "Hitung Beton Otomatis", "SaaS Konstruksi Indonesia", "Manajemen Proyek Sipil", "Webapp"],
  authors: [{ name: "Alfyansyah" }],
  openGraph: {
    title: "ConTech Labs - Aplikasi Konstruksi Digital",
    description: "Hitung RAB dan Kelola Proyek dalam satu Dashboard.",
    images: ['https://wsubscnhhabhtubdorhd.supabase.co/storage/v1/object/public/logos/front-page.png'], // Gambar yang akan muncul saat link disebar di WA
  }
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