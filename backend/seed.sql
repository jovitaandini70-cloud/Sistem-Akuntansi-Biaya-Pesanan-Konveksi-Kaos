-- ============================================================
-- SEED DATA - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- Jalankan di Supabase SQL Editor setelah schema.sql dan triggers.sql
-- ============================================================

-- Hapus data lama jika ada (aman dijalankan ulang)
DELETE FROM overheads;
DELETE FROM labors;
DELETE FROM materials;
DELETE FROM job_orders;

-- ============================================================
-- JOB ORDERS
-- ============================================================
INSERT INTO job_orders (id, nomor, pelanggan, produk, jumlah, tanggal, status, harga_jual) VALUES
  ('jo-001', 'JO-2026-001', 'PT Garuda Sport',          'Kaos Polo Tim Futsal',       50,  '2026-09-02', 'Selesai',  85000),
  ('jo-002', 'JO-2026-002', 'Kopi Kenangan Manis',      'Kaos Promo Event',          200,  '2026-09-08', 'Selesai',  95000),
  ('jo-003', 'JO-2026-003', 'SMA Negeri 5 Bandung',     'Kaos OSIS Kelas XII',       120,  '2026-09-14', 'Produksi', 75000),
  ('jo-004', 'JO-2026-004', 'Komunitas Runner Jakarta',  'Kaos Lari Event 10K',        80,  '2026-09-20', 'Draft',    80000),
  ('jo-005', 'JO-2026-005', 'Warung Kopi Senja',        'Kaos Seragam Barista',       30,  '2026-09-25', 'Selesai',  90000);

-- ============================================================
-- MATERIALS
-- ============================================================
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-001-1', 'jo-001', 'KBL-001', 'Kain Cotton Combed 30s', 'meter',  28000, 320,  75),
  ('m-001-2', 'jo-001', 'TKN-002', 'Tinta Sablon Plastisol', 'kg',     85000,  18,   3),
  ('m-001-3', 'jo-001', 'BNG-003', 'Benang Jahit Polyester', 'gulung', 12000,  45,   5),
  ('m-001-4', 'jo-001', 'PKG-004', 'Plastik Packaging',      'pcs',      500,1200,  55),

  ('m-002-1', 'jo-002', 'KBL-002', 'Kain Cotton Combed 24s', 'meter',  32000, 210, 280),
  ('m-002-2', 'jo-002', 'TKN-005', 'Tinta Sablon Waterbase', 'kg',     78000,  12,   6),
  ('m-002-3', 'jo-002', 'BNG-003', 'Benang Jahit Polyester', 'gulung', 12000,  45,  12),
  ('m-002-4', 'jo-002', 'PKG-004', 'Plastik Packaging',      'pcs',      500,1200, 205),

  ('m-003-1', 'jo-003', 'KBL-001', 'Kain Cotton Combed 30s', 'meter',  28000, 320, 150),
  ('m-003-2', 'jo-003', 'TKN-002', 'Tinta Sablon Plastisol', 'kg',     85000,  18,   4),
  ('m-003-3', 'jo-003', 'BNG-003', 'Benang Jahit Polyester', 'gulung', 12000,  45,   8),
  ('m-003-4', 'jo-003', 'PKG-004', 'Plastik Packaging',      'pcs',      500,1200, 125),

  ('m-004-1', 'jo-004', 'KBL-003', 'Kain Dryfit Polyester',  'meter',  35000,  95, 110),
  ('m-004-2', 'jo-004', 'TKN-006', 'Tinta Sublim',           'liter', 110000,   8,   4),
  ('m-004-3', 'jo-004', 'PKG-004', 'Plastik Packaging',      'pcs',      500,1200,  85),

  ('m-005-1', 'jo-005', 'KBL-001', 'Kain Cotton Combed 30s', 'meter',  28000, 320,  42),
  ('m-005-2', 'jo-005', 'TKN-002', 'Tinta Sablon Plastisol', 'kg',     85000,  18,   2),
  ('m-005-3', 'jo-005', 'BNG-003', 'Benang Jahit Polyester', 'gulung', 12000,  45,   3),
  ('m-005-4', 'jo-005', 'PKG-004', 'Plastik Packaging',      'pcs',      500,1200,  32);

-- ============================================================
-- LABORS
-- ============================================================
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-001-1', 'jo-001', 'Andi Saputra', 'Sablon',    20, 25000),
  ('l-001-2', 'jo-001', 'Rudi Hartono', 'Jahit',     30, 22000),
  ('l-001-3', 'jo-001', 'Siti Aminah',  'Finishing', 10, 18000),

  ('l-002-1', 'jo-002', 'Andi Saputra', 'Sablon',          45, 25000),
  ('l-002-2', 'jo-002', 'Rudi Hartono', 'Jahit',           60, 22000),
  ('l-002-3', 'jo-002', 'Dewi Lestari', 'Finishing',       25, 18000),
  ('l-002-4', 'jo-002', 'Joko Widodo',  'Quality Control', 15, 20000),

  ('l-003-1', 'jo-003', 'Andi Saputra', 'Sablon',    25, 25000),
  ('l-003-2', 'jo-003', 'Rudi Hartono', 'Jahit',     35, 22000),
  ('l-003-3', 'jo-003', 'Siti Aminah',  'Finishing', 15, 18000),

  ('l-004-1', 'jo-004', 'Joko Widodo',  'Sublim', 15, 28000),
  ('l-004-2', 'jo-004', 'Dewi Lestari', 'Jahit',  20, 22000),

  ('l-005-1', 'jo-005', 'Andi Saputra', 'Sablon',    12, 25000),
  ('l-005-2', 'jo-005', 'Rudi Hartono', 'Jahit',     18, 22000),
  ('l-005-3', 'jo-005', 'Siti Aminah',  'Finishing',  6, 18000);

-- ============================================================
-- OVERHEADS
-- ============================================================
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-001-1', 'jo-001', 'Listrik Produksi',        350000),
  ('o-001-2', 'jo-001', 'Penyusutan Mesin Sablon', 280000),
  ('o-001-3', 'jo-001', 'Maintenance Mesin Jahit', 120000),

  ('o-002-1', 'jo-002', 'Listrik Produksi',        850000),
  ('o-002-2', 'jo-002', 'Penyusutan Mesin Sablon', 420000),
  ('o-002-3', 'jo-002', 'Maintenance Mesin Jahit', 200000),
  ('o-002-4', 'jo-002', 'Sewa Workshop',           500000),

  ('o-003-1', 'jo-003', 'Listrik Produksi',        450000),
  ('o-003-2', 'jo-003', 'Penyusutan Mesin Sablon', 300000),
  ('o-003-3', 'jo-003', 'Maintenance Mesin Jahit', 150000),

  ('o-004-1', 'jo-004', 'Listrik Produksi',        300000),
  ('o-004-2', 'jo-004', 'Penyusutan Mesin Sublim', 350000),

  ('o-005-1', 'jo-005', 'Listrik Produksi',        220000),
  ('o-005-2', 'jo-005', 'Penyusutan Mesin Sablon', 180000),
  ('o-005-3', 'jo-005', 'Maintenance Mesin Jahit',  80000);
