"use client";

import { useState } from "react";
import type { FaqItem as FaqItemType } from "../types";
import FaqItem from "./FaqItem";

interface Props {
  items: FaqItemType[];
}

export default function FaqList({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (items.length === 0) {
    return (
      <div className="faq-empty">
        <p>No questions match your search. Try a different term or category.</p>
      </div>
    );
  }

  return (
    <div className="faq-list" role="list">
      {items.map((item) => (
        <FaqItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}
