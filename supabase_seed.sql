-- ============================================================
-- SEED DATA LENGKAP - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- 12 Job Order realistis | Oktober - Desember 2026
-- Jalankan di Supabase SQL Editor (hapus data lama dulu)
-- ============================================================

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
  ('jo-004', 'JO-2026-004', 'Komunitas Lari Semarang',   'Kaos Event Half Marathon',            120, '2026-10-15', 'Selesai',   88000),
  ('jo-005', 'JO-2026-005', 'CV Berkah Jaya',            'Seragam Karyawan Polo Shirt',          75, '2026-10-20', 'Selesai',  125000),
  ('jo-006', 'JO-2026-006', 'Universitas Diponegoro',    'Kaos KKN Periode 2026',               350, '2026-11-01', 'Selesai',   72000),
  ('jo-007', 'JO-2026-007', 'OSIS SMP Negeri 7 Solo',   'Kaos Pensi & Perpisahan',             150, '2026-11-08', 'Selesai',   85000),
  ('jo-008', 'JO-2026-008', 'PT Astra Motor Jateng',    'Kaos Seragam Mekanik',                 60, '2026-11-15', 'Produksi', 145000),
  ('jo-009', 'JO-2026-009', 'Warung Nasi Bu Sari',      'Kaos Seragam Pelayan',                 25, '2026-11-20', 'Produksi',  98000),
  ('jo-010', 'JO-2026-010', 'Tim Basket Undip',         'Jersey Basket Sublim Full Print',       40, '2026-11-25', 'Produksi', 175000),
  ('jo-011', 'JO-2026-011', 'Dinas Pemuda Kota Semarang','Kaos Hari Sumpah Pemuda',             500, '2026-12-01', 'Draft',     68000),
  ('jo-012', 'JO-2026-012', 'Klinik Sehat Bersama',     'Seragam Tenaga Medis',                 45, '2026-12-05', 'Draft',    135000);

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
