"use client";

import { ArrowLeft, ArrowRight, Check, CheckCheck, ChevronDown, CircleAlert, CircleHelp, Copy, Download, ExternalLink, FileVideo, Globe2, Info, Search, ShieldCheck } from "lucide-react";
import { kindLabels, verdictLabels, type SavedAnalysis, type Verdict } from "@/lib/types";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const Icon = verdict === "low-risk" ? ShieldCheck : verdict === "attention" ? CircleAlert : CircleHelp;
  return <span className={`verdict-badge ${verdict}`}><Icon size={13}/>{verdictLabels[verdict]}</span>;
}

function buildText(analysis: SavedAnalysis) {
  const { report } = analysis;
  return ["VERIFICA — RELATÓRIO DE SINAIS", "", `Conteúdo: ${report.title}`, `Origem: ${report.source}`, `Data: ${new Date(analysis.createdAt).toLocaleString("pt-BR")}`, `Resultado: ${verdictLabels[report.verdict]}`, "", report.summary, "", "SINAIS OBSERVADOS", ...report.signals.map((signal) => `• ${signal.title}\n  ${signal.description}`), "", "PRÓXIMOS PASSOS", ...report.nextSteps.map((step, index) => `${index + 1}. ${step}`), "", "DADOS TÉCNICOS", ...Object.entries(report.metadata).map(([key, value]) => `${key}: ${value}`), "", "IMPORTANTE: Este é um relatório técnico limitado, não uma certificação de veracidade. Não detectamos deepfakes nem verificamos automaticamente os fatos da publicação."].join("\n");
}

export function AnalysisResult({ analysis, onBack, notify }: { analysis: SavedAnalysis; onBack: () => void; notify: (message: string) => void }) {
  const { report } = analysis;
  const Icon = report.verdict === "low-risk" ? ShieldCheck : report.verdict === "attention" ? CircleAlert : CircleHelp;
  function download() {
    const blob = new Blob([buildText(analysis)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `verifica-relatorio-${analysis.id.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Seu relatório foi preparado para download.");
  }
  async function copy() {
    try { await navigator.clipboard.writeText(buildText(analysis)); notify("Relatório copiado, incluindo os limites da análise."); }
    catch { notify("Não foi possível copiar. Use a opção Baixar relatório."); }
  }
  return <div className="result-view page-enter">
    <div className="result-breadcrumb"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/>Voltar</button><span>{new Date(analysis.createdAt).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}</span></div>
    <div className="page-heading result-page-heading"><div><span className="eyebrow"><CheckCheck size={14}/>UM POUCO MAIS DE CLAREZA</span><h1>Vamos olhar mais de perto.</h1><p>Sinais observados, contexto e caminhos para você decidir melhor.</p></div></div>
    <section className={`result-summary ${report.verdict}`}>
      <div className="result-summary-top"><div className="result-status-icon"><Icon size={32}/></div><div><span className="result-kicker">RESULTADO DA ANÁLISE · {kindLabels[analysis.kind].toUpperCase()}</span><h2>{verdictLabels[report.verdict]}</h2></div><span className="technical-tag">Análise de sinais</span></div>
      <p>{report.summary}</p>
      <div className="report-source"><div className="source-icon">{report.isFile ? <FileVideo size={21}/> : <Globe2 size={21}/>}</div><div><strong>{report.title}</strong><span>{report.source}</span></div>{!report.isFile && <a href={report.source} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label="Abrir endereço original em uma nova aba" title="Abrir endereço original; a segurança não é garantida"><ExternalLink size={17}/></a>}</div>
    </section>
    <div className="result-grid">
      <section className="signals-card"><div className="section-heading"><h2>O que observamos</h2><span>{report.signals.length} sinais</span></div><div className="signal-list">{report.signals.map((signal, index) => <div className="signal-item" key={index}><div className={`signal-symbol ${signal.tone}`}>{signal.tone === "pass" ? <Check size={16}/> : signal.tone === "warning" ? <CircleAlert size={16}/> : <Info size={16}/>}</div><div><h3>{signal.title}</h3><p>{signal.description}</p></div></div>)}</div><details className="technical-details"><summary>Ver dados técnicos<ChevronDown size={16}/></summary><dl>{Object.entries(report.metadata).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></details></section>
      <aside className="next-steps-card"><div className="heading-icon"><Search size={20}/></div><h2>A checagem continua</h2><p>Um resultado é um ponto de partida. Estes passos ajudam a ir além.</p><ol>{report.nextSteps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><div className="further-checks"><h3>Busque fontes independentes</h3><a href={`https://www.google.com/search?q=${encodeURIComponent(`${report.title} checagem fatos`)}`} target="_blank" rel="noopener noreferrer">Pesquisar outras fontes<ArrowRight size={15}/></a><a href={`https://www.google.com/search?q=${encodeURIComponent(`site:aosfatos.org ${report.title}`)}`} target="_blank" rel="noopener noreferrer">Buscar no Aos Fatos<ExternalLink size={14}/></a><a href={`https://www.google.com/search?q=${encodeURIComponent(`site:lupa.uol.com.br ${report.title}`)}`} target="_blank" rel="noopener noreferrer">Buscar na Agência Lupa<ExternalLink size={14}/></a><small>Links de busca, não fontes já consultadas nesta análise.</small></div></aside>
    </div>
    <div className="result-bottom"><p><Info size={16}/>Nenhuma análise automática substitui o seu olhar crítico.</p><div><button className="secondary-button" onClick={copy}><Copy size={16}/>Copiar relatório</button><button className="primary-button" onClick={download}><Download size={16}/>Baixar relatório</button></div></div>
  </div>;
}
