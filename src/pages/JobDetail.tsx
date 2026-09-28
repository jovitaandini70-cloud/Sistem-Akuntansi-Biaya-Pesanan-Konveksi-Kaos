import { useState } from 'react';
import {
  ArrowLeft, Package, Users, Zap, ReceiptText,
  Calendar, User, Box, Plus, Trash2, Pencil, Check, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JobOrder, Material, Labor, OverheadItem } from '../types';
import StatusBadge from '../components/StatusBadge';
import {
  formatRupiah, formatDate,
  totalMaterial, totalLabor, totalOverhead, totalProduksi, totalPendapatan, estimasiLaba, margin,
} from '../lib/format';
import {
  addMaterial, updateMaterial, deleteMaterial,
  addLabor, updateLabor, deleteLabor,
  addOverhead, updateOverhead, deleteOverhead,
} from '../lib/jobOrderService';

// ─── Tipe lokal untuk form state ────────────────────────────────────────────

type MaterialForm = Omit<Material, 'id'>;
type LaborForm    = Omit<Labor, 'id'>;
type OverheadForm = Omit<OverheadItem, 'id'>;

const emptyMaterial = (): MaterialForm => ({ kode: '', nama: '', satuan: '', harga: 0, stok: 0, qtyUsed: 0 });
const emptyLabor    = (): LaborForm    => ({ nama: '', jenisPekerjaan: '', jamKerja: 0, tarifPerJam: 0 });
const emptyOverhead = (): OverheadForm => ({ nama: '', biaya: 0 });

// ─── Komponen utama ──────────────────────────────────────────────────────────

