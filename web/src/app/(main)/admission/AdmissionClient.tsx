"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  MapPin,
  Home,
  Upload,
  FileText,
  Send,
  Search,
  Eye,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

const PROCESS_STEPS = [
  { n: "1", title: "Submit your application", desc: "Apply online in minutes, or download the prospectus and drop your form at the admissions office in Nadipur." },
  { n: "2", title: "Prepare your documents", desc: "Gather your certificates, transcripts and photographs from the checklist below and keep the originals ready for verification." },
  { n: "3", title: "Sit the entrance exam", desc: "Appear for the Pokhara University entrance examination on the scheduled date. Bring your admit card and a valid ID." },
  { n: "4", title: "Selection & interview", desc: "Selection is merit-based on your entrance result and academic record, followed by a brief counselling interview." },
  { n: "5", title: "Confirm your enrolment", desc: "Complete registration, submit your migration certificate and secure your seat. Welcome to the PCM family!" },
];

const REQUIRED_DOCS = [
  "SEE Mark-sheet & Character Certificate",
  "SEE Transfer Certificate",
  "10+2 / Equivalent Mark-sheet & Transcript",
  "10+2 / Equivalent Character Certificate",
  "Migration Certificate (original required for registration)",
  "Passport-size photographs (2 copies)",
  "Citizenship / Birth Certificate",
];

const STEP_LABELS = ["Personal Info.", "Contact Info.", "Academic Info.", "Document", "Declaration", "Payment"];

interface FormData {
  program_name: string;
  shift: string;
  name: string;
  gender: string;
  dob: string;
  date_option: string;
  nationality: string;
  phone: string;
  personal_contact: string;
  email: string;
  guardian_type: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  guardian_name: string;
  guardian_phone: string;
  relationship: string;
  permanent_province: string;
  permanent_district: string;
  permanent_city: string;
  permanent_ward: string;
  same_address: boolean;
  temporary_province: string;
  temporary_district: string;
  temporary_city: string;
  temporary_ward: string;
  see_bod: string;
  see_school: string;
  see_address: string;
  see_gpa: string;
  see_year: string;
  see_full_mark: string;
  see_mark_obtained: string;
  see_percentage_obtained: string;
  intermediate_bod: string;
  intermediate_school: string;
  intermediate_address: string;
  intermediate_gpa: string;
  intermediate_year: string;
  intermediate_full_mark: string;
  intermediate_mark_obtained: string;
  intermediate_percentage_obtained: string;
  agree_terms: boolean;
}

const INITIAL_FORM: FormData = {
  program_name: "bba",
  shift: "morning",
  name: "",
  gender: "",
  dob: "",
  date_option: "bs",
  nationality: "Nepali",
  phone: "",
  personal_contact: "",
  email: "",
  guardian_type: "",
  father_name: "",
  father_phone: "",
  mother_name: "",
  mother_phone: "",
  guardian_name: "",
  guardian_phone: "",
  relationship: "",
  permanent_province: "",
  permanent_district: "",
  permanent_city: "",
  permanent_ward: "",
  same_address: false,
  temporary_province: "",
  temporary_district: "",
  temporary_city: "",
  temporary_ward: "",
  see_bod: "neb",
  see_school: "",
  see_address: "",
  see_gpa: "",
  see_year: "",
  see_full_mark: "",
  see_mark_obtained: "",
  see_percentage_obtained: "",
  intermediate_bod: "neb",
  intermediate_school: "",
  intermediate_address: "",
  intermediate_gpa: "",
  intermediate_year: "",
  intermediate_full_mark: "",
  intermediate_mark_obtained: "",
  intermediate_percentage_obtained: "",
  agree_terms: true,
};

