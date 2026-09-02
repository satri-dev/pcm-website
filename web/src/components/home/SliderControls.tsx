"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_DOTS = 7;

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
  // Determine which dots to show
  const getVisibleDots = () => {
    if (count <= MAX_VISIBLE_DOTS) {
      // Show all dots if count is small
      return Array.from({ length: count }, (_, i) => i);
    }

    // For many slides, show a sliding window of dots
    const halfWindow = Math.floor((MAX_VISIBLE_DOTS - 1) / 2);
    let start = Math.max(0, activeIndex - halfWindow);
    let end = Math.min(count - 1, activeIndex + halfWindow);

    // Adjust if we're near the edges
    if (end - start < MAX_VISIBLE_DOTS - 1) {
      if (start === 0) {
        end = Math.min(count - 1, MAX_VISIBLE_DOTS - 1);
      } else {
        start = Math.max(0, count - MAX_VISIBLE_DOTS);
      }
    }

    const visible: number[] = [];
    for (let i = start; i <= end; i++) {
      visible.push(i);
    }
    return visible;
  };

  const visibleDots = getVisibleDots();
  const showStartEllipsis = count > MAX_VISIBLE_DOTS && visibleDots[0] > 0;
  const showEndEllipsis = count > MAX_VISIBLE_DOTS && visibleDots[visibleDots.length - 1] < count - 1;

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

      <div className="absolute bottom-[1.6rem] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {/* Show slide counter for many slides */}
        {count > MAX_VISIBLE_DOTS && (
          <span className="text-white/70 text-xs font-medium mr-1">
            {activeIndex + 1}/{count}
          </span>
        )}

        {/* Start ellipsis */}
        {showStartEllipsis && (
          <span className="text-white/50 text-xs pb-1">•••</span>
        )}

        {/* Visible dots */}
        {visibleDots.map((i) => (
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

        {/* End ellipsis */}
        {showEndEllipsis && (
          <span className="text-white/50 text-xs pb-1">•••</span>
        )}
      </div>
    </>
  );
}
