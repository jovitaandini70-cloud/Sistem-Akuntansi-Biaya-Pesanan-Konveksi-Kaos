-- ============================================================
-- SEED TAMBAHAN - Data pesanan lanjutan
-- Jalankan setelah seed.sql di Supabase SQL Editor
-- ============================================================

INSERT INTO job_orders (id, nomor, pelanggan, produk, jumlah, tanggal, status, harga_jual) VALUES
  ('jo-006', 'JO-2026-006', 'Tech Startup Hub',       'Kaos Corporate Swag Pack', 150, '2026-09-27', 'Draft',    95000),
  ('jo-007', 'JO-2026-007', 'Universitas Diponegoro', 'Kaos Wisuda Fakultas',     300, '2026-10-03', 'Produksi', 70000),
  ('jo-008', 'JO-2026-008', 'CV Maju Bersama',        'Seragam Karyawan',          60, '2026-10-10', 'Draft',   110000);

-- ============================================================
-- MATERIALS tambahan
-- ============================================================
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-006-1', 'jo-006', 'KBL-002', 'Kain Cotton Combed 24s',  'meter',  32000, 210, 210),
  ('m-006-2', 'jo-006', 'TKN-005', 'Tinta Sablon Waterbase',  'kg',     78000,  12,   5),
  ('m-006-3', 'jo-006', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,  10),
  ('m-006-4', 'jo-006', 'PKG-005', 'Karton Packaging Premium','pcs',    2500,  300, 155),

  ('m-007-1', 'jo-007', 'KBL-001', 'Kain Cotton Combed 30s',  'meter',  28000, 500, 390),
  ('m-007-2', 'jo-007', 'TKN-002', 'Tinta Sablon Plastisol',  'kg',     85000,  20,   8),
  ('m-007-3', 'jo-007', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  80,  20),
  ('m-007-4', 'jo-007', 'PKG-004', 'Plastik Packaging',       'pcs',      500,2000, 310),

  ('m-008-1', 'jo-008', 'KBL-004', 'Kain Polo Pique',         'meter',  45000, 120,  90),
  ('m-008-2', 'jo-008', 'TKN-007', 'Bordir Logo',             'pcs',    15000, 200,  65),
  ('m-008-3', 'jo-008', 'BNG-003', 'Benang Jahit Polyester',  'gulung', 12000,  45,   6),
  ('m-008-4', 'jo-008', 'PKG-005', 'Karton Packaging Premium','pcs',    2500,  300,  65);

-- ============================================================
-- LABORS tambahan
-- ============================================================
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-006-1', 'jo-006', 'Andi Saputra',  'Sablon',          35, 25000),
  ('l-006-2', 'jo-006', 'Rudi Hartono',  'Jahit',           45, 22000),
  ('l-006-3', 'jo-006', 'Dewi Lestari',  'Finishing',       20, 18000),

  ('l-007-1', 'jo-007', 'Andi Saputra',  'Sablon',          60, 25000),
  ('l-007-2', 'jo-007', 'Rudi Hartono',  'Jahit',           80, 22000),
  ('l-007-3', 'jo-007', 'Siti Aminah',   'Finishing',       35, 18000),
  ('l-007-4', 'jo-007', 'Joko Widodo',   'Quality Control', 20, 20000),

  ('l-008-1', 'jo-008', 'Rudi Hartono',  'Jahit',    25, 22000),
  ('l-008-2', 'jo-008', 'Dewi Lestari',  'Bordir',   30, 28000),
  ('l-008-3', 'jo-008', 'Siti Aminah',   'Finishing', 12, 18000);

-- ============================================================
-- OVERHEADS tambahan
-- ============================================================
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-006-1', 'jo-006', 'Listrik Produksi',          600000),
  ('o-006-2', 'jo-006', 'Penyusutan Mesin Sablon',   350000),
  ('o-006-3', 'jo-006', 'Maintenance Mesin Jahit',   180000),
  ('o-006-4', 'jo-006', 'Sewa Workshop',             500000),

  ('o-007-1', 'jo-007', 'Listrik Produksi',         1100000),
  ('o-007-2', 'jo-007', 'Penyusutan Mesin Sablon',   600000),
  ('o-007-3', 'jo-007', 'Maintenance Mesin Jahit',   300000),
  ('o-007-4', 'jo-007', 'Sewa Workshop',             750000),

  ('o-008-1', 'jo-008', 'Listrik Produksi',          380000),
  ('o-008-2', 'jo-008', 'Penyusutan Mesin Bordir',   420000),
  ('o-008-3', 'jo-008', 'Maintenance Mesin Jahit',   150000);
