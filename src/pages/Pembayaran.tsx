import { useState, useMemo } from 'react';
import {
  Wallet, Plus, Filter, ArrowLeft, Check, X, Pencil, Trash2,
  CheckCircle2, Clock, AlertCircle, Send, Calendar, User, Box, Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder, Payment, PaymentMetode, PaymentStatus, PageKey } from '../types';
import StatusBadge from '../components/StatusBadge';
import {
  formatRupiah, formatDate,
  totalTagihan, totalPembayaran, sisaPembayaran, persenPembayaran, statusPembayaran,
} from '../lib/format';
import {
  addPayment, updatePayment, deletePayment, updateOrder,
} from '../lib/jobOrderService';

const metodeOptions: PaymentMetode[] = ['Tunai', 'Transfer', 'Cicilan', 'Lainnya'];
const statusFilters: ('all' | PaymentStatus)[] = ['all', 'Belum Bayar', 'Sebagian', 'Lunas'];

type PaymentForm = Omit<Payment, 'id'>;
const emptyPayment = (): PaymentForm => ({
  tanggal: new Date().toISOString().slice(0, 10),
  jumlah: 0,
  metode: 'Tunai',
  catatan: '',
});

// ─── Badge status pembayaran ──────────────────────────────────────────────────
const payBadgeConfig: Record<PaymentStatus, { bg: string; text: string; dot: string; label: string }> = {
  'Lunas': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Lunas' },
  'Sebagian': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Sebagian' },
  'Belum Bayar': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400', label: 'Belum Bayar' },
};

function PembayaranBadge({ status, size = 'sm' }: { status: PaymentStatus; size?: 'sm' | 'md' }) {
  const c = payBadgeConfig[status];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding} ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Komponen utama ──────────────────────────────────────────────────────────
export default function PembayaranPage({
  orders,
  onOrderChange,
  onNavigate,
}: {
  orders: JobOrder[];
  onOrderChange: (updated: JobOrder) => void;
  onNavigate: (key: PageKey) => void;
}) {
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === 'all') return true;
      return statusPembayaran(o) === filter;
    });
  }, [orders, filter]);

  // Statistik ringkas
  const totalAllTagihan = orders.reduce((s, o) => s + totalTagihan(o), 0);
  const totalAllDibayar = orders.reduce((s, o) => s + totalPembayaran(o), 0);
  const totalAllPiutang = orders.reduce((s, o) => s + sisaPembayaran(o), 0);
  const jumlahLunas = orders.filter((o) => statusPembayaran(o) === 'Lunas').length;

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  if (selectedOrder) {
    return (
      <PaymentDetail
        order={selectedOrder}
        onBack={() => setSelectedId(null)}
        onOrderChange={onOrderChange}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Wallet} label="Total Tagihan" value={formatRupiah(totalAllTagihan)} accent="brand" />
        <SummaryCard icon={CheckCircle2} label="Sudah Dibayar" value={formatRupiah(totalAllDibayar)} accent="emerald" />
        <SummaryCard icon={AlertCircle} label="Piutang Outstanding" value={formatRupiah(totalAllPiutang)} accent="amber" />
        <SummaryCard icon={Clock} label="Pesanan Lunas" value={`${jumlahLunas} dari ${orders.length}`} accent="violet" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-ink-400" />
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-brand-200 text-ink-500 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {f === 'all' ? 'Semua' : payBadgeConfig[f].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3.5">Nomor Pesanan</th>
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5 text-right">Total Tagihan</th>
                <th className="px-5 py-3.5 text-right">Dibayar</th>
                <th className="px-5 py-3.5 text-right">Sisa</th>
                <th className="px-5 py-3.5">Status Bayar</th>
                <th className="px-5 py-3.5">Status Order</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <Wallet size={36} className="mx-auto text-ink-300 mb-3" />
                    <p className="text-sm text-ink-400">Tidak ada pesanan yang cocok</p>
                  </td>
                </tr>
              )}
              {filtered.map((o) => {
                const sisa = sisaPembayaran(o);
                return (
                  <tr
                    key={o.id}
                    className="table-row-hover cursor-pointer"
                    onClick={() => setSelectedId(o.id)}
                  >
                    <td className="px-5 py-4 font-semibold text-brand-700 text-sm">{o.nomor}</td>
                    <td className="px-5 py-4 text-sm text-ink-700 font-medium">{o.pelanggan}</td>
                    <td className="px-5 py-4 text-sm text-ink-600 max-w-[180px] truncate">{o.produk}</td>
                    <td className="px-5 py-4 text-sm text-ink-700 text-right whitespace-nowrap">{formatRupiah(totalTagihan(o))}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatRupiah(totalPembayaran(o))}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-right whitespace-nowrap">
                      <span className={sisa > 0 ? 'text-red-500' : 'text-ink-300'}>{formatRupiah(sisa)}</span>
                    </td>
                    <td className="px-5 py-4"><PembayaranBadge status={statusPembayaran(o)} /></td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} size="sm" /></td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(o.id); }}
                        className="p-2 rounded-lg hover:bg-brand-100 text-ink-400 hover:text-brand-600 transition-colors"
                      >
                        <Wallet size={16} />
                      </button>
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

