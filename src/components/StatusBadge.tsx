import type { OrderStatus } from '../types';

const config: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
  Draft: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    label: 'Draft',
  },
  Produksi: {
    bg: 'bg-brand-100',
    text: 'text-brand-700',
    dot: 'bg-brand-500',
    label: 'Produksi',
  },
  Selesai: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Selesai',
  },
};

export default function StatusBadge({ status, size = 'md' }: { status: OrderStatus; size?: 'sm' | 'md' }) {
  const c = config[status];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding} ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
