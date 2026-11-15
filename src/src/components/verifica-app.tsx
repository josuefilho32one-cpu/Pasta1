"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, CircleHelp, CirclePlay, FileSearch, Heart, History, Home, Info, LoaderCircle, LockKeyhole, Menu, MessageSquare, Plus, ScanEye, ScanLine, ShieldCheck, Sparkles, TextSearch, Trash2, X } from "lucide-react";
import { AnalyzerForm } from "@/components/analyzer-form";
import { AnalysisResult } from "@/components/analysis-result";
import { BrandMark, VerificationArt } from "@/components/verification-art";
import { Dialog } from "@/components/dialog";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { HistoryList, HistoryView } from "@/components/history-view";
import { HelpView, HowView } from "@/components/info-views";
import { guides } from "@/lib/content";
import type { SavedAnalysis } from "@/lib/types";

export type AppView = "new" | "history" | "how" | "help";
const viewTitles: Record<AppView, string> = { new: "Nova análise", history: "Histórico", how: "Como funciona", help: "Central de ajuda" };
const navigation = [{ view: "new" as const, href: "/", label: "Nova análise", icon: ScanLine }, { view: "history" as const, href: "/historico", label: "Histórico", icon: History }, { view: "how" as const, href: "/como-funciona", label: "Como funciona", icon: BookOpen }, { view: "help" as const, href: "/ajuda", label: "Central de ajuda", icon: CircleHelp }];
const guideIcons = [FileSearch, TextSearch, ScanEye];

