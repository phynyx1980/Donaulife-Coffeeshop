"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { ChatMessage } from "@/lib/types";
import {
  isReservationTrigger,
  isGeneralInquiryTrigger,
  getNextStep,
  getStepPrompt,
  getStepQuickReplies,
  getEditFieldStep,
  buildSummary,
  buildWhatsAppUrl,
  buildGeneralInquiryUrl,
  applyInput,
  type FlowState,
} from "./ReservationFlow";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const INITIAL_FLOW: FlowState = { step: "idle", data: {} };

export default function ChatWidget({ isOpen, onClose, onOpen }: ChatWidgetProps) {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [flow, setFlow] = useState<FlowState>(INITIAL_FLOW);
  const [awaitingInquiry, setAwaitingInquiry] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isReservationActive = flow.step !== "idle" && flow.step !== "done";

  const GREETING_QUICK_REPLIES = useCallback((l: typeof lang) =>
    l === "de"
      ? ["Tisch reservieren 🌿", "Allgemeine Anfrage 💬", "Öffnungszeiten ⏰", "Events 🎉"]
      : ["Reserve a table 🌿", "General inquiry 💬", "Opening hours ⏰", "Events 🎉"],
  []);

  const addBotMessage = useCallback((content: string, replies: string[] = []) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
    setQuickReplies(replies);
  }, []);

  // Initial greeting with quick replies — beim ersten Öffnen des Chats
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      addBotMessage(t("chat_greeting"), GREETING_QUICK_REPLIES(lang));
    }
  }, [isOpen, messages.length, t, addBotMessage, lang, GREETING_QUICK_REPLIES]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", content: text };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setQuickReplies([]);
      setLoading(true);

      // ── General Inquiry Flow ──
      if (awaitingInquiry) {
        setAwaitingInquiry(false);
        const waUrl = buildGeneralInquiryUrl(text, lang);
        window.open(waUrl, "_blank");
        addBotMessage(
          lang === "de"
            ? "Super! WhatsApp öffnet sich mit deiner Anfrage 💬\nWir melden uns so schnell wie möglich!"
            : "Great! WhatsApp will open with your inquiry 💬\nWe'll get back to you as soon as possible!",
          GREETING_QUICK_REPLIES(lang)
        );
        setLoading(false);
        return;
      }

      // Trigger: Allgemeine Anfrage
      const isInquiryQR =
        text === "Allgemeine Anfrage 💬" || text === "General inquiry 💬";
      if (isInquiryQR || (flow.step === "idle" && isGeneralInquiryTrigger(text))) {
        setAwaitingInquiry(true);
        addBotMessage(
          lang === "de"
            ? "Kein Problem! Was ist deine Anfrage? Schreib sie einfach hier rein und ich leite sie per WhatsApp weiter 💬"
            : "No problem! What's your inquiry? Just write it here and I'll forward it via WhatsApp 💬"
        );
        setLoading(false);
        return;
      }

      // Reservation flow
      if (flow.step !== "idle") {
        // Confirm step → öffnet WhatsApp
        if (flow.step === "confirm") {
          const isYes = text.startsWith("✅") || text.toLowerCase().includes("yes") || text.toLowerCase().includes("abschi");
          if (isYes) {
            const waUrl = buildWhatsAppUrl(flow.data, lang);
            window.open(waUrl, "_blank");
            addBotMessage(
              lang === "de"
                ? "Super! WhatsApp öffnet sich gleich mit deiner Reservierungsanfrage 💬\nWir melden uns so schnell wie möglich!"
                : "Great! WhatsApp will open with your reservation request 💬\nWe'll get back to you as soon as possible!"
            );
          } else {
            addBotMessage(
              lang === "de"
                ? "Kein Problem! Sag mir einfach, wenn du reservieren möchtest 🌿"
                : "No problem! Just let me know when you'd like to make a reservation 🌿"
            );
          }
          setFlow(INITIAL_FLOW);
          setLoading(false);
          return;
        }

        // Apply input and advance
        const updatedState = applyInput(flow, text);
        const nextStep = getNextStep(flow.step);

        if (nextStep === "confirm") {
          const finalState = { ...updatedState, step: nextStep };
          setFlow(finalState as FlowState);
          const summary = buildSummary(finalState.data, lang);
          const confirmPrompt = lang === "de"
            ? `Alles klar! Hier nochmal deine Reservierung:\n\n${summary}`
            : `All good! Here's your reservation summary:\n\n${summary}`;
          addBotMessage(confirmPrompt, getStepQuickReplies("confirm", lang));
        } else {
          const newFlowState: FlowState = { ...updatedState, step: nextStep };
          setFlow(newFlowState);
          addBotMessage(
            getStepPrompt(nextStep, lang),
            getStepQuickReplies(nextStep, lang)
          );
        }
        setLoading(false);
        return;
      }

      // Check for reservation trigger (incl. Quick-Reply button)
      const isReservationQR = text === "Tisch reservieren 🌿" || text === "Reserve a table 🌿";
      if (isReservationQR || isReservationTrigger(text)) {
        const firstStep = getNextStep("idle");
        setFlow({ step: firstStep, data: {} });
        addBotMessage(
          getStepPrompt(firstStep, lang),
          getStepQuickReplies(firstStep, lang)
        );
        setLoading(false);
        return;
      }

      // Regular chat via API
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const data = await res.json();
        addBotMessage(data.response ?? "...");
      } catch {
        addBotMessage(
          lang === "de"
            ? "Sorry, da hat etwas nicht geklappt. Versuch es nochmal! 🌿"
            : "Sorry, something went wrong. Please try again! 🌿"
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, flow, lang, addBotMessage, awaitingInquiry, GREETING_QUICK_REPLIES]
  );

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onOpen}
            className="ring-pulse"
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--green)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 4px 20px rgba(57,211,83,0.3)",
            }}
          >
            <MessageCircle size={24} color="#080808" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              width: "360px",
              height: "548px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 50,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
            className="chat-mobile"
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "var(--bg2)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--green-dim)",
                  border: "1px solid var(--green-bdr)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                🌿
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--tx)",
                  }}
                >
                  {t("chat_title")}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11px",
                    color: "var(--tx2)",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--green)",
                    }}
                  />
                  {isReservationActive
                    ? t("chat_reservation_badge")
                    : awaitingInquiry
                    ? (lang === "de" ? "Anfrage läuft" : "Inquiry in progress")
                    : t("chat_online")}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--tx2)",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? "var(--green)" : "var(--bg)",
                      color: msg.role === "user" ? "#080808" : "var(--tx)",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      border: msg.role === "user" ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "18px 18px 18px 4px",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <div className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--tx2)" }} />
                    <div className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--tx2)" }} />
                    <div className="typing-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--tx2)" }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            {quickReplies.length > 0 && (
              <div
                style={{
                  padding: "8px 12px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  borderTop: "1px solid var(--border)",
                  background: "var(--bg2)",
                }}
              >
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--green-bdr)",
                      color: "var(--tx)",
                      borderRadius: "50px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--green-dim)";
                      (e.currentTarget as HTMLElement).style.color = "var(--green)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--card)";
                      (e.currentTarget as HTMLElement).style.color = "var(--tx)";
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: "8px",
                background: "var(--bg2)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={t("chat_placeholder")}
                style={{
                  flex: 1,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "50px",
                  padding: "10px 16px",
                  color: "var(--tx)",
                  fontSize: "13px",
                  outline: "none",
                  fontFamily: "var(--font-dm-sans)",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: input.trim() && !loading ? "var(--green)" : "var(--card)",
                  border: "1px solid var(--border)",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <Send size={16} color={input.trim() && !loading ? "#080808" : "var(--tx2)"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 480px) {
          .chat-mobile {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            border-radius: 18px 18px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}
