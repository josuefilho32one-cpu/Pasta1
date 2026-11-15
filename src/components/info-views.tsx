"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, CircleHelp, ExternalLink, FileSearch, HeartHandshake, Info, Link2, MessageSquare, Search, ShieldCheck, Sparkles } from "lucide-react";
import { VerdictBadge } from "@/components/analysis-result";
import { faqs } from "@/lib/content";

export function HowView() {
  const steps = [
    { icon: Link2, title: "Traga a sua dúvida", description: "Cole o link público de uma notícia, site ou vídeo. Se preferir, envie um vídeo de até 25 MB diretamente do seu dispositivo." },
    { icon: FileSearch, title: "A gente observa os sinais", description: "Examinamos o endereço e os metadados disponíveis. Em arquivos, verificamos o formato e os dados técnicos, sem afirmar que as cenas são autênticas." },
    { icon: ShieldCheck, title: "Você decide com mais contexto", description: "Receba um relatório transparente, entenda o que foi possível observar e siga os próximos passos para buscar confirmações independentes." },
  ];
  return <div className="page-enter"><div className="page-heading"><div><span className="eyebrow"><Sparkles size={14}/>UM ALIADO DO SEU OLHAR CRÍTICO</span><h1>Entender antes de compartilhar.</h1><p>A tecnologia ajuda a encontrar sinais. O pensamento crítico faz a diferença.</p></div></div>
    <section className="how-steps">{steps.map(({ icon: Icon, title, description }, index) => <article className="how-step" key={title}><div className="how-step-top"><span className="how-icon"><Icon size={25}/></span><span className="step-number">0{index + 1}</span></div><h2>{title}</h2><p>{description}</p></article>)}</section>
    <section className="meaning-section"><div className="section-heading"><h2>Um resultado. Diferentes possibilidades.</h2></div><div className="meaning-grid"><article><VerdictBadge verdict="low-risk"/><h3>Nenhum alerta nos sinais observados</h3><p>Não identificamos problemas técnicos nos critérios consultados. Isso não é um selo de veracidade nem uma garantia de segurança.</p></article><article><VerdictBadge verdict="attention"/><h3>Vale fazer uma pausa</h3><p>Algum sinal, como conexão sem HTTPS ou domínio incomum, merece atenção. Um alerta não comprova que a informação seja falsa.</p></article><article><VerdictBadge verdict="inconclusive"/><h3>Ainda falta contexto</h3><p>Não conseguimos consultar a página ou os dados são insuficientes. Inconclusivo não significa falso: a checagem precisa continuar.</p></article></div></section>
    <section className="methodology-box"><span className="heading-icon"><Info size={21}/></span><div><h2>Transparência não é um detalhe.</h2><p>A Verifica não faz uma checagem automática das afirmações, não consulta bancos de reputação e não detecta deepfakes. Nossa análise é técnica e limitada aos sinais descritos no relatório. Não atribuímos porcentagens de “verdade” nem certificamos conteúdos como reais ou falsos.</p><p>Para confirmar fatos, compare a publicação original com fontes independentes e consulte agências de checagem.</p><div className="resource-links"><a href="https://www.aosfatos.org/" target="_blank" rel="noopener noreferrer">Aos Fatos<ExternalLink size={13}/></a><a href="https://lupa.uol.com.br/" target="_blank" rel="noopener noreferrer">Agência Lupa<ExternalLink size={13}/></a><a href="https://www.reuters.com/fact-check/" target="_blank" rel="noopener noreferrer">Reuters Fact Check<ExternalLink size={13}/></a></div></div></section>
    <div className="how-cta"><div><BookOpen size={26}/><span><h2>Uma internet melhor começa com uma boa pergunta.</h2><p>Tem algo que você quer olhar mais de perto?</p></span></div><Link href="/" className="primary-button">Vamos verificar<ArrowRight size={17}/></Link></div>
  </div>;
}

const simplify = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function HelpView({ onFeedback }: { onFeedback: () => void }) {
  const [query, setQuery] = useState("");
  const filtered = faqs.filter((faq) => simplify(`${faq.question} ${faq.answer}`).includes(simplify(query)));
  return <div className="page-enter"><div className="page-heading"><div><span className="eyebrow"><HeartHandshake size={14}/>PODE CONTAR COM A GENTE</span><h1>Vamos tirar suas dúvidas?</h1><p>Respostas diretas para uma experiência com mais clareza.</p></div></div>
    <div className="help-layout"><section className="faq-panel"><div className="search-field help-search"><Search size={19}/><input aria-label="Buscar nas perguntas frequentes" placeholder="O que você gostaria de saber?" value={query} onChange={(event) => setQuery(event.target.value)}/></div><div className="help-tags"><span>Buscas rápidas</span>{["vídeo", "histórico", "privado", "resultado"].map((term) => <button className={query === term ? "active" : ""} key={term} onClick={() => setQuery(query === term ? "" : term)}>{term}</button>)}</div><h2>Perguntas frequentes</h2><div className="faq-list">{filtered.length ? filtered.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<ChevronDown size={18}/></summary><p>{faq.answer}</p></details>) : <div className="empty-state small"><CircleHelp size={28}/><h3>Não encontramos essa pergunta.</h3><p>Experimente uma palavra mais curta ou veja todas as respostas.</p><button className="text-button" onClick={() => setQuery("")}>Ver todas as perguntas<ArrowRight size={15}/></button></div>}</div></section>
      <aside className="help-aside"><div className="help-illustration"><MessageSquare size={37}/><span><Sparkles size={18}/></span></div><h2>A sua opinião<br/>também faz diferença.</h2><p>Encontrou um problema ou teve uma ideia? Conte para a gente e ajude a melhorar a Verifica.</p><button className="primary-button" onClick={onFeedback}>Enviar uma sugestão<ArrowRight size={16}/></button><span className="help-aside-note">Sem cadastro, do seu jeito.</span></aside></div>
  </div>;
}
