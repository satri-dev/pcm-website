export default function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 mb-4 px-[1.1rem] py-2 rounded-full bg-pcm-green text-pcm-navy font-mono text-[0.72rem] font-bold tracking-[0.14em] uppercase shadow-md whitespace-nowrap">
      {children}
    </span>
  );
}
