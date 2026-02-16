export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3" aria-hidden="true">
      <span className="text-[10px] tracking-premium uppercase text-hero-muted font-medium">
        Scroll
      </span>
      <div className="w-px h-10 bg-gradient-to-b from-accent-500/60 to-transparent animate-scroll-hint" />
    </div>
  );
}
