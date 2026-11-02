/**
 * jurnalService.ts
 * Engine jurnal akuntansi biaya pesanan (job order costing) untuk konveksi kaos.
 *
 * Alur pencatatan mengikuti siklus akuntansi biaya:
 *   1. PESANAN_DITERIMA   → Piutang Dagang (D) / Pendapatan Penjualan (K)
 *   2. PEMBAYARAN_DITERIMA → tiap record payment → Kas/Bank (D) / Piutang Dagang (K)
 *   3. PEMAKAIAN_BBB      → saat status berubah ke Produksi → BDP-BBB (D) / Persediaan BB (K)
 *   4. PEMBEBANAN_BTKL    → saat status berubah ke Produksi → BDP-BTKL (D) / Hutang Gaji (K)
 *   5. PEMBEBANAN_BOP     → saat status berubah ke Produksi → BDP-BOP (D) / BOP Dibebankan (K)
 *   6. PRODUKSI_SELESAI   → saat status Selesai            → Pers. BJ (D) / BDP Total (K)
 *                                                          → HPP (D) / Pers. BJ (K)
 *
 * Semua jurnal di-derive dari data JobOrder yang sudah ada — tidak perlu tabel DB tambahan.
 */

import type {
  JobOrder,
  JurnalEntry,
  AkunEntry,
  KodeAkun,
  LedgerAkun,
  LedgerBaris,
} from '../types';
import {
  totalMaterial,
  totalLabor,
  totalOverhead,
  totalProduksi,
  totalTagihan,
} from './format';

// ─── Daftar Akun (Chart of Accounts) ─────────────────────────────────────────

export const CHART_OF_ACCOUNTS: LedgerAkun[] = [
  { kode: '1-101', nama: 'Kas',                               tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '1-102', nama: 'Bank',                              tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '1-103', nama: 'Piutang Dagang',                    tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '1-201', nama: 'Persediaan Bahan Baku',             tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '1-202', nama: 'Barang Dalam Proses (BDP)',         tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '1-203', nama: 'Persediaan Barang Jadi',            tipe: 'Aset',       posisiNormal: 'Debet'  },
  { kode: '2-101', nama: 'Hutang Gaji',                       tipe: 'Kewajiban',  posisiNormal: 'Kredit' },
  { kode: '4-101', nama: 'Pendapatan Penjualan',              tipe: 'Pendapatan', posisiNormal: 'Kredit' },
  { kode: '5-101', nama: 'Harga Pokok Penjualan (HPP)',       tipe: 'Beban',      posisiNormal: 'Debet'  },
  { kode: '5-201', nama: 'BDP - Biaya Bahan Baku',            tipe: 'Beban',      posisiNormal: 'Debet'  },
  { kode: '5-202', nama: 'BDP - Biaya Tenaga Kerja Langsung', tipe: 'Beban',      posisiNormal: 'Debet'  },
  { kode: '5-203', nama: 'BDP - Biaya Overhead Pabrik',       tipe: 'Beban',      posisiNormal: 'Debet'  },
];

export function getAkun(kode: KodeAkun): LedgerAkun {
  return CHART_OF_ACCOUNTS.find((a) => a.kode === kode)!;
}

// ─── Helper builder baris debet/kredit ────────────────────────────────────────

function debet(kode: KodeAkun, jumlah: number): AkunEntry {
  return { kode, namaAkun: getAkun(kode).nama, debet: jumlah, kredit: 0 };
}
function kredit(kode: KodeAkun, jumlah: number): AkunEntry {
  return { kode, namaAkun: getAkun(kode).nama, debet: 0, kredit: jumlah };
}

// ─── Derivasi jurnal dari satu JobOrder ──────────────────────────────────────

