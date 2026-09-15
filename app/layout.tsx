import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UFSCar Horas — Gestão e Validação de Atividades Complementares",
  description: "Sistema de gestão e validação de horas extracurriculares de Ciência da Computação - UFSCar Sorocaba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0c0e] text-gray-100 selection:bg-emerald-500 selection:text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
