import type { Metadata } from "next";
import { VerificaApp } from "@/components/verifica-app";

export const metadata: Metadata = { title: "Central de ajuda — Verifica" };

export default function HelpPage() {
  return <VerificaApp view="help" />;
}
