"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: 80, suffix: "%", label: "Success stories" },
  { value: 100, suffix: "", label: "Dean's List Scholars" },
  { value: 1000, suffix: "", label: "Graduates" },
  { value: 23, suffix: "", label: "Years of Excellence" },
];

export default function WelcomeSection() {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      const increment = stat.value / 50;
      return setInterval(() => {
        setCounters(prev => {
          const newCounters = [...prev];
          if (newCounters[index] < stat.value) {
            newCounters[index] = Math.min(newCounters[index] + increment, stat.value);
          }
          return newCounters;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
            Welcome to PCM
          </span>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
            Education that opens doors
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Affiliated to Pokhara University, PCM has been shaping confident, capable graduates since 2002 through hands-on learning, dedicated mentors and a vibrant campus culture.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-[2.5rem] lg:text-[3rem] font-display font-bold text-pcm-blue mb-2">
                {Math.floor(counters[index])}{stat.suffix}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}