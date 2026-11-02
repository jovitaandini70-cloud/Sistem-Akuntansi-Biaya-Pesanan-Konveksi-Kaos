-- ============================================================
-- PATCH: Fix semua pesanan yang masih rugi (universal, berlaku
-- untuk semua pesanan di database apapun ID-nya)
--
-- Strategi:
--   harga_jual baru = CEIL(total_biaya_per_pcs × 1.10 / 500) × 500
--   → minimal margin 10%, dibulatkan ke kelipatan Rp 500
--
-- Aman dijalankan berkali-kali: hanya mengupdate pesanan yang
-- saat ini masih rugi (pendapatan < total biaya produksi).
-- ============================================================

UPDATE job_orders jo
SET harga_jual = (
  CEIL(
    (
        COALESCE((SELECT SUM(m.harga * m.qty_used)        FROM materials  m WHERE m.job_order_id = jo.id), 0)
      + COALESCE((SELECT SUM(l.jam_kerja * l.tarif_per_jam) FROM labors   l WHERE l.job_order_id = jo.id), 0)
      + COALESCE((SELECT SUM(o.biaya)                      FROM overheads o WHERE o.job_order_id = jo.id), 0)
    )::numeric / jo.jumlah * 1.10 / 500.0
  ) * 500
)
WHERE
  jo.jumlah > 0
  AND (
    jo.harga_jual * jo.jumlah
  ) < (
      COALESCE((SELECT SUM(m.harga * m.qty_used)        FROM materials  m WHERE m.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(l.jam_kerja * l.tarif_per_jam) FROM labors   l WHERE l.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(o.biaya)                      FROM overheads o WHERE o.job_order_id = jo.id), 0)
  );

-- ============================================================
-- Verifikasi: tampilkan semua pesanan beserta laba setelah update
-- ============================================================
SELECT
  jo.nomor,
  jo.pelanggan,
  jo.jumlah,
  jo.harga_jual                                                    AS harga_per_pcs,
  jo.harga_jual * jo.jumlah                                        AS total_pendapatan,
  (
      COALESCE((SELECT SUM(m.harga * m.qty_used)          FROM materials  m WHERE m.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(l.jam_kerja * l.tarif_per_jam) FROM labors     l WHERE l.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(o.biaya)                       FROM overheads  o WHERE o.job_order_id = jo.id), 0)
  )                                                                AS total_biaya,
  jo.harga_jual * jo.jumlah - (
      COALESCE((SELECT SUM(m.harga * m.qty_used)          FROM materials  m WHERE m.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(l.jam_kerja * l.tarif_per_jam) FROM labors     l WHERE l.job_order_id = jo.id), 0)
    + COALESCE((SELECT SUM(o.biaya)                       FROM overheads  o WHERE o.job_order_id = jo.id), 0)
  )                                                                AS laba,
  ROUND(
    (jo.harga_jual * jo.jumlah - (
        COALESCE((SELECT SUM(m.harga * m.qty_used)          FROM materials  m WHERE m.job_order_id = jo.id), 0)
      + COALESCE((SELECT SUM(l.jam_kerja * l.tarif_per_jam) FROM labors     l WHERE l.job_order_id = jo.id), 0)
      + COALESCE((SELECT SUM(o.biaya)                       FROM overheads  o WHERE o.job_order_id = jo.id), 0)
    ))::numeric / NULLIF(jo.harga_jual * jo.jumlah, 0) * 100, 1
  )                                                                AS margin_persen
FROM job_orders jo
ORDER BY jo.tanggal;
