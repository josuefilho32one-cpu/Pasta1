import type { Metadata } from "next";
import { VerificaApp } from "@/components/verifica-app";

export const metadata: Metadata = { title: "Como funciona — Verifica" };

export default function HowPage() {
  return <VerificaApp view="how" />;
}
