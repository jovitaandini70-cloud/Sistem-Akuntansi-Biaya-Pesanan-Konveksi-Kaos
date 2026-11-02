/**
 * jobOrderService.ts
 * Layer akses data ke Supabase untuk entitas JobOrder beserta relasi-nya.
 * Semua fungsi bersifat async dan mengembalikan data sesuai tipe di types.ts.
 */

import { supabase } from './supabase';
import type { JobOrder, Material, Labor, OverheadItem, OrderStatus, Payment, PaymentMetode, ProductionStage, TahapanStatus, Production } from '../types';

// ----------------------------------------------------------------
// Helper: mapping dari row Postgres (snake_case) ke tipe TypeScript
// ----------------------------------------------------------------

function mapMaterial(row: Record<string, unknown>): Material {
  return {
    id: row.id as string,
    kode: row.kode as string,
    nama: row.nama as string,
    satuan: row.satuan as string,
    harga: Number(row.harga),
    stok: Number(row.stok),
    qtyUsed: Number(row.qty_used),
  };
}

function mapLabor(row: Record<string, unknown>): Labor {
  return {
    id: row.id as string,
    nama: row.nama as string,
    jenisPekerjaan: row.jenis_pekerjaan as string,
    jamKerja: Number(row.jam_kerja),
    tarifPerJam: Number(row.tarif_per_jam),
  };
}

function mapOverhead(row: Record<string, unknown>): OverheadItem {
  return {
    id: row.id as string,
    nama: row.nama as string,
    biaya: Number(row.biaya),
  };
}

function mapPayment(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string,
    tanggal: (row.tanggal as string) ?? '',
    jumlah: Number(row.jumlah),
    metode: (row.metode as PaymentMetode) ?? 'Tunai',
    catatan: (row.catatan as string) ?? '',
  };
}

function mapProductionStage(row: Record<string, unknown>): ProductionStage {
  return {
    id: row.id as string,
    namaTahapan: row.nama_tahapan as string,
    urutan: Number(row.urutan),
    status: (row.status as TahapanStatus) ?? 'Belum',
    tanggalMulai: (row.tanggal_mulai as string) ?? '',
    tanggalSelesai: (row.tanggal_selesai as string) ?? '',
    catatan: (row.catatan as string) ?? '',
  };
}

function mapProduction(
  row: Record<string, unknown> | Record<string, unknown>[] | undefined,
  tahapan: ProductionStage[]
): Production | null {
  if (!row) return null;
  const p = Array.isArray(row) ? row[0] : row;
  if (!p) return null;
  return {
    id: p.id as string,
    tanggalMulai: (p.tanggal_mulai as string) ?? '',
    estimasiSelesai: (p.estimasi_selesai as string) ?? '',
    tanggalSelesai: (p.tanggal_selesai as string) ?? '',
    catatan: (p.catatan as string) ?? '',
    tahapan,
  };
}

function mapJobOrder(
  row: Record<string, unknown>,
  materials: Material[],
  labors: Labor[],
  overheads: OverheadItem[],
  payments: Payment[],
  produksi: Production | null
): JobOrder {
  return {
    id: row.id as string,
    nomor: row.nomor as string,
    pelanggan: row.pelanggan as string,
    produk: row.produk as string,
    jumlah: Number(row.jumlah),
    tanggal: row.tanggal as string,
    status: row.status as OrderStatus,
    hargaJual: Number(row.harga_jual),
    materials,
    labors,
    overheads,
    payments,
    produksi,
  };
}

