import type { Metadata } from "next";
import { VerificaApp } from "@/components/verifica-app";

export const metadata: Metadata = { title: "Seu histórico — Verifica" };

export default function HistoryPage() {
  return <VerificaApp view="history" />;
}
