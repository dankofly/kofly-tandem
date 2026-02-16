import { getTickerItems } from "@/lib/ticker-config";

export default async function Ticker() {
  const items = await getTickerItems();

  if (items.length === 0) return null;

  const content = items.map((item, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      <span className="text-xs font-medium tracking-wide text-[var(--text-body)]">
        {item}
      </span>
      <span className="mx-4 text-[var(--text-ghost)]" aria-hidden="true">|</span>
    </span>
  ));

  return (
    <div className="relative overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border-faint)]">
      <div className="ticker-track flex items-center whitespace-nowrap py-2.5">
        <div className="ticker-segment flex items-center shrink-0">{content}</div>
        <div className="ticker-segment flex items-center shrink-0" aria-hidden="true">{content}</div>
      </div>
    </div>
  );
}