// ----------------------------------------------------------------
// BACA: ambil semua job order beserta relasi-nya
// ----------------------------------------------------------------
export async function fetchAllOrders(): Promise<JobOrder[]> {
  const { data: orders, error } = await supabase
    .from('job_orders')
    .select(`
      *,
      materials (*),
      labors (*),
      overheads (*),
      payments (*),
      produksi (*),
      produksi_tahapan (*)
    `)
    .order('tanggal', { ascending: false });

  if (error) throw new Error(`Gagal mengambil data pesanan: ${error.message}`);
  if (!orders) return [];

  return orders.map((o) => {
    const tahapan = (o.produksi_tahapan as Record<string, unknown>[]).map(mapProductionStage);
    return mapJobOrder(
      o,
      (o.materials as Record<string, unknown>[]).map(mapMaterial),
      (o.labors as Record<string, unknown>[]).map(mapLabor),
      (o.overheads as Record<string, unknown>[]).map(mapOverhead),
      (o.payments as Record<string, unknown>[]).map(mapPayment),
      mapProduction(o.produksi as Record<string, unknown>[] | undefined, tahapan)
    );
  });
}

// ----------------------------------------------------------------
// BACA: ambil satu job order berdasarkan id
// ----------------------------------------------------------------
export async function fetchOrderById(id: string): Promise<JobOrder | null> {
  const { data, error } = await supabase
    .from('job_orders')
    .select(`
      *,
      materials (*),
      labors (*),
      overheads (*),
      payments (*),
      produksi (*),
      produksi_tahapan (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Gagal mengambil pesanan: ${error.message}`);
  }

  const tahapan = (data.produksi_tahapan as Record<string, unknown>[]).map(mapProductionStage);
  return mapJobOrder(
    data,
    (data.materials as Record<string, unknown>[]).map(mapMaterial),
    (data.labors as Record<string, unknown>[]).map(mapLabor),
    (data.overheads as Record<string, unknown>[]).map(mapOverhead),
    (data.payments as Record<string, unknown>[]).map(mapPayment),
    mapProduction(data.produksi as Record<string, unknown>[] | undefined, tahapan)
  );
}

// ----------------------------------------------------------------
// TAMBAH: buat job order baru (tanpa materials/labors/overheads)
// ----------------------------------------------------------------
export async function createOrder(
  data: Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads' | 'payments' | 'produksi'>
): Promise<JobOrder> {
  const id = `jo-${Date.now()}`;

  const { error } = await supabase.from('job_orders').insert({
    id,
    nomor: data.nomor,
    pelanggan: data.pelanggan,
    produk: data.produk,
    jumlah: data.jumlah,
    tanggal: data.tanggal,
    status: data.status,
    harga_jual: data.hargaJual,
  });

  if (error) throw new Error(`Gagal membuat pesanan: ${error.message}`);

  return { ...data, id, materials: [], labors: [], overheads: [], payments: [], produksi: null };
}

// ----------------------------------------------------------------
// UPDATE: ubah field header job order
// ----------------------------------------------------------------
export async function updateOrder(
  id: string,
  data: Partial<Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.nomor      !== undefined) patch.nomor       = data.nomor;
  if (data.pelanggan  !== undefined) patch.pelanggan   = data.pelanggan;
  if (data.produk     !== undefined) patch.produk      = data.produk;
  if (data.jumlah     !== undefined) patch.jumlah      = data.jumlah;
  if (data.tanggal    !== undefined) patch.tanggal     = data.tanggal;
  if (data.status     !== undefined) patch.status      = data.status;
  if (data.hargaJual  !== undefined) patch.harga_jual  = data.hargaJual;

  const { error } = await supabase.from('job_orders').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate pesanan: ${error.message}`);
}

// ----------------------------------------------------------------
// HAPUS: hapus job order (cascade ke materials/labors/overheads)
// ----------------------------------------------------------------
export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('job_orders').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus pesanan: ${error.message}`);
}

// ----------------------------------------------------------------
// MATERIAL: tambah, update, hapus
// ----------------------------------------------------------------
export async function addMaterial(
  jobOrderId: string,
  material: Omit<Material, 'id'>
): Promise<Material> {
  const id = `m-${Date.now()}`;
  const { error } = await supabase.from('materials').insert({
    id,
    job_order_id: jobOrderId,
    kode:         material.kode,
    nama:         material.nama,
    satuan:       material.satuan,
    harga:        material.harga,
    stok:         material.stok,
    qty_used:     material.qtyUsed,
  });
  if (error) throw new Error(`Gagal menambah material: ${error.message}`);
  return { ...material, id };
}

