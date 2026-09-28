/**
 * jobOrderService.ts
 * Layer akses data ke Supabase untuk entitas JobOrder beserta relasi-nya.
 * Semua fungsi bersifat async dan mengembalikan data sesuai tipe di types.ts.
 */

import { supabase } from './supabase';
import type { JobOrder, Material, Labor, OverheadItem, OrderStatus } from '../types';

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

function mapJobOrder(
  row: Record<string, unknown>,
  materials: Material[],
  labors: Labor[],
  overheads: OverheadItem[]
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
      overheads (*)
    `)
    .order('tanggal', { ascending: false });

  if (error) throw new Error(`Gagal mengambil data pesanan: ${error.message}`);
  if (!orders) return [];

  return orders.map((o) =>
    mapJobOrder(
      o,
      (o.materials as Record<string, unknown>[]).map(mapMaterial),
      (o.labors as Record<string, unknown>[]).map(mapLabor),
      (o.overheads as Record<string, unknown>[]).map(mapOverhead)
    )
  );
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
      overheads (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Gagal mengambil pesanan: ${error.message}`);
  }

  return mapJobOrder(
    data,
    (data.materials as Record<string, unknown>[]).map(mapMaterial),
    (data.labors as Record<string, unknown>[]).map(mapLabor),
    (data.overheads as Record<string, unknown>[]).map(mapOverhead)
  );
}

// ----------------------------------------------------------------
// TAMBAH: buat job order baru (tanpa materials/labors/overheads)
// ----------------------------------------------------------------
export async function createOrder(
  data: Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads'>
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

  return { ...data, id, materials: [], labors: [], overheads: [] };
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
