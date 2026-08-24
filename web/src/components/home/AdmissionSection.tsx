import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const admissionSteps = [
  {
    number: "01",
    title: "Submit the form",
    description: "Fill out the online application or pick up a form from the college office before Ashar 26, 2083."
  },
  {
    number: "02", 
    title: "Appear for the entrance",
    description: "The entrance exam is held on Ashar 29, 2083, 8:00 AM at the PCM campus."
  },
  {
    number: "03",
    title: "Secure your seat", 
    description: "Selected candidates complete admission formalities and begin a journey worth starting."
  }
];

const admissionDetails = [
  { label: "Form deadline", value: "Ashar 26, 2083" },
  { label: "Entrance exam", value: "Ashar 29, 2083 · 8:00 AM" },
  { label: "Programs", value: "BBA · BBA-Finance · BCSIT" },
  { label: "Scholarships", value: "Available" }
];

export default function AdmissionSection() {
  return (
    <section className="py-[clamp(3rem,6vw,5rem)] bg-background">
      <div className="container">
        <div className="max-w-2xl mb-6">
          <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
            Admissions 2083
          </span>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.4rem)] font-display font-semibold text-pcm-navy mb-3">
            Join PCM this intake
          </h2>
          <p className="text-muted-foreground text-base">
            A simple, transparent admission process — scholarships available for deserving students.
          </p>
        </div>

        {/* 3-column grid: image | steps | details */}
        <div className="grid lg:grid-cols-[200px_minmax(0,1fr)_320px] gap-[clamp(1.5rem,3vw,2.5rem)] items-start mt-6">
          {/* Left: Admission Poster */}
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-md">
            <Image
              src="/images/admission-open-2026.png"
              alt="Admissions open for 2083 intake"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          
          {/* Middle: Steps */}
          <div className="space-y-5">
            {admissionSteps.map((step) => (
              <div key={step.number} className="flex gap-3">
                <div className="flex-shrink-0 text-pcm-blue/50 text-sm font-mono font-semibold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-[1.05rem] font-semibold text-pcm-navy mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-[0.9rem] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Admission Details Card */}
          <aside className="bg-white border border-border rounded-lg p-5 shadow-sm">
            <h3 className="text-base font-semibold text-pcm-navy mb-4">
              Admission details
            </h3>
            
            <div className="space-y-3 mb-5">
              {admissionDetails.map((detail) => (
                <div key={detail.label} className="flex flex-col gap-0.5">
                  <span className="text-[0.75rem] text-muted-foreground">
                    {detail.label}
                  </span>
                  <span className="text-[0.875rem] font-semibold text-pcm-navy">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/admission" className={`${buttonVariants({ variant: "primary", size: "default" })} w-full`}>
              Apply Now
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}