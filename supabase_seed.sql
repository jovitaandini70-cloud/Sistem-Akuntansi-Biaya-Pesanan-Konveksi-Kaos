-- ============================================================
-- SEED DATA LENGKAP - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- 12 Job Order realistis | Oktober - Desember 2026
-- Jalankan di Supabase SQL Editor (hapus data lama dulu)
-- ============================================================

DELETE FROM produksi_tahapan;
DELETE FROM produksi;
DELETE FROM payments;
DELETE FROM overheads;
DELETE FROM labors;
DELETE FROM materials;
DELETE FROM job_orders;

-- ============================================================
-- JOB ORDERS
-- harga_jual = harga per pcs
-- ============================================================
INSERT INTO job_orders (id, nomor, pelanggan, produk, jumlah, tanggal, status, harga_jual) VALUES
  ('jo-001', 'JO-2026-001', 'PT Garuda Sport',           'Kaos Jersey Futsal Lengan Pendek',    100, '2026-10-02', 'Selesai',   95000),
  ('jo-002', 'JO-2026-002', 'Kopi Kenangan Manis',       'Kaos Promo Grand Opening',            250, '2026-10-05', 'Selesai',   78000),
  ('jo-003', 'JO-2026-003', 'SMA Negeri 3 Semarang',     'Kaos Angkatan 2026',                  180, '2026-10-10', 'Selesai',   82000),
  ('jo-004', 'JO-2026-004', 'Komunitas Lari Semarang',   'Kaos Event Half Marathon',            120, '2026-10-15', 'Selesai',   95000),
  ('jo-005', 'JO-2026-005', 'CV Berkah Jaya',            'Seragam Karyawan Polo Shirt',          75, '2026-10-20', 'Selesai',  145000),
  ('jo-006', 'JO-2026-006', 'Universitas Diponegoro',    'Kaos KKN Periode 2026',               350, '2026-11-01', 'Selesai',   80000),
  ('jo-007', 'JO-2026-007', 'OSIS SMP Negeri 7 Solo',   'Kaos Pensi & Perpisahan',             150, '2026-11-08', 'Selesai',   85000),
  ('jo-008', 'JO-2026-008', 'PT Astra Motor Jateng',    'Kaos Seragam Mekanik',                 60, '2026-11-15', 'Produksi', 145000),
  ('jo-009', 'JO-2026-009', 'Warung Nasi Bu Sari',      'Kaos Seragam Pelayan',                 25, '2026-11-20', 'Produksi',  98000),
  ('jo-010', 'JO-2026-010', 'Tim Basket Undip',         'Jersey Basket Sublim Full Print',       40, '2026-11-25', 'Produksi', 175000),
  ('jo-011', 'JO-2026-011', 'Dinas Pemuda Kota Semarang','Kaos Hari Sumpah Pemuda',             500, '2026-12-01', 'Draft',     68000),
  ('jo-012', 'JO-2026-012', 'Klinik Sehat Bersama',     'Seragam Tenaga Medis',                 45, '2026-12-05', 'Draft',    185000);

-- ============================================================
-- MATERIALS
-- ============================================================

-- JO-001: Kaos Jersey Futsal (100 pcs) | Cotton PE 20s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-001-1', 'jo-001', 'KBL-005', 'Kain Cotton PE 20s',         'meter',  26000, 450, 140),
  ('m-001-2', 'jo-001', 'TKN-002', 'Tinta Sablon Plastisol',     'kg',     85000,  20,   4),
  ('m-001-3', 'jo-001', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,   8),
  ('m-001-4', 'jo-001', 'AKS-001', 'Label Baju Woven',           'pcs',      800, 500, 105),
  ('m-001-5', 'jo-001', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500, 105);

-- JO-002: Kaos Promo Grand Opening (250 pcs) | Cotton Combed 24s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-002-1', 'jo-002', 'KBL-002', 'Kain Cotton Combed 24s',     'meter',  32000, 600, 340),
  ('m-002-2', 'jo-002', 'TKN-005', 'Tinta Sablon Waterbase',     'kg',     78000,  15,   7),
  ('m-002-3', 'jo-002', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,  14),
  ('m-002-4', 'jo-002', 'AKS-001', 'Label Baju Woven',           'pcs',      800, 500, 255),
  ('m-002-5', 'jo-002', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500, 255);

