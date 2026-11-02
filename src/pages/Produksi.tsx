import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Factory, Plus, Filter, ArrowLeft, Check, X, Pencil, Trash2,
  Activity, Calendar, Play, CheckCircle2, Clock,
  User, Box, Package, Flag, Loader2, Zap, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder, ProductionStage, TahapanStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import {
  formatRupiah, formatDate,
  progressProduksi, tahapanSelesai, totalTahapan,
  statusProduksi, hariMenujuEstimasi,
  totalTagihan, totalPembayaran, statusPembayaran,
} from '../lib/format';
import {
  startProduksi, updateProduksi,
  addTahapan, updateTahapan, deleteTahapan,
  updateOrder,
} from '../lib/jobOrderService';

type ProduksiFilter = 'all' | 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
const statusFilters: (ProduksiFilter)[] = ['all', 'Belum Mulai', 'Dalam Proses', 'Selesai'];

const defaultStages = [
  'Pemotongan Pola',
  'Penjahitan',
  'Sablon/Bordir',
  'Finishing & QC',
  'Packaging',
];

type TahapanForm = Omit<ProductionStage, 'id'>;
const emptyTahapan = (urutan: number): TahapanForm => ({
  namaTahapan: '',
  urutan,
  status: 'Belum',
  tanggalMulai: '',
  tanggalSelesai: '',
  catatan: '',
});

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ─── Badge tahapan status ───────────────────────────────────────────────────
const tahapanConfig: Record<TahapanStatus, { bg: string; text: string; dot: string; label: string }> = {
  'Belum': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Belum' },
  'Proses': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Proses' },
  'Selesai': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Selesai' },
};

