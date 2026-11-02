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
  | 'produksi';

export interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
}
