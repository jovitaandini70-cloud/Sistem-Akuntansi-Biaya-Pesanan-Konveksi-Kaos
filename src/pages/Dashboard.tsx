import {
  ClipboardList,
  Factory,
  TrendingUp,
  Wallet,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import type { JobOrder } from '../types';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { BarChart, DonutChart } from '../components/Charts';
import {
  formatRupiah,
  formatRupiahShort,
  formatDate,
  totalProduksi,
  estimasiLaba,
} from '../lib/format';

export default function Dashboard({
  orders,
  onSelectOrder,
  onNavigate,
}: {
  orders: JobOrder[];
  onSelectOrder: (id: string) => void;
  onNavigate: (key: 'pesanan' | 'laporan') => void;
}) {
  const activeOrders = orders.filter((o) => o.status === 'Produksi').length;
  const totalBiaya = orders.reduce((s, o) => s + totalProduksi(o), 0);
  const totalPendapatan = orders.reduce((s, o) => s + o.hargaJual * o.jumlah, 0);
  const totalLaba = orders.reduce((s, o) => s + estimasiLaba(o), 0);

  const recent = [...orders].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 5);

  const chartData = orders.slice(0, 6).map((o) => ({
    label: o.nomor.replace('JO-2026-', ''),
    biaya: totalProduksi(o),
    pendapatan: o.hargaJual * o.jumlah,
  }));

  const donutSegments = [
    {
      label: 'Bahan Baku',
      value: orders.reduce((s, o) => s + o.materials.reduce((x, m) => x + m.harga * m.qtyUsed, 0), 0),
      color: '#59affd',
    },
    {
      label: 'Tenaga Kerja',
      value: orders.reduce((s, o) => s + o.labors.reduce((x, l) => x + l.jamKerja * l.tarifPerJam, 0), 0),
      color: '#226ff0',
    },
    {
      label: 'Overhead',
      value: orders.reduce((s, o) => s + o.overheads.reduce((x, ov) => x + ov.biaya, 0), 0),
      color: '#8ecffe',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Pesanan Aktif" value={String(activeOrders)} icon={ClipboardList} trend="2 minggu ini" trendUp accent="brand" />
        <StatCard label="Total Biaya Produksi" value={formatRupiahShort(totalBiaya)} icon={Factory} trend="12.5%" trendUp={false} accent="amber" />
        <StatCard label="Total Pendapatan" value={formatRupiahShort(totalPendapatan)} icon={Wallet} trend="8.2%" trendUp accent="emerald" />
        <StatCard label="Estimasi Laba" value={formatRupiahShort(totalLaba)} icon={TrendingUp} trend="15.3%" trendUp accent="violet" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-ink-900 text-base">Biaya vs Pendapatan per Pesanan</h3>
              <p className="text-xs text-ink-400 mt-0.5">Perbandingan biaya produksi dan pendapatan</p>
            </div>
            <button onClick={() => onNavigate('laporan')} className="btn-ghost text-xs">
              Lihat Laporan <ArrowRight size={14} />
            </button>
          </div>
          <BarChart data={chartData} formatValue={formatRupiahShort} />
        </div>
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="font-bold text-ink-900 text-base">Komposisi Biaya</h3>
            <p className="text-xs text-ink-400 mt-0.5">Distribusi elemen biaya produksi</p>
          </div>
          <DonutChart
            segments={donutSegments}
            formatValue={formatRupiahShort}
            centerLabel="Total"
            centerValue={formatRupiahShort(totalBiaya)}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-ink-900 text-base">Pesanan Terbaru</h3>
            <p className="text-xs text-ink-400 mt-0.5">5 pesanan terakhir yang masuk</p>
          </div>
          <button onClick={() => onNavigate('pesanan')} className="btn-ghost text-xs">
            Semua Pesanan <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100">
                <th className="px-3 py-3">Nomor Pesanan</th>
                <th className="px-3 py-3">Pelanggan</th>
                <th className="px-3 py-3">Produk</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Total Biaya</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {recent.map((o) => (
                <tr key={o.id} className="table-row-hover cursor-pointer" onClick={() => onSelectOrder(o.id)}>
                  <td className="px-3 py-3.5 font-semibold text-brand-700 text-sm">{o.nomor}</td>
                  <td className="px-3 py-3.5 text-sm text-ink-700">{o.pelanggan}</td>
                  <td className="px-3 py-3.5 text-sm text-ink-600 max-w-[180px] truncate">{o.produk}</td>
                  <td className="px-3 py-3.5 text-sm text-ink-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-ink-300" />
                      {formatDate(o.tanggal)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5"><StatusBadge status={o.status} size="sm" /></td>
                  <td className="px-3 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalProduksi(o))}</td>
                  <td className="px-3 py-3.5 text-right">
                    <ArrowRight size={16} className="text-ink-300 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
