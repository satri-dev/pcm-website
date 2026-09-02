import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, BookOpen, Award } from "lucide-react";
import type { AdmissionConfig } from "@/types/homepage";

export default function AdmissionSection({ admission }: { admission: AdmissionConfig }) {
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-semibold uppercase tracking-wider mb-4">
            {admission.badge}
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-display font-bold text-pcm-navy mb-4">
            {admission.heading}
          </h2>
          <p className="text-gray-600 text-base lg:text-lg">
            {admission.subheading}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Left: Main Content */}
            <div>
              {/* Poster Image - Mobile/Tablet */}
              <div className="lg:hidden mb-8">
                <div className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={admission.posterImage}
                    alt="Admissions open"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {admission.steps.map((step, index) => (
                  <div 
                    key={step.number} 
                    className="flex gap-4 group"
                  >
                    {/* Step Number Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-pcm-blue/10 text-pcm-blue flex items-center justify-center font-bold text-lg group-hover:bg-pcm-blue group-hover:text-white transition-colors">
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg lg:text-xl font-display font-semibold text-pcm-navy mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button - Mobile */}
              <div className="mt-8 lg:hidden">
                <Link 
                  href="/admission" 
                  className={buttonVariants({ variant: "gold", size: "lg", className: "w-full" })}
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="lg:sticky lg:top-24">
              {/* Poster - Desktop */}
              <div className="hidden lg:block mb-6">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
                  <Image
                    src={admission.posterImage}
                    alt="Admissions open"
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-display font-bold text-pcm-navy mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pcm-green" />
                  Key Details
                </h3>
                
                <div className="space-y-4 mb-6">
                  {admission.details.map((detail, index) => (
                    <div 
                      key={detail.label} 
                      className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold block mb-1">
                        {detail.label}
                      </span>
                      <span className="text-base font-semibold text-pcm-navy block">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button - Desktop */}
                <Link 
                  href="/admission" 
                  className={buttonVariants({ variant: "gold", size: "lg", className: "w-full" })}
                >
                  Apply Now <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Additional Info */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Need help? <Link href="/contact" className="text-pcm-blue hover:underline font-medium">Contact us</Link>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
