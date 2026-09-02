"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

interface Props {
  buttonText?: string;
}

export default function NewsletterSubscribeForm({ buttonText = "Subscribe" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-pcm-green text-sm">
        <Check className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_auto] gap-2 sm:gap-[0.55rem] mt-[0.2rem]">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        required
        disabled={status === "loading"}
        className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-[0.72rem] border border-white/22 rounded-lg sm:rounded-xl bg-white/6 text-white text-sm sm:text-[0.9rem] placeholder:text-white/45 outline-none transition-all focus:border-pcm-green focus:bg-white/10 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label="Subscribe to newsletter"
        className="inline-flex items-center gap-[0.45rem] px-3 sm:px-[1.15rem] py-2.5 sm:py-[0.72rem] rounded-lg sm:rounded-xl bg-pcm-green text-pcm-navy font-bold text-sm sm:text-[0.9rem] transition-all hover:bg-pcm-green-500 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="hidden sm:inline">{buttonText}</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="col-span-full text-xs text-red-400 mt-1">{message}</p>
      )}
    </form>
  );
}