export default function JobDetail({
  order,
  onBack,
  onOrderChange,
}: {
  order: JobOrder;
  onBack: () => void;
  onOrderChange: (updated: JobOrder) => void;
}) {
  // ── Material state ──
  const [showAddMaterial, setShowAddMaterial]     = useState(false);
  const [materialForm, setMaterialForm]           = useState<MaterialForm>(emptyMaterial());
  const [editMaterialId, setEditMaterialId]       = useState<string | null>(null);
  const [editMaterialForm, setEditMaterialForm]   = useState<MaterialForm>(emptyMaterial());
  const [savingMaterial, setSavingMaterial]       = useState(false);

  // ── Labor state ──
  const [showAddLabor, setShowAddLabor]           = useState(false);
  const [laborForm, setLaborForm]                 = useState<LaborForm>(emptyLabor());
  const [editLaborId, setEditLaborId]             = useState<string | null>(null);
  const [editLaborForm, setEditLaborForm]         = useState<LaborForm>(emptyLabor());
  const [savingLabor, setSavingLabor]             = useState(false);

  // ── Overhead state ──
  const [showAddOverhead, setShowAddOverhead]     = useState(false);
  const [overheadForm, setOverheadForm]           = useState<OverheadForm>(emptyOverhead());
  const [editOverheadId, setEditOverheadId]       = useState<string | null>(null);
  const [editOverheadForm, setEditOverheadForm]   = useState<OverheadForm>(emptyOverhead());
  const [savingOverhead, setSavingOverhead]       = useState(false);

  // ─── Material handlers ─────────────────────────────────────────────────────

  const handleAddMaterial = async () => {
    if (!materialForm.kode || !materialForm.nama) return;
    setSavingMaterial(true);
    try {
      const m = await addMaterial(order.id, materialForm);
      onOrderChange({ ...order, materials: [...order.materials, m] });
      setMaterialForm(emptyMaterial());
      setShowAddMaterial(false);
    } finally { setSavingMaterial(false); }
  };

  const handleEditMaterialSave = async (id: string) => {
    setSavingMaterial(true);
    try {
      await updateMaterial(id, editMaterialForm);
      onOrderChange({
        ...order,
        materials: order.materials.map((m) => m.id === id ? { ...m, ...editMaterialForm } : m),
      });
      setEditMaterialId(null);
    } finally { setSavingMaterial(false); }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Hapus bahan baku ini?')) return;
    await deleteMaterial(id);
    onOrderChange({ ...order, materials: order.materials.filter((m) => m.id !== id) });
  };

  // ─── Labor handlers ────────────────────────────────────────────────────────

  const handleAddLabor = async () => {
    if (!laborForm.nama || !laborForm.jenisPekerjaan) return;
    setSavingLabor(true);
    try {
      const l = await addLabor(order.id, laborForm);
      onOrderChange({ ...order, labors: [...order.labors, l] });
      setLaborForm(emptyLabor());
      setShowAddLabor(false);
    } finally { setSavingLabor(false); }
  };

  const handleEditLaborSave = async (id: string) => {
    setSavingLabor(true);
    try {
      await updateLabor(id, editLaborForm);
      onOrderChange({
        ...order,
        labors: order.labors.map((l) => l.id === id ? { ...l, ...editLaborForm } : l),
      });
      setEditLaborId(null);
    } finally { setSavingLabor(false); }
  };

  const handleDeleteLabor = async (id: string) => {
    if (!confirm('Hapus tenaga kerja ini?')) return;
    await deleteLabor(id);
    onOrderChange({ ...order, labors: order.labors.filter((l) => l.id !== id) });
  };

  // ─── Overhead handlers ─────────────────────────────────────────────────────

  const handleAddOverhead = async () => {
    if (!overheadForm.nama) return;
    setSavingOverhead(true);
    try {
      const o = await addOverhead(order.id, overheadForm);
      onOrderChange({ ...order, overheads: [...order.overheads, o] });
      setOverheadForm(emptyOverhead());
      setShowAddOverhead(false);
    } finally { setSavingOverhead(false); }
  };

  const handleEditOverheadSave = async (id: string) => {
    setSavingOverhead(true);
    try {
      await updateOverhead(id, editOverheadForm);
      onOrderChange({
        ...order,
        overheads: order.overheads.map((o) => o.id === id ? { ...o, ...editOverheadForm } : o),
      });
      setEditOverheadId(null);
    } finally { setSavingOverhead(false); }
  };

  const handleDeleteOverhead = async (id: string) => {
    if (!confirm('Hapus overhead ini?')) return;
    await deleteOverhead(id);
    onOrderChange({ ...order, overheads: order.overheads.filter((o) => o.id !== id) });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

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
          <InfoItem icon={User}     label="Pelanggan" value={order.pelanggan} />
          <InfoItem icon={Box}      label="Produk"    value={order.produk} />
          <InfoItem icon={Package}  label="Jumlah"    value={`${order.jumlah} pcs`} />
          <InfoItem icon={Calendar} label="Tanggal"   value={formatDate(order.tanggal)} />
        </div>
      </div>

      {/* ── Bahan Baku ─────────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <SectionHeader
          icon={Package}
          title="Biaya Bahan Baku"
          subtitle="Material yang digunakan dalam produksi"
          total={totalMaterial(order)}
          onAdd={() => { setShowAddMaterial((v) => !v); setEditMaterialId(null); }}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Kode</th>
                <th className="px-5 py-3">Nama Bahan</th>
                <th className="px-5 py-3 text-center">Satuan</th>
                <th className="px-5 py-3 text-right">Harga</th>
                <th className="px-5 py-3 text-center">Qty Digunakan</th>
                <th className="px-5 py-3 text-right">Stok Sisa</th>
                <th className="px-5 py-3 text-right">Subtotal</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.materials.map((m) =>
                editMaterialId === m.id ? (
                  <tr key={m.id} className="bg-brand-50/60">
                    <td className="px-2 py-2"><input className="input-cell" value={editMaterialForm.kode} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, kode: e.target.value })} placeholder="Kode" /></td>
                    <td className="px-2 py-2"><input className="input-cell" value={editMaterialForm.nama} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, nama: e.target.value })} placeholder="Nama bahan" /></td>
                    <td className="px-2 py-2"><input className="input-cell text-center" value={editMaterialForm.satuan} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, satuan: e.target.value })} placeholder="Satuan" /></td>
                    <td className="px-2 py-2"><input className="input-cell text-right" type="number" value={editMaterialForm.harga} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, harga: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2"><input className="input-cell text-center" type="number" value={editMaterialForm.qtyUsed} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, qtyUsed: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2"><input className="input-cell text-right" type="number" value={editMaterialForm.stok} onChange={(e) => setEditMaterialForm({ ...editMaterialForm, stok: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2 text-right text-sm font-semibold text-ink-700">{formatRupiah(editMaterialForm.harga * editMaterialForm.qtyUsed)}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <ActionBtn icon={Check} color="green" onClick={() => handleEditMaterialSave(m.id)} disabled={savingMaterial} title="Simpan" />
                        <ActionBtn icon={X} color="gray" onClick={() => setEditMaterialId(null)} title="Batal" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={m.id} className="table-row-hover group">
                    <td className="px-5 py-3.5 text-sm font-semibold text-brand-700">{m.kode}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{m.nama}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-500 text-center">{m.satuan}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(m.harga)}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-600 text-center">{m.qtyUsed}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-500 text-center">{m.stok}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(m.harga * m.qtyUsed)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn icon={Pencil} color="blue" onClick={() => { setEditMaterialId(m.id); setEditMaterialForm({ kode: m.kode, nama: m.nama, satuan: m.satuan, harga: m.harga, stok: m.stok, qtyUsed: m.qtyUsed }); }} title="Edit" />
                        <ActionBtn icon={Trash2} color="red" onClick={() => handleDeleteMaterial(m.id)} title="Hapus" />
                      </div>
                    </td>
                  </tr>
                )
              )}

              {/* Form tambah material */}
              {showAddMaterial && (
                <tr className="bg-emerald-50/60">
                  <td className="px-2 py-2"><input className="input-cell" value={materialForm.kode} onChange={(e) => setMaterialForm({ ...materialForm, kode: e.target.value })} placeholder="Kode*" /></td>
                  <td className="px-2 py-2"><input className="input-cell" value={materialForm.nama} onChange={(e) => setMaterialForm({ ...materialForm, nama: e.target.value })} placeholder="Nama bahan*" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-center" value={materialForm.satuan} onChange={(e) => setMaterialForm({ ...materialForm, satuan: e.target.value })} placeholder="pcs/meter/kg" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={materialForm.harga} onChange={(e) => setMaterialForm({ ...materialForm, harga: Number(e.target.value) })} placeholder="Harga" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-center" type="number" min="0" value={materialForm.qtyUsed} onChange={(e) => setMaterialForm({ ...materialForm, qtyUsed: Number(e.target.value) })} placeholder="Qty" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={materialForm.stok} onChange={(e) => setMaterialForm({ ...materialForm, stok: Number(e.target.value) })} placeholder="Stok" /></td>
                  <td className="px-2 py-2 text-right text-sm font-semibold text-emerald-700">{formatRupiah(materialForm.harga * materialForm.qtyUsed)}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <ActionBtn icon={Check} color="green" onClick={handleAddMaterial} disabled={savingMaterial} title="Simpan" />
                      <ActionBtn icon={X} color="gray" onClick={() => { setShowAddMaterial(false); setMaterialForm(emptyMaterial()); }} title="Batal" />
                    </div>
                  </td>
                </tr>
              )}

              {order.materials.length === 0 && !showAddMaterial && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-ink-400">Belum ada bahan baku. Klik <strong>+ Tambah</strong> untuk menambahkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Tenaga Kerja ───────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <SectionHeader
          icon={Users}
          title="Biaya Tenaga Kerja Langsung"
          subtitle="Pekerja yang terlibat dalam produksi"
          total={totalLabor(order)}
          onAdd={() => { setShowAddLabor((v) => !v); setEditLaborId(null); }}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Nama Pekerja</th>
                <th className="px-5 py-3">Jenis Pekerjaan</th>
                <th className="px-5 py-3 text-center">Jam Kerja</th>
                <th className="px-5 py-3 text-right">Tarif per Jam</th>
                <th className="px-5 py-3 text-right">Total Biaya</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.labors.map((l) =>
                editLaborId === l.id ? (
                  <tr key={l.id} className="bg-brand-50/60">
                    <td className="px-2 py-2"><input className="input-cell" value={editLaborForm.nama} onChange={(e) => setEditLaborForm({ ...editLaborForm, nama: e.target.value })} placeholder="Nama pekerja" /></td>
                    <td className="px-2 py-2"><input className="input-cell" value={editLaborForm.jenisPekerjaan} onChange={(e) => setEditLaborForm({ ...editLaborForm, jenisPekerjaan: e.target.value })} placeholder="Jenis pekerjaan" /></td>
                    <td className="px-2 py-2"><input className="input-cell text-center" type="number" min="0" value={editLaborForm.jamKerja} onChange={(e) => setEditLaborForm({ ...editLaborForm, jamKerja: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={editLaborForm.tarifPerJam} onChange={(e) => setEditLaborForm({ ...editLaborForm, tarifPerJam: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2 text-right text-sm font-semibold text-ink-700">{formatRupiah(editLaborForm.jamKerja * editLaborForm.tarifPerJam)}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <ActionBtn icon={Check} color="green" onClick={() => handleEditLaborSave(l.id)} disabled={savingLabor} title="Simpan" />
                        <ActionBtn icon={X} color="gray" onClick={() => setEditLaborId(null)} title="Batal" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={l.id} className="table-row-hover group">
                    <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{l.nama}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-500">{l.jenisPekerjaan}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-600 text-center">{l.jamKerja} jam</td>
                    <td className="px-5 py-3.5 text-sm text-ink-600 text-right whitespace-nowrap">{formatRupiah(l.tarifPerJam)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(l.jamKerja * l.tarifPerJam)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn icon={Pencil} color="blue" onClick={() => { setEditLaborId(l.id); setEditLaborForm({ nama: l.nama, jenisPekerjaan: l.jenisPekerjaan, jamKerja: l.jamKerja, tarifPerJam: l.tarifPerJam }); }} title="Edit" />
                        <ActionBtn icon={Trash2} color="red" onClick={() => handleDeleteLabor(l.id)} title="Hapus" />
                      </div>
                    </td>
                  </tr>
                )
              )}

              {showAddLabor && (
                <tr className="bg-emerald-50/60">
                  <td className="px-2 py-2"><input className="input-cell" value={laborForm.nama} onChange={(e) => setLaborForm({ ...laborForm, nama: e.target.value })} placeholder="Nama pekerja*" /></td>
                  <td className="px-2 py-2"><input className="input-cell" value={laborForm.jenisPekerjaan} onChange={(e) => setLaborForm({ ...laborForm, jenisPekerjaan: e.target.value })} placeholder="Jenis pekerjaan*" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-center" type="number" min="0" value={laborForm.jamKerja} onChange={(e) => setLaborForm({ ...laborForm, jamKerja: Number(e.target.value) })} placeholder="Jam" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={laborForm.tarifPerJam} onChange={(e) => setLaborForm({ ...laborForm, tarifPerJam: Number(e.target.value) })} placeholder="Tarif/jam" /></td>
                  <td className="px-2 py-2 text-right text-sm font-semibold text-emerald-700">{formatRupiah(laborForm.jamKerja * laborForm.tarifPerJam)}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <ActionBtn icon={Check} color="green" onClick={handleAddLabor} disabled={savingLabor} title="Simpan" />
                      <ActionBtn icon={X} color="gray" onClick={() => { setShowAddLabor(false); setLaborForm(emptyLabor()); }} title="Batal" />
                    </div>
                  </td>
                </tr>
              )}

              {order.labors.length === 0 && !showAddLabor && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-400">Belum ada data tenaga kerja. Klik <strong>+ Tambah</strong> untuk menambahkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Overhead ───────────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <SectionHeader
          icon={Zap}
          title="Biaya Overhead Pabrik"
          subtitle="Biaya tidak langsung produksi"
          total={totalOverhead(order)}
          onAdd={() => { setShowAddOverhead((v) => !v); setEditOverheadId(null); }}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3">Jenis Biaya Overhead</th>
                <th className="px-5 py-3 text-right">Biaya</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {order.overheads.map((o) =>
                editOverheadId === o.id ? (
                  <tr key={o.id} className="bg-brand-50/60">
                    <td className="px-2 py-2"><input className="input-cell" value={editOverheadForm.nama} onChange={(e) => setEditOverheadForm({ ...editOverheadForm, nama: e.target.value })} placeholder="Nama overhead" /></td>
                    <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={editOverheadForm.biaya} onChange={(e) => setEditOverheadForm({ ...editOverheadForm, biaya: Number(e.target.value) })} /></td>
                    <td className="px-2 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <ActionBtn icon={Check} color="green" onClick={() => handleEditOverheadSave(o.id)} disabled={savingOverhead} title="Simpan" />
                        <ActionBtn icon={X} color="gray" onClick={() => setEditOverheadId(null)} title="Batal" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={o.id} className="table-row-hover group">
                    <td className="px-5 py-3.5 text-sm text-ink-700 font-medium">{o.nama}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(o.biaya)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionBtn icon={Pencil} color="blue" onClick={() => { setEditOverheadId(o.id); setEditOverheadForm({ nama: o.nama, biaya: o.biaya }); }} title="Edit" />
                        <ActionBtn icon={Trash2} color="red" onClick={() => handleDeleteOverhead(o.id)} title="Hapus" />
                      </div>
                    </td>
                  </tr>
                )
              )}

              {showAddOverhead && (
                <tr className="bg-emerald-50/60">
                  <td className="px-2 py-2"><input className="input-cell" value={overheadForm.nama} onChange={(e) => setOverheadForm({ ...overheadForm, nama: e.target.value })} placeholder="Nama biaya overhead*" /></td>
                  <td className="px-2 py-2"><input className="input-cell text-right" type="number" min="0" value={overheadForm.biaya} onChange={(e) => setOverheadForm({ ...overheadForm, biaya: Number(e.target.value) })} placeholder="Nominal" /></td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <ActionBtn icon={Check} color="green" onClick={handleAddOverhead} disabled={savingOverhead} title="Simpan" />
                      <ActionBtn icon={X} color="gray" onClick={() => { setShowAddOverhead(false); setOverheadForm(emptyOverhead()); }} title="Batal" />
                    </div>
                  </td>
                </tr>
              )}

              {order.overheads.length === 0 && !showAddOverhead && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-ink-400">Belum ada biaya overhead. Klik <strong>+ Tambah</strong> untuk menambahkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Ringkasan ─────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <ReceiptText size={20} className="text-brand-600" />
          <h3 className="font-bold text-ink-900 text-base">Ringkasan Biaya Produksi</h3>
        </div>
        <div className="space-y-3 max-w-md ml-auto">
          <SummaryRow label="Total Bahan Baku"           value={formatRupiah(totalMaterial(order))} />
          <SummaryRow label="Total Tenaga Kerja Langsung" value={formatRupiah(totalLabor(order))} />
          <SummaryRow label="Total Biaya Overhead"        value={formatRupiah(totalOverhead(order))} />
          <div className="border-t border-brand-100 pt-3">
            <SummaryRow label="Total Biaya Produksi" value={formatRupiah(totalProduksi(order))} bold />
          </div>
          <SummaryRow label="Harga Jual" value={`${formatRupiah(order.hargaJual)} × ${order.jumlah} pcs`} />
          <SummaryRow label="Total Pendapatan" value={formatRupiah(totalPendapatan(order))} />
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

// ─── Sub-komponen ────────────────────────────────────────────────────────────

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

function SectionHeader({
  icon: Icon, title, subtitle, total, onAdd,
}: {
  icon: LucideIcon; title: string; subtitle: string; total: number; onAdd: () => void;
}) {
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
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-ink-400">Total</p>
          <p className="text-base font-bold text-brand-700">{formatRupiah(total)}</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          <Plus size={14} />
          Tambah
        </button>
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
    red:   'text-red-500 hover:bg-red-50',
    blue:  'text-brand-600 hover:bg-brand-50',
    gray:  'text-ink-400 hover:bg-gray-100',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${colors[color]}`}
    >
      <Icon size={14} />
    </button>
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