-- JO-003: Kaos Angkatan SMA (180 pcs) | Cotton Combed 30s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-003-1', 'jo-003', 'KBL-001', 'Kain Cotton Combed 30s',     'meter',  28000, 500, 245),
  ('m-003-2', 'jo-003', 'TKN-002', 'Tinta Sablon Plastisol',     'kg',     85000,  20,   6),
  ('m-003-3', 'jo-003', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,  10),
  ('m-003-4', 'jo-003', 'AKS-002', 'Label Sablon Nama',          'pcs',      300, 800, 185),
  ('m-003-5', 'jo-003', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500, 185);

-- JO-004: Kaos Half Marathon (120 pcs) | Dryfit Polyester
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-004-1', 'jo-004', 'KBL-003', 'Kain Dryfit Polyester',      'meter',  35000, 300, 165),
  ('m-004-2', 'jo-004', 'TKN-006', 'Tinta Sublim',               'liter', 110000,  10,   6),
  ('m-004-3', 'jo-004', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,   8),
  ('m-004-4', 'jo-004', 'AKS-003', 'Nomor Dada BIB',             'pcs',    2500, 200, 125),
  ('m-004-5', 'jo-004', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500, 125);

-- JO-005: Polo Shirt Seragam (75 pcs) | Lacoste PE
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-005-1', 'jo-005', 'KBL-006', 'Kain Lacoste PE',            'meter',  42000, 200, 112),
  ('m-005-2', 'jo-005', 'TKN-007', 'Bordir Logo Komputer',       'pcs',    18000, 200,  80),
  ('m-005-3', 'jo-005', 'BNG-001', 'Benang Bordir Warna',        'gulung', 15000,  30,   8),
  ('m-005-4', 'jo-005', 'AKS-004', 'Kancing Polo 3 Biji/set',   'set',    1500, 200,  80),
  ('m-005-5', 'jo-005', 'PKG-005', 'Karton Box Packaging',       'pcs',    3500, 200,  78);

-- JO-006: Kaos KKN Undip (350 pcs) | Cotton Combed 24s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-006-1', 'jo-006', 'KBL-002', 'Kain Cotton Combed 24s',     'meter',  32000, 800, 475),
  ('m-006-2', 'jo-006', 'TKN-005', 'Tinta Sablon Waterbase',     'kg',     78000,  15,  10),
  ('m-006-3', 'jo-006', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  80,  20),
  ('m-006-4', 'jo-006', 'AKS-001', 'Label Baju Woven',           'pcs',      800,1000, 360),
  ('m-006-5', 'jo-006', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,2000, 360);

-- JO-007: Kaos Pensi SMP (150 pcs) | Cotton Combed 30s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-007-1', 'jo-007', 'KBL-001', 'Kain Cotton Combed 30s',     'meter',  28000, 500, 205),
  ('m-007-2', 'jo-007', 'TKN-002', 'Tinta Sablon Plastisol',     'kg',     85000,  20,   5),
  ('m-007-3', 'jo-007', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,   9),
  ('m-007-4', 'jo-007', 'AKS-002', 'Label Sablon Nama',          'pcs',      300, 800, 155),
  ('m-007-5', 'jo-007', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500, 155);

-- JO-008: Seragam Mekanik Astra (60 pcs) | Drill Cotton
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-008-1', 'jo-008', 'KBL-007', 'Kain Drill Cotton',          'meter',  38000, 200,  95),
  ('m-008-2', 'jo-008', 'TKN-007', 'Bordir Logo Komputer',       'pcs',    18000, 200,  65),
  ('m-008-3', 'jo-008', 'BNG-001', 'Benang Bordir Warna',        'gulung', 15000,  30,   6),
  ('m-008-4', 'jo-008', 'AKS-005', 'Kancing Kemeja',             'pcs',      500, 500, 130),
  ('m-008-5', 'jo-008', 'PKG-005', 'Karton Box Packaging',       'pcs',    3500, 200,  63);

-- JO-009: Seragam Pelayan Warung (25 pcs) | Cotton Combed 30s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-009-1', 'jo-009', 'KBL-001', 'Kain Cotton Combed 30s',     'meter',  28000, 500,  35),
  ('m-009-2', 'jo-009', 'TKN-002', 'Tinta Sablon Plastisol',     'kg',     85000,  20,   2),
  ('m-009-3', 'jo-009', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,   3),
  ('m-009-4', 'jo-009', 'AKS-001', 'Label Baju Woven',           'pcs',      800, 500,  28),
  ('m-009-5', 'jo-009', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,1500,  28);

