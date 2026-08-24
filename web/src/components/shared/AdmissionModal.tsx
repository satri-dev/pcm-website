"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, GraduationCap, ArrowRight } from "lucide-react";
import { newsData } from "@/data/news";

const tabs = [
  { id: "news", label: "Latest News" },
  { id: "notice", label: "Notice" },
  { id: "result", label: "Result" },
  { id: "event", label: "Event" },
];

const noticeData = [
  { date: "Ashar 21, 2083", title: "Entrance Examination Schedule - 2083", href: "/assets/pdf/entrance-schedule-2083.pdf" },
  { date: "Ashar 18, 2083", title: "Admission Form Deadline", href: "/assets/pdf/admission-open-2083.pdf" },
  { date: "Ashar 10, 2083", title: "Scholarship Applications Open", href: "/assets/pdf/scholarship-open-2083.pdf" },
  { date: "Ashar 02, 2083", title: "Semester Result Publication", href: "/assets/pdf/semester-result-publication.pdf" },
  { date: "Jestha 28, 2083", title: "Annual Fest 2083 Dates Announced", href: "/assets/pdf/annual-fest-2083.pdf" },
];

const resultData = [
  { date: "15 Jul 2026", title: "BBA 8th Semester Result - 2082", href: "/assets/pdf/bba-8th-semester-2082.pdf" },
  { date: "28 Jun 2026", title: "BCSIT 3rd Semester Result - 2082", href: "/assets/pdf/bcsit-3rd-semester-2082.pdf" },
  { date: "12 Jun 2026", title: "BBA-Finance 5th Semester Result - 2082", href: "/assets/pdf/bba-finance-5th-semester-2082.pdf" },
  { date: "02 Jun 2026", title: "BBA 6th Semester Result - 2082", href: "/assets/pdf/bba-6th-semester-2082.pdf" },
  { date: "28 May 2026", title: "BCSIT 1st Semester Result - 2082", href: "/assets/pdf/bcsit-1st-semester-2082.pdf" },
];

const eventData = [
  { date: "15 Aug 2026", title: "Coding Bootcamp for BCSIT" },
  { date: "22 Aug 2026", title: "Guest Lecture: Careers in Banking" },
  { date: "29 Aug 2026", title: "Inter-Batch Sports Tournament" },
  { date: "05 Sep 2026", title: "Annapurna Educational Tour" },
  { date: "18 Sep 2026", title: "Annual Fest 2083" },
];

export default function AdmissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    // Show modal on page load after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeModal = () => setIsOpen(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "news":
        return (
          <div className="space-y-2 sm:space-y-3">
            {newsData.slice(0, 5).map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="block p-2.5 sm:p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={closeModal}
              >
                <div className="text-[0.65rem] sm:text-xs text-pcm-blue font-mono mb-0.5 sm:mb-1">{item.date}</div>
                <div className="text-xs sm:text-sm font-medium text-pcm-navy line-clamp-2 leading-snug">{item.title}</div>
              </Link>
            ))}
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-xs sm:text-sm transition-colors mt-2 sm:mt-3"
              onClick={closeModal}
            >
              View all news <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        );
      case "notice":
        return (
          <div className="space-y-2 sm:space-y-3">
            {noticeData.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener"
                className="block p-2.5 sm:p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={closeModal}
              >
                <div className="text-[0.65rem] sm:text-xs text-pcm-blue font-mono mb-0.5 sm:mb-1">{item.date}</div>
                <div className="text-xs sm:text-sm font-medium text-pcm-navy leading-snug">{item.title}</div>
              </a>
            ))}
            <Link
              href="/notice"
              className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-xs sm:text-sm transition-colors mt-2 sm:mt-3"
              onClick={closeModal}
            >
              View all notices <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        );
      case "result":
        return (
          <div className="space-y-2 sm:space-y-3">
            {resultData.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener"
                className="block p-2.5 sm:p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={closeModal}
              >
                <div className="text-[0.65rem] sm:text-xs text-pcm-blue font-mono mb-0.5 sm:mb-1">{item.date}</div>
                <div className="text-xs sm:text-sm font-medium text-pcm-navy leading-snug">{item.title}</div>
              </a>
            ))}
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-xs sm:text-sm transition-colors mt-2 sm:mt-3"
              onClick={closeModal}
            >
              View all results <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        );
      case "event":
        return (
          <div className="space-y-2 sm:space-y-3">
            {eventData.map((item) => (
              <Link
                key={item.title}
                href="/events"
                className="block p-2.5 sm:p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={closeModal}
              >
                <div className="text-[0.65rem] sm:text-xs text-pcm-blue font-mono mb-0.5 sm:mb-1">{item.date}</div>
                <div className="text-xs sm:text-sm font-medium text-pcm-navy leading-snug">{item.title}</div>
              </Link>
            ))}
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-xs sm:text-sm transition-colors mt-2 sm:mt-3"
              onClick={closeModal}
            >
              View all events <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-3 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admissionModalTitle"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-lg sm:rounded-xl shadow-2xl max-h-[96vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-pcm-navy" />
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 text-center border-b border-border">
          {/* Icon Badge */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-pcm-blue text-white grid place-items-center mx-auto mb-2 sm:mb-3">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>

          {/* Eyebrow */}
          <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-pcm-blue/10 text-pcm-blue text-[0.65rem] sm:text-xs font-mono uppercase tracking-wider mb-1.5 sm:mb-2">
            Admissions Open · 2083 Intake
          </span>

          {/* Title */}
          <h2
            id="admissionModalTitle"
            className="text-base sm:text-lg md:text-xl font-display font-bold text-pcm-navy mb-1.5 sm:mb-2 px-2"
          >
            Join BBA, BBA-Finance & BCSIT
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2 leading-relaxed">
            Applications are open for the 2083 intake at Pokhara College of Management. Seats are limited and the deadline is close.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 px-3 sm:px-4 md:px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-pcm-blue text-pcm-blue bg-pcm-blue/5"
                    : "border-transparent text-muted-foreground hover:text-pcm-navy hover:bg-secondary/30"
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-3 sm:pt-4">
          {renderTabContent()}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-border p-3 sm:p-4 md:p-5 bg-secondary/30">
          <div className="flex flex-col gap-2 sm:gap-2.5 mb-2 sm:mb-3">
            <Link
              href="/admission"
              className="w-full h-9 sm:h-10 md:h-11 rounded-lg bg-pcm-green text-pcm-navy font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:bg-pcm-green/90 transition-colors"
              onClick={closeModal}
            >
              Apply Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="/admission"
              className="w-full h-9 sm:h-10 md:h-11 rounded-lg bg-white border-2 border-pcm-navy text-pcm-navy font-bold text-xs sm:text-sm inline-flex items-center justify-center hover:bg-pcm-navy hover:text-white transition-colors"
              onClick={closeModal}
            >
              Entrance Details
            </Link>
          </div>
          <p className="text-center text-[0.65rem] sm:text-xs text-muted-foreground">
            Questions? Call{" "}
            <a href="tel:061544761" className="text-pcm-blue hover:underline font-semibold">
              (061) 544761
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
