import { useState, useMemo } from 'react';
import { Plus, Search, Eye, Filter, Calendar, Package } from 'lucide-react';
import type { JobOrder, OrderStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatRupiah, formatDate, totalProduksi, estimasiLaba } from '../lib/format';

const statusFilters: ('all' | OrderStatus)[] = ['all', 'Draft', 'Produksi', 'Selesai'];

export default function PesananPage({
  orders,
  onSelectOrder,
  onAddOrder,
  searchQuery,
}: {
  orders: JobOrder[];
  onSelectOrder: (id: string) => void;
  onAddOrder: (o: Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads'>) => void;
  searchQuery: string;
}) {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nomor: '', pelanggan: '', produk: '', jumlah: '', tanggal: '', hargaJual: '', status: 'Draft' as OrderStatus });

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filter === 'all' || o.status === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || o.nomor.toLowerCase().includes(q) || o.pelanggan.toLowerCase().includes(q) || o.produk.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const handleSubmit = () => {
    if (!form.nomor || !form.pelanggan || !form.produk || !form.tanggal) return;
    onAddOrder({
      nomor: form.nomor,
      pelanggan: form.pelanggan,
      produk: form.produk,
      jumlah: Number(form.jumlah) || 0,
      tanggal: form.tanggal,
      hargaJual: Number(form.hargaJual) || 0,
      status: form.status,
    });
    setForm({ nomor: '', pelanggan: '', produk: '', jumlah: '', tanggal: '', hargaJual: '', status: 'Draft' });
    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Tambah Pesanan
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-ink-400 border-b border-brand-100 bg-brand-50/40">
                <th className="px-5 py-3.5">Nomor Pesanan</th>
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-5 py-3.5 text-center">Jumlah</th>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Total Biaya</th>
                <th className="px-5 py-3.5 text-right">Est. Laba</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <Package size={36} className="mx-auto text-ink-300 mb-3" />
                    <p className="text-sm text-ink-400">Tidak ada pesanan yang cocok</p>
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="table-row-hover cursor-pointer" onClick={() => onSelectOrder(o.id)}>
                  <td className="px-5 py-4 font-semibold text-brand-700 text-sm">{o.nomor}</td>
                  <td className="px-5 py-4 text-sm text-ink-700 font-medium">{o.pelanggan}</td>
                  <td className="px-5 py-4 text-sm text-ink-600 max-w-[200px] truncate">{o.produk}</td>
                  <td className="px-5 py-4 text-sm text-ink-500 text-center">{o.jumlah}</td>
                  <td className="px-5 py-4 text-sm text-ink-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-ink-300" />
                      {formatDate(o.tanggal)}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} size="sm" /></td>
                  <td className="px-5 py-4 text-sm font-semibold text-ink-800 text-right whitespace-nowrap">{formatRupiah(totalProduksi(o))}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-emerald-600 text-right whitespace-nowrap">{formatRupiah(estimasiLaba(o))}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-brand-100 text-ink-400 hover:text-brand-600 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-ink-900">Tambah Pesanan Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nomor Pesanan</label>
                  <input className="input-field" placeholder="JO-2026-007" value={form.nomor} onChange={(e) => setForm({ ...form, nomor: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Tanggal</label>
                  <input type="date" className="input-field" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label-field">Nama Pelanggan</label>
                <input className="input-field" placeholder="Nama perusahaan / instansi" value={form.pelanggan} onChange={(e) => setForm({ ...form, pelanggan: e.target.value })} />
              </div>
              <div>
                <label className="label-field">Produk</label>
                <input className="input-field" placeholder="Jenis produk / kaos" value={form.produk} onChange={(e) => setForm({ ...form, produk: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Jumlah (pcs)</label>
                  <input type="number" className="input-field" placeholder="0" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Harga Jual per Pcs (Rp)</label>
                  <input type="number" className="input-field" placeholder="0" value={form.hargaJual} onChange={(e) => setForm({ ...form, hargaJual: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label-field">Status</label>
                <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}>
                  <option value="Draft">Draft</option>
                  <option value="Produksi">Produksi</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline">Batal</button>
              <button onClick={handleSubmit} className="btn-primary"><Plus size={16} /> Simpan Pesanan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
