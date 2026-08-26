"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = "97761544761"; // PCM WhatsApp number
  const facebookPageId = "239069093193587"; // PCM Facebook Page ID
  
  const whatsappMessage = encodeURIComponent("Hello! I'd like to know more about admissions at PCM.");

  return (
    <div className="fixed bottom-6 right-6 z-150 flex flex-col items-end gap-3">
      {/* Chat Options - Show when open */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 pr-4 pl-3 py-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] grid place-items-center shrink-0">
              <FaWhatsapp className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-pcm-navy">WhatsApp</div>
              <div className="text-xs text-muted-foreground">Chat with us</div>
            </div>
          </a>

          {/* Facebook Messenger */}
          <a
            href={`https://m.me/${facebookPageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 pr-4 pl-3 py-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-12 h-12 rounded-full bg-[#0084FF] grid place-items-center shrink-0">
              <FaFacebookMessenger className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-pcm-navy">Messenger</div>
              <div className="text-xs text-muted-foreground">Message on Facebook</div>
            </div>
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pcm-blue text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 grid place-items-center"
        aria-label={isOpen ? "Close chat options" : "Open chat options"}
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pcm-blue animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  );
}
