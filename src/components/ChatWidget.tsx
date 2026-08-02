"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MessageCircle, Send, Square, X } from "lucide-react";
import { buildManualWhatsAppUrl, getSafarWhatsAppRecipient } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

type ChatMessage = { role: "user" | "assistant"; content: string; whatsappFallback?: boolean; followUp?: string[]; link?: { href: string; label: string } };
const starterQuestions = ["What products do you source?", "What are your minimum order quantities?", "Which Incoterms do you offer?", "How do I submit an RFQ?"];
const quoteIntent = /need\s+\d+\s?(mt|tons?|units?|pieces?)|\bmt\b|bulk (order|requirement)|export to|sourc|procure|supplier|price|quote|quotation|rfq/i;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Welcome to Safar Traders. What can we help you source?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = buildManualWhatsAppUrl("Hello Safar Traders, I'd like help with a sourcing requirement.", getSafarWhatsAppRecipient());

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming, showLeadForm]);

  const send = async (suggestion?: string) => {
    const text = (suggestion ?? input).trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    const controller = new AbortController();
    abortRef.current = controller;
    setMessages(nextMessages); setInput(""); setLoading(true); setStreaming(""); setShowLeadForm(false);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages }), signal: controller.signal });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data.ok && data.reply) setMessages((items) => [...items, { role: "assistant", content: data.reply, followUp: data.followUp, link: data.link }]);
        else setMessages((items) => [...items, { role: "assistant", content: data.error || "Please submit your requirement and our sourcing team will provide a formal quotation.", whatsappFallback: data.fallback === "whatsapp" }]);
      } else if (response.body) {
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let answer = "";
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n"); buffer = events.pop() || "";
          for (const event of events) {
            const line = event.split("\n").find((item) => item.startsWith("data: "));
            if (!line || line === "data: [DONE]") continue;
            try { const delta = JSON.parse(line.slice(6)).delta; if (typeof delta === "string") { answer += delta; setStreaming(answer); } } catch { /* Ignore malformed upstream events. */ }
          }
        }
        if (answer) setMessages((items) => [...items, { role: "assistant", content: answer }]);
        else throw new Error("Empty stream");
      } else throw new Error("No response body");
      if (quoteIntent.test(text)) setShowLeadForm(true);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessages((items) => [...items, { role: "assistant", content: "Connection issue. You can continue on WhatsApp instead.", whatsappFallback: true }]);
    } finally { abortRef.current = null; setStreaming(""); setLoading(false); }
  };

  return <>
    <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close chat" : "Open chat"} aria-expanded={open} style={launcherStyle}>{open ? <X size={22} /> : <MessageCircle size={22} />}</button>
    {open && <div role="dialog" aria-label="Sourcing and trade assistant chat" style={dialogStyle}>
      <div style={{ padding: "0.875rem 1rem", backgroundColor: "var(--color-dark-bg)", color: "var(--color-dark-text)" }}><p style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>Sourcing Desk</p><p style={{ fontSize: "0.6875rem", color: "var(--color-dark-muted)", margin: 0 }}>For RFQ details, use the RFQ form</p></div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <p style={{ margin: 0, fontSize: "0.6875rem", lineHeight: 1.45, color: "var(--color-text-secondary)" }}>Do not share sensitive personal or payment information. Messages may be processed by our AI service provider. See our <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link>.</p>
        {messages.map((message, index) => <div key={index} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <div style={{ padding: "0.625rem 0.875rem", borderRadius: "0.625rem", fontSize: "0.8125rem", lineHeight: 1.5, backgroundColor: message.role === "user" ? "var(--color-dark-bg)" : "var(--color-bg-secondary)", color: message.role === "user" ? "var(--color-dark-text)" : "var(--color-text-primary)", whiteSpace: "pre-wrap" }}>{message.content}</div>
          {message.link && <Link href={message.link.href} style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{message.link.label} →</Link>}
          {message.whatsappFallback && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={whatsappStyle}>Continue on WhatsApp</a>}
          {message.followUp?.map((question) => <QuestionChip key={question} question={question} onClick={() => send(question)} />)}
        </div>)}
        {messages.length === 1 && !loading && starterQuestions.map((question) => <QuestionChip key={question} question={question} onClick={() => send(question)} />)}
        {loading && <div style={{ alignSelf: "flex-start", fontSize: "0.75rem", color: "var(--color-text-secondary)" }} aria-live="polite">{streaming || "Sourcing desk is typing…"}</div>}
        {showLeadForm && <LeadMiniForm />}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid var(--color-border-light)", padding: "0.625rem" }}><label htmlFor="chat-input" style={visuallyHidden}>Type your message</label><input id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Type your message..." style={{ flex: 1, border: "none", outline: "none", fontSize: "1rem", padding: "0.5rem", background: "transparent", color: "var(--color-text-primary)" }} /><button onClick={loading ? () => abortRef.current?.abort() : () => send()} disabled={!loading && !input.trim()} aria-label={loading ? "Stop generating" : "Send message"} style={sendButtonStyle}>{loading ? <Square size={15} fill="currentColor" /> : <Send size={18} />}</button></div>
    </div>}
  </>;
}