export function buildJurnalForOrder(order: JobOrder): JurnalEntry[] {
  const entries: JurnalEntry[] = [];
  const ref = order.nomor;

  const tBBB   = totalMaterial(order);
  const tBTKL  = totalLabor(order);
  const tBOP   = totalOverhead(order);
  const tTotal = totalProduksi(order);
  const tTagih = totalTagihan(order);

  // 1 ── PESANAN DITERIMA ────────────────────────────────────────────────────
  // Catatan: tanggal pesanan, Dr Piutang / Cr Pendapatan
  if (tTagih > 0) {
    entries.push({
      id:         `j-pd-${order.id}`,
      tanggal:    order.tanggal,
      tipe:       'PESANAN_DITERIMA',
      keterangan: `Pesanan diterima dari ${order.pelanggan} — ${order.produk} (${order.jumlah} pcs)`,
      referensi:  ref,
      jobOrderId: order.id,
      akun: [
        debet('1-103', tTagih),
        kredit('4-101', tTagih),
      ],
    });
  }

  // 2 ── PEMBAYARAN DITERIMA (satu jurnal per record payment) ────────────────
  for (const p of order.payments) {
    const kasKode: KodeAkun = (p.metode === 'Transfer' || p.metode === 'Cicilan') ? '1-102' : '1-101';
    entries.push({
      id:         `j-pay-${p.id}`,
      tanggal:    p.tanggal,
      tipe:       'PEMBAYARAN_DITERIMA',
      keterangan: `Pembayaran ${p.metode} — ${order.pelanggan} (${ref})${p.catatan ? ': ' + p.catatan : ''}`,
      referensi:  ref,
      jobOrderId: order.id,
      akun: [
        debet(kasKode, p.jumlah),
        kredit('1-103', p.jumlah),
      ],
    });
  }

  // Jurnal 3-5 hanya dibuat jika pesanan sudah masuk produksi atau selesai
  if (order.status === 'Produksi' || order.status === 'Selesai') {
    const tglProduksi = order.produksi?.tanggalMulai || order.tanggal;

    // 3 ── PEMAKAIAN BAHAN BAKU ─────────────────────────────────────────────
    if (tBBB > 0) {
      entries.push({
        id:         `j-bbb-${order.id}`,
        tanggal:    tglProduksi,
        tipe:       'PEMAKAIAN_BBB',
        keterangan: `Pemakaian bahan baku produksi ${ref} — ${order.produk}`,
        referensi:  ref,
        jobOrderId: order.id,
        akun: [
          debet('5-201', tBBB),
          kredit('1-201', tBBB),
        ],
      });
    }

    // 4 ── PEMBEBANAN BTKL ─────────────────────────────────────────────────
    if (tBTKL > 0) {
      entries.push({
        id:         `j-btkl-${order.id}`,
        tanggal:    tglProduksi,
        tipe:       'PEMBEBANAN_BTKL',
        keterangan: `Pembebanan tenaga kerja langsung ${ref} — ${order.labors.length} pekerja`,
        referensi:  ref,
        jobOrderId: order.id,
        akun: [
          debet('5-202', tBTKL),
          kredit('2-101', tBTKL),
        ],
      });
    }

    // 5 ── PEMBEBANAN BOP ──────────────────────────────────────────────────
    if (tBOP > 0) {
      entries.push({
        id:         `j-bop-${order.id}`,
        tanggal:    tglProduksi,
        tipe:       'PEMBEBANAN_BOP',
        keterangan: `Pembebanan biaya overhead pabrik ${ref} — ${order.overheads.length} item`,
        referensi:  ref,
        jobOrderId: order.id,
        akun: [
          debet('5-203', tBOP),
          kredit('1-202', tBOP),
        ],
      });
    }
  }

  // 6 ── PRODUKSI SELESAI (dua ayat jurnal) ─────────────────────────────────
  if (order.status === 'Selesai' && tTotal > 0) {
    const tglSelesai = order.produksi?.tanggalSelesai || order.tanggal;

    // 6a. Transfer BDP ke Persediaan Barang Jadi
    entries.push({
      id:         `j-psbj-${order.id}`,
      tanggal:    tglSelesai,
      tipe:       'PRODUKSI_SELESAI',
      keterangan: `Produksi selesai — transfer BDP ke Persediaan BJ ${ref}`,
      referensi:  ref,
      jobOrderId: order.id,
      akun: [
        debet('1-203', tTotal),
        kredit('5-201', tBBB > 0 ? tBBB : 0),
        kredit('5-202', tBTKL > 0 ? tBTKL : 0),
        kredit('5-203', tBOP > 0 ? tBOP : 0),
      ].filter((a) => a.debet > 0 || a.kredit > 0),
    });

    // 6b. Pengakuan HPP atas barang yang diserahkan
    entries.push({
      id:         `j-hpp-${order.id}`,
      tanggal:    tglSelesai,
      tipe:       'PRODUKSI_SELESAI',
      keterangan: `Pengakuan HPP pesanan ${ref} — ${order.jumlah} pcs diserahkan`,
      referensi:  ref,
      jobOrderId: order.id,
      akun: [
        debet('5-101', tTotal),
        kredit('1-203', tTotal),
      ],
    });
  }

  return entries;
}

