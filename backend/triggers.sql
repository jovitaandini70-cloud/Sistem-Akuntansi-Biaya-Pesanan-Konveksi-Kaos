-- ============================================================
-- TRIGGERS - Sistem Akuntansi Biaya Pesanan Konveksi Kaos
-- Jalankan setelah schema.sql di Supabase SQL Editor
-- ============================================================

-- Trigger: auto-update kolom updated_at pada job_orders
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
-- Trigger: validasi harga_jual tidak boleh negatif
-- ============================================================
CREATE OR REPLACE FUNCTION validate_harga_jual()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.harga_jual < 0 THEN
    RAISE EXCEPTION 'harga_jual tidak boleh negatif';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_validate_harga_jual
  BEFORE INSERT OR UPDATE ON job_orders
  FOR EACH ROW EXECUTE FUNCTION validate_harga_jual();

-- ============================================================
-- Trigger: validasi jumlah tidak boleh nol atau negatif
-- ============================================================
CREATE OR REPLACE FUNCTION validate_jumlah()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.jumlah <= 0 THEN
    RAISE EXCEPTION 'jumlah pesanan harus lebih dari 0';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_validate_jumlah
  BEFORE INSERT OR UPDATE ON job_orders
  FOR EACH ROW EXECUTE FUNCTION validate_jumlah();
