-- ============================================================
-- SEED DATA - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- Jalankan di Supabase SQL Editor setelah schema dibuat
-- ============================================================

-- Hapus data lama jika ada (opsional, aman dijalankan ulang)
DELETE FROM overheads;
DELETE FROM labors;
DELETE FROM materials;
DELETE FROM job_orders;

-- ============================================================
-- JOB ORDERS
-- ============================================================
INSERT INTO job_orders (id, nomor, pelanggan, produk, jumlah, tanggal, status, harga_jual) VALUES
  ('jo-001', 'JO-2026-001', 'PT Garuda Sport',         'Kaos Polo Tim Futsal',       50,  '2026-09-02', 'Selesai',  85000),
  ('jo-002', 'JO-2026-002', 'Kopi Kenangan Manis',     'Kaos Promo Event',          200,  '2026-09-08', 'Selesai',  95000),
  ('jo-003', 'JO-2026-003', 'SMA Negeri 5 Bandung',    'Kaos OSIS Kelas XII',       120,  '2026-09-14', 'Produksi', 75000),
  ('jo-004', 'JO-2026-004', 'Komunitas Runner Jakarta', 'Kaos Lari Event 10K',       80,  '2026-09-20', 'Draft',    80000),
  ('jo-005', 'JO-2026-005', 'Warung Kopi Senja',       'Kaos Seragam Barista',      30,  '2026-09-25', 'Selesai',  90000),
  ('jo-006', 'JO-2026-006', 'Tech Startup Hub',        'Kaos Corporate Swag Pack',  150,  '2026-09-27', 'Draft',    95000),
  ('jo-007', 'JO-2026-007', 'Universitas Diponegoro',  'Kaos Wisuda Fakultas',      300,  '2026-10-03', 'Produksi', 70000),
  ('jo-008', 'JO-2026-008', 'CV Maju Bersama',         'Seragam Karyawan',           60,  '2026-10-10', 'Draft',   110000);

-- ============================================================
-- MATERIALS (Bahan Baku)
-- ============================================================

