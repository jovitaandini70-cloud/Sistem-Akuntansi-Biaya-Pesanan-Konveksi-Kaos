import {
  ClipboardList,
  Factory,
  TrendingUp,
  Wallet,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Activity,
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
  totalPembayaran,
  sisaPembayaran,
  progressProduksi,
  statusProduksi,
} from '../lib/format';

export default function Dashboard({
  orders,
  onSelectOrder,
  onNavigate,
}: {
  orders: JobOrder[];
  onSelectOrder: (id: string) => void;
  onNavigate: (key: 'pesanan' | 'laporan' | 'pembayaran' | 'produksi') => void;
}) {
  const activeOrders = orders.filter((o) => o.status === 'Produksi').length;
  const totalBiaya = orders.reduce((s, o) => s + totalProduksi(o), 0);
  const totalLaba = orders.reduce((s, o) => s + estimasiLaba(o), 0);
  const totalDiterima = orders.reduce((s, o) => s + totalPembayaran(o), 0);
  const totalPiutang = orders.reduce((s, o) => s + sisaPembayaran(o), 0);
  const produksiProses = orders.filter((o) => statusProduksi(o) === 'Dalam Proses').length;
  const avgProgress = orders.length > 0
    ? Math.round(orders.reduce((s, o) => s + progressProduksi(o), 0) / orders.length)
    : 0;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Pesanan Aktif" value={String(activeOrders)} icon={ClipboardList} trend="produksi berjalan" trendUp accent="brand" />
        <StatCard label="Pembayaran Diterima" value={formatRupiahShort(totalDiterima)} icon={CheckCircle2} trend="total diterima" trendUp accent="emerald" />
        <StatCard label="Piutang Outstanding" value={formatRupiahShort(totalPiutang)} icon={Wallet} trend="belum tertagih" trendUp={false} accent="amber" />
        <StatCard label="Total Biaya Produksi" value={formatRupiahShort(totalBiaya)} icon={Factory} trend="akumulasi" trendUp={false} accent="amber" />
        <StatCard label="Produksi Dalam Proses" value={`${produksiProses} pesanan`} icon={Activity} trend={`avg ${avgProgress}%`} trendUp accent="violet" />
        <StatCard label="Estimasi Laba" value={formatRupiahShort(totalLaba)} icon={TrendingUp} trend="proyeksi" trendUp accent="emerald" />
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

      {/* Quick access to Pembayaran & Produksi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => onNavigate('pembayaran')} className="card card-hover p-5 text-left group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100">
                <Wallet size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">Pembayaran & Piutang</p>
                <p className="text-xs text-ink-400">
                  Diterima {formatRupiahShort(totalDiterima)} · Piutang {formatRupiahShort(totalPiutang)}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-ink-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
        <button onClick={() => onNavigate('produksi')} className="card card-hover p-5 text-left group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-4 ring-violet-100">
                <Activity size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">Proses Produksi</p>
                <p className="text-xs text-ink-400">
                  {produksiProses} pesanan dalam proses · Rata-rata progress {avgProgress}%
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-ink-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
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
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100">
                <th className="px-3 py-3">Nomor Pesanan</th>
                <th className="px-3 py-3">Pelanggan</th>
                <th className="px-3 py-3">Produk</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Progress</th>
                <th className="px-3 py-3 text-right">Total Biaya</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {recent.map((o) => {
                const prog = progressProduksi(o);
                return (
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
                  <td className="px-3 py-3.5">
                    {prog > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-brand-100 overflow-hidden">
                          <div className={`h-full rounded-full ${prog === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${prog}%` }} />
                        </div>
                        <span className="text-xs font-medium text-ink-500">{prog}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalProduksi(o))}</td>
                  <td className="px-3 py-3.5 text-right">
                    <ArrowRight size={16} className="text-ink-300 inline-block" />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
