"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SliderControls({
  count,
  activeIndex,
  onPrev,
  onNext,
  onDotClick,
}: {
  count: number;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (i: number) => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={onPrev}
        className="hidden md:grid absolute left-[1.1rem] top-1/2 -translate-y-1/2 z-10 w-[46px] h-[46px] place-items-center rounded-full bg-white/10 border border-white/22 text-white hover:bg-pcm-green hover:text-pcm-navy hover:border-pcm-green transition-colors"
      >
        <ChevronLeft className="w-[1.15rem] h-[1.15rem]" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={onNext}
        className="hidden md:grid absolute right-[1.1rem] top-1/2 -translate-y-1/2 z-10 w-[46px] h-[46px] place-items-center rounded-full bg-white/10 border border-white/22 text-white hover:bg-pcm-green hover:text-pcm-navy hover:border-pcm-green transition-colors"
      >
        <ChevronRight className="w-[1.15rem] h-[1.15rem]" />
      </button>

      <div className="absolute bottom-[1.6rem] left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDotClick(i)}
            className={cn(
              "h-[10px] rounded-full bg-white/35 transition-all",
              i === activeIndex ? "w-[26px] bg-pcm-green" : "w-[10px]"
            )}
          />
        ))}
      </div>
    </>
  );
}
