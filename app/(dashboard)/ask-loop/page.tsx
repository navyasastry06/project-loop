"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Clock, 
  Layers,
  ArrowRight,
  HelpCircle
} from "lucide-react";

type Message = {
  type: "user" | "bot";
  text: string;
  references?: {
    id: string;
    content: string;
    sentiment?: string | null;
    category?: string | null;
    score: number;
  }[];
};

const suggestions = [
  "What are the main performance issues on mobile?",
  "What features do customers request most?",
  "Are there any pricing or billing complaints?",
  "Summarize the positive onboarding feedback.",
];

export default function AskLoopPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(text: string) {
    if (!text.trim()) return;

    setError("");
    setLoading(true);

    const userMsg: Message = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const response = await fetch("/api/ask-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const result = await response.json();

      if (result.success) {
        const botMsg: Message = {
          type: "bot",
          text: result.answer,
          references: result.references,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setError(result.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to query LOOP AI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] space-y-6"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-5">
        <div className="text-left">
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Ask LOOP AI
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Query your feedback database semantically and synthesize insights via Gemini LLM.
          </p>
        </div>
      </div>

      {/* Chat Messages area */}
      <div className="flex-1 overflow-y-auto rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs space-y-6 scrollbar-thin flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto my-auto py-4 space-y-6">
            <div className="relative animate-float">
              <img 
                src="/8.png" 
                alt="Chat Empty State" 
                className="max-h-[220px] object-contain rounded-2xl"
              />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#2B4DA2] font-heading">Consult LOOP Chatbot</h2>
              <p className="text-xs text-[#374151]/70 leading-relaxed font-sans font-medium">
                Ask qualitative questions about customer complaints, praise, or friction logs. 
                LOOP searches matching logs by conceptual similarity and drafts an answer.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="w-full space-y-2.5 text-left">
              <span className="text-[9px] text-[#2B4DA2]/50 font-black uppercase tracking-wider">Suggested Queries</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-left text-xs font-semibold text-[#2B4DA2] bg-[#FFF6D6] hover:bg-[#D8C4FF] border border-[#2B4DA2]/10 p-3 rounded-2xl transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl rounded-[24px] p-5 border text-left shadow-2xs transition-all ${
                    msg.type === "user"
                      ? "bg-[#2B4DA2] border-[#2B4DA2] text-white"
                      : "bg-[#FFF6D6] border-[#2B4DA2]/10 text-[#374151]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 dark:border-black/5">
                    {msg.type === "user" ? (
                      <>
                        <User className="h-3.5 w-3.5 opacity-80" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Workspace Presenter</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3.5 w-3.5 text-[#4C74D9]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2B4DA2]/60">LOOP AI Agent</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </p>

                  {/* Supporting references */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#2B4DA2]/10 space-y-3">
                      <span className="text-[9px] text-[#2B4DA2]/50 font-black uppercase tracking-widest block">
                        Ingested Reference Slides
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.references.map((ref, rIdx) => (
                          <div
                            key={ref.id}
                            className="bg-white rounded-xl p-3 border border-[#2B4DA2]/10 text-[13px] space-y-2 relative"
                          >
                            <span className="absolute top-2 right-2 text-[8px] font-black bg-[#D8C4FF] text-[#2B4DA2] px-2 py-0.5 rounded-full border border-[#2B4DA2]/10">
                              {(ref.score * 100).toFixed(0)}% concept match
                            </span>
                            <p className="text-[#374151]/85 font-semibold leading-relaxed font-sans pr-16">
                              "{ref.content}"
                            </p>
                            {ref.category && (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center rounded-md bg-[#FFF6D6] px-1.5 py-0.5 text-[9px] font-extrabold text-[#2B4DA2] border border-[#2B4DA2]/10">
                                  {ref.category}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Error prompt */}
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700 text-left">
                ⚠️ {error}
              </div>
            )}

            {/* Bouncing Lavender loader */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-full bg-[#FFF6D6] border border-[#2B4DA2]/10 px-5 py-3.5 flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-[#4C74D9] rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-[#4C74D9] rounded-full animate-bounce [animation-delay:0.15s]"></div>
                  <div className="h-2 w-2 bg-[#4C74D9] rounded-full animate-bounce [animation-delay:0.3s]"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pill Search form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(question);
        }}
        className="flex items-center gap-3 bg-white p-2.5 rounded-full border border-[#2B4DA2]/10 shadow-xs relative"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Query topics, sentiment logs, or categories (e.g. billing complaints)..."
          disabled={loading}
          className="flex-1 bg-transparent px-4 py-3 outline-none text-xs font-semibold text-[#374151] placeholder-[#2B4DA2]/40"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="h-11 w-11 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </motion.div>
  );
}

