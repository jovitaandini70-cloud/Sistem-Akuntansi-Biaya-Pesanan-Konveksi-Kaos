interface BarChartProps {
  data: { label: string; biaya: number; pendapatan: number }[];
  formatValue: (n: number) => string;
}

export function BarChart({ data, formatValue }: BarChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.biaya, d.pendapatan]), 1);
  const chartHeight = 220;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-brand-400" />
          <span className="text-xs font-medium text-ink-500">Biaya Produksi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-brand-600" />
          <span className="text-xs font-medium text-ink-500">Pendapatan</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 sm:gap-4" style={{ height: chartHeight }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex items-end justify-center gap-1.5 h-full">
              <div className="relative flex-1 max-w-[28px] flex items-end" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t-lg bg-brand-400 transition-all duration-500 group-hover:bg-brand-500 origin-bottom animate-draw-bar"
                  style={{ height: `${(d.biaya / max) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
                    {formatValue(d.biaya)}
                  </div>
                </div>
              </div>
              <div className="relative flex-1 max-w-[28px] flex items-end" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t-lg bg-brand-600 transition-all duration-500 group-hover:bg-brand-700 origin-bottom animate-draw-bar"
                  style={{ height: `${(d.pendapatan / max) * 100}%`, animationDelay: '0.1s' }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
                    {formatValue(d.pendapatan)}
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-ink-400 text-center truncate w-full">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  formatValue: (n: number) => string;
  centerLabel: string;
  centerValue: string;
}

export function DonutChart({ segments, formatValue, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#eef2f8" strokeWidth="22" />
          {segments.map((seg, i) => {
            const len = (seg.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="22"
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700"
                style={{ animation: 'fade-in 0.5s ease-out' }}
              />
            );
            offset += len;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-ink-400 font-medium">{centerLabel}</p>
          <p className="text-lg font-bold text-ink-900">{centerValue}</p>
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-3 w-3 rounded-md shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-sm text-ink-600 font-medium truncate">{seg.label}</span>
            </div>
            <span className="text-sm font-semibold text-ink-800 shrink-0">{formatValue(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
