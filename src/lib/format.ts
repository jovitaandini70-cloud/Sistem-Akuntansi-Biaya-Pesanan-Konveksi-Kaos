import type { JobOrder } from '../types';

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

export const estimasiLaba = (o: JobOrder) => totalPendapatan(o) - totalProduksi(o);

export const margin = (o: JobOrder) => {
  const pendapatan = totalPendapatan(o);
  return pendapatan > 0 ? (estimasiLaba(o) / pendapatan) * 100 : 0;
};
