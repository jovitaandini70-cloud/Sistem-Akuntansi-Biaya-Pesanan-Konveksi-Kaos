export type OrderStatus = 'Draft' | 'Produksi' | 'Selesai';

export type PaymentMetode = 'Tunai' | 'Transfer' | 'Cicilan' | 'Lainnya';
export type PaymentStatus = 'Lunas' | 'Sebagian' | 'Belum Bayar';
export type TahapanStatus = 'Belum' | 'Proses' | 'Selesai';

export interface Material {
  id: string;
  kode: string;
  nama: string;
  satuan: string;
  harga: number;
  stok: number;
  qtyUsed: number;
}

export interface Labor {
  id: string;
  nama: string;
  jenisPekerjaan: string;
  jamKerja: number;
  tarifPerJam: number;
}

export interface OverheadItem {
  id: string;
  nama: string;
  biaya: number;
}

export interface Payment {
  id: string;
  tanggal: string;
  jumlah: number;
  metode: PaymentMetode;
  catatan: string;
}

export interface ProductionStage {
  id: string;
  namaTahapan: string;
  urutan: number;
  status: TahapanStatus;
  tanggalMulai: string;
  tanggalSelesai: string;
  catatan: string;
}

export interface Production {
  id: string;
  tanggalMulai: string;
  estimasiSelesai: string;
  tanggalSelesai: string;
  catatan: string;
  tahapan: ProductionStage[];
}

export interface JobOrder {
  id: string;
  nomor: string;
  pelanggan: string;
  produk: string;
  jumlah: number;
  tanggal: string;
  status: OrderStatus;
  hargaJual: number;
  materials: Material[];
  labors: Labor[];
  overheads: OverheadItem[];
  payments: Payment[];
  produksi: Production | null;
}

export type PageKey =
  | 'dashboard'
  | 'pesanan'
  | 'detail'
  | 'kartu-biaya'
  | 'laporan'
  | 'pembayaran'
  | 'produksi'
  | 'buku-besar';

export interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
}

// ─── Akuntansi: Buku Besar ────────────────────────────────────────────────

/** Kode akun standar akuntansi biaya konveksi */
export type KodeAkun =
  | '1-101' // Kas
  | '1-102' // Bank
  | '1-103' // Piutang Dagang
  | '1-201' // Persediaan Bahan Baku
  | '1-202' // Barang Dalam Proses (BDP)
  | '1-203' // Persediaan Barang Jadi
  | '2-101' // Hutang Gaji
  | '2-102' // BOP Dibebankan
  | '4-101' // Pendapatan Penjualan
  | '5-101' // Harga Pokok Produksi (HPP)
  | '5-201' // Biaya Bahan Baku (BBB)
  | '5-202' // Biaya Tenaga Kerja Langsung (BTKL)
  | '5-203'; // Biaya Overhead Pabrik (BOP)

export type TipeAkun = 'Aset' | 'Kewajiban' | 'Pendapatan' | 'Beban';
export type PosisiNormal = 'Debet' | 'Kredit';
export type JurnalTipe =
  | 'PESANAN_DITERIMA'       // saat pesanan dibuat (Dr Piutang / Cr Pendapatan)
  | 'PEMBAYARAN_DITERIMA'    // saat payment masuk (Dr Kas/Bank / Cr Piutang)
  | 'PEMAKAIAN_BBB'          // saat masuk produksi (Dr BDP-BBB / Cr Persediaan BB)
  | 'PEMBEBANAN_BTKL'        // saat masuk produksi (Dr BDP-BTKL / Cr Hutang Gaji)
  | 'PEMBEBANAN_BOP'         // saat masuk produksi (Dr BDP-BOP / Cr BOP Dibebankan)
  | 'PRODUKSI_SELESAI';      // saat selesai (Dr Persediaan BJ / Cr BDP)

export interface AkunEntry {
  kode: KodeAkun;
  namaAkun: string;
  debet: number;
  kredit: number;
}

export interface JurnalEntry {
  id: string;
  tanggal: string;
  tipe: JurnalTipe;
  keterangan: string;
  referensi: string;    // nomor pesanan
  jobOrderId: string;
  akun: AkunEntry[];    // baris-baris debet/kredit
}

export interface LedgerAkun {
  kode: KodeAkun;
  nama: string;
  tipe: TipeAkun;
  posisiNormal: PosisiNormal;
  saldoAwal?: number;
}

export interface LedgerBaris {
  tanggal: string;
  keterangan: string;
  referensi: string;
  debet: number;
  kredit: number;
  saldo: number;
}
