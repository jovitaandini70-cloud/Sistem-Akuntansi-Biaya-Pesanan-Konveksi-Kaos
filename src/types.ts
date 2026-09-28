export type OrderStatus = 'Draft' | 'Produksi' | 'Selesai';

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
}

export type PageKey =
  | 'dashboard'
  | 'pesanan'
  | 'detail'
  | 'kartu-biaya'
  | 'laporan';

export interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
}
