-- ============================================================
-- PATCH: Update harga_jual agar semua pesanan menghasilkan laba
-- Jalankan di Supabase SQL Editor
-- ============================================================
-- Pesanan yang sebelumnya rugi / margin terlalu tipis:
--
-- JO-004 | Kaos Event Half Marathon (120 pcs)
--   Biaya produksi: Rp 10.490.000 | Harga lama: 88.000/pcs (pendapatan 10.560.000, laba 70.000 = 0,7%)
--   Harga baru: 95.000/pcs → pendapatan 11.400.000, laba 910.000 = margin ~8%
--
-- JO-005 | Seragam Karyawan Polo Shirt (75 pcs)
--   Biaya produksi: Rp 9.957.000 | Harga lama: 125.000/pcs (pendapatan 9.375.000, RUGI 582.000)
--   Harga baru: 145.000/pcs → pendapatan 10.875.000, laba 918.000 = margin ~8,4%
--
-- JO-006 | Kaos KKN Periode 2026 (350 pcs)
--   Biaya produksi: Rp 25.498.000 | Harga lama: 72.000/pcs (pendapatan 25.200.000, RUGI 298.000)
--   Harga baru: 80.000/pcs → pendapatan 28.000.000, laba 2.502.000 = margin ~8,9%
--
-- JO-012 | Seragam Tenaga Medis (45 pcs)
--   Biaya produksi: Rp 7.518.000 | Harga lama: 135.000/pcs (pendapatan 6.075.000, RUGI 1.443.000)
--   Harga baru: 185.000/pcs → pendapatan 8.325.000, laba 807.000 = margin ~9,7%
-- ============================================================

UPDATE job_orders SET harga_jual = 95000  WHERE id = 'jo-004';
UPDATE job_orders SET harga_jual = 145000 WHERE id = 'jo-005';
UPDATE job_orders SET harga_jual = 80000  WHERE id = 'jo-006';
UPDATE job_orders SET harga_jual = 185000 WHERE id = 'jo-012';

-- ============================================================
-- Update payment JO-004 agar sesuai tagihan baru
-- Tagihan baru: 120 × 95.000 = 11.400.000
-- (DP 4.000.000 tetap, pelunasan naik dari 6.560.000 ke 7.400.000)
-- ============================================================
UPDATE payments SET jumlah = 7400000, catatan = 'Pelunasan cash (sesuai harga revisi)'
  WHERE id = 'pay-004-2';

-- ============================================================
-- Update payment JO-005 agar sesuai tagihan baru
-- Tagihan baru: 75 × 145.000 = 10.875.000
-- (DP 3.500.000 tetap, pelunasan naik dari 5.875.000 ke 7.375.000)
-- ============================================================
UPDATE payments SET jumlah = 7375000, catatan = 'Pelunasan (sesuai harga revisi)'
  WHERE id = 'pay-005-2';

-- ============================================================
-- Update payment JO-006 agar sesuai tagihan baru
-- Tagihan baru: 350 × 80.000 = 28.000.000
-- (DP 10.000.000 tetap, pelunasan naik dari 15.200.000 ke 18.000.000)
-- ============================================================
UPDATE payments SET jumlah = 18000000, catatan = 'Pelunasan (sesuai harga revisi)'
  WHERE id = 'pay-006-2';
