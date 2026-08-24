"use client";

import type { ReactNode } from "react";
import { useReveal } from "./use-reveal";

export function RevealBox({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const reveal = useReveal<HTMLDivElement>(delayMs);
  return (
    <div ref={reveal.ref} className={`${className ?? ""} ${reveal.revealClass}`.trim()} style={reveal.style}>
      {children}
    </div>
  );
}
