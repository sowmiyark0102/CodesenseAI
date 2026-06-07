import clsx from 'clsx';

interface Props {
  score: number;
  size?: number;
  label?: string;
  strokeWidth?: number;
  showPercent?: boolean;
}

export function getScoreColor(score: number) {
  if (score >= 85) return '#00d4ff';
  if (score >= 65) return '#a3e635';
  if (score >= 40) return '#fbbf24';
  return '#fb7185';
}

export function getScoreLabel(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
}

export default function ScoreRing({ score, size = 72, label, strokeWidth = 5, showPercent = true }: Props) {
  const color = getScoreColor(score);
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={center} cy={center} r={r} fill="none" stroke="#1f2840" strokeWidth={strokeWidth} />
          <circle
            cx={center} cy={center} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-semibold leading-none" style={{ color, fontSize: size * 0.22 }}>
            {score}
          </span>
          {showPercent && <span style={{ color, fontSize: size * 0.10, opacity: 0.7 }}>%</span>}
        </div>
      </div>
      {label && <span className="text-xs text-dim font-medium">{label}</span>}
    </div>
  );
}
