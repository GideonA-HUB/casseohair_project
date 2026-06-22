const PINK = '#E62E72';
const PINK_DARK = '#801337';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#22c55e',
  processing: '#3b82f6',
  confirmed: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

export interface BarChartItem {
  label: string;
  value: number;
}

export function AdminBarChart({
  data,
  valuePrefix = '',
  height = 220,
}: {
  data: BarChartItem[];
  valuePrefix?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(48, Math.floor(520 / Math.max(data.length, 1)) - 8);

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${Math.max(data.length * (barWidth + 16), 320)} ${height}`} className="w-full h-full">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - 40 - ratio * (height - 70);
          return (
            <g key={ratio}>
              <line x1="0" y1={y} x2="100%" y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
            </g>
          );
        })}
        {data.map((item, i) => {
          const barHeight = (item.value / max) * (height - 70);
          const x = i * (barWidth + 16) + 8;
          const y = height - 40 - barHeight;
          return (
            <g key={item.label}>
              <defs>
                <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PINK} />
                  <stop offset="100%" stopColor={PINK_DARK} />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="8"
                fill={`url(#bar-${i})`}
                opacity="0.95"
              />
              <text
                x={x + barWidth / 2}
                y={height - 18}
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
                fontWeight="500"
              >
                {item.label}
              </text>
              {item.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={PINK}
                  fontSize="10"
                  fontWeight="700"
                >
                  {valuePrefix}
                  {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export interface PieChartItem {
  label: string;
  value: number;
  color?: string;
}

export function AdminPieChart({ data, size = 200 }: { data: PieChartItem[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;

  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    angle += sliceAngle;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = item.color || STATUS_COLORS[item.label] || `hsl(${index * 55}, 70%, 55%)`;
    const path =
      item.value === 0
        ? ''
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...item, path, color };
  });

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
      <svg width={size} height={size} className="shrink-0">
        {total === 0 || data.every((d) => d.value === 0) ? (
          <circle cx={cx} cy={cy} r={radius} fill="#f1f5f9" />
        ) : (
          slices.map((slice) =>
            slice.path ? (
              <path key={slice.label} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
            ) : null,
          )
        )}
        <circle cx={cx} cy={cy} r={radius * 0.55} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#111" fontSize="18" fontWeight="700">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10">
          orders
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: item.color || STATUS_COLORS[item.label] || PINK }}
            />
            <span className="capitalize text-slate-600">{item.label}</span>
            <span className="font-semibold text-slate-900">{item.value}</span>
            <span className="text-slate-400">
              ({total ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricCard({
  title,
  value,
  subtitle,
  accent = 'pink',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: 'pink' | 'green' | 'blue' | 'purple';
}) {
  const accents = {
    pink: 'from-brand-pink/10 to-brand-pink/5 border-brand-pink/20 text-brand-pink',
    green: 'from-emerald-50 to-emerald-50/50 border-emerald-200 text-emerald-600',
    blue: 'from-blue-50 to-blue-50/50 border-blue-200 text-blue-600',
    purple: 'from-violet-50 to-violet-50/50 border-violet-200 text-violet-600',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${accents[accent].split(' ').slice(0, 3).join(' ')}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accents[accent].split(' ').pop()}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
