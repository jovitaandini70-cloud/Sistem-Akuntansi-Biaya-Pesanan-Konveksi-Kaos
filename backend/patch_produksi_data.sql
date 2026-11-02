-- ============================================================
-- PATCH: Isi data produksi & tahapan untuk pesanan yang sudah ada
-- Jalankan di Supabase SQL Editor
-- Aman dijalankan berkali-kali (menggunakan INSERT ... ON CONFLICT DO NOTHING)
-- ============================================================

-- ============================================================
-- PRODUKSI (header) untuk pesanan Selesai (jo-001 s/d jo-007)
-- ============================================================
INSERT INTO produksi (id, job_order_id, tanggal_mulai, estimasi_selesai, tanggal_selesai, catatan)
VALUES
  ('prd-001', 'jo-001', '2026-10-03', '2026-10-12', '2026-10-11', 'Produksi lancar, QC lolos semua'),
  ('prd-002', 'jo-002', '2026-10-06', '2026-10-18', '2026-10-17', 'Selesai lebih cepat dari estimasi'),
  ('prd-003', 'jo-003', '2026-10-11', '2026-10-22', '2026-10-22', 'Tepat waktu'),
  ('prd-004', 'jo-004', '2026-10-16', '2026-10-26', '2026-10-25', 'Sublim berkualitas tinggi'),
  ('prd-005', 'jo-005', '2026-10-21', '2026-10-31', '2026-10-30', 'Bordir rapi, pelanggan puas'),
  ('prd-006', 'jo-006', '2026-11-02', '2026-11-15', '2026-11-14', 'Volume besar, tim tambahan'),
  ('prd-007', 'jo-007', '2026-11-09', '2026-11-19', '2026-11-19', 'Tepat waktu')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PRODUKSI (header) untuk pesanan Dalam Proses (jo-008 s/d jo-010)
