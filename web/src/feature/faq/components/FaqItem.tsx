"use client";

import type { FaqItem as FaqItemType } from "../types";

interface Props {
  item: FaqItemType;
  isOpen: boolean;
  onToggle: () => void;
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

export default function FaqItem({ item, isOpen, onToggle }: Props) {
  return (
    <div className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
      <button
        className="faq-item__header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-body-${item.id}`}
        id={`faq-btn-${item.id}`}
      >
        <span className="faq-item__num">{item.num}</span>
        <span className="faq-item__q">{item.question}</span>
        <span className="faq-item__chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>
      <div
        className="faq-item__body"
        id={`faq-body-${item.id}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
        hidden={!isOpen}
      >
        <p>{item.answer}</p>
      </div>
    </div>
  );
}