function TahapanBadge({ status }: { status: TahapanStatus }) {
  const c = tahapanConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function ProduksiStatusBadge({ status }: { status: 'Belum Mulai' | 'Dalam Proses' | 'Selesai' }) {
  const config = {
    'Belum Mulai': { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Belum Mulai' },
    'Dalam Proses': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Dalam Proses' },
    'Selesai': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Selesai' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Komponen utama ──────────────────────────────────────────────────────────
export default function ProduksiPage({
  orders,
  onOrderChange,
}: {
  orders: JobOrder[];
  onOrderChange: (updated: JobOrder) => void;
}) {
  const [filter, setFilter] = useState<ProduksiFilter>('all');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter === 'all') return true;
      return statusProduksi(o) === filter;
    });
  }, [orders, filter]);

  // Statistik
  const dalamProses = orders.filter((o) => statusProduksi(o) === 'Dalam Proses').length;
  const selesai = orders.filter((o) => statusProduksi(o) === 'Selesai').length;
  const belumMulai = orders.filter((o) => statusProduksi(o) === 'Belum Mulai').length;
  const avgProgress = orders.length > 0
    ? Math.round(orders.reduce((s, o) => s + progressProduksi(o), 0) / orders.length)
    : 0;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  if (selectedOrder) {
    return (
      <ProduksiDetail order={selectedOrder} onBack={() => setSelectedId(null)} onOrderChange={onOrderChange} />
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Factory} label="Dalam Proses" value={String(dalamProses)} accent="amber" />
        <SummaryCard icon={CheckCircle2} label="Selesai Produksi" value={String(selesai)} accent="emerald" />
        <SummaryCard icon={Clock} label="Belum Mulai" value={String(belumMulai)} accent="brand" />
        <SummaryCard icon={Activity} label="Rata-rata Progress" value={`${avgProgress}%`} accent="violet" />
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
            {f === 'all' ? 'Semua' : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3.5">Nomor Pesanan</th>
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5">Progress</th>
                <th className="px-5 py-3.5 text-center">Tahapan</th>
                <th className="px-5 py-3.5">Estimasi Selesai</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Factory size={36} className="mx-auto text-ink-300 mb-3" />
                    <p className="text-sm text-ink-400">Tidak ada pesanan yang cocok</p>
                  </td>
                </tr>
              )}
              {filtered.map((o) => {
                const prog = progressProduksi(o);
                const sts = statusProduksi(o);
                const hari = hariMenujuEstimasi(o);
                return (
                  <tr
                    key={o.id}
                    className="table-row-hover cursor-pointer"
                    onClick={() => setSelectedId(o.id)}
                  >
                    <td className="px-5 py-4 font-semibold text-brand-700 text-sm">{o.nomor}</td>
                    <td className="px-5 py-4 text-sm text-ink-700 font-medium">{o.pelanggan}</td>
                    <td className="px-5 py-4 text-sm text-ink-600 max-w-[160px] truncate">{o.produk}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 w-32">
                        <div className="h-2 flex-1 rounded-full bg-brand-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prog === 100 ? 'bg-emerald-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-ink-600 w-8">{prog}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-500 text-center whitespace-nowrap">
                      {totalTahapan(o) > 0 ? `${tahapanSelesai(o)}/${totalTahapan(o)}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-500 whitespace-nowrap">
                      {o.produksi?.estimasiSelesai ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} className="text-ink-300" />
                          {formatDate(o.produksi.estimasiSelesai)}
                          {hari !== null && sts !== 'Selesai' && (
                            <span className={`text-xs font-medium ${hari < 0 ? 'text-red-500' : hari <= 2 ? 'text-amber-500' : 'text-ink-400'}`}>
                              {hari < 0 ? `(${Math.abs(hari)}h telat)` : hari === 0 ? '(hari ini)' : `(${hari}h lagi)`}
                            </span>
                          )}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4"><ProduksiStatusBadge status={sts} /></td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(o.id); }}
                        className="p-2 rounded-lg hover:bg-brand-100 text-ink-400 hover:text-brand-600 transition-colors"
                      >
                        <ChevronRight size={16} />
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

// ─── Detail produksi ────────────────────────────────────────────────────────
function ProduksiDetail({
  order,
  onBack,
  onOrderChange,
}: {
  order: JobOrder;
  onBack: () => void;
  onOrderChange: (updated: JobOrder) => void;
}) {
  const [showAddTahapan, setShowAddTahapan] = useState(false);
  const [tahapanForm, setTahapanForm] = useState<TahapanForm>(emptyTahapan(1));
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TahapanForm>(emptyTahapan(1));
  const [saving, setSaving] = useState(false);
  const [mulaiForm, setMulaiForm] = useState({ tanggalMulai: todayISO(), estimasiSelesai: addDaysISO(10), catatan: '' });
  const [showMulaiForm, setShowMulaiForm] = useState(false);
  const [editEstimasi, setEditEstimasi] = useState(false);
  const [estimasiForm, setEstimasiForm] = useState('');

  const produksi = order.produksi;
  const prog = progressProduksi(order);
  const sts = statusProduksi(order);
  const hari = hariMenujuEstimasi(order);
  const payStatus = statusPembayaran(order);
  const allStagesDone = produksi !== null && produksi.tahapan.length > 0 && produksi.tahapan.every((t) => t.status === 'Selesai');

  // ── Mulai Produksi ──
  const handleMulaiProduksi = async () => {
    setSaving(true);
    try {
      const p = await startProduksi(order.id, {
        tanggalMulai: mulaiForm.tanggalMulai,
        estimasiSelesai: mulaiForm.estimasiSelesai,
        catatan: mulaiForm.catatan,
      });
      // Tambahkan 5 tahapan default
      const stages: ProductionStage[] = [];
      for (let i = 0; i < defaultStages.length; i++) {
        const s = await addTahapan(order.id, {
          namaTahapan: defaultStages[i],
          urutan: i + 1,
          status: 'Belum',
          tanggalMulai: '',
          tanggalSelesai: '',
          catatan: '',
        });
        stages.push(s);
      }
      onOrderChange({ ...order, produksi: { ...p, tahapan: stages } });
      setShowMulaiForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memulai produksi');
    } finally {
      setSaving(false);
    }
  };

  // ── Tambah tahapan ──
  const handleAddTahapan = async () => {
    if (!tahapanForm.namaTahapan) return;
    setSaving(true);
    try {
      const urutan = (produksi?.tahapan.length ?? 0) + 1;
      const s = await addTahapan(order.id, { ...tahapanForm, urutan });
      onOrderChange({
        ...order,
        produksi: produksi
          ? { ...produksi, tahapan: [...produksi.tahapan, s] }
          : null,
      });
      setTahapanForm(emptyTahapan(urutan + 1));
      setShowAddTahapan(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menambah tahapan');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit tahapan ──
  const handleEditSave = async (id: string) => {
    setSaving(true);
    try {
      await updateTahapan(id, editForm);
      if (produksi) {
        onOrderChange({
          ...order,
          produksi: {
            ...produksi,
            tahapan: produksi.tahapan.map((t) => (t.id === id ? { ...t, ...editForm } : t)),
          },
        });
      }
      setEditId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengupdate tahapan');
    } finally {
      setSaving(false);
    }
  };

  // ── Cycle status tahapan ──
  const handleCycleStatus = async (t: ProductionStage) => {
    if (!produksi) return;
    const next: TahapanStatus = t.status === 'Belum' ? 'Proses' : t.status === 'Proses' ? 'Selesai' : 'Belum';
    const patch: Partial<TahapanForm> = { status: next };
    if (next === 'Proses' && !t.tanggalMulai) patch.tanggalMulai = todayISO();
    if (next === 'Selesai' && !t.tanggalSelesai) patch.tanggalSelesai = todayISO();
    if (next === 'Belum') { patch.tanggalMulai = ''; patch.tanggalSelesai = ''; }
    try {
      await updateTahapan(t.id, patch);
      onOrderChange({
        ...order,
        produksi: {
          ...produksi,
          tahapan: produksi.tahapan.map((x) => (x.id === t.id ? { ...x, ...patch } : x)),
        },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengubah status tahapan');
    }
  };

  // ── Hapus tahapan ──
  const handleDeleteTahapan = async (id: string) => {
    if (!confirm('Hapus tahapan produksi ini?')) return;
    if (!produksi) return;
    try {
      await deleteTahapan(id);
      onOrderChange({
        ...order,
        produksi: { ...produksi, tahapan: produksi.tahapan.filter((t) => t.id !== id) },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus tahapan');
    }
  };

  // ── Tandai selesai ──
  const handleTandaiSelesai = async () => {
    if (!produksi) return;
    if (!confirm('Tandai produksi sebagai selesai? Status pesanan akan berubah menjadi Selesai.')) return;
    setSaving(true);
    try {
      const today = todayISO();
      await updateProduksi(produksi.id, { tanggalSelesai: today });
      await updateOrder(order.id, { status: 'Selesai' });
      onOrderChange({
        ...order,
        produksi: { ...produksi, tanggalSelesai: today },
        status: 'Selesai',
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menandai selesai');
    } finally {
      setSaving(false);
    }
  };

  // ── Update estimasi selesai ──
  const handleUpdateEstimasi = async () => {
    if (!produksi) return;
    try {
      await updateProduksi(produksi.id, { estimasiSelesai: estimasiForm });
      onOrderChange({
        ...order,
        produksi: { ...produksi, estimasiSelesai: estimasiForm },
      });
      setEditEstimasi(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal update estimasi');
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
              <ProduksiStatusBadge status={sts} />
              <StatusBadge status={order.status} size="sm" />
            </div>
            <p className="text-sm text-ink-400 mt-0.5">{order.produk} — {order.pelanggan}</p>
          </div>
        </div>
        {allStagesDone && sts !== 'Selesai' && (
          <button onClick={handleTandaiSelesai} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Tandai Selesai
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

      {/* Belum mulai produksi */}
      {!produksi && !showMulaiForm && (
        <div className="card p-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-4">
            <Factory size={32} />
          </div>
          <h3 className="font-bold text-ink-900 text-base mb-1">Produksi Belang Dimulai</h3>
          <p className="text-sm text-ink-400 mb-1">
            {payStatus === 'Lunas'
              ? 'Pesanan sudah lunas. Klik tombol di bawah untuk memulai produksi.'
              : 'Catatan: Pesanan belum lunas. Sebaiknya lunasi pembayaran sebelum produksi.'}
          </p>
          {payStatus !== 'Lunas' && (
            <p className="text-xs text-amber-600 mb-4">
              Sisa tagihan: {formatRupiah(totalTagihan(order) - totalPembayaran(order))}
            </p>
          )}
          <button onClick={() => setShowMulaiForm(true)} className="btn-primary mx-auto mt-2">
            <Play size={16} /> Mulai Produksi
          </button>
        </div>
      )}

      {/* Form mulai produksi */}
      {!produksi && showMulaiForm && (
        <div className="card p-6 max-w-lg">
          <div className="flex items-center gap-2.5 mb-5">
            <Play size={20} className="text-brand-600" />
            <h3 className="font-bold text-ink-900 text-base">Mulai Produksi</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Tanggal Mulai</label>
                <input type="date" className="input-field" value={mulaiForm.tanggalMulai} onChange={(e) => setMulaiForm({ ...mulaiForm, tanggalMulai: e.target.value })} />
              </div>
              <div>
                <label className="label-field">Estimasi Selesai</label>
                <input type="date" className="input-field" value={mulaiForm.estimasiSelesai} onChange={(e) => setMulaiForm({ ...mulaiForm, estimasiSelesai: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Catatan (opsional)</label>
              <input className="input-field" value={mulaiForm.catatan} onChange={(e) => setMulaiForm({ ...mulaiForm, catatan: e.target.value })} placeholder="Catatan produksi" />
            </div>
            <p className="text-xs text-ink-400">
              5 tahapan standar (Pemotongan, Penjahitan, Sablon/Bordir, Finishing & QC, Packaging) akan dibuat otomatis.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={() => setShowMulaiForm(false)} className="btn-outline">Batal</button>
            <button onClick={handleMulaiProduksi} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} Mulai Produksi
            </button>
          </div>
        </div>
      )}

      {/* Detail produksi */}
      {produksi && (
        <>
          {/* Timeline & progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Timeline card */}
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <Calendar size={20} className="text-brand-600" />
                <h3 className="font-bold text-ink-900 text-base">Timeline Produksi</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TimelineItem icon={Play} label="Tanggal Mulai" value={produksi.tanggalMulai ? formatDate(produksi.tanggalMulai) : '—'} color="brand" />
                <TimelineItem
                  icon={Flag}
                  label="Estimasi Selesai"
                  value={
                    editEstimasi ? (
                      <div className="flex items-center gap-1">
                        <input type="date" className="input-cell text-xs" value={estimasiForm} onChange={(e) => setEstimasiForm(e.target.value)} />
                        <ActionBtn icon={Check} color="green" onClick={handleUpdateEstimasi} title="Simpan" />
                        <ActionBtn icon={X} color="gray" onClick={() => setEditEstimasi(false)} title="Batal" />
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEstimasiForm(produksi.estimasiSelesai); setEditEstimasi(true); }}
                        className="inline-flex items-center gap-1.5 text-left hover:text-brand-600 transition-colors"
                      >
                        {produksi.estimasiSelesai ? formatDate(produksi.estimasiSelesai) : 'Belum diset'}
                        <Pencil size={12} className="text-ink-300" />
                      </button>
                    )
                  }
                  color="amber"
                />
                <TimelineItem icon={CheckCircle2} label="Tanggal Selesai" value={produksi.tanggalSelesai ? formatDate(produksi.tanggalSelesai) : 'Belum selesai'} color={produksi.tanggalSelesai ? 'emerald' : 'gray'} />
              </div>
              {produksi.catatan && (
                <div className="mt-4 rounded-xl bg-brand-50/50 p-3 border border-brand-100">
                  <p className="text-xs text-ink-400 font-medium mb-0.5">Catatan Produksi</p>
                  <p className="text-sm text-ink-600">{produksi.catatan}</p>
                </div>
              )}
            </div>

            {/* Progress card */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <Activity size={20} className="text-brand-600" />
                <h3 className="font-bold text-ink-900 text-base">Progress</h3>
              </div>
              <div className="text-center mb-4">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(224,242,254)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={prog === 100 ? 'rgb(16,185,129)' : 'rgb(45,138,240)'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(prog / 100) * 264} 264`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-ink-800">{prog}%</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Tahapan Selesai</span>
                  <span className="font-semibold text-emerald-600">{tahapanSelesai(order)} / {totalTahapan(order)}</span>
                </div>
                {hari !== null && sts !== 'Selesai' && (
                  <div className="flex items-center justify-between">
                    <span className="text-ink-400">Estimasi</span>
                    <span className={`font-semibold ${hari < 0 ? 'text-red-500' : hari <= 2 ? 'text-amber-500' : 'text-ink-600'}`}>
                      {hari < 0 ? `Terlambat ${Math.abs(hari)} hari` : hari === 0 ? 'Hari ini' : `${hari} hari lagi`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tahapan produksi */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-brand-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 text-sm">Tahapan Produksi</h3>
                  <p className="text-xs text-ink-400">Klik status untuk mengubah: Belum → Proses → Selesai</p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddTahapan((v) => !v); setEditId(null); }}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                <Plus size={14} /> Tambah Tahapan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                    <th className="px-5 py-3 text-center w-10">No.</th>
                    <th className="px-5 py-3">Nama Tahapan</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3">Mulai</th>
                    <th className="px-5 py-3">Selesai</th>
                    <th className="px-5 py-3">Catatan</th>
                    <th className="px-5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {produksi.tahapan.length === 0 && !showAddTahapan && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-sm text-ink-400">
                        Belum ada tahapan. Klik <strong>+ Tambah Tahapan</strong> untuk menambahkan.
                      </td>
                    </tr>
                  )}

                  {showAddTahapan && (
                    <tr className="bg-emerald-50/60">
                      <td className="px-2 py-2 text-center text-sm text-ink-400">{(produksi.tahapan.length + 1)}</td>
                      <td className="px-2 py-2"><input className="input-cell" value={tahapanForm.namaTahapan} onChange={(e) => setTahapanForm({ ...tahapanForm, namaTahapan: e.target.value })} placeholder="Nama tahapan*" /></td>
                      <td className="px-2 py-2"><TahapanBadge status="Belum" /></td>
                      <td className="px-2 py-2 text-ink-300 text-sm">—</td>
                      <td className="px-2 py-2 text-ink-300 text-sm">—</td>
                      <td className="px-2 py-2"><input className="input-cell" value={tahapanForm.catatan} onChange={(e) => setTahapanForm({ ...tahapanForm, catatan: e.target.value })} placeholder="Catatan" /></td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <ActionBtn icon={Check} color="green" onClick={handleAddTahapan} disabled={saving} title="Simpan" />
                          <ActionBtn icon={X} color="gray" onClick={() => { setShowAddTahapan(false); setTahapanForm(emptyTahapan(1)); }} title="Batal" />
                        </div>
                      </td>
                    </tr>
                  )}

                  {produksi.tahapan.map((t) =>
                    editId === t.id ? (
                      <tr key={t.id} className="bg-brand-50/60">
                        <td className="px-2 py-2 text-center text-sm text-ink-400">{t.urutan}</td>
                        <td className="px-2 py-2"><input className="input-cell" value={editForm.namaTahapan} onChange={(e) => setEditForm({ ...editForm, namaTahapan: e.target.value })} placeholder="Nama tahapan" /></td>
                        <td className="px-2 py-2">
                          <select className="input-cell" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TahapanStatus })}>
                            <option value="Belum">Belum</option>
                            <option value="Proses">Proses</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </td>
                        <td className="px-2 py-2"><input type="date" className="input-cell text-xs" value={editForm.tanggalMulai} onChange={(e) => setEditForm({ ...editForm, tanggalMulai: e.target.value })} /></td>
                        <td className="px-2 py-2"><input type="date" className="input-cell text-xs" value={editForm.tanggalSelesai} onChange={(e) => setEditForm({ ...editForm, tanggalSelesai: e.target.value })} /></td>
                        <td className="px-2 py-2"><input className="input-cell" value={editForm.catatan} onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })} placeholder="Catatan" /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn icon={Check} color="green" onClick={() => handleEditSave(t.id)} disabled={saving} title="Simpan" />
                            <ActionBtn icon={X} color="gray" onClick={() => setEditId(null)} title="Batal" />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={t.id} className="table-row-hover group">
                        <td className="px-5 py-3.5 text-center text-sm font-semibold text-ink-400">{t.urutan}</td>
                        <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{t.namaTahapan}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button onClick={() => handleCycleStatus(t)} className="transition-transform hover:scale-110" title="Klik untuk mengubah status">
                            <TahapanBadge status={t.status} />
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-ink-500 whitespace-nowrap">{t.tanggalMulai ? formatDate(t.tanggalMulai) : '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-ink-500 whitespace-nowrap">{t.tanggalSelesai ? formatDate(t.tanggalSelesai) : '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-ink-500 max-w-[200px] truncate">{t.catatan || '—'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionBtn icon={Pencil} color="blue" onClick={() => { setEditId(t.id); setEditForm({ namaTahapan: t.namaTahapan, urutan: t.urutan, status: t.status, tanggalMulai: t.tanggalMulai, tanggalSelesai: t.tanggalSelesai, catatan: t.catatan }); }} title="Edit" />
                            <ActionBtn icon={Trash2} color="red" onClick={() => handleDeleteTahapan(t.id)} title="Hapus" />
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {/* Overall progress row */}
                  {produksi.tahapan.length > 0 && (
                    <tr className="bg-brand-50/40 border-t-2 border-brand-100">
                      <td className="px-5 py-4" colSpan={2}>
                        <span className="text-sm font-bold text-ink-800">Progress Keseluruhan</span>
                      </td>
                      <td className="px-5 py-4" colSpan={5}>
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-brand-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${prog === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-brand-700">{prog}%</span>
                          <span className="text-xs text-ink-400">({tahapanSelesai(order)}/{totalTahapan(order)} tahapan)</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selesai indicator */}
          {sts === 'Selesai' && (
            <div className="card p-5 bg-gradient-to-br from-emerald-50 to-brand-50 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="font-bold text-ink-900 text-sm">Produksi Selesai</p>
                  <p className="text-xs text-ink-500">
                    Selesai pada {produksi.tanggalSelesai ? formatDate(produksi.tanggalSelesai) : '—'} — {produksi.tahapan.length} tahapan diselesaikan
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
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

function TimelineItem({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: ReactNode; color: 'brand' | 'amber' | 'emerald' | 'gray' }) {
  const map = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    gray: 'bg-gray-100 text-gray-500',
  };
  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${map[color]}`}>
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
