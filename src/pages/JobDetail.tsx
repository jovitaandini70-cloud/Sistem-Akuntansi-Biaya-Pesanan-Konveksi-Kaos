import { ArrowLeft, Package, Users, Zap, ReceiptText, Calendar, User, Box } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatRupiah, formatDate, totalMaterial, totalLabor, totalOverhead, totalProduksi, estimasiLaba, margin } from '../lib/format';

export default function JobDetail({
  order,
  onBack,
}: {
  order: JobOrder;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 rounded-xl border border-brand-200 bg-white text-ink-500 hover:bg-brand-50 hover:text-brand-700 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-ink-900">{order.nomor}</h2>
              <StatusBadge status={order.status} size="sm" />
            </div>
            <p className="text-sm text-ink-400 mt-0.5">{order.produk} — {order.pelanggan}</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem icon={User} label="Pelanggan" value={order.pelanggan} />
          <InfoItem icon={Box} label="Produk" value={order.produk} />
          <InfoItem icon={Package} label="Jumlah" value={`${order.jumlah} pcs`} />
          <InfoItem icon={Calendar} label="Tanggal" value={formatDate(order.tanggal)} />
        </div>
      </div>

      {/* Bahan Baku */}
      <div className="card overflow-hidden">
        <SectionHeader icon={Package} title="Biaya Bahan Baku" subtitle="Material yang digunakan dalam produksi" total={totalMaterial(order)} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Kode</th>
                <th className="px-5 py-3">Nama Bahan</th>
                <th className="px-5 py-3 text-center">Satuan</th>
                <th className="px-5 py-3 text-right">Harga</th>
                <th className="px-5 py-3 text-center">Qty Digunakan</th>
                <th className="px-5 py-3 text-right">Stok Sisa</th>
                <th className="px-5 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.materials.map((m) => (
                <tr key={m.id} className="table-row-hover">
                  <td className="px-5 py-3.5 text-sm font-semibold text-brand-700">{m.kode}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{m.nama}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-500 text-center">{m.satuan}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(m.harga)}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-600 text-center">{m.qtyUsed}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-500 text-center">{m.stok}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(m.harga * m.qtyUsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenaga Kerja */}
      <div className="card overflow-hidden">
        <SectionHeader icon={Users} title="Biaya Tenaga Kerja Langsung" subtitle="Pekerja yang terlibat dalam produksi" total={totalLabor(order)} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Nama Pekerja</th>
                <th className="px-5 py-3">Jenis Pekerjaan</th>
                <th className="px-5 py-3 text-center">Jam Kerja</th>
                <th className="px-5 py-3 text-right">Tarif per Jam</th>
                <th className="px-5 py-3 text-right">Total Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.labors.map((l) => (
                <tr key={l.id} className="table-row-hover">
                  <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{l.nama}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-500">{l.jenisPekerjaan}</td>
                  <td className="px-5 py-3.5 text-sm text-ink-600 text-center">{l.jamKerja} jam</td>
                  <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(l.tarifPerJam)}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(l.jamKerja * l.tarifPerJam)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overhead */}
      <div className="card overflow-hidden">
        <SectionHeader icon={Zap} title="Biaya Overhead Pabrik" subtitle="Biaya tidak langsung produksi" total={totalOverhead(order)} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Jenis Biaya Overhead</th>
                <th className="px-5 py-3 text-right">Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.overheads.map((o) => (
                <tr key={o.id} className="table-row-hover">
                  <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{o.nama}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(o.biaya)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <ReceiptText size={20} className="text-brand-600" />
          <h3 className="font-bold text-ink-900 text-base">Ringkasan Biaya Produksi</h3>
        </div>
        <div className="space-y-3 max-w-md ml-auto">
          <SummaryRow label="Total Bahan Baku" value={formatRupiah(totalMaterial(order))} />
          <SummaryRow label="Total Tenaga Kerja Langsung" value={formatRupiah(totalLabor(order))} />
          <SummaryRow label="Total Biaya Overhead" value={formatRupiah(totalOverhead(order))} />
          <div className="border-t border-brand-100 pt-3">
            <SummaryRow label="Total Biaya Produksi" value={formatRupiah(totalProduksi(order))} bold />
          </div>
          <SummaryRow label="Harga Jual" value={formatRupiah(order.hargaJual)} />
          <div className="border-t border-brand-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-600">Estimasi Laba</span>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">{formatRupiah(estimasiLaba(order))}</p>
                <p className="text-xs text-ink-400">Margin {margin(order).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-ink-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, total }: { icon: LucideIcon; title: string; subtitle: string; total: number }) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-brand-100">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-bold text-ink-900 text-sm">{title}</h3>
          <p className="text-xs text-ink-400">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-ink-400">Total</p>
        <p className="text-base font-bold text-brand-700">{formatRupiah(total)}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? 'font-bold text-ink-800' : 'font-medium text-ink-600'}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-ink-900' : 'font-semibold text-ink-700'}`}>{value}</span>
    </div>
  );
}
