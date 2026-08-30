"use client";

import { useState } from "react";
import type { ScholarshipFaq } from "../types";

interface Props {
  faqs: ScholarshipFaq[];
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function ScholarshipFaqs({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="sc-faqs">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`faq-callout${isOpen ? " faq-callout--open" : ""}`}
          >
            <button
              className="faq-callout__header"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              aria-controls={`sfaq-body-${faq.id}`}
              id={`sfaq-btn-${faq.id}`}
            >
              <span className="faq-callout__q">{faq.question}</span>
              <span className="faq-callout__chevron" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
            <div
              className="faq-callout__body"
              id={`sfaq-body-${faq.id}`}
              role="region"
              aria-labelledby={`sfaq-btn-${faq.id}`}
              hidden={!isOpen}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
