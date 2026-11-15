import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/dm-sans-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/dm-sans-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/dm-sans-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/dm-sans-800.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verifica — Na dúvida, verifique.",
  description: "Um olhar mais atento para links, sites e vídeos. Identifique sinais de risco, entenda o contexto e compartilhe com mais consciência.",
  applicationName: "Verifica",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