function QuestionChip({ question, onClick }: { question: string; onClick: () => void }) { return <button onClick={onClick} style={{ alignSelf: "flex-start", fontSize: "0.75rem", color: "var(--color-text-primary)", background: "var(--color-bg)", border: "1px solid var(--color-border-light)", borderRadius: "999px", padding: "0.4rem 0.7rem", cursor: "pointer", textAlign: "left" }}>{question}</button>; }

function LeadMiniForm() {
  const [company, setCompany] = useState(""); const [contact, setContact] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [privacyConsent, setPrivacyConsent] = useState(false); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  const submit = () => {
    if (!company.trim() || !contact.trim() || (!email.trim() && !phone.trim())) return setError("Company, contact person, and email or phone are required.");
    if (!privacyConsent) return setError("Please agree to the Privacy Policy before sending your details.");
    setSubmitting(true);
    setError("");
    const subject = `Sourcing enquiry — ${company}`;
    const body = `Hello Safar Traders,\n\nI would like to discuss a sourcing requirement.\n\nCompany: ${company}\nContact person: ${contact}\nEmail: ${email || "—"}\nPhone / WhatsApp: ${phone || "—"}\n\nPlease contact me to discuss the requirement.\n\nRegards,\n${contact}`;
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitting(false);
  };
  return <div style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-light)", borderRadius: "0.625rem", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}><p style={{ fontSize: "0.75rem", margin: 0 }}>Please share a few details so our sourcing team can follow up:</p><input placeholder="Company name" value={company} onChange={(event) => setCompany(event.target.value)} style={miniInput} /><input placeholder="Contact person" value={contact} onChange={(event) => setContact(event.target.value)} style={miniInput} /><input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} style={miniInput} /><input type="tel" placeholder="Phone / WhatsApp" value={phone} onChange={(event) => setPhone(event.target.value)} style={miniInput} /><label style={{ fontSize: "0.6875rem" }}><input type="checkbox" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} /> I agree to the <Link href={siteConfig.legal.privacyPolicyUrl}>Privacy Policy</Link>.</label>{error && <p role="alert" style={{ color: "#B42318", fontSize: "0.75rem", margin: 0 }}>{error}</p>}<button onClick={submit} disabled={submitting} style={{ border: "none", borderRadius: "0.375rem", padding: "0.625rem", cursor: "pointer", background: "var(--color-dark-bg)", color: "var(--color-dark-text)" }}>{submitting ? "Sending..." : "Send to sourcing team"}</button></div>;
}

const launcherStyle: CSSProperties = { position: "fixed", bottom: "calc(max(1.25rem, calc(env(safe-area-inset-bottom) + 1rem)) + 60px)", right: "1.25rem", width: 52, height: 52, borderRadius: "50%", background: "var(--color-dark-bg)", color: "var(--color-dark-text)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,.25)", zIndex: 999 };
const dialogStyle: CSSProperties = { position: "fixed", bottom: "calc(max(1.25rem, calc(env(safe-area-inset-bottom) + 1rem)) + 130px)", right: "1.25rem", width: "min(360px, calc(100vw - 2rem))", height: "min(520px, calc(100vh - 8rem))", background: "rgba(255,255,255,.94)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.16)", zIndex: 998 };
const sendButtonStyle: CSSProperties = { background: "none", border: "none", cursor: "pointer", color: "var(--color-text-primary)", padding: "0.5rem", minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" };
const whatsappStyle: CSSProperties = { display: "inline-flex", justifyContent: "center", background: "#25D366", color: "#fff", borderRadius: "0.5rem", padding: "0.625rem", fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none" };
const miniInput: CSSProperties = { border: "1px solid var(--color-border-light)", borderRadius: "0.375rem", padding: "0.55rem", fontSize: "0.8125rem" };
const visuallyHidden: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" };
