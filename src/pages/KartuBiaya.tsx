import { useState } from 'react';
import { ReceiptText, ArrowRight, Package, Users, Zap, TrendingUp, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatRupiah, formatDate, totalMaterial, totalLabor, totalOverhead, totalProduksi, estimasiLaba, margin } from '../lib/format';

export default function KartuBiaya({
  orders,
  onSelectOrder,
}: {
  orders: JobOrder[];
  onSelectOrder: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(orders[0]?.id ?? '');
  const order = orders.find((o) => o.id === selectedId) ?? orders[0];

  if (!order) return null;

  const tm = totalMaterial(order);
  const tl = totalLabor(order);
  const tov = totalOverhead(order);
  const tp = totalProduksi(order);
  const laba = estimasiLaba(order);
  const mar = margin(order);

  return (
    <div className="space-y-5">
      {/* Order selector */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <ReceiptText size={18} className="text-brand-600" />
          <h3 className="font-bold text-ink-900 text-sm">Pilih Job Order</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedId(o.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                o.id === order.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-ink-500 border-brand-200 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              {o.nomor}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cost Sheet */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ReceiptText size={20} />
                <h2 className="text-lg font-bold">Kartu Biaya Pesanan</h2>
              </div>
              <p className="text-brand-100 text-sm">{order.nomor} — {order.produk}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-brand-100">Pelanggan</p>
                <p className="text-sm font-semibold">{order.pelanggan}</p>
              </div>
              <StatusBadge status={order.status} size="sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-brand-500/40">
            <div>
              <p className="text-xs text-brand-100">Tanggal</p>
              <p className="text-sm font-semibold">{formatDate(order.tanggal)}</p>
            </div>
            <div>
              <p className="text-xs text-brand-100">Jumlah</p>
              <p className="text-sm font-semibold">{order.jumlah} pcs</p>
            </div>
            <div>
              <p className="text-xs text-brand-100">Harga Jual</p>
              <p className="text-sm font-semibold">{formatRupiah(order.hargaJual)}</p>
            </div>
            <div>
              <p className="text-xs text-brand-100">Margin</p>
              <p className="text-sm font-semibold">{mar.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="p-6 space-y-4">
          <CostRow icon={Package} label="Biaya Bahan Baku" value={tm} detail={`${order.materials.length} jenis material`} />
          <CostRow icon={Users} label="Tenaga Kerja Langsung" value={tl} detail={`${order.labors.length} pekerja, ${order.labors.reduce((s, l) => s + l.jamKerja, 0)} jam total`} />
          <CostRow icon={Zap} label="Biaya Overhead Pabrik" value={tov} detail={`${order.overheads.length} jenis overhead`} />

          <div className="border-t-2 border-dashed border-brand-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Wallet size={22} />
                </div>
                <div>
                  <p className="font-bold text-ink-900">Total Biaya Produksi</p>
                  <p className="text-xs text-ink-400">Bahan + Tenaga Kerja + Overhead</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-brand-700">{formatRupiah(tp)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl bg-brand-50 p-4 border border-brand-100">
              <p className="text-xs text-ink-400 font-medium mb-1">Harga Jual</p>
              <p className="text-lg font-bold text-ink-800">{formatRupiah(order.hargaJual)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={14} className="text-emerald-600" />
                <p className="text-xs text-emerald-600 font-medium">Estimasi Laba</p>
              </div>
              <p className="text-lg font-bold text-emerald-700">{formatRupiah(laba)}</p>
            </div>
            <div className="rounded-xl bg-brand-100 p-4 border border-brand-200">
              <p className="text-xs text-brand-600 font-medium mb-1">Margin Keuntungan</p>
              <p className="text-lg font-bold text-brand-700">{mar.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div className="border-t border-brand-100 p-4">
          <button onClick={() => onSelectOrder(order.id)} className="btn-ghost text-sm w-full justify-center">
            Lihat Detail Lengkap <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CostRow({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: number; detail: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-100 p-4 hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-ink-800 text-sm">{label}</p>
          <p className="text-xs text-ink-400">{detail}</p>
        </div>
      </div>
      <p className="text-base font-bold text-ink-800">{formatRupiah(value)}</p>
    </div>
  );
}