// ─── Kumpulkan semua jurnal dari semua pesanan ────────────────────────────────

export function buildAllJurnal(orders: JobOrder[]): JurnalEntry[] {
  const all = orders.flatMap(buildJurnalForOrder);
  // Urutkan: tanggal ascending, lalu berdasarkan urutan tipe
  const tipeOrder: Record<string, number> = {
    PESANAN_DITERIMA: 1,
    PEMBAYARAN_DITERIMA: 2,
    PEMAKAIAN_BBB: 3,
    PEMBEBANAN_BTKL: 4,
    PEMBEBANAN_BOP: 5,
    PRODUKSI_SELESAI: 6,
  };
  return all.sort((a, b) => {
    const dtA = a.tanggal || '';
    const dtB = b.tanggal || '';
    if (dtA !== dtB) return dtA.localeCompare(dtB);
    return (tipeOrder[a.tipe] ?? 9) - (tipeOrder[b.tipe] ?? 9);
  });
}

// ─── Buku Besar per akun ──────────────────────────────────────────────────────

export function buildLedgerBaris(
  jurnal: JurnalEntry[],
  kode: KodeAkun,
  saldoAwal = 0
): LedgerBaris[] {
  const akun = getAkun(kode);
  const rows: LedgerBaris[] = [];
  let saldo = saldoAwal;

  for (const j of jurnal) {
    for (const a of j.akun) {
      if (a.kode !== kode) continue;
      // Saldo bergerak sesuai posisi normal akun
      if (akun.posisiNormal === 'Debet') {
        saldo += a.debet - a.kredit;
      } else {
        saldo += a.kredit - a.debet;
      }
      rows.push({
        tanggal:    j.tanggal,
        keterangan: j.keterangan,
        referensi:  j.referensi,
        debet:      a.debet,
        kredit:     a.kredit,
        saldo,
      });
    }
  }
  return rows;
}

// ─── Neraca Saldo ─────────────────────────────────────────────────────────────

export interface NeracaSaldoRow {
  kode: KodeAkun;
  namaAkun: string;
  tipe: string;
  totalDebet: number;
  totalKredit: number;
  saldoDebet: number;
  saldoKredit: number;
}

export function buildNeracaSaldo(jurnal: JurnalEntry[]): NeracaSaldoRow[] {
  const map = new Map<KodeAkun, { debet: number; kredit: number }>();

  for (const j of jurnal) {
    for (const a of j.akun) {
      const existing = map.get(a.kode) ?? { debet: 0, kredit: 0 };
      map.set(a.kode, {
        debet:  existing.debet  + a.debet,
        kredit: existing.kredit + a.kredit,
      });
    }
  }

  return CHART_OF_ACCOUNTS.map((akun) => {
    const totals = map.get(akun.kode) ?? { debet: 0, kredit: 0 };
    const net = totals.debet - totals.kredit;
    return {
      kode:        akun.kode,
      namaAkun:    akun.nama,
      tipe:        akun.tipe,
      totalDebet:  totals.debet,
      totalKredit: totals.kredit,
      saldoDebet:  net > 0 ? net : 0,
      saldoKredit: net < 0 ? Math.abs(net) : 0,
    };
  }).filter((r) => r.totalDebet > 0 || r.totalKredit > 0);
}

// ─── Label jurnal yang user-friendly ─────────────────────────────────────────

export const JURNAL_TIPE_LABEL: Record<string, { label: string; color: string }> = {
  PESANAN_DITERIMA:    { label: 'Pesanan Diterima',    color: 'bg-brand-50 text-brand-700' },
  PEMBAYARAN_DITERIMA: { label: 'Pembayaran Diterima', color: 'bg-emerald-50 text-emerald-700' },
  PEMAKAIAN_BBB:       { label: 'Pemakaian BB',        color: 'bg-amber-50 text-amber-700' },
  PEMBEBANAN_BTKL:     { label: 'Beban TKL',           color: 'bg-violet-50 text-violet-700' },
  PEMBEBANAN_BOP:      { label: 'Beban Overhead',      color: 'bg-orange-50 text-orange-700' },
  PRODUKSI_SELESAI:    { label: 'Produksi Selesai',    color: 'bg-teal-50 text-teal-700' },
};
