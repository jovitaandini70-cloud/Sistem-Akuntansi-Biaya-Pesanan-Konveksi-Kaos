-- ============================================================
-- SKEMA DATABASE - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Tabel utama job order
CREATE TABLE IF NOT EXISTS job_orders (
  id          TEXT PRIMARY KEY,
  nomor       TEXT NOT NULL UNIQUE,
  pelanggan   TEXT NOT NULL,
  produk      TEXT NOT NULL,
  jumlah      INTEGER NOT NULL DEFAULT 0,
  tanggal     DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Produksi', 'Selesai')),
  harga_jual  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel bahan baku / material per job order
CREATE TABLE IF NOT EXISTS materials (
  id          TEXT PRIMARY KEY,
  job_order_id TEXT NOT NULL REFERENCES job_orders(id) ON DELETE CASCADE,
  kode        TEXT NOT NULL,
  nama        TEXT NOT NULL,
  satuan      TEXT NOT NULL,
  harga       NUMERIC(15, 2) NOT NULL DEFAULT 0,
  stok        NUMERIC(15, 2) NOT NULL DEFAULT 0,
  qty_used    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel tenaga kerja / labor per job order
CREATE TABLE IF NOT EXISTS labors (
  id              TEXT PRIMARY KEY,
  job_order_id    TEXT NOT NULL REFERENCES job_orders(id) ON DELETE CASCADE,
  nama            TEXT NOT NULL,
  jenis_pekerjaan TEXT NOT NULL,
  jam_kerja       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tarif_per_jam   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel biaya overhead per job order
CREATE TABLE IF NOT EXISTS overheads (
  id          TEXT PRIMARY KEY,
  job_order_id TEXT NOT NULL REFERENCES job_orders(id) ON DELETE CASCADE,
  nama        TEXT NOT NULL,
  biaya       NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Trigger: auto-update kolom updated_at pada job_orders
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_job_orders_updated_at
  BEFORE UPDATE ON job_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Index untuk performa query
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_materials_job_order_id  ON materials(job_order_id);
CREATE INDEX IF NOT EXISTS idx_labors_job_order_id     ON labors(job_order_id);
CREATE INDEX IF NOT EXISTS idx_overheads_job_order_id  ON overheads(job_order_id);
CREATE INDEX IF NOT EXISTS idx_job_orders_status       ON job_orders(status);
CREATE INDEX IF NOT EXISTS idx_job_orders_tanggal      ON job_orders(tanggal);

-- ============================================================
-- Row Level Security (RLS) - aktifkan setelah konfigurasi auth
-- Untuk saat ini dibuka agar bisa diakses dengan anon key
-- ============================================================
ALTER TABLE job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE labors     ENABLE ROW LEVEL SECURITY;
ALTER TABLE overheads  ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi untuk anon key (development)
-- GANTI policy ini dengan yang lebih ketat saat production / pakai auth
CREATE POLICY "allow_all_job_orders" ON job_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_materials"  ON materials  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_labors"     ON labors     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_overheads"  ON overheads  FOR ALL USING (true) WITH CHECK (true);
