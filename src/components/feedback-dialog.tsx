"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Heart, LoaderCircle, Star } from "lucide-react";
import { Dialog } from "@/components/dialog";

export function FeedbackDialog({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (!rating || message.trim().length < 5) { setError("Escolha uma avaliação e escreva pelo menos 5 caracteres."); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar o feedback.");
      setDone(true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Confira sua conexão e tente novamente."); }
    finally { setLoading(false); }
  }
  return <Dialog title={done ? "Obrigado por fazer parte!" : "Sua opinião tem espaço aqui."} onClose={onClose}>
    {done ? <div className="feedback-success"><span><Check size={30}/></span><h3>Feedback recebido, com carinho.</h3><p>Sua mensagem foi salva. Obrigado por ajudar a construir uma internet mais consciente.</p><button className="primary-button" onClick={onClose}>Continuar verificando<ArrowRight size={16}/></button></div> : <form className="feedback-form" onSubmit={submit}><p>Como foi a sua experiência com a Verifica?</p><div className="rating-stars" role="group" aria-label="Avalie de 1 a 5 estrelas">{[1, 2, 3, 4, 5].map((number) => <button type="button" key={number} disabled={loading} aria-pressed={number === rating} aria-label={`${number} ${number === 1 ? "estrela" : "estrelas"}`} className={number <= rating ? "selected" : ""} onClick={() => setRating(number)}><Star size={29}/></button>)}</div><label className="input-label" htmlFor="feedback-message">O que podemos fazer melhor?</label><textarea id="feedback-message" placeholder="Uma sugestão, um problema ou algo de que você gostou…" rows={5} maxLength={2000} value={message} disabled={loading} onChange={(event) => setMessage(event.target.value)}/><div className="textarea-footer"><span>Evite incluir dados pessoais ou conteúdo sensível.</span><span>{message.length}/2000</span></div>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="primary-button full-width" disabled={loading}>{loading ? <LoaderCircle size={17} className="spinning"/> : <Heart size={17}/>} {loading ? "Enviando…" : "Enviar feedback"}</button></form>}
  </Dialog>;
}
