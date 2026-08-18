const BARS: { left: number; width: number; className: string; delay: number }[] = [
  { left: 0, width: 42, className: "bg-thread-ochre-tint", delay: 0 },
  { left: 12, width: 56, className: "bg-paper/90", delay: 80 },
  { left: 4, width: 30, className: "bg-thread-moss-tint", delay: 160 },
  { left: 24, width: 62, className: "bg-thread-stone-tint", delay: 240 },
  { left: 0, width: 46, className: "bg-thread-ochre-tint/70", delay: 320 },
  { left: 18, width: 36, className: "bg-paper/80", delay: 400 },
  { left: 8, width: 52, className: "bg-thread-moss-tint/80", delay: 480 },
];

export function TimelineHero() {
  return (
    <div className="relative py-2" aria-hidden>
      <div className="absolute bottom-0 top-0 w-px border-l-2 border-dashed border-paper/50" style={{ left: "68%" }}>
        <span className="absolute -top-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-paper animate-pulse-soft" />
      </div>

      <div className="space-y-3">
        {BARS.map((bar, i) => (
          <div key={i} className="h-2.5 w-full">
            <div
              className={`animate-bar-in h-full rounded-full ${bar.className}`}
              style={{
                marginLeft: `${bar.left}%`,
                width: `${bar.width}%`,
                animationDelay: `${bar.delay}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
