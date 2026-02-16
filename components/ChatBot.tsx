"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 500;

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export default function ChatBot() {
  const t = useTranslations("ChatBot");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialMessages: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: t("welcome") }],
    },
  ];

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showWhatsAppCTA = userMessageCount >= 2;
  const isRateLimited = messageCount >= MAX_MESSAGES;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isRateLimited || !input.trim() || isLoading) return;
    setMessageCount((c) => c + 1);
    sendMessage({ text: input.trim() });
    setInput("");
  }

  return (
    <>
      {/* Floating Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[4.5rem] right-3 lg:bottom-8 lg:right-8 z-50 flex items-center gap-2 pl-3 pr-4 py-2.5 lg:pl-4 lg:pr-5 lg:py-3 rounded-full bg-accent-500 hover:bg-accent-400 text-white btn-glow transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label={t("openChat")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
          <span className="text-xs lg:text-sm font-semibold tracking-wide">Kofly KI</span>
          <span className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-20" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 lg:inset-auto lg:bottom-8 lg:right-8 z-50 w-full lg:w-[380px] h-full lg:h-[min(500px,calc(100vh-8rem))] flex flex-col bg-[var(--bg-primary)] lg:glass-card lg:rounded-2xl lg:shadow-2xl lg:border lg:border-edge-faint overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-edge-faint bg-surface-secondary/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold">
                KI
              </div>
              <div>
                <h3 className="text-sm font-semibold text-content-strong">
                  {t("title")}
                </h3>
                <p className="text-xs text-content-muted">
                  {isLoading ? t("typing") : t("online")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-tertiary transition-colors text-content-muted hover:text-content-strong"
              aria-label={t("closeChat")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-accent-500 text-white rounded-br-md"
                      : "bg-surface-secondary text-content-body rounded-bl-md"
                  }`}
                >
                  {getMessageText(message)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-content-muted animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-content-muted animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-content-muted animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            {showWhatsAppCTA && !isLoading && (
              <div className="flex justify-center py-2">
                <a
                  href="https://wa.me/436767293888?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20einen%20Tandemflug!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 highlight-glow shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("whatsappCta")}
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-edge-faint bg-surface-secondary/30">
            {isRateLimited ? (
              <div className="text-center text-sm text-content-muted py-2">
                <p>
                  {t("rateLimited")}{" "}
                  <a
                    href="https://wa.me/436767293888?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20einen%20Tandemflug!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-medium hover:underline"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_INPUT_LENGTH) {
                      setInput(e.target.value);
                    }
                  }}
                  placeholder={t("placeholder")}
                  className="flex-1 px-3 py-2 rounded-xl border border-edge-input bg-surface-input text-content-strong text-sm placeholder:text-content-placeholder focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent-500 hover:bg-accent-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0"
                  aria-label={t("sendLabel")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