export function VerificaApp({ view = "new" }: { view?: AppView }) {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [total, setTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [selected, setSelected] = useState<SavedAnalysis | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [info, setInfo] = useState<"privacy" | "limits" | null>(null);
  const [guide, setGuide] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState<{ id?: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const notify = useCallback((message: string) => setNotice(message), []);
  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const response = await fetch("/api/analyses", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAnalyses(data.analyses);
      setTotal(data.total);
    } catch { setHistoryError("Não conseguimos conectar ao seu histórico. Tente novamente em instantes."); }
    finally { setHistoryLoading(false); }
  }, []);
  useEffect(() => { void refreshHistory(); }, [refreshHistory]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 6000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { if (!mobileOpen) return; const handler = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [mobileOpen]);

  function openAnalysis(analysis: SavedAnalysis) { setSelected(analysis); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function completeAnalysis(analysis: SavedAnalysis) {
    setAnalyses((previous) => [analysis, ...previous.filter((item) => item.id !== analysis.id)].slice(0, 100));
    setTotal((previous) => previous + 1);
    setHistoryError("");
    openAnalysis(analysis);
  }
  async function deleteAnalyses() {
    if (!confirmation || deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/analyses?${confirmation.id ? `id=${confirmation.id}` : "all=true"}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (confirmation.id) { setAnalyses((previous) => previous.filter((item) => item.id !== confirmation.id)); setTotal((previous) => Math.max(0, previous - 1)); }
      else { setAnalyses([]); setTotal(0); }
      if (selected && (!confirmation.id || selected.id === confirmation.id)) setSelected(null);
      notify(confirmation.id ? "Análise excluída do seu histórico." : "Seu histórico foi apagado.");
      setConfirmation(null);
    } catch (failure) { notify(failure instanceof Error ? failure.message : "Não foi possível excluir. Tente novamente."); }
    finally { setDeleting(false); }
  }

  const resetView = () => { setSelected(null); setMobileOpen(false); };
  return <>
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      {mobileOpen && <button className="sidebar-overlay" aria-label="Fechar menu de navegação" onClick={() => setMobileOpen(false)}/>}
      <aside id="main-sidebar" className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <Link href="/" className="brand" onClick={resetView} aria-label="Verifica — início"><BrandMark/><span>verifica<span className="brand-dot">.</span></span></Link>
        <p className="brand-tagline">Veja além do que parece.</p>
        <nav className="main-nav" aria-label="Navegação principal"><span className="nav-caption">SEU ESPAÇO</span>{navigation.map(({ view: navView, href, label, icon: Icon }, index) => <div key={href}>{index === 2 && <span className="nav-caption explore-caption">APRENDA E EXPLORE</span>}<Link href={href} className={`nav-link ${view === navView ? "active" : ""}`} aria-current={view === navView ? "page" : undefined} onClick={resetView}><Icon size={19}/><span>{label}</span>{navView === "new" && <Plus className="nav-trailing" size={16}/>} {navView === "history" && <span className="nav-count">{total}</span>}</Link></div>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><div className="sidebar-tip-icon"><ShieldCheck size={23}/></div><h3>Informação é<br/>uma forma de proteção.</h3><p>Uma pausa antes de compartilhar faz a diferença.</p><button onClick={() => setGuide(0)}>Pratique o olhar crítico<ArrowUpRight size={15}/></button><span className="tip-sparkle"><Sparkles size={25}/></span></div><button className="visitor-profile" onClick={() => setInfo("privacy")}><span className="visitor-avatar">V<span/></span><span><strong>Seu espaço pessoal</strong><small>Sem cadastro. Sem complicação.</small></span><ChevronRight size={15}/></button></div>
      </aside>
      <div className="workspace">
        <header className="topbar"><div className="breadcrumb"><button className="mobile-menu icon-button" aria-label="Abrir menu" aria-controls="main-sidebar" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21}/></button><Link href="/" aria-label="Página inicial" onClick={resetView}><Home size={16}/></Link><span className="breadcrumb-divider">/</span><span>{selected ? "Resultado da análise" : viewTitles[view]}</span></div><div className="topbar-actions"><span className="conscious-label"><span/>Uma internet mais consciente</span><span className="topbar-divider"/><button onClick={() => setFeedbackOpen(true)}><MessageSquare size={16}/><span>Enviar feedback</span></button></div></header>
        <main className="main-content" id="main-content">
          {selected ? <AnalysisResult analysis={selected} onBack={() => setSelected(null)} notify={notify}/> : view === "new" ? <div className="dashboard page-enter">
            <section className="hero"><div><span className="eyebrow"><Sparkles size={13}/>MENOS DESINFORMAÇÃO. MAIS CLAREZA.</span><h1>Na dúvida, <span>verifique.</span><span className="title-sparkle" aria-hidden="true">✧</span></h1><p>Um link suspeito? Um vídeo surpreendente? Dê o primeiro passo<br className="desktop-break"/> para entender o que é confiável, antes de compartilhar.</p></div><Link className="how-link" href="/como-funciona"><CirclePlay size={17}/>Como funciona<ArrowUpRight size={14}/></Link></section>
            <div className="analysis-grid"><AnalyzerForm onComplete={completeAnalysis} notify={notify}/><aside className="reassurance-card"><span className="reassurance-eyebrow"><Sparkles size={12}/>UM ALIADO DO SEU OLHAR CRÍTICO</span><VerificationArt/><div className="reassurance-copy"><h2>Mais contexto.<br/>Melhores escolhas.</h2><p>Nem tudo na internet é o que parece.<br/>Juntos, vamos olhar mais de perto.</p><span><ShieldCheck size={13}/>Tecnologia com responsabilidade</span></div></aside></div>
            <div className="honesty-note"><span className="honesty-icon"><Info size={16}/></span><p><strong>Transparência em primeiro lugar.</strong> A análise aponta sinais, não verdades absolutas.</p><button onClick={() => setInfo("limits")}>Entenda os limites<ArrowUpRight size={13}/></button></div>
            <section className="learn-section"><div className="section-heading"><h2>Seu melhor filtro é o olhar crítico.</h2><span>Pequenos hábitos, grandes diferenças.</span></div><div className="learn-grid">{guides.map((item, index) => { const Icon = guideIcons[index]; return <button key={item.title} className={`learn-card ${item.color}`} onClick={() => setGuide(index)}><span className="learn-card-top"><span className="learn-icon"><Icon size={19}/></span><ArrowUpRight size={16}/></span><h3>{item.title}</h3><p>{item.description}</p></button>; })}</div></section>
            {analyses.length > 0 ? <section className="recent-section"><div className="section-heading"><h2>Suas análises recentes</h2><Link href="/historico">Ver histórico<ArrowRight size={14}/></Link></div><HistoryList analyses={analyses.slice(0, 3)} onOpen={openAnalysis} onDelete={(analysis) => setConfirmation({ id: analysis.id, title: analysis.title })}/></section> : <div className="history-teaser"><span><History size={15}/>Cada verificação é um passo para compartilhar melhor.</span><Link href="/historico">Seu histórico fica aqui<ArrowRight size={14}/></Link></div>}
          </div> : view === "history" ? <HistoryView analyses={analyses} total={total} loading={historyLoading} error={historyError} onRetry={refreshHistory} onOpen={openAnalysis} onDelete={(analysis) => setConfirmation({ id: analysis.id, title: analysis.title })} onClear={() => setConfirmation({ title: "todo o seu histórico" })}/> : view === "how" ? <HowView/> : <HelpView onFeedback={() => setFeedbackOpen(true)}/>}
          <footer className="page-footer"><span><Heart size={12}/>Feito para uma internet mais consciente.</span><div><button onClick={() => setInfo("privacy")}><LockKeyhole size={11}/>Privacidade</button><span className="footer-dot">·</span><Link href="/como-funciona">Sobre a Verifica</Link></div></footer>
        </main>
      </div>
    </div>
    {notice && <div className="toast" role="status"><span><Info size={18}/></span><p>{notice}</p><button className="icon-button" aria-label="Fechar aviso" onClick={() => setNotice("")}><X size={16}/></button></div>}
    {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)}/>}
    {guide !== null && <Dialog title={guides[guide].title} onClose={() => setGuide(null)}><span className="dialog-eyebrow">{guides[guide].label}</span><p className="dialog-intro">{guides[guide].intro}</p><ol className="guide-tips">{guides[guide].tips.map((tip, index) => <li key={tip}><span>{index + 1}</span><p>{tip}</p></li>)}</ol><div className="dialog-bottom-note"><ShieldCheck size={17}/>A dúvida é o primeiro passo de uma boa checagem.</div><button className="primary-button full-width" onClick={() => setGuide(null)}>Vou ficar de olho<Check size={16}/></button></Dialog>}
    {info && <Dialog title={info === "privacy" ? "Sua privacidade, com clareza." : "Sinais ajudam. Contexto decide."} onClose={() => setInfo(null)} wide>
      {info === "privacy" ? <div className="prose-content"><p className="dialog-intro">Seu conteúdo não é publicado. Veja exatamente como os dados são tratados.</p><h3>Um espaço vinculado ao seu navegador</h3><p>Um cookie essencial com identificador aleatório permite acessar seu histórico, sem conta ou e-mail. Qualquer pessoa com acesso a este navegador pode ver essas análises.</p><h3>O que fica salvo</h3><p>Guardamos os links consultados, os relatórios e suas datas no banco de dados. Para vídeos, ficam apenas o nome, o tamanho, o formato, os metadados disponíveis e o hash SHA-256. Os bytes do arquivo são processados temporariamente em memória e não são armazenados.</p><h3>Você pode apagar suas análises</h3><p>Use a lixeira ou “Limpar histórico” na página Histórico. Exclua os registros antes de limpar os cookies: sem o identificador do navegador, você perde o acesso ao histórico, mas os registros não são apagados automaticamente.</p><h3>Conteúdo público, sempre</h3><p>Ao verificar um link, nosso servidor consulta o site de destino. Não envie links com tokens de acesso, documentos confidenciais ou vídeos sensíveis. As buscas externas sugeridas só são abertas quando você clica nelas.</p><h3>Feedback</h3><p>Sua avaliação e mensagem são armazenadas separadamente do histórico para orientar melhorias. Não inclua informações pessoais nesses campos.</p><div className="dialog-bottom-note"><LockKeyhole size={16}/>Usamos um cookie essencial, não um perfil de publicidade.</div></div> : <div className="prose-content"><p className="dialog-intro">A Verifica é uma ferramenta de apoio ao pensamento crítico, não uma certificação de veracidade.</p><h3>O que conseguimos observar</h3><p>Protocolo do link, domínio, redirecionamentos e metadados públicos acessíveis. Nos vídeos enviados, reconhecemos o formato inicial e calculamos o tamanho e a impressão digital do arquivo.</p><h3>O que esses sinais não comprovam</h3><p>HTTPS não torna uma notícia verdadeira. Ausência de autor não torna um texto falso. E um vídeo em MP4 pode conter imagens reais, editadas ou geradas por IA.</p><h3>Não há um “detector de verdade” aqui</h3><p>Não verificamos automaticamente as afirmações de um texto, não consultamos listas de reputação e não fazemos detecção de deepfakes. Os resultados deixam claros os dados observados e as limitações da consulta.</p><div className="dialog-bottom-note"><Info size={18}/>A melhor decisão combina evidências, fontes independentes e contexto.</div><Link href="/como-funciona" className="primary-button" onClick={() => setInfo(null)}>Conheça a metodologia<ArrowRight size={16}/></Link></div>}
    </Dialog>}
    {confirmation && <Dialog title={confirmation.id ? "Excluir esta análise?" : "Limpar seu histórico?"} onClose={() => { if (!deleting) setConfirmation(null); }}><div className="delete-confirmation"><span className="delete-confirmation-icon"><Trash2 size={25}/></span><p>{confirmation.id ? <>A análise de <strong>{confirmation.title}</strong> será removida do banco de dados.</> : <>Todas as suas <strong>{total} análises</strong> serão removidas do banco de dados.</>}</p><p>Essa ação não pode ser desfeita.</p><div className="dialog-actions"><button className="secondary-button" disabled={deleting} onClick={() => setConfirmation(null)}>Cancelar</button><button className="danger-button" disabled={deleting} onClick={deleteAnalyses}>{deleting ? <LoaderCircle size={16} className="spinning"/> : <Trash2 size={16}/>} {deleting ? "Excluindo…" : confirmation.id ? "Excluir análise" : "Limpar histórico"}</button></div></div></Dialog>}
  </>;
}