export default function AdmissionClient() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [payFiles, setPayFiles] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);
  const payInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback((field: keyof FormData, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "same_address" && value === true) {
        next.temporary_province = prev.permanent_province;
        next.temporary_district = prev.permanent_district;
        next.temporary_city = prev.permanent_city;
        next.temporary_ward = prev.permanent_ward;
      }
      if (field === "same_address" && value === false) {
        next.temporary_province = "";
        next.temporary_district = "";
        next.temporary_city = "";
        next.temporary_ward = "";
      }
      return next;
    });
  }, []);

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Photo too large. Max 2MB."); return; }
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if ("stopPropagation" in e) e.stopPropagation();
    const inputFiles = "dataTransfer" in e ? e.dataTransfer.files : e.target.files;
    if (!inputFiles) return;
    const newFiles = Array.from(inputFiles).filter((f) => {
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} is too large (max 5MB).`); return false; }
      return true;
    });
    setDocFiles((prev) => [...prev, ...newFiles]);
  };

  const handlePayDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if ("stopPropagation" in e) e.stopPropagation();
    const inputFiles = "dataTransfer" in e ? e.dataTransfer.files : e.target.files;
    if (!inputFiles) return;
    const newFiles = Array.from(inputFiles).filter((f) => {
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} is too large (max 5MB).`); return false; }
      return true;
    });
    setPayFiles((prev) => [...prev, ...newFiles]);
  };

  const removeDoc = (idx: number) => setDocFiles((prev) => prev.filter((_, i) => i !== idx));
  const removePay = (idx: number) => setPayFiles((prev) => prev.filter((_, i) => i !== idx));

  const progressPct = Math.round((step / 6) * 100);

  const handleSubmit = async () => {
    if (!form.agree_terms || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#51B747] flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#16285B] mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-2">Your application has been received successfully.</p>
          <p className="text-gray-500 text-sm mb-6">Our admissions team will review your application and contact you shortly.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16285B] text-white font-semibold hover:bg-[#1e3a7a] transition-colors">Back to Home</Link>
            <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setDocFiles([]); setPayFiles([]); setProfilePhoto(null); setStep(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#16285B]" style={{ color: "#ffffff" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(3rem,6vw,4.5rem)] grid gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[0.74rem] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
            <Link href="/" className="text-[#51B747] hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span>Admission</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold" style={{ color: "#ffffff" }}>Admission Information</h1>
          <p className="max-w-[56ch]" style={{ color: "rgba(255,255,255,0.7)" }}>Applying to PCM is quick and simple — online or in person. Here&apos;s everything you need for the 2083 intake.</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="text-center mb-12">
            <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">How it works</span>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">The admission process</h2>
          </div>
          <div className="max-w-[820px] mx-auto grid gap-6">
            {PROCESS_STEPS.map((s) => (
              <div key={s.n} className="flex gap-5 items-start p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-11 h-11 rounded-full bg-[#16285B] text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Ways to Apply */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)] bg-[#f5f8ff]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="grid lg:grid-cols-[auto_1fr_auto] gap-10 items-start">
            <img src="/images/admission-open-2026.png" alt="Admissions open for the 2083 intake at PCM" loading="lazy" className="w-full max-w-[280px] h-auto object-contain hidden lg:block" />
            <div>
              <div className="mb-8">
                <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">Apply for admission</span>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">Two easy ways to apply</h2>
                <p className="text-gray-600 mt-3 max-w-2xl">Applying to Pokhara College of Management is quick and simple. Submit your application online, or if you prefer, download the prospectus/form as a PDF and drop it at our admissions office.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mb-4"><Search className="w-6 h-6 text-[#16285B]" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">Apply online</h3>
                  <p className="text-gray-600 text-sm mb-4">The fastest route — complete the form from anywhere and get a confirmation instantly.</p>
                  <a href="#apply-form" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors">Apply Online Now <ArrowRight className="w-4 h-4" /></a>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mb-4"><Upload className="w-6 h-6 text-[#16285B]" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">Apply offline</h3>
                  <p className="text-gray-600 text-sm mb-4">Download the prospectus, fill it in, and submit it at our Nadipur campus.</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer">Download Form <Upload className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-[#21409a]" /> Required documents</h3>
              <ul className="space-y-2.5 mb-5">
                {REQUIRED_DOCS.map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#21409a] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#f0f4ff] rounded-xl p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Entrance schedule</h4>
                <p className="text-sm text-gray-600">Exam: <strong>Ashar 29, 2083 — 8:00 AM</strong><br />Form deadline: <strong>Ashar 26, 2083</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Form */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)]" id="apply-form">
        <div className="w-full max-w-[960px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="text-center mb-10">
            <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">Online Admission</span>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">Start your application</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-[#16285B] rounded-r transition-all duration-400" style={{ width: `${progressPct}%` }} />
            </div>

            {/* Stepper Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${i < step ? "bg-[#51B747] text-white" : i === step ? "bg-[#16285B] text-white" : "bg-gray-100 text-gray-400 border-2 border-gray-200"}`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-[#16285B] font-semibold" : i < step ? "text-[#51B747]" : "text-gray-400"}`}>{label}</span>
                  {i < STEP_LABELS.length - 1 && <div className="hidden sm:block w-4 lg:w-8 h-0.5 bg-gray-200 rounded mx-1" />}
                </div>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault(); }}>
              <div className="p-6 sm:p-8">
                {/* STEP 1: Personal Info */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                      <p className="text-sm text-gray-500">Tell us about yourself</p>
                    </div>

                    {/* Profile Photo */}
                    <div className="flex justify-center">
                      <input type="file" ref={profileInputRef} accept="image/*" className="hidden" onChange={handleProfilePhoto} />
                      <button type="button" onClick={() => profileInputRef.current?.click()} className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${profilePhoto ? "border-[#16285B] bg-[#f0f4ff]" : "border-gray-300 bg-gray-50 hover:border-[#16285B] hover:bg-[#f0f4ff]"}`}>
                        {profilePhoto ? (
                          <div className="relative w-full h-full">
                            <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            <span className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); if (profileInputRef.current) profileInputRef.current.value = ""; }}>&times;</span>
                          </div>
                        ) : (
                          <>
                            <User className="w-10 h-10 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 text-center leading-tight">Profile Photo<br /><span className="text-[0.65rem] text-gray-400">(Click to upload)</span></span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Program */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Programme <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-3">
                          {[{ v: "bba", l: "BBA" }, { v: "bba-finance", l: "BBA - Finance" }, { v: "bcsit", l: "BCSIT" }].map((p) => (
                            <label key={p.v} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${form.program_name === p.v ? "border-[#16285B] bg-[#f0f4ff]" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                              <input type="radio" name="program_name" value={p.v} checked={form.program_name === p.v} onChange={() => update("program_name", p.v)} className="hidden" />
                              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.program_name === p.v ? "border-[#16285B] bg-[#16285B]" : "border-gray-300"}`}>
                                {form.program_name === p.v && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className={`text-sm font-semibold ${form.program_name === p.v ? "text-[#16285B]" : "text-gray-700"}`}>{p.l}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Shift */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Shift <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-3">
                          {[{ v: "morning", l: "Morning" }, { v: "day", l: "Day" }].map((s) => (
                            <label key={s.v} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${form.shift === s.v ? "border-[#16285B] bg-[#f0f4ff]" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                              <input type="radio" name="shift" value={s.v} checked={form.shift === s.v} onChange={() => update("shift", s.v)} className="hidden" />
                              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.shift === s.v ? "border-[#16285B] bg-[#16285B]" : "border-gray-300"}`}>
                                {form.shift === s.v && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className={`text-sm font-semibold ${form.shift === s.v ? "text-[#16285B]" : "text-gray-700"}`}>{s.l}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student&apos;s Full Name <span className="text-red-500">*</span></label>
                        <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter full name as on document" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                        <div className="flex gap-3 flex-wrap">
                          {[{ v: "male", l: "Male" }, { v: "female", l: "Female" }, { v: "other", l: "Other" }].map((g) => (
                            <label key={g.v} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${form.gender === g.v ? "border-[#16285B] bg-[#f0f4ff]" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                              <input type="radio" name="gender" value={g.v} checked={form.gender === g.v} onChange={() => update("gender", g.v)} className="hidden" />
                              <span className={`text-sm font-semibold ${form.gender === g.v ? "text-[#16285B]" : "text-gray-700"}`}>{g.l}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type="text" value={form.dob} onChange={(e) => update("dob", e.target.value)} placeholder="YYYY-MM-DD" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all pr-20" />
                          <div className="absolute right-1 top-1 flex">
                            {["bs", "ad"].map((opt) => (
                              <label key={opt} className={`px-2.5 py-1 text-xs font-semibold cursor-pointer border transition-all ${form.date_option === opt ? "bg-[#16285B] text-white border-[#16285B]" : "bg-white text-[#16285B] border-[#16285B]"}`}>
                                <input type="radio" name="date_option" value={opt} checked={form.date_option === opt} onChange={() => update("date_option", opt)} className="hidden" />
                                {opt === "bs" ? "B.S" : "A.D"}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Nationality */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nationality</label>
                        <input type="text" value={form.nationality} onChange={(e) => update("nationality", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                        <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="e.g. 98XXXXXXXX" maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" />
                      </div>

                      {/* Personal Contact */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Personal Contact Number</label>
                        <input type="tel" value={form.personal_contact} onChange={(e) => update("personal_contact", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="e.g. 98XXXXXXXX" maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" />
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="example@domain.com" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" />
                      </div>
                    </div>

                    {/* Guardian Type */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Guardian Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[{ v: "father", l: "Father" }, { v: "mother", l: "Mother" }, { v: "guardian", l: "Other" }].map((g) => (
                          <label key={g.v} className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${form.guardian_type === g.v ? "border-[#16285B] bg-[#f0f4ff]" : "border-gray-200 bg-white hover:border-blue-300"}`}>
                            <input type="radio" name="guardian_type" value={g.v} checked={form.guardian_type === g.v} onChange={() => update("guardian_type", g.v)} className="hidden" />
                            <User className={`w-6 h-6 ${form.guardian_type === g.v ? "text-[#16285B]" : "text-gray-400"}`} />
                            <span className={`text-sm font-semibold ${form.guardian_type === g.v ? "text-[#16285B]" : "text-gray-700"}`}>{g.l}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Guardian Fields */}
                    {form.guardian_type === "father" && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100 grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Father&apos;s Name</label><input type="text" value={form.father_name} onChange={(e) => update("father_name", e.target.value)} placeholder="Enter father&apos;s full name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Father&apos;s Phone Number</label><input type="tel" value={form.father_phone} onChange={(e) => update("father_phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="e.g. 98XXXXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    )}
                    {form.guardian_type === "mother" && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100 grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Mother&apos;s Name</label><input type="text" value={form.mother_name} onChange={(e) => update("mother_name", e.target.value)} placeholder="Enter mother&apos;s full name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Mother&apos;s Phone Number</label><input type="tel" value={form.mother_phone} onChange={(e) => update("mother_phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="e.g. 98XXXXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    )}
                    {form.guardian_type === "guardian" && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100 grid sm:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Guardian&apos;s Name</label><input type="text" value={form.guardian_name} onChange={(e) => update("guardian_name", e.target.value)} placeholder="Enter guardian&apos;s full name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Guardian&apos;s Phone</label><input type="tel" value={form.guardian_phone} onChange={(e) => update("guardian_phone", e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} placeholder="e.g. 98XXXXXXXX" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Relationship</label><input type="text" value={form.relationship} onChange={(e) => update("relationship", e.target.value)} placeholder="e.g. Uncle, Aunt" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Contact Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
                      <p className="text-sm text-gray-500">Where can we reach you?</p>
                    </div>

                    {/* Permanent Address */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-blue-700" /></div>
                        <h4 className="font-bold text-gray-900 text-sm">Permanent Address</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Province</label><input type="text" value={form.permanent_province} onChange={(e) => update("permanent_province", e.target.value)} placeholder="Enter province" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label><input type="text" value={form.permanent_district} onChange={(e) => update("permanent_district", e.target.value)} placeholder="Enter district" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">City / Municipality</label><input type="text" value={form.permanent_city} onChange={(e) => update("permanent_city", e.target.value)} placeholder="Enter city or municipality" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Ward No.</label><input type="number" value={form.permanent_ward} onChange={(e) => update("permanent_ward", e.target.value)} min="1" placeholder="e.g. 5" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    </div>

                    {/* Same Address Toggle */}
                    <label className="flex items-center gap-3 p-3.5 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:border-green-400 transition-all">
                      <input type="checkbox" checked={form.same_address} onChange={(e) => update("same_address", e.target.checked)} className="w-4.5 h-4.5 accent-[#51B747] cursor-pointer" />
                      <span className="text-sm font-semibold text-green-800">Temporary address same as permanent</span>
                    </label>

                    {/* Temporary Address */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Home className="w-4 h-4 text-amber-700" /></div>
                        <h4 className="font-bold text-gray-900 text-sm">Temporary Address</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Province</label><input type="text" value={form.temporary_province} onChange={(e) => update("temporary_province", e.target.value)} placeholder="Enter province" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label><input type="text" value={form.temporary_district} onChange={(e) => update("temporary_district", e.target.value)} placeholder="Enter district" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">City / Municipality</label><input type="text" value={form.temporary_city} onChange={(e) => update("temporary_city", e.target.value)} placeholder="Enter city or municipality" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Ward No.</label><input type="number" value={form.temporary_ward} onChange={(e) => update("temporary_ward", e.target.value)} min="1" placeholder="e.g. 5" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Academic Info */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Academic Information</h3>
                      <p className="text-sm text-gray-500">Your educational background</p>
                    </div>

                    {/* SEE */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">SEE / SLC</span>
                        <h4 className="font-bold text-gray-900 text-sm">Secondary Education Details</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Board of Education</label><select value={form.see_bod} onChange={(e) => update("see_bod", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all bg-white"><option value="neb">NEB</option><option value="hseb">HSEB</option><option value="other">Other</option></select></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">School Name</label><input type="text" value={form.see_school} onChange={(e) => update("see_school", e.target.value)} placeholder="Enter school name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">School Location</label><input type="text" value={form.see_address} onChange={(e) => update("see_address", e.target.value)} placeholder="Enter school location" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">GPA</label><input type="text" value={form.see_gpa} onChange={(e) => update("see_gpa", e.target.value)} placeholder="e.g. 3.65" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label><input type="text" value={form.see_year} onChange={(e) => update("see_year", e.target.value)} placeholder="e.g. 2079 BS" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Marks</label><input type="text" value={form.see_full_mark} onChange={(e) => update("see_full_mark", e.target.value)} placeholder="e.g. 800" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Marks Obtained</label><input type="text" value={form.see_mark_obtained} onChange={(e) => update("see_mark_obtained", e.target.value)} placeholder="Obtained marks" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Percentage</label><input type="text" value={form.see_percentage_obtained} onChange={(e) => update("see_percentage_obtained", e.target.value)} placeholder="Percentage (%)" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    </div>

                    {/* +2 */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wide">+2 / Intermediate</span>
                        <h4 className="font-bold text-gray-900 text-sm">Higher Secondary Details</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Board of Education</label><select value={form.intermediate_bod} onChange={(e) => update("intermediate_bod", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all bg-white"><option value="neb">NEB</option><option value="hseb">HSEB</option><option value="cie">CIE (A Levels)</option><option value="other">Other</option></select></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">College Name</label><input type="text" value={form.intermediate_school} onChange={(e) => update("intermediate_school", e.target.value)} placeholder="Enter college name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">College Location</label><input type="text" value={form.intermediate_address} onChange={(e) => update("intermediate_address", e.target.value)} placeholder="Enter college location" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">GPA</label><input type="text" value={form.intermediate_gpa} onChange={(e) => update("intermediate_gpa", e.target.value)} placeholder="e.g. 3.25" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label><input type="text" value={form.intermediate_year} onChange={(e) => update("intermediate_year", e.target.value)} placeholder="e.g. 2081 BS" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Marks</label><input type="text" value={form.intermediate_full_mark} onChange={(e) => update("intermediate_full_mark", e.target.value)} placeholder="e.g. 600" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Marks Obtained</label><input type="text" value={form.intermediate_mark_obtained} onChange={(e) => update("intermediate_mark_obtained", e.target.value)} placeholder="Obtained marks" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Percentage</label><input type="text" value={form.intermediate_percentage_obtained} onChange={(e) => update("intermediate_percentage_obtained", e.target.value)} placeholder="Percentage (%)" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-[#16285B] focus:ring-2 focus:ring-[#16285B]/10 outline-none transition-all" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Document Upload */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Document Upload</h3>
                      <p className="text-sm text-gray-500">Upload your required documents</p>
                    </div>

                    <ul className="space-y-2">
                      {["SEE / SLC Mark-sheet", "SEE / SLC Character Certificate", "+2 / Intermediate Mark-sheet", "+2 / Intermediate Character Certificate"].map((doc) => (
                        <li key={doc} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">
                          <Check className="w-4 h-4 text-[#51B747] shrink-0" strokeWidth={2.5} /> {doc}
                        </li>
                      ))}
                    </ul>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-8 text-center cursor-pointer hover:border-[#16285B] hover:bg-[#f0f4ff] transition-all" onClick={() => docInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={handleDocDrop}>
                      <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mx-auto mb-2"><Upload className="w-6 h-6 text-[#16285B]" /></div>
                      <p className="text-sm text-gray-700 font-medium">Drag and drop files here, or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Accepted: JPEG, JPG, PNG, PDF · Max 5 MB each</p>
                      <input ref={docInputRef} type="file" multiple accept=".jpeg,.jpg,.png,.pdf" className="hidden" onChange={handleDocDrop} />
                    </div>

                    {docFiles.length > 0 && (
                      <div className="space-y-2">
                        {docFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3.5 py-2.5">
                            <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p><p className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p></div>
                            <button type="button" onClick={() => removeDoc(i)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: Declaration */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Declaration & Consent</h3>
                      <p className="text-sm text-gray-500">Review and confirm your application</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <h4 className="font-bold text-gray-900 mb-2">Declaration</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge. I understand that if any information is found to be false or misleading, my admission may be cancelled. I agree to abide by the rules and regulations of Pokhara College of Management.</p>
                    </div>

                    <label className="flex items-center gap-3 p-3.5 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:border-green-400 transition-all">
                      <input type="checkbox" checked={form.agree_terms} onChange={(e) => update("agree_terms", e.target.checked)} className="w-5 h-5 accent-[#51B747] cursor-pointer" />
                      <span className="text-sm font-semibold text-green-800">I have read and agree to the declaration above</span>
                    </label>
                  </div>
                )}

                {/* STEP 6: Payment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Payment & Review</h3>
                      <p className="text-sm text-gray-500">Upload payment slip and review your application</p>
                    </div>

                    <div className="bg-[#16285B] rounded-xl p-5 text-white">
                      <h4 className="font-bold mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Bank Voucher Details</h4>
                      <div className="space-y-0">
                        {[
                          { l: "Bank", v: "Prabhu Bank Limited" },
                          { l: "Account Name", v: "Pokhara College Of Management Pvt Ltd" },
                          { l: "Account No", v: "0560153103200019" },
                          { l: "Branch", v: "Newroad, Pokhara, Nepal" },
                          { l: "Admission Fee", v: "Rs. 1,000", accent: true },
                        ].map((row) => (
                          <div key={row.l} className="flex justify-between py-2 border-b border-white/10 last:border-b-0 text-sm">
                            <span className="text-white/65 font-medium">{row.l}</span>
                            <span className={`font-semibold ${row.accent ? "text-[#51B747] text-base" : "text-white"}`}>{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Payment Slip</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-8 text-center cursor-pointer hover:border-[#16285B] hover:bg-[#f0f4ff] transition-all" onClick={() => payInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={handlePayDrop}>
                        <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mx-auto mb-2"><Upload className="w-6 h-6 text-[#16285B]" /></div>
                        <p className="text-sm text-gray-700 font-medium">Drag and drop payment slip, or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">Accepted: JPEG, JPG, PNG, PDF · Max 5 MB</p>
                        <input ref={payInputRef} type="file" multiple accept=".jpeg,.jpg,.png,.pdf" className="hidden" onChange={handlePayDrop} />
                      </div>
                      {payFiles.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {payFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3.5 py-2.5">
                              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p><p className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p></div>
                              <button type="button" onClick={() => removePay(i)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b-2 border-[#16285B]">
                        <Eye className="w-5 h-5 text-[#16285B]" />
                        <h4 className="font-bold text-[#16285B] text-sm">Application Summary</h4>
                      </div>
                      <div className="space-y-0">
                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-2 pb-1 border-b border-gray-200">Personal Information</div>
                        {[
                          { l: "Programme", v: form.program_name.toUpperCase().replace("BBA-FINANCE", "BBA-Finance") },
                          { l: "Shift", v: form.shift.charAt(0).toUpperCase() + form.shift.slice(1) },
                          { l: "Full Name", v: form.name || "—" },
                          { l: "Gender", v: form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1) : "—" },
                          { l: "Date of Birth", v: form.dob || "—" },
                          { l: "Nationality", v: form.nationality || "—" },
                          { l: "Phone", v: form.phone || "—" },
                          { l: "Email", v: form.email || "—" },
                          ...(form.guardian_type ? [{ l: "Guardian Type", v: form.guardian_type.charAt(0).toUpperCase() + form.guardian_type.slice(1) }] : []),
                        ].map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Address</div>
                        {[
                          { l: "Permanent", v: [form.permanent_province, form.permanent_district, form.permanent_city, form.permanent_ward ? `Ward ${form.permanent_ward}` : ""].filter(Boolean).join(", ") || "—" },
                          { l: "Temporary", v: [form.temporary_province, form.temporary_district, form.temporary_city, form.temporary_ward ? `Ward ${form.temporary_ward}` : ""].filter(Boolean).join(", ") || "—" },
                        ].map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Academic Information</div>
                        {[
                          { l: "SEE GPA / Year", v: [form.see_gpa, form.see_year].filter(Boolean).join(" \u00b7 ") || "—" },
                          { l: "+2 GPA / Year", v: [form.intermediate_gpa, form.intermediate_year].filter(Boolean).join(" \u00b7 ") || "—" },
                        ].map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Uploads</div>
                        {[
                          { l: "Documents", v: `${docFiles.length} file${docFiles.length !== 1 ? "s" : ""}` },
                          { l: "Payment Slip", v: `${payFiles.length} file${payFiles.length !== 1 ? "s" : ""}` },
                        ].map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
                  {step > 0 ? (
                    <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                  ) : <div />}
                  {step < 5 ? (
                    <button type="button" onClick={() => setStep(step + 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors">
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="button" disabled={submitting || !form.agree_terms} onClick={handleSubmit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#51B747] text-white font-semibold text-sm hover:bg-[#3F9E35] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <>Submit Application <Send className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="bg-[#f0f4ff] rounded-xl p-5 mt-6">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Need help?</h4>
            <p className="text-sm text-gray-600">For any queries or technical assistance with the application, contact the Admission Desk at <a href="mailto:info@pcm.edu.np" className="text-[#16285B] font-semibold">info@pcm.edu.np</a> or call (061) 544761, 570124.</p>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-[clamp(2.5rem,5vw,4rem)]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="relative overflow-hidden rounded-[22px] shadow-[0_4px_6px_-1px_rgba(22,40,91,0.1),0_2px_4px_-2px_rgba(22,40,91,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16285b] to-[#14265a]" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_85%_10%,rgba(81,183,71,0.28),transparent_60%),radial-gradient(500px_300px_at_10%_90%,rgba(65,103,201,0.35),transparent_60%)]" />
            <div className="relative z-10 grid grid-cols-[1.3fr_auto] gap-[clamp(1.25rem,3vw,2.5rem)] items-center p-[clamp(2rem,5vw,3.5rem)_clamp(1.5rem,4vw,3rem)] max-md:grid-cols-1 max-md:text-center" style={{ color: "#ffffff" }}>
              <div>
                <span className="inline-flex items-center gap-2 text-[0.74rem] tracking-[0.2em] uppercase text-[#51B747]">Enter to Learn — Go Forth to Serve</span>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 mb-2 font-semibold">A step towards your future</h2>
                <p className="max-w-[56ch] max-md:mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
              </div>
              <div className="flex flex-wrap gap-3.5 max-md:justify-center">
                <a href="#apply-form" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-[#51B747] text-[#16285b] hover:bg-[#3f9e35] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(81,183,71,0.28)] transition-all">Apply Now <ArrowRight className="w-4 h-4" /></a>
                <Link href="/about" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-transparent text-white border border-white/35 hover:border-white hover:text-white transition-all">More Info</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