-- JO-010: Jersey Basket Sublim (40 pcs) | Dryfit Premium
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-010-1', 'jo-010', 'KBL-008', 'Kain Dryfit Premium',        'meter',  48000, 150,  62),
  ('m-010-2', 'jo-010', 'TKN-006', 'Tinta Sublim',               'liter', 110000,  10,   5),
  ('m-010-3', 'jo-010', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000,  60,   4),
  ('m-010-4', 'jo-010', 'AKS-006', 'Nomor Punggung Transfer',    'pcs',    3500, 100,  42),
  ('m-010-5', 'jo-010', 'PKG-005', 'Karton Box Packaging',       'pcs',    3500, 200,  42);

-- JO-011: Kaos Sumpah Pemuda (500 pcs) | Cotton Combed 20s
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-011-1', 'jo-011', 'KBL-009', 'Kain Cotton Combed 20s',     'meter',  24000,1200, 670),
  ('m-011-2', 'jo-011', 'TKN-008', 'Tinta Sablon Rubber',        'kg',     72000,  25,  14),
  ('m-011-3', 'jo-011', 'BNG-003', 'Benang Jahit Polyester',     'gulung', 12000, 100,  28),
  ('m-011-4', 'jo-011', 'AKS-001', 'Label Baju Woven',           'pcs',      800,2000, 510),
  ('m-011-5', 'jo-011', 'PKG-004', 'Plastik OPP Packaging',      'pcs',      500,3000, 510);

-- JO-012: Seragam Tenaga Medis (45 pcs) | Katun Ripstop
INSERT INTO materials (id, job_order_id, kode, nama, satuan, harga, stok, qty_used) VALUES
  ('m-012-1', 'jo-012', 'KBL-010', 'Kain Katun Ripstop',         'meter',  55000, 150,  72),
  ('m-012-2', 'jo-012', 'TKN-007', 'Bordir Logo Komputer',       'pcs',    18000, 200,  50),
  ('m-012-3', 'jo-012', 'BNG-001', 'Benang Bordir Warna',        'gulung', 15000,  30,   5),
  ('m-012-4', 'jo-012', 'AKS-007', 'Kancing Tanam/Snap Button',  'pcs',    1200, 300, 100),
  ('m-012-5', 'jo-012', 'PKG-005', 'Karton Box Packaging',       'pcs',    3500, 200,  48);

-- ============================================================
-- LABORS (Tenaga Kerja)
-- ============================================================

-- JO-001
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-001-1', 'jo-001', 'Andi Saputra',   'Sablon',          30, 25000),
  ('l-001-2', 'jo-001', 'Rudi Hartono',   'Jahit',           45, 22000),
  ('l-001-3', 'jo-001', 'Siti Aminah',    'Finishing',       15, 18000),
  ('l-001-4', 'jo-001', 'Joko Widodo',    'Quality Control', 10, 20000);

-- JO-002
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-002-1', 'jo-002', 'Andi Saputra',   'Sablon',          55, 25000),
  ('l-002-2', 'jo-002', 'Rudi Hartono',   'Jahit',           75, 22000),
  ('l-002-3', 'jo-002', 'Dewi Lestari',   'Finishing',       28, 18000),
  ('l-002-4', 'jo-002', 'Joko Widodo',    'Quality Control', 18, 20000);

-- JO-003
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-003-1', 'jo-003', 'Andi Saputra',   'Sablon',          40, 25000),
  ('l-003-2', 'jo-003', 'Rudi Hartono',   'Jahit',           55, 22000),
  ('l-003-3', 'jo-003', 'Siti Aminah',    'Finishing',       20, 18000),
  ('l-003-4', 'jo-003', 'Joko Widodo',    'Quality Control', 12, 20000);

-- JO-004
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-004-1', 'jo-004', 'Budi Santoso',   'Sublim',          35, 28000),
  ('l-004-2', 'jo-004', 'Rudi Hartono',   'Jahit',           40, 22000),
  ('l-004-3', 'jo-004', 'Siti Aminah',    'Finishing',       18, 18000),
  ('l-004-4', 'jo-004', 'Joko Widodo',    'Quality Control',  8, 20000);