// ─── Detail pembayaran ──────────────────────────────────────────────────────
function PaymentDetail({
  order,
  onBack,
  onOrderChange,
  onNavigate,
}: {
  order: JobOrder;
  onBack: () => void;
  onOrderChange: (updated: JobOrder) => void;
  onNavigate: (key: PageKey) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<PaymentForm>(emptyPayment());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PaymentForm>(emptyPayment());
  const [saving, setSaving] = useState(false);

  const tagihan = totalTagihan(order);
  const dibayar = totalPembayaran(order);
  const sisa = sisaPembayaran(order);
  const persen = persenPembayaran(order);
  const payStatus = statusPembayaran(order);
  const canKirimProduksi = payStatus === 'Lunas' && order.status === 'Draft';

  const handleAdd = async () => {
    if (form.jumlah <= 0) return;
    setSaving(true);
    try {
      const p = await addPayment(order.id, form);
      onOrderChange({ ...order, payments: [...order.payments, p] });
      setForm(emptyPayment());
      setShowAdd(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menambah pembayaran');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (id: string) => {
    setSaving(true);
    try {
      await updatePayment(id, editForm);
      onOrderChange({
        ...order,
        payments: order.payments.map((p) => (p.id === id ? { ...p, ...editForm } : p)),
      });
      setEditId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengupdate pembayaran');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data pembayaran ini?')) return;
    try {
      await deletePayment(id);
      onOrderChange({ ...order, payments: order.payments.filter((p) => p.id !== id) });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus pembayaran');
    }
  };

  const handleKirimProduksi = async () => {
    if (!confirm('Kirim pesanan ini ke bagian produksi? Status akan berubah menjadi Produksi.')) return;
    try {
      await updateOrder(order.id, { status: 'Produksi' });
      onOrderChange({ ...order, status: 'Produksi' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

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
              <PembayaranBadge status={payStatus} />
              <StatusBadge status={order.status} size="sm" />
            </div>
            <p className="text-sm text-ink-400 mt-0.5">{order.produk} — {order.pelanggan}</p>
          </div>
        </div>
        {canKirimProduksi && (
          <button onClick={handleKirimProduksi} className="btn-primary">
            <Send size={16} /> Kirim ke Produksi
          </button>
        )}
      </div>

      {/* Info grid */}
      <div className="card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem icon={User} label="Pelanggan" value={order.pelanggan} />
          <InfoItem icon={Box} label="Produk" value={order.produk} />
          <InfoItem icon={Package} label="Jumlah" value={`${order.jumlah} pcs`} />
          <InfoItem icon={Calendar} label="Tanggal Pesanan" value={formatDate(order.tanggal)} />
        </div>
      </div>

      {/* Progress pembayaran */}
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Wallet size={20} className="text-brand-600" />
          <h3 className="font-bold text-ink-900 text-base">Ringkasan Pembayaran</h3>
        </div>
        {/* Progress bar */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-600">Progress Pembayaran</span>
          <span className="font-bold text-brand-700">{persen}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-brand-100 overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${persen}%` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-brand-50 p-4 border border-brand-100">
            <p className="text-xs text-ink-400 font-medium mb-1">Total Tagihan</p>
            <p className="text-xl font-bold text-ink-800">{formatRupiah(tagihan)}</p>
            <p className="text-xs text-ink-400 mt-0.5">{formatRupiah(order.hargaJual)}/pcs × {order.jumlah} pcs</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <p className="text-xs text-emerald-600 font-medium">Sudah Dibayar</p>
            </div>
            <p className="text-xl font-bold text-emerald-700">{formatRupiah(dibayar)}</p>
            <p className="text-xs text-ink-400 mt-0.5">{order.payments.length} kali pembayaran</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4 border border-red-100">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-xs text-red-500 font-medium">Sisa Tagihan</p>
            </div>
            <p className="text-xl font-bold text-red-600">{formatRupiah(sisa)}</p>
            <p className="text-xs text-ink-400 mt-0.5">{sisa > 0 ? 'Belum lunas' : 'Pembayaran complete'}</p>
          </div>
        </div>
      </div>

      {/* Riwayat pembayaran */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-brand-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="font-bold text-ink-900 text-sm">Riwayat Pembayaran</h3>
              <p className="text-xs text-ink-400">Catat setiap pembayaran yang diterima</p>
            </div>
          </div>
          <button
            onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            <Plus size={14} /> Tambah Pembayaran
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Jumlah</th>
                <th className="px-5 py-3">Metode</th>
                <th className="px-5 py-3">Catatan</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.payments.length === 0 && !showAdd && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-ink-400">
                    Belum ada pembayaran. Klik <strong>+ Tambah Pembayaran</strong> untuk mencatat.
                  </td>
                </tr>
              )}

              {/* Form tambah */}
              {showAdd && (
                <tr className="bg-emerald-50/60">
                  <td className="px-2 py-2"><input type="date" className="input-cell" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></td>
                  <td className="px-2 py-2"><input type="number" min="0" className="input-cell text-right" value={form.jumlah || ''} onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })} placeholder="Jumlah" /></td>
                  <td className="px-2 py-2">
                    <select className="input-cell" value={form.metode} onChange={(e) => setForm({ ...form, metode: e.target.value as PaymentMetode })}>
                      {metodeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2"><input className="input-cell" value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan (opsional)" /></td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <ActionBtn icon={Check} color="green" onClick={handleAdd} disabled={saving} title="Simpan" />
                      <ActionBtn icon={X} color="gray" onClick={() => { setShowAdd(false); setForm(emptyPayment()); }} title="Batal" />
                    </div>
                  </td>
                </tr>
              )}

              {order.payments.map((p) =>
                editId === p.id ? (
                  <tr key={p.id} className="bg-brand-50/60">
                    <td className="px-2 py-2"><input type="date" className="input-cell" value={editForm.tanggal} onChange={(e) => setEditForm({ ...editForm, tanggal: e.target.value })} /></td>
                    <td className="px-2 py-2"><input type="number" min="0" className="input-cell text-right" value={editForm.jumlah || ''} onChange={(e) => setEditForm({ ...editForm, jumlah: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2">
                      <select className="input-cell" value={editForm.metode} onChange={(e) => setEditForm({ ...editForm, metode: e.target.value as PaymentMetode })}>
                        {metodeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-2"><input className="input-cell" value={editForm.catatan} onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })} placeholder="Catatan" /></td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <ActionBtn icon={Check} color="green" onClick={() => handleEditSave(p.id)} disabled={saving} title="Simpan" />
                        <ActionBtn icon={X} color="gray" onClick={() => setEditId(null)} title="Batal" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id} className="table-row-hover group">
                    <td className="px-5 py-3.5 text-sm text-ink-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-ink-300" />
                        {formatDate(p.tanggal)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatRupiah(p.jumlah)}</td>
                    <td className="px-5 py-3.5"><span className="inline-flex rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{p.metode}</span></td>
                    <td className="px-5 py-3.5 text-sm text-ink-500 max-w-[240px] truncate">{p.catatan || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn icon={Pencil} color="blue" onClick={() => { setEditId(p.id); setEditForm({ tanggal: p.tanggal, jumlah: p.jumlah, metode: p.metode, catatan: p.catatan }); }} title="Edit" />
                        <ActionBtn icon={Trash2} color="red" onClick={() => handleDelete(p.id)} title="Hapus" />
                      </div>
                    </td>
                  </tr>
                )
              )}

              {/* Total row */}
              {order.payments.length > 0 && (
                <tr className="bg-brand-50/40 border-t-2 border-brand-100">
                  <td className="px-5 py-4 text-sm font-bold text-ink-800">Total Diterima</td>
                  <td className="px-5 py-4 text-sm font-bold text-emerald-700 text-right whitespace-nowrap">{formatRupiah(dibayar)}</td>
                  <td colSpan={3} className="px-5 py-4 text-sm text-ink-400">
                    Sisa: <span className={`font-semibold ${sisa > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{formatRupiah(sisa)}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick link ke produksi */}
      {payStatus === 'Lunas' && (
        <div className="card p-5 bg-gradient-to-br from-brand-50 to-emerald-50 border-brand-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="font-bold text-ink-900 text-sm">Pembayaran Lunas</p>
                <p className="text-xs text-ink-500">
                  {order.status === 'Draft'
                    ? 'Pesanan siap dikirim ke bagian produksi'
                    : order.status === 'Produksi'
                      ? 'Pesanan sedang dalam proses produksi'
                      : 'Pesanan telah selesai diproduksi'}
                </p>
              </div>
            </div>
            {order.status !== 'Draft' && (
              <button onClick={() => onNavigate('produksi')} className="btn-outline text-xs">
                Lihat Status Produksi →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-komponen ────────────────────────────────────────────────────────────
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

function ActionBtn({
  icon: Icon, color, onClick, disabled, title,
}: {
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'gray';
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  const colors = {
    green: 'text-emerald-600 hover:bg-emerald-50',
    red: 'text-red-500 hover:bg-red-50',
    blue: 'text-brand-600 hover:bg-brand-50',
    gray: 'text-ink-400 hover:bg-gray-100',
  };
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${colors[color]}`}>
      <Icon size={14} />
    </button>
  );
}
