const items = [
  "High-Quality Heat Press",
  "Fast Turnaround",
  "Bulk & Single Orders",
  "Custom Designs",
  "Made in Jamaica",
  "Premium Apparel",
];

const Marquee = () => {
  const loop = [...items, ...items];
  return (
    <div className="ticker-mask overflow-hidden border-y border-ink/15 bg-ink py-4 text-paper">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {loop.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-mono text-xs uppercase tracking-[0.3em]"
          >
            {t}
            <span className="text-stamp">✶</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