-- JO-005
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-005-1', 'jo-005', 'Dewi Lestari',   'Bordir',          40, 28000),
  ('l-005-2', 'jo-005', 'Rudi Hartono',   'Jahit',           35, 22000),
  ('l-005-3', 'jo-005', 'Siti Aminah',    'Finishing',       15, 18000),
  ('l-005-4', 'jo-005', 'Joko Widodo',    'Quality Control',  8, 20000);

-- JO-006
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-006-1', 'jo-006', 'Andi Saputra',   'Sablon',          75, 25000),
  ('l-006-2', 'jo-006', 'Rudi Hartono',   'Jahit',          100, 22000),
  ('l-006-3', 'jo-006', 'Dewi Lestari',   'Finishing',       45, 18000),
  ('l-006-4', 'jo-006', 'Joko Widodo',    'Quality Control', 25, 20000);

-- JO-007
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-007-1', 'jo-007', 'Andi Saputra',   'Sablon',          35, 25000),
  ('l-007-2', 'jo-007', 'Rudi Hartono',   'Jahit',           48, 22000),
  ('l-007-3', 'jo-007', 'Siti Aminah',    'Finishing',       18, 18000),
  ('l-007-4', 'jo-007', 'Joko Widodo',    'Quality Control', 10, 20000);

-- JO-008
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-008-1', 'jo-008', 'Dewi Lestari',   'Bordir',          30, 28000),
  ('l-008-2', 'jo-008', 'Rudi Hartono',   'Jahit',           30, 22000),
  ('l-008-3', 'jo-008', 'Siti Aminah',    'Finishing',       12, 18000),
  ('l-008-4', 'jo-008', 'Joko Widodo',    'Quality Control',  8, 20000);

-- JO-009
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-009-1', 'jo-009', 'Andi Saputra',   'Sablon',          10, 25000),
  ('l-009-2', 'jo-009', 'Rudi Hartono',   'Jahit',           15, 22000),
  ('l-009-3', 'jo-009', 'Siti Aminah',    'Finishing',        6, 18000);

-- JO-010
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-010-1', 'jo-010', 'Budi Santoso',   'Sublim',          22, 28000),
  ('l-010-2', 'jo-010', 'Rudi Hartono',   'Jahit',           22, 22000),
  ('l-010-3', 'jo-010', 'Siti Aminah',    'Finishing',        8, 18000),
  ('l-010-4', 'jo-010', 'Joko Widodo',    'Quality Control',  5, 20000);

-- JO-011
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-011-1', 'jo-011', 'Andi Saputra',   'Sablon',         110, 25000),
  ('l-011-2', 'jo-011', 'Rudi Hartono',   'Jahit',          140, 22000),
  ('l-011-3', 'jo-011', 'Dewi Lestari',   'Finishing',       60, 18000),
  ('l-011-4', 'jo-011', 'Joko Widodo',    'Quality Control', 30, 20000);

-- JO-012
INSERT INTO labors (id, job_order_id, nama, jenis_pekerjaan, jam_kerja, tarif_per_jam) VALUES
  ('l-012-1', 'jo-012', 'Dewi Lestari',   'Bordir',          25, 28000),
  ('l-012-2', 'jo-012', 'Rudi Hartono',   'Jahit',           25, 22000),
  ('l-012-3', 'jo-012', 'Siti Aminah',    'Finishing',       10, 18000),
  ('l-012-4', 'jo-012', 'Joko Widodo',    'Quality Control',  6, 20000);

-- ============================================================
-- OVERHEADS (Biaya Overhead Pabrik)
-- ============================================================

-- JO-001
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-001-1', 'jo-001', 'Listrik Produksi',           420000),
  ('o-001-2', 'jo-001', 'Penyusutan Mesin Sablon',    350000),
  ('o-001-3', 'jo-001', 'Penyusutan Mesin Jahit',     180000),
  ('o-001-4', 'jo-001', 'Biaya Air & Kebersihan',      75000);

