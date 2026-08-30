import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { CTAConfig } from "@/types/homepage";

export default function CTASection({ cta }: { cta: CTAConfig }) {
  return (
    <section className="py-[clamp(2.5rem,5vw,4rem)]">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl shadow-pcm-md bg-gradient-to-br from-pcm-navy to-pcm-blue-900">
          <div className="relative z-10 grid lg:grid-cols-[1.3fr_auto] gap-8 items-center p-[clamp(2rem,5vw,3.5rem)]">
            <div>
              <span className="font-mono text-[0.74rem] tracking-[0.2em] uppercase text-pcm-green">
                {cta.tagline}
              </span>
              <h2 className="mt-2 text-white text-[clamp(1.6rem,3vw,2.2rem)] font-display font-semibold">
                {cta.heading}
              </h2>
              <p className="mt-2 text-white/72 max-w-[56ch]">
                {cta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-[0.9rem]">
              <Link href={cta.primaryButton.href} className={buttonVariants({ variant: "gold", size: "lg" })}>
                {cta.primaryButton.label}
              </Link>
              <Link href={cta.secondaryButton.href} className={buttonVariants({ variant: "ghostOnDark", size: "lg" })}>
                {cta.secondaryButton.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
