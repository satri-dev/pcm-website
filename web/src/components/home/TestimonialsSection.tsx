"use client";

import { useState } from "react";
import Image from "next/image";
import type { HomepageTestimonial } from "@/types/homepage";

export default function TestimonialsSection({ testimonials }: { testimonials: HomepageTestimonial[] }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-secondary/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
            Voices of PCM
          </span>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
            What our achievers say
          </h2>
          <p className="text-muted-foreground text-lg">
            Graduates on the Dean's List reflect on their four-year journey — the mentorship, the friendships, and the confidence they carry forward.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[300px,1fr] gap-12 items-center">
            {/* Featured testimonial */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6">
                <Image
                  src={testimonials[activeTestimonial].photo}
                  alt={testimonials[activeTestimonial].name}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-display font-semibold text-pcm-navy mb-1">
                {testimonials[activeTestimonial].name}
              </h3>
              <p className="text-muted-foreground">
                {testimonials[activeTestimonial].role}
              </p>
            </div>

            {/* Quote */}
            <div className="lg:text-left text-center">
              <blockquote className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 italic">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>

              {/* Testimonial selector */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => setActiveTestimonial(index)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      index === activeTestimonial
                        ? "bg-pcm-blue text-white border-pcm-blue"
                        : "bg-card border-border hover:border-pcm-blue/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm line-clamp-1 ${
                        index === activeTestimonial ? "text-white" : "text-pcm-navy"
                      }`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-xs line-clamp-1 ${
                        index === activeTestimonial ? "text-white/80" : "text-muted-foreground"
                      }`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}