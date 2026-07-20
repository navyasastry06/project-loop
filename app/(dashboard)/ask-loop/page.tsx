"use client";

import { useState } from "react";

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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">🤖 Ask LOOP</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ask questions and retrieve semantic insights directly from customer feedback history.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center max-w-lg mx-auto py-12 space-y-6">
            <span className="text-5xl">✨</span>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Welcome to Ask LOOP AI</h2>
              <p className="text-sm text-gray-500">
                Ask questions about your feedback database. LOOP uses semantic search vector embeddings to find relevant feedback and synthesizes grounded answers using Gemini AI.
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full space-y-2 text-left">
              <span className="text-xs text-gray-400 font-semibold uppercase">Suggested Prompts</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-left text-xs text-gray-700 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 p-3 rounded-lg transition-all"
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
                  className={`max-w-2xl rounded-2xl p-5 border shadow-sm ${
                    msg.type === "user"
                      ? "bg-blue-600 border-blue-700 text-white"
                      : "bg-gray-50 border-gray-150 text-gray-800"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* References breakdown */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-3">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Supporting Sources
                      </span>
                      <div className="space-y-2">
                        {msg.references.map((ref, rIdx) => (
                          <div
                            key={ref.id}
                            className="bg-white rounded-lg p-3 border border-gray-100 text-xs shadow-inner space-y-2"
                          >
                            <p className="text-gray-700 font-medium leading-relaxed">
                              {rIdx + 1}. "{ref.content}"
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                Match: {(ref.score * 100).toFixed(0)}%
                              </span>
                              {ref.category && (
                                <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
                                  {ref.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Error output */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Skeleton loading bubble */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-2xl rounded-2xl p-5 bg-gray-50 border border-gray-150 flex items-center gap-3">
                  <div className="h-2 w-2 animate-bounce bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 animate-bounce bg-gray-400 rounded-full [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-bounce bg-gray-400 rounded-full [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(question);
        }}
        className="flex gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about user feedback..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          Send ➔
        </button>
      </form>
    </div>
  );
}
