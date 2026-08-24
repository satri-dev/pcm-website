import Link from "next/link";
import { MessageCircle, GraduationCap } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed right-6 bottom-6 z-[500] flex flex-col items-center gap-3">
      <a
        href="https://wa.me/97761544761"
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="w-[50px] h-[50px] grid place-items-center rounded-full bg-[#25d366] text-white shadow-pcm-md hover:-translate-y-1 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <Link
        href="/admission"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pcm-green text-pcm-navy font-bold text-sm shadow-pcm-md hover:-translate-y-1 transition-transform"
      >
        <GraduationCap className="w-[1.1rem] h-[1.1rem]" /> Apply
      </Link>
    </div>
  );
}