-- JO-002
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-002-1', 'jo-002', 'Listrik Produksi',           950000),
  ('o-002-2', 'jo-002', 'Penyusutan Mesin Sablon',    520000),
  ('o-002-3', 'jo-002', 'Penyusutan Mesin Jahit',     280000),
  ('o-002-4', 'jo-002', 'Sewa Workshop',              600000),
  ('o-002-5', 'jo-002', 'Biaya Air & Kebersihan',     120000);

-- JO-003
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-003-1', 'jo-003', 'Listrik Produksi',           680000),
  ('o-003-2', 'jo-003', 'Penyusutan Mesin Sablon',    380000),
  ('o-003-3', 'jo-003', 'Penyusutan Mesin Jahit',     220000),
  ('o-003-4', 'jo-003', 'Biaya Air & Kebersihan',      90000);

-- JO-004
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-004-1', 'jo-004', 'Listrik Produksi',           520000),
  ('o-004-2', 'jo-004', 'Penyusutan Mesin Sublim',    480000),
  ('o-004-3', 'jo-004', 'Penyusutan Mesin Jahit',     160000),
  ('o-004-4', 'jo-004', 'Biaya Air & Kebersihan',      80000);

-- JO-005
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-005-1', 'jo-005', 'Listrik Produksi',           360000),
  ('o-005-2', 'jo-005', 'Penyusutan Mesin Bordir',    420000),
  ('o-005-3', 'jo-005', 'Penyusutan Mesin Jahit',     140000),
  ('o-005-4', 'jo-005', 'Biaya Air & Kebersihan',      60000);

-- JO-006
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-006-1', 'jo-006', 'Listrik Produksi',          1350000),
  ('o-006-2', 'jo-006', 'Penyusutan Mesin Sablon',    720000),
  ('o-006-3', 'jo-006', 'Penyusutan Mesin Jahit',     380000),
  ('o-006-4', 'jo-006', 'Sewa Workshop',              800000),
  ('o-006-5', 'jo-006', 'Biaya Air & Kebersihan',     175000);

-- JO-007
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-007-1', 'jo-007', 'Listrik Produksi',           560000),
  ('o-007-2', 'jo-007', 'Penyusutan Mesin Sablon',    320000),
  ('o-007-3', 'jo-007', 'Penyusutan Mesin Jahit',     190000),
  ('o-007-4', 'jo-007', 'Biaya Air & Kebersihan',      85000);

-- JO-008
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-008-1', 'jo-008', 'Listrik Produksi',           340000),
  ('o-008-2', 'jo-008', 'Penyusutan Mesin Bordir',    380000),
  ('o-008-3', 'jo-008', 'Penyusutan Mesin Jahit',     150000),
  ('o-008-4', 'jo-008', 'Biaya Air & Kebersihan',      55000);

-- JO-009
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-009-1', 'jo-009', 'Listrik Produksi',           180000),
  ('o-009-2', 'jo-009', 'Penyusutan Mesin Sablon',    120000),
  ('o-009-3', 'jo-009', 'Penyusutan Mesin Jahit',      85000),
  ('o-009-4', 'jo-009', 'Biaya Air & Kebersihan',      35000);

-- JO-010
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-010-1', 'jo-010', 'Listrik Produksi',           280000),
  ('o-010-2', 'jo-010', 'Penyusutan Mesin Sublim',    350000),
  ('o-010-3', 'jo-010', 'Penyusutan Mesin Jahit',     120000),
  ('o-010-4', 'jo-010', 'Biaya Air & Kebersihan',      50000);

-- JO-011
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-011-1', 'jo-011', 'Listrik Produksi',          1850000),
  ('o-011-2', 'jo-011', 'Penyusutan Mesin Sablon',    980000),
  ('o-011-3', 'jo-011', 'Penyusutan Mesin Jahit',     520000),
  ('o-011-4', 'jo-011', 'Sewa Workshop',             1200000),
  ('o-011-5', 'jo-011', 'Biaya Air & Kebersihan',     250000);

-- JO-012
INSERT INTO overheads (id, job_order_id, nama, biaya) VALUES
  ('o-012-1', 'jo-012', 'Listrik Produksi',           260000),
  ('o-012-2', 'jo-012', 'Penyusutan Mesin Bordir',    310000),
  ('o-012-3', 'jo-012', 'Penyusutan Mesin Jahit',     130000),
  ('o-012-4', 'jo-012', 'Biaya Air & Kebersihan',      45000);