export async function updateMaterial(
  id: string,
  data: Partial<Omit<Material, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.kode     !== undefined) patch.kode      = data.kode;
  if (data.nama     !== undefined) patch.nama      = data.nama;
  if (data.satuan   !== undefined) patch.satuan    = data.satuan;
  if (data.harga    !== undefined) patch.harga     = data.harga;
  if (data.stok     !== undefined) patch.stok      = data.stok;
  if (data.qtyUsed  !== undefined) patch.qty_used  = data.qtyUsed;

  const { error } = await supabase.from('materials').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate material: ${error.message}`);
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await supabase.from('materials').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus material: ${error.message}`);
}

// ----------------------------------------------------------------
// LABOR: tambah, update, hapus
// ----------------------------------------------------------------
export async function addLabor(
  jobOrderId: string,
  labor: Omit<Labor, 'id'>
): Promise<Labor> {
  const id = `l-${Date.now()}`;
  const { error } = await supabase.from('labors').insert({
    id,
    job_order_id:     jobOrderId,
    nama:             labor.nama,
    jenis_pekerjaan:  labor.jenisPekerjaan,
    jam_kerja:        labor.jamKerja,
    tarif_per_jam:    labor.tarifPerJam,
  });
  if (error) throw new Error(`Gagal menambah tenaga kerja: ${error.message}`);
  return { ...labor, id };
}

export async function updateLabor(
  id: string,
  data: Partial<Omit<Labor, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.nama            !== undefined) patch.nama             = data.nama;
  if (data.jenisPekerjaan  !== undefined) patch.jenis_pekerjaan  = data.jenisPekerjaan;
  if (data.jamKerja        !== undefined) patch.jam_kerja        = data.jamKerja;
  if (data.tarifPerJam     !== undefined) patch.tarif_per_jam    = data.tarifPerJam;

  const { error } = await supabase.from('labors').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate tenaga kerja: ${error.message}`);
}

export async function deleteLabor(id: string): Promise<void> {
  const { error } = await supabase.from('labors').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus tenaga kerja: ${error.message}`);
}

// ----------------------------------------------------------------
// OVERHEAD: tambah, update, hapus
// ----------------------------------------------------------------
export async function addOverhead(
  jobOrderId: string,
  overhead: Omit<OverheadItem, 'id'>
): Promise<OverheadItem> {
  const id = `o-${Date.now()}`;
  const { error } = await supabase.from('overheads').insert({
    id,
    job_order_id: jobOrderId,
    nama:         overhead.nama,
    biaya:        overhead.biaya,
  });
  if (error) throw new Error(`Gagal menambah overhead: ${error.message}`);
  return { ...overhead, id };
}

export async function updateOverhead(
  id: string,
  data: Partial<Omit<OverheadItem, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.nama  !== undefined) patch.nama  = data.nama;
  if (data.biaya !== undefined) patch.biaya = data.biaya;

  const { error } = await supabase.from('overheads').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate overhead: ${error.message}`);
}

export async function deleteOverhead(id: string): Promise<void> {
  const { error } = await supabase.from('overheads').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus overhead: ${error.message}`);
}

// ----------------------------------------------------------------
// PAYMENTS: tambah, update, hapus
// ----------------------------------------------------------------
export async function addPayment(
  jobOrderId: string,
  payment: Omit<Payment, 'id'>
): Promise<Payment> {
  const id = `pay-${Date.now()}`;
  const { error } = await supabase.from('payments').insert({
    id,
    job_order_id: jobOrderId,
    tanggal:     payment.tanggal,
    jumlah:      payment.jumlah,
    metode:      payment.metode,
    catatan:     payment.catatan,
  });
  if (error) throw new Error(`Gagal menambah pembayaran: ${error.message}`);
  return { ...payment, id };
}

