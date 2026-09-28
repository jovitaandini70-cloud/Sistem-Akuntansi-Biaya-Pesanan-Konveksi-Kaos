import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: 'brand' | 'emerald' | 'amber' | 'violet';
}

const accentMap = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-600', ring: 'ring-brand-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
};

export default function StatCard({ label, value, icon: Icon, trend, trendUp, accent = 'brand' }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className="card card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-4 ${a.ring}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-ink-400 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-ink-900 tracking-tight">{value}</p>
    </div>
  );
}
