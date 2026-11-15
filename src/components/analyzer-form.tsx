"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Clipboard, FileVideo, Globe2, Link2, LoaderCircle, LockKeyhole, ScanLine, Upload, Video, X } from "lucide-react";
import type { CheckKind, SavedAnalysis } from "@/lib/types";

const tabs = [{ key: "link" as const, label: "Link", icon: Link2 }, { key: "site" as const, label: "Site", icon: Globe2 }, { key: "video" as const, label: "Vídeo", icon: Video }];
const stages = ["Preparando a análise…", "Consultando os sinais disponíveis…", "Organizando o contexto…", "Finalizando seu relatório…"];

function readVideoMetadata(file: File): Promise<{ duration?: number; width?: number; height?: number }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    let finished = false;
    const finish = (data: { duration?: number; width?: number; height?: number }) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(objectUrl);
      resolve(data);
    };
    const timer = setTimeout(() => finish({}), 3000);
    video.preload = "metadata";
    video.onloadedmetadata = () => finish({ duration: Number.isFinite(video.duration) ? video.duration : undefined, width: video.videoWidth, height: video.videoHeight });
    video.onerror = () => finish({});
    video.src = objectUrl;
  });
}

export function AnalyzerForm({ onComplete, notify }: { onComplete: (analysis: SavedAnalysis) => void; notify: (message: string) => void }) {
  const [kind, setKind] = useState<CheckKind>("link");
  const [url, setUrl] = useState("");
  const [videoMode, setVideoMode] = useState<"link" | "file">("link");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const isUpload = kind === "video" && videoMode === "file";

  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setStep((previous) => Math.min(previous + 1, stages.length - 1)), 2600);
    return () => clearInterval(timer);
  }, [loading]);

  function chooseFile(candidate: File | undefined) {
    if (!candidate) return;
    setError("");
    if (!/\.(mp4|mov|webm)$/i.test(candidate.name)) { setError("Escolha um vídeo MP4, MOV ou WebM."); return; }
    if (!candidate.size || candidate.size > 25 * 1024 * 1024) { setError("O vídeo precisa ter até 25 MB e não pode estar vazio."); return; }
    setFile(candidate);
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) { notify("Sua área de transferência está vazia. Copie um link primeiro."); return; }
      setUrl(text.trim());
      setError("");
      inputRef.current?.focus();
    } catch { notify("Não foi possível acessar a área de transferência. Cole o link com Ctrl+V ou ⌘V."); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (isUpload && !file) { setError("Selecione ou arraste um vídeo para começar."); return; }
    if (!isUpload && !url.trim()) { setError("Cole o link que você quer verificar para começar."); inputRef.current?.focus(); return; }
    setLoading(true);
    setStep(0);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 55000);
    try {
      let body: FormData | string;
      let headers: Record<string, string> = {};
      if (isUpload && file) {
        const metadata = await readVideoMetadata(file);
        const form = new FormData();
        form.append("file", file);
        if (metadata.duration) form.append("duration", String(metadata.duration));
        if (metadata.width) form.append("width", String(metadata.width));
        if (metadata.height) form.append("height", String(metadata.height));
        body = form;
      } else {
        body = JSON.stringify({ url: url.trim(), kind });
        headers = { "Content-Type": "application/json" };
      }
      const response = await fetch("/api/analyses", { method: "POST", headers, body, signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível concluir a análise.");
      onComplete(data.analysis);
    } catch (failure) {
      setError(failure instanceof Error && failure.name === "AbortError" ? "A análise demorou mais do que o esperado. Tente novamente em instantes." : failure instanceof Error ? failure.message : "Não foi possível conectar. Confira sua internet e tente novamente.");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
      controllerRef.current = null;
    }
  }

  return (
    <section className="analyzer-card" aria-labelledby="analyzer-title">
      <div className="analyzer-heading"><div className="heading-icon"><ScanLine size={20}/></div><h2 id="analyzer-title">O que vamos verificar?</h2><span className="free-label"><span/>Grátis e sem cadastro</span></div>
      <div className="type-tabs" role="tablist" aria-label="Tipo de conteúdo">
        {tabs.map(({ key, label, icon: Icon }, index) => <button key={key} id={`tab-${key}`} role="tab" aria-selected={kind === key} aria-controls="analysis-input-panel" tabIndex={kind === key ? 0 : -1} disabled={loading} className={kind === key ? "active" : ""} onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3; setKind(tabs[next].key); setError(""); document.getElementById(`tab-${tabs[next].key}`)?.focus(); } }} onClick={() => { setKind(key); setError(""); }}><Icon size={18}/>{label}</button>)}
      </div>
      <form onSubmit={submit} noValidate>
        <div id="analysis-input-panel" role="tabpanel" aria-labelledby={`tab-${kind}`}>
          {kind === "video" && <div className="video-modes"><button type="button" disabled={loading} className={videoMode === "link" ? "selected" : ""} onClick={() => { setVideoMode("link"); setError(""); }}><Link2 size={13}/>Link do vídeo</button><button type="button" disabled={loading} className={videoMode === "file" ? "selected" : ""} onClick={() => { setVideoMode("file"); setError(""); }}><Upload size={13}/>Enviar arquivo</button></div>}
          {isUpload ? <>
            <label className="input-label" htmlFor="video-file">Envie o vídeo que você quer analisar</label>
            <input ref={fileRef} id="video-file" type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" className="sr-only" disabled={loading} onChange={(event) => chooseFile(event.target.files?.[0])}/>
            <div className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`} onDragOver={(event) => { event.preventDefault(); if (!loading) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); if (!loading) chooseFile(event.dataTransfer.files[0]); }}>
              {file ? <div className="selected-file"><div className="file-symbol"><FileVideo size={25}/></div><div><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · pronto para analisar</span></div><button type="button" className="icon-button" aria-label="Remover vídeo" disabled={loading} onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}><X size={18}/></button></div> : <button type="button" className="drop-select" disabled={loading} onClick={() => fileRef.current?.click()}><Upload size={24}/><span><strong>Clique para escolher</strong> ou arraste seu vídeo</span><small>MP4, MOV ou WebM · até 25 MB</small></button>}
            </div>
          </> : <>
            <label className="input-label" htmlFor="content-url">{kind === "site" ? "Qual site você quer conhecer melhor?" : kind === "video" ? "Cole o link público do vídeo" : "Cole o link que você quer verificar"}</label>
            <div className={`url-field ${error ? "input-error" : ""}`}><Link2 size={19}/><input ref={inputRef} id="content-url" type="text" inputMode="url" autoComplete="off" placeholder={kind === "site" ? "https://www.exemplo.com.br" : kind === "video" ? "https://youtube.com/watch?v=..." : "https://cole-seu-link-aqui.com"} value={url} maxLength={2048} disabled={loading} aria-invalid={!!error} aria-describedby={error ? "analysis-error" : "input-helper"} onChange={(event) => { setUrl(event.target.value); setError(""); }}/><button type="button" className="paste-button" title="Colar link" aria-label="Colar link da área de transferência" onClick={paste} disabled={loading}><Clipboard size={16}/><span>Colar</span></button></div>
            <div className="input-examples" id="input-helper"><span>Experimente:</span><button type="button" disabled={loading} onClick={() => { setUrl("https://www.bbc.com/portuguese"); setKind("link"); setError(""); inputRef.current?.focus(); }}>uma notícia</button><span className="example-dot">·</span><button type="button" disabled={loading} onClick={() => { setUrl("https://www.gov.br"); setKind("site"); setError(""); inputRef.current?.focus(); }}>um site</button><span className="example-dot">·</span><button type="button" disabled={loading} onClick={() => { setUrl("https://www.youtube.com/watch?v=jNQXAC9IVRw"); setKind("video"); setVideoMode("link"); setError(""); inputRef.current?.focus(); }}>um vídeo</button></div>
          </>}
        </div>
        {error && <p id="analysis-error" className="form-error" role="alert">{error}</p>}
        <button type="submit" className="analyze-button" disabled={loading}>{loading ? <><LoaderCircle size={19} className="spinning"/>{stages[step]}</> : <><ScanLine size={19}/>Analisar conteúdo<ArrowRight size={18} className="button-arrow"/></>}</button>
        {loading ? <div className="analysis-progress" role="status" aria-live="polite"><div className="progress-track"><span style={{ width: `${18 + step * 23}%` }}/></div><span><Check size={12}/> Uma checagem cuidadosa leva alguns instantes.</span></div> : <p className="form-privacy"><LockKeyhole size={12}/>Sua análise é privada. Seus arquivos não são publicados.</p>}
      </form>
    </section>
  );
}
