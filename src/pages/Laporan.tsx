import { BarChart3, Package, Users, Zap, Factory, Wallet, TrendingUp, FileDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatRupiah, formatRupiahShort, formatDate, totalMaterial, totalLabor, totalOverhead, totalProduksi, estimasiLaba, margin } from '../lib/format';

export default function Laporan({ orders }: { orders: JobOrder[] }) {
  const totalAllMaterial = orders.reduce((s, o) => s + totalMaterial(o), 0);
  const totalAllLabor = orders.reduce((s, o) => s + totalLabor(o), 0);
  const totalAllOverhead = orders.reduce((s, o) => s + totalOverhead(o), 0);
  const totalAllProduksi = orders.reduce((s, o) => s + totalProduksi(o), 0);
  const totalAllPendapatan = orders.reduce((s, o) => s + o.hargaJual, 0);
  const totalAllLaba = orders.reduce((s, o) => s + estimasiLaba(o), 0);
  const avgMargin = totalAllPendapatan > 0 ? (totalAllLaba / totalAllPendapatan) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Package} label="Total Bahan Baku" value={formatRupiahShort(totalAllMaterial)} accent="brand" />
        <SummaryCard icon={Users} label="Total Tenaga Kerja" value={formatRupiahShort(totalAllLabor)} accent="emerald" />
        <SummaryCard icon={Zap} label="Total Overhead" value={formatRupiahShort(totalAllOverhead)} accent="amber" />
        <SummaryCard icon={Factory} label="Total Biaya Produksi" value={formatRupiahShort(totalAllProduksi)} accent="violet" />
      </div>

      {/* Pendapatan & Laba */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-4 ring-brand-100">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-ink-400 font-medium">Total Pendapatan</p>
            <p className="text-xl font-bold text-ink-900">{formatRupiah(totalAllPendapatan)}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-ink-400 font-medium">Total Estimasi Laba</p>
            <p className="text-xl font-bold text-emerald-700">{formatRupiah(totalAllLaba)}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-4 ring-violet-100">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm text-ink-400 font-medium">Rata-rata Margin</p>
            <p className="text-xl font-bold text-ink-900">{avgMargin.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed report table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-brand-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 text-sm">Ringkasan Biaya per Job Order</h3>
              <p className="text-xs text-ink-400">Rincian biaya dan profitabilitas setiap pesanan</p>
            </div>
          </div>
          <button className="btn-outline text-xs">
            <FileDown size={14} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-4 py-3.5">No. Pesanan</th>
                <th className="px-4 py-3.5">Pelanggan</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Bahan Baku</th>
                <th className="px-4 py-3.5 text-right">Tenaga Kerja</th>
                <th className="px-4 py-3.5 text-right">Overhead</th>
                <th className="px-4 py-3.5 text-right">Total Biaya</th>
                <th className="px-4 py-3.5 text-right">Pendapatan</th>
                <th className="px-4 py-3.5 text-right">Laba</th>
                <th className="px-4 py-3.5 text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {orders.map((o) => (
                <tr key={o.id} className="table-row-hover">
                  <td className="px-4 py-3.5 text-sm font-semibold text-brand-700">{o.nomor}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-700 font-medium max-w-[140px] truncate">{o.pelanggan}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-500 whitespace-nowrap">{formatDate(o.tanggal)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={o.status} size="sm" /></td>
                  <td className="px-4 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(totalMaterial(o))}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(totalLabor(o))}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(totalOverhead(o))}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalProduksi(o))}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-700 text-right whitespace-nowrap">{formatRupiah(o.hargaJual)}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatRupiah(estimasiLaba(o))}</td>
                  <td className="px-4 py-3.5 text-sm text-ink-500 text-right">{margin(o).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-50 border-t-2 border-brand-200">
                <td className="px-4 py-4 text-sm font-bold text-ink-800" colSpan={4}>Total Keseluruhan</td>
                <td className="px-4 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(totalAllMaterial)}</td>
                <td className="px-4 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(totalAllLabor)}</td>
                <td className="px-4 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(totalAllOverhead)}</td>
                <td className="px-4 py-4 text-sm font-bold text-brand-700 text-right whitespace-nowrap">{formatRupiah(totalAllProduksi)}</td>
                <td className="px-4 py-4 text-sm font-bold text-ink-700 text-right whitespace-nowrap">{formatRupiah(totalAllPendapatan)}</td>
                <td className="px-4 py-4 text-sm font-bold text-emerald-700 text-right whitespace-nowrap">{formatRupiah(totalAllLaba)}</td>
                <td className="px-4 py-4 text-sm font-bold text-ink-700 text-right">{avgMargin.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string; accent: 'brand' | 'emerald' | 'amber' | 'violet' }) {
  const map = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  };
  return (
    <div className="card p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-4 mb-3 ${map[accent]}`}>
        <Icon size={22} />
      </div>
      <p className="text-sm text-ink-400 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-ink-900">{value}</p>
    </div>
  );
}