export async function updatePayment(
  id: string,
  data: Partial<Omit<Payment, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.tanggal !== undefined) patch.tanggal  = data.tanggal;
  if (data.jumlah !== undefined)  patch.jumlah   = data.jumlah;
  if (data.metode !== undefined)  patch.metode   = data.metode;
  if (data.catatan !== undefined) patch.catatan  = data.catatan;

  const { error } = await supabase.from('payments').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate pembayaran: ${error.message}`);
}

export async function deletePayment(id: string): Promise<void> {
  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus pembayaran: ${error.message}`);
}

// ----------------------------------------------------------------
// PRODUKSI: mulai produksi, update overview
// ----------------------------------------------------------------
export async function startProduksi(
  jobOrderId: string,
  data: Pick<Production, 'tanggalMulai' | 'estimasiSelesai'> & Partial<Pick<Production, 'catatan'>>
): Promise<Production> {
  const id = `prd-${Date.now()}`;
  const { error } = await supabase.from('produksi').insert({
    id,
    job_order_id:     jobOrderId,
    tanggal_mulai:    data.tanggalMulai,
    estimasi_selesai: data.estimasiSelesai,
    catatan:          data.catatan ?? '',
  });
  if (error) throw new Error(`Gagal memulai produksi: ${error.message}`);
  return {
    id,
    tanggalMulai: data.tanggalMulai,
    estimasiSelesai: data.estimasiSelesai,
    tanggalSelesai: '',
    catatan: data.catatan ?? '',
    tahapan: [],
  };
}

export async function updateProduksi(
  id: string,
  data: Partial<Pick<Production, 'tanggalMulai' | 'estimasiSelesai' | 'tanggalSelesai' | 'catatan'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.tanggalMulai    !== undefined) patch.tanggal_mulai    = data.tanggalMulai;
  if (data.estimasiSelesai !== undefined) patch.estimasi_selesai = data.estimasiSelesai;
  if (data.tanggalSelesai  !== undefined) patch.tanggal_selesai  = data.tanggalSelesai;
  if (data.catatan         !== undefined) patch.catatan          = data.catatan;

  const { error } = await supabase.from('produksi').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate produksi: ${error.message}`);
}

// ----------------------------------------------------------------
// PRODUKSI TAHAPAN: tambah, update, hapus
// ----------------------------------------------------------------
export async function addTahapan(
  jobOrderId: string,
  tahapan: Omit<ProductionStage, 'id'>
): Promise<ProductionStage> {
  const id = `pt-${Date.now()}`;
  const { error } = await supabase.from('produksi_tahapan').insert({
    id,
    job_order_id:    jobOrderId,
    nama_tahapan:    tahapan.namaTahapan,
    urutan:          tahapan.urutan,
    status:          tahapan.status,
    tanggal_mulai:   tahapan.tanggalMulai || null,
    tanggal_selesai: tahapan.tanggalSelesai || null,
    catatan:         tahapan.catatan,
  });
  if (error) throw new Error(`Gagal menambah tahapan: ${error.message}`);
  return { ...tahapan, id };
}

export async function updateTahapan(
  id: string,
  data: Partial<Omit<ProductionStage, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.namaTahapan    !== undefined) patch.nama_tahapan    = data.namaTahapan;
  if (data.urutan        !== undefined) patch.urutan          = data.urutan;
  if (data.status        !== undefined) patch.status          = data.status;
  if (data.tanggalMulai  !== undefined) patch.tanggal_mulai   = data.tanggalMulai || null;
  if (data.tanggalSelesai !== undefined) patch.tanggal_selesai = data.tanggalSelesai || null;
  if (data.catatan       !== undefined) patch.catatan        = data.catatan;

  const { error } = await supabase.from('produksi_tahapan').update(patch).eq('id', id);
  if (error) throw new Error(`Gagal mengupdate tahapan: ${error.message}`);
}

export async function deleteTahapan(id: string): Promise<void> {
  const { error } = await supabase.from('produksi_tahapan').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus tahapan: ${error.message}`);
}