-- ============================================================
-- PAYMENTS (Pembayaran)
-- harga_jual × jumlah = total tagihan
-- ============================================================

-- JO-001: tagihan 9.500.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-001-1', 'jo-001', '2026-10-02', 4000000, 'Tunai',    'DP 50% saat order'),
  ('pay-001-2', 'jo-001', '2026-10-10', 5500000, 'Transfer', 'Pelunasan sebelum kirim');

-- JO-002: tagihan 19.500.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-002-1', 'jo-002', '2026-10-05', 8000000,  'Transfer', 'DP setelah konfirmasi desain'),
  ('pay-002-2', 'jo-002', '2026-10-13', 11500000, 'Transfer', 'Pelunasan');

-- JO-003: tagihan 14.760.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-003-1', 'jo-003', '2026-10-10', 5000000,  'Tunai',    'DP dari bendahara OSIS'),
  ('pay-003-2', 'jo-003', '2026-10-18', 9760000,  'Transfer', 'Pelunasan transfer bank');

-- JO-004: tagihan 11.400.000 (120 × 95.000) — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-004-1', 'jo-004', '2026-10-15', 4000000,  'Transfer', 'DP pendaftaran event'),
  ('pay-004-2', 'jo-004', '2026-10-22', 7400000,  'Tunai',    'Pelunasan cash');

-- JO-005: tagihan 10.875.000 (75 × 145.000) — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-005-1', 'jo-005', '2026-10-20', 3500000,  'Tunai',    'DP 30%'),
  ('pay-005-2', 'jo-005', '2026-10-27', 7375000,  'Transfer', 'Pelunasan');

-- JO-006: tagihan 28.000.000 (350 × 80.000) — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-006-1', 'jo-006', '2026-11-01', 10000000, 'Transfer', 'DP KKN Undip'),
  ('pay-006-2', 'jo-006', '2026-11-10', 18000000, 'Transfer', 'Pelunasan');

-- JO-007: tagihan 12.750.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-007-1', 'jo-007', '2026-11-08', 5000000,  'Tunai',    'DP dari kas OSIS'),
  ('pay-007-2', 'jo-007', '2026-11-15', 7750000,  'Transfer', 'Pelunasan');

-- JO-008: tagihan 8.700.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-008-1', 'jo-008', '2026-11-15', 4000000,  'Transfer', 'DP 50%'),
  ('pay-008-2', 'jo-008', '2026-11-22', 4700000,  'Transfer', 'Pelunasan');

-- JO-009: tagihan 2.450.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-009-1', 'jo-009', '2026-11-20', 2450000,  'Tunai',    'Pembayaran lunas');

-- JO-010: tagihan 7.000.000 — Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-010-1', 'jo-010', '2026-11-25', 3500000,  'Transfer', 'DP 50%'),
  ('pay-010-2', 'jo-010', '2026-11-28', 3500000,  'Cicilan',  'Pelunasan cicilan');

-- JO-011: tagihan 34.000.000 — Sebagian (DP saja)
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan) VALUES
  ('pay-011-1', 'jo-011', '2026-12-01', 10000000, 'Transfer', 'DP 30%');

-- JO-012: tagihan 8.325.000 (45 × 185.000) — Belum Bayar
-- (tidak ada pembayaran)

-- ============================================================
-- PRODUKSI (Proses Produksi — satu record per pesanan)
-- ============================================================

-- JO-001 hingga JO-007 (Selesai): produksi selesai
INSERT INTO produksi (id, job_order_id, tanggal_mulai, estimasi_selesai, tanggal_selesai, catatan) VALUES
  ('prd-001', 'jo-001', '2026-10-03', '2026-10-12', '2026-10-11', 'Produksi lancar, QC lolos semua'),
  ('prd-002', 'jo-002', '2026-10-06', '2026-10-18', '2026-10-17', 'Selesai lebih cepat dari estimasi'),
  ('prd-003', 'jo-003', '2026-10-11', '2026-10-22', '2026-10-22', 'Tepat waktu'),
  ('prd-004', 'jo-004', '2026-10-16', '2026-10-26', '2026-10-25', 'Sublim berkualitas tinggi'),
  ('prd-005', 'jo-005', '2026-10-21', '2026-10-31', '2026-10-30', 'Bordir rapi, pelanggan puas'),
  ('prd-006', 'jo-006', '2026-11-02', '2026-11-15', '2026-11-14', 'Volume besar, tim tambahan'),
  ('prd-007', 'jo-007', '2026-11-09', '2026-11-19', '2026-11-19', 'Tepat waktu');

