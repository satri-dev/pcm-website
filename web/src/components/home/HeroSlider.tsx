"use client";

import { useCallback, useEffect, useState } from "react";
import type { HeroSlide as HeroSlideType } from "@/types/homepage";
import { MAX_HERO_SLIDES } from "@/types/homepage";
import HeroSlide from "./HeroSlide";
import SliderControls from "./SliderControls";

export default function HeroSlider({ slides }: { slides: HeroSlideType[] }) {
  const visibleSlides = slides.slice(0, MAX_HERO_SLIDES);
  const [index, setIndex] = useState(0);
  const count = visibleSlides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section
      aria-label="Highlights"
      className="relative bg-pcm-navy text-white/85 overflow-hidden min-h-[calc(100dvh-104px)] sm:min-h-[calc(100dvh-114px)] flex flex-col"
    >
      <div
        className="flex flex-1 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {visibleSlides.map((slide) => (
          <HeroSlide key={slide.id} slide={slide} />
        ))}
      </div>

      <SliderControls
        count={count}
        activeIndex={index}
        onPrev={prev}
        onNext={next}
        onDotClick={setIndex}
      />
    </section>
  );
}