-- JO-001: Kaos Polo Tim Futsal (50 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-001-1', 'jo-001', 'KBL-001', 'Kain Cotton Combed 30s',  'meter',  28000, 320, 75),
  ('m-001-2', 'jo-001', 'TKN-002', 'Tinta Sablon Plastisol',  'kg',     85000,  18,  3),
  ('m-001-3', 'jo-001', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,  5),
  ('m-001-4', 'jo-001', 'PKG-004', 'Plastik Packaging',       'pcs',      500,1200, 55);

-- JO-002: Kaos Promo Event (200 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-002-1', 'jo-002', 'KBL-002', 'Kain Cotton Combed 24s',  'meter',  32000, 210, 280),
  ('m-002-2', 'jo-002', 'TKN-005', 'Tinta Sablon Waterbase',  'kg',     78000,  12,   6),
  ('m-002-3', 'jo-002', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,  12),
  ('m-002-4', 'jo-002', 'PKG-004', 'Plastik Packaging',       'pcs',      500,1200, 205);

-- JO-003: Kaos OSIS (120 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-003-1', 'jo-003', 'KBL-001', 'Kain Cotton Combed 30s',  'meter',  28000, 320, 150),
  ('m-003-2', 'jo-003', 'TKN-002', 'Tinta Sablon Plastisol',  'kg',     85000,  18,   4),
  ('m-003-3', 'jo-003', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,   8),
  ('m-003-4', 'jo-003', 'PKG-004', 'Plastik Packaging',       'pcs',      500,1200, 125);

-- JO-004: Kaos Lari (80 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-004-1', 'jo-004', 'KBL-003', 'Kain Dryfit Polyester',   'meter',  35000,  95, 110),
  ('m-004-2', 'jo-004', 'TKN-006', 'Tinta Sublim',            'liter', 110000,   8,   4),
  ('m-004-3', 'jo-004', 'PKG-004', 'Plastik Packaging',       'pcs',      500,1200,  85);

-- JO-005: Kaos Barista (30 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-005-1', 'jo-005', 'KBL-001', 'Kain Cotton Combed 30s',  'meter',  28000, 320, 42),
  ('m-005-2', 'jo-005', 'TKN-002', 'Tinta Sablon Plastisol',  'kg',     85000,  18,  2),
  ('m-005-3', 'jo-005', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,  3),
  ('m-005-4', 'jo-005', 'PKG-004', 'Plastik Packaging',       'pcs',      500,1200, 32);

-- JO-006: Corporate Swag (150 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-006-1', 'jo-006', 'KBL-002', 'Kain Cotton Combed 24s',  'meter',  32000, 210, 210),
  ('m-006-2', 'jo-006', 'TKN-005', 'Tinta Sablon Waterbase',  'kg',     78000,  12,   5),
  ('m-006-3', 'jo-006', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,  10),
  ('m-006-4', 'jo-006', 'PKG-005', 'Karton Packaging Premium','pcs',    2500,  300, 155);

-- JO-007: Kaos Wisuda (300 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-007-1', 'jo-007', 'KBL-001', 'Kain Cotton Combed 30s',  'meter',  28000, 500, 390),
  ('m-007-2', 'jo-007', 'TKN-002', 'Tinta Sablon Plastisol',  'kg',     85000,  20,   8),
  ('m-007-3', 'jo-007', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  80,  20),
  ('m-007-4', 'jo-007', 'PKG-004', 'Plastik Packaging',       'pcs',      500,2000, 310);

-- JO-008: Seragam Karyawan (60 pcs)
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-008-1', 'jo-008', 'KBL-004', 'Kain Polo Pique',         'meter',  45000, 120,  90),
  ('m-008-2', 'jo-008', 'TKN-007', 'Bordir Logo',             'pcs',    15000, 200,  65),
  ('m-008-3', 'jo-008', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,   6),
  ('m-008-4', 'jo-008', 'PKG-005', 'Karton Packaging Premium','pcs',    2500,  300,  65);

-- ============================================================
-- LABORS (Tenaga Kerja)
-- ============================================================

-- JO-001
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-001-1', 'jo-001', 'Andi Saputra',  'Sablon',          20, 25000),
  ('l-001-2', 'jo-001', 'Rudi Hartono',  'Jahit',           30, 22000),
  ('l-001-3', 'jo-001', 'Siti Aminah',   'Finishing',       10, 18000);

-- JO-002
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-002-1', 'jo-002', 'Andi Saputra',  'Sablon',          45, 25000),
  ('l-002-2', 'jo-002', 'Rudi Hartono',  'Jahit',           60, 22000),
  ('l-002-3', 'jo-002', 'Dewi Lestari',  'Finishing',       25, 18000),
  ('l-002-4', 'jo-002', 'Joko Widodo',   'Quality Control', 15, 20000);

-- JO-003
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-003-1', 'jo-003', 'Andi Saputra',  'Sablon',          25, 25000),
  ('l-003-2', 'jo-003', 'Rudi Hartono',  'Jahit',           35, 22000),
  ('l-003-3', 'jo-003', 'Siti Aminah',   'Finishing',       15, 18000);

-- JO-004
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-004-1', 'jo-004', 'Joko Widodo',   'Sublim',          15, 28000),
  ('l-004-2', 'jo-004', 'Dewi Lestari',  'Jahit',           20, 22000);

-- JO-005
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-005-1', 'jo-005', 'Andi Saputra',  'Sablon',          12, 25000),
  ('l-005-2', 'jo-005', 'Rudi Hartono',  'Jahit',           18, 22000),
  ('l-005-3', 'jo-005', 'Siti Aminah',   'Finishing',        6, 18000);

-- JO-006
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-006-1', 'jo-006', 'Andi Saputra',  'Sablon',          35, 25000),
  ('l-006-2', 'jo-006', 'Rudi Hartono',  'Jahit',           45, 22000),
  ('l-006-3', 'jo-006', 'Dewi Lestari',  'Finishing',       20, 18000);

-- JO-007
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-007-1', 'jo-007', 'Andi Saputra',  'Sablon',          60, 25000),
  ('l-007-2', 'jo-007', 'Rudi Hartono',  'Jahit',           80, 22000),
  ('l-007-3', 'jo-007', 'Siti Aminah',   'Finishing',       35, 18000),
  ('l-007-4', 'jo-007', 'Joko Widodo',   'Quality Control', 20, 20000);

-- JO-008
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-008-1', 'jo-008', 'Rudi Hartono',  'Jahit',           25, 22000),
  ('l-008-2', 'jo-008', 'Dewi Lestari',  'Bordir',          30, 28000),
  ('l-008-3', 'jo-008', 'Siti Aminah',   'Finishing',       12, 18000);

-- ============================================================
-- OVERHEADS (Biaya Overhead)
-- ============================================================

-- JO-001
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-001-1', 'jo-001', 'Listrik Produksi',          350000),
  ('o-001-2', 'jo-001', 'Penyusutan Mesin Sablon',   280000),
  ('o-001-3', 'jo-001', 'Maintenance Mesin Jahit',   120000);

-- JO-002
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-002-1', 'jo-002', 'Listrik Produksi',          850000),
  ('o-002-2', 'jo-002', 'Penyusutan Mesin Sablon',   420000),
  ('o-002-3', 'jo-002', 'Maintenance Mesin Jahit',   200000),
  ('o-002-4', 'jo-002', 'Sewa Workshop',             500000);

-- JO-003
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-003-1', 'jo-003', 'Listrik Produksi',          450000),
  ('o-003-2', 'jo-003', 'Penyusutan Mesin Sablon',   300000),
  ('o-003-3', 'jo-003', 'Maintenance Mesin Jahit',   150000);

-- JO-004
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-004-1', 'jo-004', 'Listrik Produksi',          300000),
  ('o-004-2', 'jo-004', 'Penyusutan Mesin Sublim',   350000);

-- JO-005
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-005-1', 'jo-005', 'Listrik Produksi',          220000),
  ('o-005-2', 'jo-005', 'Penyusutan Mesin Sablon',   180000),
  ('o-005-3', 'jo-005', 'Maintenance Mesin Jahit',    80000);

-- JO-006
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-006-1', 'jo-006', 'Listrik Produksi',          600000),
  ('o-006-2', 'jo-006', 'Penyusutan Mesin Sablon',   350000),
  ('o-006-3', 'jo-006', 'Maintenance Mesin Jahit',   180000),
  ('o-006-4', 'jo-006', 'Sewa Workshop',             500000);

-- JO-007
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-007-1', 'jo-007', 'Listrik Produksi',         1100000),
  ('o-007-2', 'jo-007', 'Penyusutan Mesin Sablon',   600000),
  ('o-007-3', 'jo-007', 'Maintenance Mesin Jahit',   300000),
  ('o-007-4', 'jo-007', 'Sewa Workshop',             750000);

-- JO-008
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-008-1', 'jo-008', 'Listrik Produksi',          380000),
  ('o-008-2', 'jo-008', 'Penyusutan Mesin Bordir',   420000),
  ('o-008-3', 'jo-008', 'Maintenance Mesin Jahit',   150000);
