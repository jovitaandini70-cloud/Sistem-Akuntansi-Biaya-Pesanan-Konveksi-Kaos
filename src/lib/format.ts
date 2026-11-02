import type { JobOrder, PaymentStatus } from '../types';

export const formatRupiah = (n: number): string =>
  'Rp ' + n.toLocaleString('id-ID');

export const formatRupiahShort = (n: number): string => {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1) + ' M';
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return 'Rp ' + (n / 1_000).toFixed(0) + ' rb';
  return 'Rp ' + n;
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const totalMaterial = (o: JobOrder) =>
  o.materials.reduce((s, m) => s + m.harga * m.qtyUsed, 0);

export const totalLabor = (o: JobOrder) =>
  o.labors.reduce((s, l) => s + l.jamKerja * l.tarifPerJam, 0);

export const totalOverhead = (o: JobOrder) =>
  o.overheads.reduce((s, o) => s + o.biaya, 0);

export const totalProduksi = (o: JobOrder) =>
  totalMaterial(o) + totalLabor(o) + totalOverhead(o);

// hargaJual adalah harga per pcs — dikalikan jumlah untuk mendapat total pendapatan
export const totalPendapatan = (o: JobOrder) => o.hargaJual * o.jumlah;

// Total tagihan = harga jual × jumlah (sama dengan total pendapatan, istilah pembayaran)
export const totalTagihan = (o: JobOrder) => o.hargaJual * o.jumlah;

// Total pembayaran yang sudah diterima
export const totalPembayaran = (o: JobOrder) =>
  o.payments.reduce((s, p) => s + p.jumlah, 0);

// Sisa tagihan yang belum dibayar (minimal 0)
export const sisaPembayaran = (o: JobOrder) =>
  Math.max(0, totalTagihan(o) - totalPembayaran(o));

// Persentase pembayaran (0-100)
export const persenPembayaran = (o: JobOrder): number => {
  const tagihan = totalTagihan(o);
  return tagihan > 0 ? Math.min(100, Math.round((totalPembayaran(o) / tagihan) * 100)) : 0;
};

// Status pembayaran: Lunas / Sebagian / Belum Bayar
export const statusPembayaran = (o: JobOrder): PaymentStatus => {
  const dibayar = totalPembayaran(o);
  if (dibayar <= 0) return 'Belum Bayar';
  if (dibayar >= totalTagihan(o)) return 'Lunas';
  return 'Sebagian';
};

// Progress produksi berdasarkan tahapan yang selesai (0-100)
// Jika status pesanan Selesai, progress selalu 100%
export const progressProduksi = (o: JobOrder): number => {
  if (o.status === 'Selesai') return 100;
  if (!o.produksi || o.produksi.tahapan.length === 0) return 0;
  const selesai = o.produksi.tahapan.filter((t) => t.status === 'Selesai').length;
  return Math.round((selesai / o.produksi.tahapan.length) * 100);
};

// Jumlah tahapan yang selesai vs total
export const tahapanSelesai = (o: JobOrder): number => {
  if (o.status === 'Selesai' && o.produksi?.tahapan.length)
    return o.produksi.tahapan.length;
  return o.produksi?.tahapan.filter((t) => t.status === 'Selesai').length ?? 0;
};

export const totalTahapan = (o: JobOrder): number =>
  o.produksi?.tahapan.length ?? 0;

// Status produksi ringkas — diselaraskan dengan status pesanan
export const statusProduksi = (o: JobOrder): 'Belum Mulai' | 'Dalam Proses' | 'Selesai' => {
  // Status pesanan adalah sumber kebenaran utama
  if (o.status === 'Selesai') return 'Selesai';
  if (!o.produksi) return 'Belum Mulai';
  if (o.produksi.tanggalSelesai) return 'Selesai';
  return 'Dalam Proses';
};

// Hari menuju estimasi selesai (bisa negatif jika terlambat, null jika belum ada)
export const hariMenujuEstimasi = (o: JobOrder): number | null => {
  if (!o.produksi?.estimasiSelesai) return null;
  const estimasi = new Date(o.produksi.estimasiSelesai);
  const sekarang = new Date();
  estimasi.setHours(0, 0, 0, 0);
  sekarang.setHours(0, 0, 0, 0);
  return Math.round((estimasi.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
};

export const estimasiLaba = (o: JobOrder) => totalPendapatan(o) - totalProduksi(o);

export const margin = (o: JobOrder) => {
  const pendapatan = totalPendapatan(o);
  return pendapatan > 0 ? (estimasiLaba(o) / pendapatan) * 100 : 0;
};
