import type { CSSProperties } from "react";

type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
};

export function ProgressRing({ value, size = 48, stroke = 4, className }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  const ringStyle = {
    "--ring-from": circumference,
    "--ring-to": offset,
    strokeDashoffset: offset,
  } as CSSProperties;

  return (
    <div className={`relative shrink-0 ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--paper-dim)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--indigo)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="animate-ring-fill"
          style={ringStyle}
        />
      </svg>
      <span className="animate-rise-in absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums text-ink">
        {clamped}%
      </span>
    </div>
  );
}
