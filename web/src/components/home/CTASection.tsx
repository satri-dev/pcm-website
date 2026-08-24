import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-[clamp(2.5rem,5vw,4rem)]">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl shadow-pcm-md bg-gradient-to-br from-pcm-navy to-pcm-blue-900">
          <div className="relative z-10 grid lg:grid-cols-[1.3fr_auto] gap-8 items-center p-[clamp(2rem,5vw,3.5rem)]">
            <div>
              <span className="font-mono text-[0.74rem] tracking-[0.2em] uppercase text-pcm-green">
                Enter to Learn — Go Forth to Serve
              </span>
              <h2 className="mt-2 text-white text-[clamp(1.6rem,3vw,2.2rem)] font-display font-semibold">
                A step towards your future
              </h2>
              <p className="mt-2 text-white/72 max-w-[56ch]">
                Applications for the 2083 intake are open across all three programs. Take the first step today.
              </p>
            </div>
            <div className="flex flex-wrap gap-[0.9rem]">
              <Link href="/admission" className={buttonVariants({ variant: "gold", size: "lg" })}>
                Apply Now
              </Link>
              <Link href="/about" className={buttonVariants({ variant: "ghostOnDark", size: "lg" })}>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
