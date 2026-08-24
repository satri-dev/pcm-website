import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide as HeroSlideType } from "@/data/hero-slides";
import { buttonVariants } from "@/components/ui/button";
import HeroBadge from "./HeroBadge";
import StatsOverlay from "./StatsOverlay";

export default function HeroSlide({ slide }: { slide: HeroSlideType }) {
  return (
    <article className="relative flex items-center min-w-full flex-[0_0_100%]">
      <Image
        src={slide.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_40%]"
      />
      {/* readability gradient, matches .hero-carousel__slide::after */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08102266] via-[#08102247] to-[#081022b8]" />

      <div className="container relative z-10 py-[clamp(2rem,4vw,3.5rem)]">
        <HeroBadge>{slide.badge}</HeroBadge>
        <h1 className="text-white font-display font-semibold leading-[1.06] text-[clamp(2.2rem,4.2vw,3.3rem)] max-w-[16ch]">
          {slide.heading} <span className="text-pcm-green">{slide.accent}</span>
        </h1>
        <p className="mt-4 text-[1.05rem] max-w-[48ch] text-white/72">{slide.sub}</p>

        <div className="flex flex-wrap gap-[0.9rem] mt-6">
          <Link href={slide.primaryCta.href} className={buttonVariants({ variant: "gold", size: "lg" })}>
            {slide.primaryCta.label} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={slide.secondaryCta.href} className={buttonVariants({ variant: "ghostOnDark", size: "lg" })}>
            {slide.secondaryCta.label}
          </Link>
        </div>

        <StatsOverlay stats={slide.stats} />
      </div>
    </article>
  );
}