-- JO-008 hingga JO-010 (Produksi): produksi dalam proses
INSERT INTO produksi (id, job_order_id, tanggal_mulai, estimasi_selesai, tanggal_selesai, catatan) VALUES
  ('prd-008', 'jo-008', '2026-11-16', '2026-11-28', NULL, 'Sedang tahap bordir logo'),
  ('prd-009', 'jo-009', '2026-11-21', '2026-11-28', NULL, 'Pesanan kecil, hampir selesai'),
  ('prd-010', 'jo-010', '2026-11-26', '2026-12-05', NULL, 'Sublim full print sedang proses');

-- JO-011 & JO-012 (Draft): belum ada produksi
-- (tidak ada record produksi)

-- ============================================================
-- PRODUKSI_TAHAPAN (Tahapan Produksi)
-- 5 tahapan standar: Pemotongan, Penjahitan, Sablon/Bordir, Finishing QC, Packaging
-- ============================================================

-- JO-001 (Selesai — semua tahapan selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-001-1', 'jo-001', 'Pemotongan Pola', 1, 'Selesai', '2026-10-03', '2026-10-04', ''),
  ('pt-001-2', 'jo-001', 'Penjahitan',      2, 'Selesai', '2026-10-04', '2026-10-08', ''),
  ('pt-001-3', 'jo-001', 'Sablon',          3, 'Selesai', '2026-10-08', '2026-10-10', ''),
  ('pt-001-4', 'jo-001', 'Finishing & QC',  4, 'Selesai', '2026-10-10', '2026-10-11', ''),
  ('pt-001-5', 'jo-001', 'Packaging',       5, 'Selesai', '2026-10-11', '2026-10-11', '');

-- JO-002 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-002-1', 'jo-002', 'Pemotongan Pola', 1, 'Selesai', '2026-10-06', '2026-10-07', ''),
  ('pt-002-2', 'jo-002', 'Penjahitan',      2, 'Selesai', '2026-10-07', '2026-10-13', ''),
  ('pt-002-3', 'jo-002', 'Sablon',          3, 'Selesai', '2026-10-13', '2026-10-16', ''),
  ('pt-002-4', 'jo-002', 'Finishing & QC',  4, 'Selesai', '2026-10-16', '2026-10-17', ''),
  ('pt-002-5', 'jo-002', 'Packaging',       5, 'Selesai', '2026-10-17', '2026-10-17', '');

-- JO-003 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-003-1', 'jo-003', 'Pemotongan Pola', 1, 'Selesai', '2026-10-11', '2026-10-12', ''),
  ('pt-003-2', 'jo-003', 'Penjahitan',      2, 'Selesai', '2026-10-12', '2026-10-18', ''),
  ('pt-003-3', 'jo-003', 'Sablon',          3, 'Selesai', '2026-10-18', '2026-10-21', ''),
  ('pt-003-4', 'jo-003', 'Finishing & QC',  4, 'Selesai', '2026-10-21', '2026-10-22', ''),
  ('pt-003-5', 'jo-003', 'Packaging',       5, 'Selesai', '2026-10-22', '2026-10-22', '');

-- JO-004 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-004-1', 'jo-004', 'Pemotongan Pola', 1, 'Selesai', '2026-10-16', '2026-10-17', ''),
  ('pt-004-2', 'jo-004', 'Penjahitan',      2, 'Selesai', '2026-10-17', '2026-10-22', ''),
  ('pt-004-3', 'jo-004', 'Sublim',          3, 'Selesai', '2026-10-22', '2026-10-24', ''),
  ('pt-004-4', 'jo-004', 'Finishing & QC',  4, 'Selesai', '2026-10-24', '2026-10-25', ''),
  ('pt-004-5', 'jo-004', 'Packaging',       5, 'Selesai', '2026-10-25', '2026-10-25', '');

-- JO-005 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-005-1', 'jo-005', 'Pemotongan Pola', 1, 'Selesai', '2026-10-21', '2026-10-22', ''),
  ('pt-005-2', 'jo-005', 'Penjahitan',      2, 'Selesai', '2026-10-22', '2026-10-27', ''),
  ('pt-005-3', 'jo-005', 'Bordir',          3, 'Selesai', '2026-10-27', '2026-10-29', ''),
  ('pt-005-4', 'jo-005', 'Finishing & QC',  4, 'Selesai', '2026-10-29', '2026-10-30', ''),
  ('pt-005-5', 'jo-005', 'Packaging',       5, 'Selesai', '2026-10-30', '2026-10-30', '');

-- JO-006 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-006-1', 'jo-006', 'Pemotongan Pola', 1, 'Selesai', '2026-11-02', '2026-11-04', ''),
  ('pt-006-2', 'jo-006', 'Penjahitan',      2, 'Selesai', '2026-11-04', '2026-11-11', ''),
  ('pt-006-3', 'jo-006', 'Sablon',          3, 'Selesai', '2026-11-11', '2026-11-13', ''),
  ('pt-006-4', 'jo-006', 'Finishing & QC',  4, 'Selesai', '2026-11-13', '2026-11-14', ''),
  ('pt-006-5', 'jo-006', 'Packaging',       5, 'Selesai', '2026-11-14', '2026-11-14', '');

-- JO-007 (Selesai)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-007-1', 'jo-007', 'Pemotongan Pola', 1, 'Selesai', '2026-11-09', '2026-11-10', ''),
  ('pt-007-2', 'jo-007', 'Penjahitan',      2, 'Selesai', '2026-11-10', '2026-11-15', ''),
  ('pt-007-3', 'jo-007', 'Sablon',          3, 'Selesai', '2026-11-15', '2026-11-18', ''),
  ('pt-007-4', 'jo-007', 'Finishing & QC',  4, 'Selesai', '2026-11-18', '2026-11-19', ''),
  ('pt-007-5', 'jo-007', 'Packaging',       5, 'Selesai', '2026-11-19', '2026-11-19', '');

-- JO-008 (Produksi — tahap bordir sedang proses)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-008-1', 'jo-008', 'Pemotongan Pola', 1, 'Selesai', '2026-11-16', '2026-11-17', ''),
  ('pt-008-2', 'jo-008', 'Penjahitan',      2, 'Selesai', '2026-11-17', '2026-11-22', ''),
  ('pt-008-3', 'jo-008', 'Bordir',          3, 'Proses',  '2026-11-22', NULL,         'Logo Astra sedang dibordir'),
  ('pt-008-4', 'jo-008', 'Finishing & QC',  4, 'Belum',   NULL,         NULL,         ''),
  ('pt-008-5', 'jo-008', 'Packaging',       5, 'Belum',   NULL,         NULL,         '');

-- JO-009 (Produksi — hampir selesai, tahap finishing proses)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-009-1', 'jo-009', 'Pemotongan Pola', 1, 'Selesai', '2026-11-21', '2026-11-21', ''),
  ('pt-009-2', 'jo-009', 'Penjahitan',      2, 'Selesai', '2026-11-21', '2026-11-24', ''),
  ('pt-009-3', 'jo-009', 'Sablon',          3, 'Selesai', '2026-11-24', '2026-11-26', ''),
  ('pt-009-4', 'jo-009', 'Finishing & QC',  4, 'Proses',  '2026-11-26', NULL,         ''),
  ('pt-009-5', 'jo-009', 'Packaging',       5, 'Belum',   NULL,         NULL,         '');

-- JO-010 (Produksi — tahap awal, sublim sedang proses)
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan) VALUES
  ('pt-010-1', 'jo-010', 'Pemotongan Pola', 1, 'Selesai', '2026-11-26', '2026-11-27', ''),
  ('pt-010-2', 'jo-010', 'Sublim',          2, 'Proses',  '2026-11-27', NULL,         'Full print jersey basket'),
  ('pt-010-3', 'jo-010', 'Penjahitan',      3, 'Belum',   NULL,         NULL,         ''),
  ('pt-010-4', 'jo-010', 'Finishing & QC',  4, 'Belum',   NULL,         NULL,         ''),
  ('pt-010-5', 'jo-010', 'Packaging',       5, 'Belum',   NULL,         NULL,         '');

-- JO-011 & JO-012 (Draft): belum ada tahapan produksi