-- ============================================================
INSERT INTO produksi (id, job_order_id, tanggal_mulai, estimasi_selesai, tanggal_selesai, catatan)
VALUES
  ('prd-008', 'jo-008', '2026-11-16', '2026-11-28', NULL, 'Sedang tahap bordir logo'),
  ('prd-009', 'jo-009', '2026-11-21', '2026-11-28', NULL, 'Pesanan kecil, hampir selesai'),
  ('prd-010', 'jo-010', '2026-11-26', '2026-12-05', NULL, 'Sublim full print sedang proses')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-001 (PT Garuda Sport) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-001-1', 'jo-001', 'Pemotongan Pola', 1, 'Selesai', '2026-10-03', '2026-10-04', ''),
  ('pt-001-2', 'jo-001', 'Penjahitan',      2, 'Selesai', '2026-10-04', '2026-10-08', ''),
  ('pt-001-3', 'jo-001', 'Sablon',          3, 'Selesai', '2026-10-08', '2026-10-10', ''),
  ('pt-001-4', 'jo-001', 'Finishing & QC',  4, 'Selesai', '2026-10-10', '2026-10-11', ''),
  ('pt-001-5', 'jo-001', 'Packaging',       5, 'Selesai', '2026-10-11', '2026-10-11', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-002 (Kopi Kenangan Manis) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-002-1', 'jo-002', 'Pemotongan Pola', 1, 'Selesai', '2026-10-06', '2026-10-07', ''),
  ('pt-002-2', 'jo-002', 'Penjahitan',      2, 'Selesai', '2026-10-07', '2026-10-13', ''),
  ('pt-002-3', 'jo-002', 'Sablon',          3, 'Selesai', '2026-10-13', '2026-10-16', ''),
  ('pt-002-4', 'jo-002', 'Finishing & QC',  4, 'Selesai', '2026-10-16', '2026-10-17', ''),
  ('pt-002-5', 'jo-002', 'Packaging',       5, 'Selesai', '2026-10-17', '2026-10-17', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-003 (SMA Negeri 3 Semarang) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-003-1', 'jo-003', 'Pemotongan Pola', 1, 'Selesai', '2026-10-11', '2026-10-12', ''),
  ('pt-003-2', 'jo-003', 'Penjahitan',      2, 'Selesai', '2026-10-12', '2026-10-18', ''),
  ('pt-003-3', 'jo-003', 'Sablon',          3, 'Selesai', '2026-10-18', '2026-10-21', ''),
  ('pt-003-4', 'jo-003', 'Finishing & QC',  4, 'Selesai', '2026-10-21', '2026-10-22', ''),
  ('pt-003-5', 'jo-003', 'Packaging',       5, 'Selesai', '2026-10-22', '2026-10-22', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-004 (Komunitas Lari Semarang) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-004-1', 'jo-004', 'Pemotongan Pola', 1, 'Selesai', '2026-10-16', '2026-10-17', ''),
  ('pt-004-2', 'jo-004', 'Penjahitan',      2, 'Selesai', '2026-10-17', '2026-10-22', ''),
  ('pt-004-3', 'jo-004', 'Sublim',          3, 'Selesai', '2026-10-22', '2026-10-24', ''),
  ('pt-004-4', 'jo-004', 'Finishing & QC',  4, 'Selesai', '2026-10-24', '2026-10-25', ''),
  ('pt-004-5', 'jo-004', 'Packaging',       5, 'Selesai', '2026-10-25', '2026-10-25', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-005 (CV Berkah Jaya) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-005-1', 'jo-005', 'Pemotongan Pola', 1, 'Selesai', '2026-10-21', '2026-10-22', ''),
  ('pt-005-2', 'jo-005', 'Penjahitan',      2, 'Selesai', '2026-10-22', '2026-10-27', ''),
  ('pt-005-3', 'jo-005', 'Bordir',          3, 'Selesai', '2026-10-27', '2026-10-29', ''),
  ('pt-005-4', 'jo-005', 'Finishing & QC',  4, 'Selesai', '2026-10-29', '2026-10-30', ''),
  ('pt-005-5', 'jo-005', 'Packaging',       5, 'Selesai', '2026-10-30', '2026-10-30', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-006 (Universitas Diponegoro) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-006-1', 'jo-006', 'Pemotongan Pola', 1, 'Selesai', '2026-11-02', '2026-11-04', ''),
  ('pt-006-2', 'jo-006', 'Penjahitan',      2, 'Selesai', '2026-11-04', '2026-11-11', ''),
  ('pt-006-3', 'jo-006', 'Sablon',          3, 'Selesai', '2026-11-11', '2026-11-13', ''),
  ('pt-006-4', 'jo-006', 'Finishing & QC',  4, 'Selesai', '2026-11-13', '2026-11-14', ''),
  ('pt-006-5', 'jo-006', 'Packaging',       5, 'Selesai', '2026-11-14', '2026-11-14', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-007 (OSIS SMP Negeri 7 Solo) — semua Selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-007-1', 'jo-007', 'Pemotongan Pola', 1, 'Selesai', '2026-11-09', '2026-11-10', ''),
  ('pt-007-2', 'jo-007', 'Penjahitan',      2, 'Selesai', '2026-11-10', '2026-11-15', ''),
  ('pt-007-3', 'jo-007', 'Sablon',          3, 'Selesai', '2026-11-15', '2026-11-18', ''),
  ('pt-007-4', 'jo-007', 'Finishing & QC',  4, 'Selesai', '2026-11-18', '2026-11-19', ''),
  ('pt-007-5', 'jo-007', 'Packaging',       5, 'Selesai', '2026-11-19', '2026-11-19', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-008 (PT Astra Motor) — bordir sedang proses
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-008-1', 'jo-008', 'Pemotongan Pola', 1, 'Selesai', '2026-11-16', '2026-11-17', ''),
  ('pt-008-2', 'jo-008', 'Penjahitan',      2, 'Selesai', '2026-11-17', '2026-11-22', ''),
  ('pt-008-3', 'jo-008', 'Bordir',          3, 'Proses',  '2026-11-22', NULL,         'Logo Astra sedang dibordir'),
  ('pt-008-4', 'jo-008', 'Finishing & QC',  4, 'Belum',   NULL,         NULL,         ''),
  ('pt-008-5', 'jo-008', 'Packaging',       5, 'Belum',   NULL,         NULL,         '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-009 (Warung Nasi Bu Sari) — hampir selesai
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-009-1', 'jo-009', 'Pemotongan Pola', 1, 'Selesai', '2026-11-21', '2026-11-21', ''),
  ('pt-009-2', 'jo-009', 'Penjahitan',      2, 'Selesai', '2026-11-21', '2026-11-24', ''),
  ('pt-009-3', 'jo-009', 'Sablon',          3, 'Selesai', '2026-11-24', '2026-11-26', ''),
  ('pt-009-4', 'jo-009', 'Finishing & QC',  4, 'Proses',  '2026-11-26', NULL,         ''),
  ('pt-009-5', 'jo-009', 'Packaging',       5, 'Belum',   NULL,         NULL,         '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TAHAPAN untuk JO-010 (Tim Basket Undip) — sublim sedang proses
-- ============================================================
INSERT INTO produksi_tahapan (id, job_order_id, nama_tahapan, urutan, status, tanggal_mulai, tanggal_selesai, catatan)
VALUES
  ('pt-010-1', 'jo-010', 'Pemotongan Pola', 1, 'Selesai', '2026-11-26', '2026-11-27', ''),
  ('pt-010-2', 'jo-010', 'Sublim',          2, 'Proses',  '2026-11-27', NULL,         'Full print jersey basket'),
  ('pt-010-3', 'jo-010', 'Penjahitan',      3, 'Belum',   NULL,         NULL,         ''),
  ('pt-010-4', 'jo-010', 'Finishing & QC',  4, 'Belum',   NULL,         NULL,         ''),
  ('pt-010-5', 'jo-010', 'Packaging',       5, 'Belum',   NULL,         NULL,         '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PAYMENTS untuk semua pesanan (jika belum ada)
-- ============================================================

-- JO-001: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-001-1', 'jo-001', '2026-10-02', 4000000,  'Tunai',    'DP 50% saat order'),
  ('pay-001-2', 'jo-001', '2026-10-10', 5500000,  'Transfer', 'Pelunasan sebelum kirim')
ON CONFLICT (id) DO NOTHING;

-- JO-002: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-002-1', 'jo-002', '2026-10-05', 8000000,  'Transfer', 'DP setelah konfirmasi desain'),
  ('pay-002-2', 'jo-002', '2026-10-13', 11500000, 'Transfer', 'Pelunasan')
ON CONFLICT (id) DO NOTHING;

-- JO-003: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-003-1', 'jo-003', '2026-10-10', 5000000,  'Tunai',    'DP dari bendahara OSIS'),
  ('pay-003-2', 'jo-003', '2026-10-18', 9760000,  'Transfer', 'Pelunasan transfer bank')
ON CONFLICT (id) DO NOTHING;

-- JO-004: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-004-1', 'jo-004', '2026-10-15', 4000000,  'Transfer', 'DP pendaftaran event'),
  ('pay-004-2', 'jo-004', '2026-10-22', 6560000,  'Tunai',    'Pelunasan cash')
ON CONFLICT (id) DO NOTHING;

-- JO-005: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-005-1', 'jo-005', '2026-10-20', 3500000,  'Tunai',    'DP 30%'),
  ('pay-005-2', 'jo-005', '2026-10-27', 5875000,  'Transfer', 'Pelunasan')
ON CONFLICT (id) DO NOTHING;

-- JO-006: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-006-1', 'jo-006', '2026-11-01', 10000000, 'Transfer', 'DP KKN Undip'),
  ('pay-006-2', 'jo-006', '2026-11-10', 15200000, 'Transfer', 'Pelunasan')
ON CONFLICT (id) DO NOTHING;

-- JO-007: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-007-1', 'jo-007', '2026-11-08', 5000000,  'Tunai',    'DP dari kas OSIS'),
  ('pay-007-2', 'jo-007', '2026-11-15', 7750000,  'Transfer', 'Pelunasan')
ON CONFLICT (id) DO NOTHING;

-- JO-008: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-008-1', 'jo-008', '2026-11-15', 4000000,  'Transfer', 'DP 50%'),
  ('pay-008-2', 'jo-008', '2026-11-22', 4700000,  'Transfer', 'Pelunasan')
ON CONFLICT (id) DO NOTHING;

-- JO-009: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-009-1', 'jo-009', '2026-11-20', 2450000,  'Tunai',    'Pembayaran lunas')
ON CONFLICT (id) DO NOTHING;

-- JO-010: Lunas
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-010-1', 'jo-010', '2026-11-25', 3500000,  'Transfer', 'DP 50%'),
  ('pay-010-2', 'jo-010', '2026-11-28', 3500000,  'Cicilan',  'Pelunasan cicilan')
ON CONFLICT (id) DO NOTHING;

-- JO-011: DP saja
INSERT INTO payments (id, job_order_id, tanggal, jumlah, metode, catatan)
VALUES
  ('pay-011-1', 'jo-011', '2026-12-01', 10000000, 'Transfer', 'DP 30%')
ON CONFLICT (id) DO NOTHING;

-- JO-012: Belum bayar (tidak ada insert)
