"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { HomepageTestimonial } from "@/types/homepage";

export default function TestimonialsSection({ testimonials }: { testimonials: HomepageTestimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-pcm-green/10 text-pcm-green text-sm font-semibold uppercase tracking-wider mb-4">
            Voices of PCM
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-display font-bold text-pcm-navy mb-4">
            What our achievers say
          </h2>
          <p className="text-gray-600 text-base lg:text-lg">
            Graduates on the Dean's List reflect on their four-year journey at PCM
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-5xl mx-auto relative">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="relative px-6 py-12 lg:px-16 lg:py-16">
              {/* Quote Icon Background */}
              <div className="absolute top-8 right-8 opacity-5">
                <Quote className="w-32 h-32 lg:w-48 lg:h-48 text-pcm-blue" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Photo - Centered */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-pcm-green/20 shadow-lg">
                      <Image
                        src={activeTestimonial.photo}
                        alt={activeTestimonial.name}
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Quote badge */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-pcm-green rounded-full flex items-center justify-center shadow-lg">
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-center max-w-3xl mx-auto mb-8">
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-normal">
                    "{activeTestimonial.quote}"
                  </p>
                </blockquote>

                {/* Author Info - Centered */}
                <div className="text-center">
                  <h3 className="text-xl lg:text-2xl font-display font-bold text-pcm-navy mb-1">
                    {activeTestimonial.name}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 font-medium">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-100">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-gray-200 text-pcm-navy hover:border-pcm-green hover:bg-pcm-green hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                      className={`transition-all rounded-full ${
                        index === activeIndex 
                          ? "w-8 h-2.5 bg-pcm-green" 
                          : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-gray-200 text-pcm-navy hover:border-pcm-green hover:bg-pcm-green hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Counter */}
              <div className="text-center mt-4">
                <span className="text-xs lg:text-sm text-gray-500 font-medium">
                  {activeIndex + 1} of {testimonials.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}