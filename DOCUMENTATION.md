# SISTEM AKUNTANSI BIAYA PESANAN (JOB ORDER COSTING)
## Konveksi & Sablon Kaos Custom — Dokumentasi Lengkap

---

## DAFTAR ISI

1. [Penjelasan Sistem](#1-penjelasan-sistem)
2. [Teknologi yang Digunakan](#2-teknologi-yang-digunakan)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Struktur Database & ERD](#4-struktur-database--erd)
5. [Fitur Lengkap](#5-fitur-lengkap)
6. [Aturan & Validasi dalam Sistem](#6-aturan--validasi-dalam-sistem)
7. [Logika Akuntansi Biaya Pesanan](#7-logika-akuntansi-biaya-pesanan)
8. [Alur Kerja (Workflow) Sistem](#8-alur-kerja-workflow-sistem)
9. [Struktur Folder & Penjelasan File](#9-struktur-folder--penjelasan-file)
10. [Data Contoh (Sample Data)](#10-data-contoh-sample-data)
11. [Deployment](#11-deployment)
12. [Keamanan & Catatan Pengembangan](#12-keamanan--catatan-pengembangan)

---

## 1. PENJELASAN SISTEM

### 1.1 Apa itu Sistem ini?

Sistem **Akuntansi Biaya Pesanan (Job Order Costing)** ini adalah aplikasi web yang dirancang khusus untuk bisnis **konveksi dan sablon kaos custom**. Sistem ini mencatat, menghitung, dan menganalisis **biaya produksi per pesanan** — mulai dari biaya bahan baku (kain, tinta, benang, packaging), biaya tenaga kerja langsung (sablon, jahit, finishing, QC), hingga biaya overhead pabrik (listrik, penyusutan mesin, sewa workshop).

### 1.2 Mengapa Job Order Costing?

Metode **Job Order Costing** dipilih karena karakteristik bisnis konveksi kaos yang memproduksi **setiap pesanan secara terpisah dan unik**. Berbeda dengan metode Process Costing (yang cocok untuk produksi massal yang seragam), dalam konveksi custom:

- Setiap pesanan memiliki **spesifikasi berbeda** (jenis kain, teknik sablon/bordir/sublim, jumlah, desain)
- Setiap pesanan memiliki **pelanggan yang berbeda**
- Biaya harus **dilacak per pesanan**, bukan dirata-ratakan
- Harga jual ditentukan **per pesanan**, bukan per unit standar

### 1.3 Tujuan Sistem

| Tujuan | Penjelasan |
|---|---|
| Pencatatan biaya | Mencatat semua elemen biaya (bahan baku, tenaga kerja, overhead) untuk setiap pesanan secara terpisah |
| Perhitungan biaya produksi | Menjumlahkan seluruh biaya per pesanan untuk mendapat total biaya produksi |
| Analisis profitabilitas | Membandingkan total biaya produksi dengan harga jual untuk menghitung estimasi laba dan margin |
| Pelaporan | Menyajikan ringkasan biaya, pendapatan, dan laba baik per pesanan maupun keseluruhan |
| Pengelolaan pesanan | Melacak status setiap pesanan dari Draft → Produksi → Selesai |

### 1.4 Konteks Bisnis

Sistem ini dirancang untuk bisnis konveksi kaos dengan operasi sebagai berikut:

- **Menerima pesanan custom** dari berbagai pelanggan (sekolah, perusahaan, komunitas, instansi)
- **Membeli bahan baku** seperti kain (Cotton Combed, Dryfit, Lacoste, Drill, Katun Ripstop), tinta sablon (Plastisol, Waterbase, Rubber), tinta sublim, benang, label, kancing, dan packaging
- **Mempekerjakan tenaga kerja langsung** dengan berbagai keahlian: Sablon, Jahit, Bordir, Sublim, Finishing, Quality Control
- **Menggunakan mesin produksi** yang memerlukan biaya listrik, penyusutan, dan maintenance
- **Menetapkan harga jual per potong (pcs)** dan menghitung total pendapatan dengan mengalikan harga jual × jumlah pesanan

---

## 2. TEKNOLOGI YANG DIGUNAKAN

### 2.1 Stack Teknologi Utama

| Lapisan | Teknologi | Versi | Fungsi |
|---|---|---|---|
| **Frontend Framework** | React | 18.3.1 | Library UI berbasis komponen |
| **Bahasa Pemrograman** | TypeScript | 5.5.x | Type safety, mencegah bug saat development |
| **Build Tool** | Vite | 5.4.x | Bundler & dev server yang cepat |
| **CSS Framework** | Tailwind CSS | 3.4.x | Utility-first CSS framework untuk styling |
| **Icon Library** | Lucide React | 0.446.x | Set ikon modern dan konsisten |
| **Database & Backend** | Supabase (PostgreSQL) | — | Database terkelola + REST API auto-generated |
| **Database Client** | @supabase/supabase-js | 2.57.x | SDK untuk komunikasi frontend ↔ database |
| **Font** | Plus Jakarta Sans | — | Font modern dari Google Fonts |
| **Deployment** | GitHub Pages + GitHub Actions | — | CI/CD otomatis dari branch `main` |

### 2.2 Mengapa Teknologi Ini?

**React + TypeScript:** Dipilih untuk membangun antarmuka yang interaktif dengan keamanan tipe data. Setiap entitas (JobOrder, Material, Labor, Overhead) memiliki definisi tipe yang jelas di `src/types.ts`, sehingga mencegah kesalahan akses properti yang tidak ada.

**Vite:** Build tool yang sangat cepat dengan Hot Module Replacement (HMR), cocok untuk development yang iteratif. Output build berupa static files yang ringan dan bisa dihosting di GitHub Pages.

**Tailwind CSS:** Utility-first CSS yang memungkinkan styling langsung di JSX tanpa file CSS terpisah. Sistem ini menggunakan custom color palette (brand blue & ink neutral) yang didefinisikan di `tailwind.config.js`.

**Supabase:** Platform Backend-as-a-Service yang menyediakan database PostgreSQL terkelola dengan REST API auto-generated. Frontend langsung berkomunikasi dengan database melalui Supabase JS SDK — tidak perlu membangun server backend terpisah. Supabase juga menyediakan Row Level Security (RLS) untuk kontrol akses data.

**GitHub Pages:** Hosting static files gratis yang terintegrasi dengan repository GitHub. Deploy otomatis dijalankan oleh GitHub Actions setiap kali code di-push ke branch `main`.

### 2.3 Versi Legacy (Vanilla JS)

Selain aplikasi React utama, terdapat juga versi vanilla HTML/CSS/JS di folder `frontend/` yang menjadi prototipe awal. Versi ini:
- Menggunakan HTML murni (`index.html`), CSS manual (`style.css`), dan JavaScript vanilla (`script.js`)
- Terhubung ke Supabase melalui REST API menggunakan `fetch()` langsung
- Memiliki 3 halaman: Dashboard, Data Pesanan, dan Laporan (tanpa halaman Detail dan Kartu Biaya)
- Tidak memiliki fitur CRUD (tambah/edit/hapus) — hanya menampilkan data

Versi React adalah pengembangan penuh dari prototipe ini dengan tambahan halaman Detail Job Order, Kartu Biaya, fitur CRUD lengkap, dan UI yang lebih profesional.

---

## 3. ARSITEKTUR SISTEM

### 3.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                     USER (BROWSER)                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              REACT FRONTEND (SPA)                  │  │
│  │                                                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│  │  │Dashboard │ │ Pesanan  │ │  Job Detail      │  │  │
│  │  │          │ │          │ │  (Bahan/TK/OH)   │  │  │
│  │  └──────────┘ └──────────┘ └──────────────────┘  │  │
│  │  ┌──────────────┐ ┌──────────────────────────┐   │  │
│  │  │ Kartu Biaya  │ │       Laporan            │   │  │
│  │  │ (Cost Sheet) │ │  (Biaya & Profitabilitas)│   │  │
│  │  └──────────────┘ └──────────────────────────┘   │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────┐     │  │
│  │  │        Service Layer                     │     │  │
│  │  │  (jobOrderService.ts)                    │     │  │
│  │  │  fetchAllOrders() / createOrder() /      │     │  │
│  │  │  addMaterial() / addLabor() / ...        │     │  │
│  │  └──────────────┬──────────────────────────┘     │  │
│  └─────────────────┼─────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────┘
                     │ Supabase JS SDK
                     │ (HTTPS + API Key)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE (CLOUD)                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database                     │  │
│  │                                                   │  │
│  │  ┌────────────┐     ┌────────────┐               │  │
│  │  │ job_orders │─────│ materials  │               │  │
│  │  │            │     └────────────┘               │  │
│  │  │  (PK: id)  │     ┌────────────┐               │  │
│  │  │            │─────│  labors    │               │  │
│  │  │            │     └────────────┘               │  │
│  │  │            │     ┌────────────┐               │  │
│  │  │            │─────│ overheads  │               │  │
│  │  └────────────┘     └────────────┘               │  │
│  │                                                   │  │
│  │  + Triggers (validasi & auto-update)              │  │
│  │  + Row Level Security (RLS)                       │  │
│  │  + Index untuk performa query                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         REST API (Auto-generated)                  │  │
│  │  GET/POST/PATCH/DELETE /rest/v1/<table>            │  │
│  │  + Nested select (join otomatis)                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              GITHUB PAGES (HOSTING)                      │
│                                                         │
│  Static files dari `npm run build` (dist/)              │
│  Auto-deploy via GitHub Actions dari branch `main`      │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Pola Komunikasi Data

Sistem ini menggunakan pola **client-to-database langsung** (tidak ada server middleware):

1. **Frontend React** memanggil fungsi di `jobOrderService.ts`
2. **Service layer** menggunakan Supabase JS SDK untuk mengirim query ke database
3. **Supabase REST API** menerjemahkan request menjadi query PostgreSQL
4. **Database PostgreSQL** mengeksekusi query, menerapkan trigger & RLS
5. **Hasil** dikembalikan sebagai JSON ke frontend
6. **Service layer** memetakan row PostgreSQL (snake_case) ke tipe TypeScript (camelCase)
7. **React components** menerima data dan merender UI

Contoh pemanggilan nested select (join otomatis Supabase):
```typescript
const { data } = await supabase
  .from('job_orders')
  .select(`
    *,
    materials (*),
    labors (*),
    overheads (*)
  `)
  .order('tanggal', { ascending: false });
```
Query ini mengembalikan setiap job order beserta semua material, labor, dan overhead yang terkait dalam satu request.

---

## 4. STRUKTUR DATABASE & ERD

### 4.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         job_orders                               │
│                     (Tabel Utama Pesanan)                        │
├─────────────────────────────────────────────────────────────────┤
│  PK  id            TEXT          (identifikasi unik pesanan)     │
│      nomor         TEXT  UNIQUE  (nomor pesanan, cth: JO-2026-001)│
│      pelanggan     TEXT          (nama pelanggan/instansi)        │
│      produk        TEXT          (jenis produk/kaos)              │
│      jumlah        INTEGER       (jumlah pcs dipesan)             │
│      tanggal       DATE          (tanggal pesanan)                │
│      status        TEXT  CHECK   (Draft | Produksi | Selesai)     │
│      harga_jual    NUMERIC(15,2) (harga jual PER PCS dalam Rupiah)│
│      created_at    TIMESTAMPTZ   (otomatis saat dibuat)           │
│      updated_at    TIMESTAMPTZ   (otomatis saat diupdate)         │
├─────────────────────────────────────────────────────────────────┤
│  TRIGGERS:                                                       │
│   • update_updated_at() → auto-update updated_at saat UPDATE     │
│   • validate_harga_jual() → harga_jual ≥ 0                       │
│   • validate_jumlah() → jumlah > 0                               │
│                                                                  │
│  INDEXES:                                                        │
│   • idx_job_orders_status (untuk filter by status)               │
│   • idx_job_orders_tanggal (untuk sort by tanggal)               │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │ 1                │ 1                │ 1
           │                  │                  │
           │ N                │ N                │ N
           ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│    materials      │ │     labors       │ │    overheads     │
│  (Bahan Baku)     │ │ (Tenaga Kerja)   │ │ (Biaya Overhead) │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ PK  id       TEXT │ │ PK  id       TEXT│ │ PK  id       TEXT│
│ FK  job_order_id  │ │ FK  job_order_id │ │ FK  job_order_id │
│     kode      TEXT │ │     nama     TEXT│ │     nama     TEXT│
│     nama     TEXT  │ │     jenis_       │ │     biaya    │
│     satuan   TEXT  │ │     pekerjaan    │ │     NUMERIC  │
│     harga    NUM   │ │     TEXT         │ │     (15,2)   │
│     stok     NUM   │ │     jam_kerja    │ └──────────────────┘
│     qty_used  NUM  │ │     NUMERIC(10,2)│
│     NUMERIC(15,2)  │ │     tarif_per_jam│
│                   │ │     NUMERIC(15,2)│
├──────────────────┤ ├──────────────────┤
│ INDEX:            │ │ INDEX:            │
│  job_order_id     │ │  job_order_id     │
├──────────────────┤ ├──────────────────┤
│ FK → job_orders   │ │ FK → job_orders   │
│ ON DELETE CASCADE │ │ ON DELETE CASCADE │
└──────────────────┘ └──────────────────┘

           ┌──────────────────────────────────────────┐
           │           RELATIONSHIP RULES              │
           ├──────────────────────────────────────────┤
           │ • 1 job_order : N materials              │
           │ • 1 job_order : N labors                 │
           │ • 1 job_order : N overheads              │
           │ • Hapus job_order → otomatis hapus       │
           │   semua materials, labors, overheads     │
           │   (ON DELETE CASCADE)                    │
           │ • Setiap child wajib memiliki            │
           │   job_order_id (NOT NULL)                │
           └──────────────────────────────────────────┘
```

### 4.2 Penjelasan Tabel

#### Tabel `job_orders` — Tabel Utama Pesanan

Menyimpan informasi header setiap pesanan produksi. Ini adalah tabel "induk" yang memiliki relasi ke tiga tabel anak (materials, labors, overheads).

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | ID unik pesanan, format: `jo-001`, `jo-{timestamp}` |
| `nomor` | TEXT | NOT NULL, UNIQUE | Nomor pesanan untuk identifikasi manusia, contoh: `JO-2026-001` |
| `pelanggan` | TEXT | NOT NULL | Nama pelanggan atau instansi pemesan |
| `produk` | TEXT | NOT NULL | Jenis produk yang dipesan, contoh: "Kaos Jersey Futsal Lengan Pendek" |
| `jumlah` | INTEGER | NOT NULL, DEFAULT 0, > 0 (trigger) | Jumlah potong (pcs) yang dipesan |
| `tanggal` | DATE | NOT NULL | Tanggal pesanan dibuat |
| `status` | TEXT | NOT NULL, DEFAULT 'Draft', CHECK (Draft/Produksi/Selesai) | Status produksi pesanan |
| `harga_jual` | NUMERIC(15,2) | NOT NULL, DEFAULT 0, ≥ 0 (trigger) | Harga jual **per potong (pcs)** dalam Rupiah |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp pembuatan record |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp terakhir diupdate (auto via trigger) |

**Penting:** Kolom `harga_jual` menyimpan harga **per pcs**, bukan total. Total pendapatan dihitung dengan formula: `harga_jual × jumlah`.

#### Tabel `materials` — Bahan Baku per Pesanan

Menyimpan data bahan baku/material yang digunakan dalam produksi setiap pesanan.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | TEXT (PK) | ID unik material, format: `m-{timestamp}` |
| `job_order_id` | TEXT (FK) | Referensi ke `job_orders.id`, ON DELETE CASCADE |
| `kode` | TEXT | Kode material, contoh: `KBL-001` (kain), `TKN-002` (tinta), `BNG-003` (benang) |
| `nama` | TEXT | Nama material, contoh: "Kain Cotton Combed 30s" |
| `satuan` | TEXT | Satuan ukuran, contoh: meter, kg, liter, pcs, gulung, set |
| `harga` | NUMERIC(15,2) | Harga per satuan dalam Rupiah |
| `stok` | NUMERIC(15,2) | Jumlah stok yang tersisa di gudang |
| `qty_used` | NUMERIC(15,2) | Jumlah yang digunakan untuk pesanan ini |
| `created_at` | TIMESTAMPTZ | Timestamp pembuatan |

**Kategori bahan baku yang digunakan dalam sistem:**
- `KBL-xxx` — Kain (Cotton Combed 20s/24s/30s, Cotton PE, Dryfit, Lacoste, Drill, Katun Ripstop)
- `TKN-xxx` — Tinta (Sablon Plastisol, Waterbase, Rubber, Sublim)
- `BNG-xxx` — Benang (Jahit Polyester, Bordir Warna)
- `AKS-xxx` — Aksesoris (Label Woven, Label Sablon, Kancing, Nomor Dada, Nomor Punggung)
- `PKG-xxx` — Packaging (Plastik OPP, Karton Box)

#### Tabel `labors` — Tenaga Kerja Langsung per Pesanan

Menyimpan data pekerja yang terlibat langsung dalam produksi setiap pesanan.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | TEXT (PK) | ID unik labor, format: `l-{timestamp}` |
| `job_order_id` | TEXT (FK) | Referensi ke `job_orders.id`, ON DELETE CASCADE |
| `nama` | TEXT | Nama pekerja, contoh: "Andi Saputra" |
| `jenis_pekerjaan` | TEXT | Jenis pekerjaan, contoh: Sablon, Jahit, Bordir, Sublim, Finishing, Quality Control |
| `jam_kerja` | NUMERIC(10,2) | Jumlah jam kerja yang dicurahkan untuk pesanan ini |
| `tarif_per_jam` | NUMERIC(15,2) | Tarif upah per jam dalam Rupiah |
| `created_at` | TIMESTAMPTZ | Timestamp pembuatan |

**Jenis pekerjaan dalam sistem:**
- **Sablon** — Proses sablon manual (Plastisol/Waterbase/Rubber)
- **Sublim** — Proses sublim printing untuk kain Dryfit
- **Bordir** — Proses bordir logo menggunakan mesin bordir komputer
- **Jahit** — Proses menjahit kain menjadi kaos
- **Finishing** — Proses finishing (potong benang, setrika, lipat)
- **Quality Control** — Pemeriksaan kualitas sebelum packing

#### Tabel `overheads` — Biaya Overhead Pabrik per Pesanan

Menyimpan biaya-biaya tidak langsung produksi yang dialokasikan ke setiap pesanan.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | TEXT (PK) | ID unik overhead, format: `o-{timestamp}` |
| `job_order_id` | TEXT (FK) | Referensi ke `job_orders.id`, ON DELETE CASCADE |
| `nama` | TEXT | Nama biaya overhead, contoh: "Listrik Produksi", "Penyusutan Mesin Sablon" |
| `biaya` | NUMERIC(15,2) | Nominal biaya dalam Rupiah |
| `created_at` | TIMESTAMPTZ | Timestamp pembuatan |

**Jenis biaya overhead dalam sistem:**
- **Listrik Produksi** — Biaya listrik selama proses produksi pesanan
- **Penyusutan Mesin Sablon** — Depresiasi mesin sablon
- **Penyusutan Mesin Jahit** — Depresiasi mesin jahit
- **Penyusutan Mesin Bordir** — Depresiasi mesin bordir
- **Penyusutan Mesin Sublim** — Depresiasi mesin sublim
- **Maintenance Mesin Jahit** — Biaya pemeliharaan mesin jahit
- **Sewa Workshop** — Biaya sewa tempat produksi
- **Biaya Air & Kebersihan** — Biaya utilitas pendukung

### 4.3 Index Database

Index dibuat untuk mempercepat query yang sering dijalankan:

| Index | Tabel | Kolom | Tujuan |
|---|---|---|---|
| `idx_materials_job_order_id` | materials | job_order_id | Mempercepat join dengan job_orders |
| `idx_labors_job_order_id` | labors | job_order_id | Mempercepat join dengan job_orders |
| `idx_overheads_job_order_id` | overheads | job_order_id | Mempercepat join dengan job_orders |
| `idx_job_orders_status` | job_orders | status | Mempercepat filter by status |
| `idx_job_orders_tanggal` | job_orders | tanggal | Mempercepat sort by tanggal |

---

## 5. FITUR LENGKAP

### 5.1 Halaman Dashboard

**Tujuan:** Memberikan ringkasan visual performa produksi dan keuangan secara keseluruhan.

**Komponen yang ditampilkan:**

| Komponen | Isi | Sumber Data |
|---|---|---|
| Kartu Statistik 1: Pesanan Aktif | Jumlah pesanan dengan status "Produksi" | `filter(status === 'Produksi').length` |
| Kartu Statistik 2: Total Biaya Produksi | Penjumlahan total biaya produksi semua pesanan | `Σ totalProduksi(orders)` |
| Kartu Statistik 3: Total Pendapatan | Penjumlahan pendapatan semua pesanan | `Σ (harga_jual × jumlah)` |
| Kartu Statistik 4: Estimasi Laba | Penjumlahan laba semua pesanan | `Σ estimasiLaba(orders)` |
| Grafik Batang (Bar Chart) | Perbandingan biaya produksi vs pendapatan per pesanan | 6 pesanan pertama, 2 batang per pesanan |
| Grafik Donat (Donut Chart) | Komposisi biaya: Bahan Baku vs Tenaga Kerja vs Overhead | Agregasi seluruh pesanan |
| Tabel Pesanan Terbaru | 5 pesanan terbaru dengan nomor, pelanggan, produk, tanggal, status, total biaya | Sort by tanggal descending, limit 5 |

**Interaksi:**
- Klik baris tabel pesanan → navigasi ke halaman Detail Job Order
- Klik tombol "Semua Pesanan" → navigasi ke halaman Data Pesanan
- Klik tombol "Lihat Laporan" → navigasi ke halaman Laporan
- Hover pada bar chart → menampilkan tooltip nilai biaya/pendapatan

### 5.2 Halaman Data Pesanan

**Tujuan:** Mengelola dan melihat semua job order dalam bentuk tabel.

**Komponen yang ditampilkan:**

| Komponen | Fungsi |
|---|---|
| Filter Status | Tombol filter: Semua / Draft / Produksi / Selesai |
| Search Bar | Pencarian berdasarkan nomor pesanan, nama pelanggan, atau jenis produk (di topbar) |
| Tabel Pesanan | Kolom: Nomor, Pelanggan, Produk, Jumlah, Tanggal, Status, Total Biaya, Est. Laba, Aksi |
| Tombol "Tambah Pesanan" | Membuka modal form untuk menambah pesanan baru |
| Tombol Eye (Aksi) | Navigasi ke halaman Detail Job Order |

**Modal Tambah Pesanan:**
Form berisi field: Nomor Pesanan, Tanggal, Nama Pelanggan, Produk, Jumlah (pcs), Harga Jual per pcs, Status (Draft/Produksi/Selesai).

Saat pesanan baru dibuat, sistem mengirim data ke Supabase melalui `createOrder()` yang melakukan INSERT ke tabel `job_orders`. Pesanan baru belum memiliki data materials, labors, atau overheads — data tersebut ditambahkan kemudian di halaman Detail.

### 5.3 Halaman Detail Job Order

**Tujuan:** Menampilkan dan mengelola rincian biaya untuk satu pesanan tertentu.

**Komponen yang ditampilkan:**

1. **Header** — Nomor pesanan, status badge, nama produk & pelanggan, tombol kembali
2. **Info Grid** — Pelanggan, Produk, Jumlah, Tanggal dalam format kartu
3. **Tabel Biaya Bahan Baku** — CRUD lengkap:
   - Kolom: Kode, Nama Bahan, Satuan, Harga, Qty Digunakan, Stok Sisa, Subtotal, Aksi
   - Tombol "+ Tambah" untuk menambah bahan baku baru
   - Tombol Edit (ikon pensil) untuk mengedit baris inline
   - Tombol Hapus (ikon tempat sampah) untuk menghapus bahan baku
   - Subtotal otomatis: `harga × qty_used`
4. **Tabel Biaya Tenaga Kerja Langsung** — CRUD lengkap:
   - Kolom: Nama Pekerja, Jenis Pekerjaan, Jam Kerja, Tarif per Jam, Total Biaya, Aksi
   - Total Biaya otomatis: `jam_kerja × tarif_per_jam`
5. **Tabel Biaya Overhead Pabrik** — CRUD lengkap:
   - Kolom: Jenis Biaya Overhead, Biaya, Aksi
6. **Ringkasan Biaya Produksi** — Ringkasan otomatis:
   - Total Bahan Baku
   - Total Tenaga Kerja Langsung
   - Total Biaya Overhead
   - Total Biaya Produksi (penjumlahan ketiganya)
   - Harga Jual (per pcs × jumlah pcs)
   - Total Pendapatan
   - Estimasi Laba + Margin %

**Fitur CRUD (Create, Read, Update, Delete):**
Setiap perubahan (tambah/edit/hapus) pada materials, labors, atau overheads langsung dikirim ke database Supabase secara real-time melalui service layer. Jika operasi berhasil, state lokal di React diperbarui untuk merefleksikan perubahan tanpa perlu reload halaman.

### 5.4 Halaman Kartu Biaya (Job Cost Sheet)

**Tujuan:** Menampilkan kartu biaya pesanan (Job Cost Sheet) — dokumen standar dalam akuntansi biaya pesanan yang merangkum seluruh biaya produksi untuk satu pesanan.

**Komponen yang ditampilkan:**

1. **Selector Job Order** — Tombol berderet untuk memilih pesanan mana yang ingin dilihat kartu biayanya
2. **Header Kartu** (gradient biru) — Nomor pesanan, produk, pelanggan, status, tanggal, jumlah, harga jual/pcs, margin
3. **Rincian Biaya:**
   - Biaya Bahan Baku + detail jumlah jenis material
   - Tenaga Kerja Langsung + detail jumlah pekerja & total jam
   - Biaya Overhead Pabrik + detail jumlah jenis overhead
4. **Total Biaya Produksi** — Penjumlahan ketiga elemen biaya dengan tampilan menonjol
5. **Kartu Ringkasan:**
   - Total Pendapatan (harga jual/pcs × jumlah)
   - Estimasi Laba
   - Margin Keuntungan (%)
6. **Tombol "Lihat Detail Lengkap"** — Navigasi ke halaman Detail Job Order

### 5.5 Halaman Laporan

**Tujuan:** Menyajikan laporan ringkasan biaya, pendapatan, dan profitabilitas untuk semua pesanan.

**Komponen yang ditampilkan:**

1. **4 Kartu Ringkasan:**
   - Total Bahan Baku (semua pesanan digabung)
   - Total Tenaga Kerja (semua pesanan digabung)
   - Total Overhead (semua pesanan digabung)
   - Total Biaya Produksi (semua pesanan digabung)

2. **3 Kartu Finansial:**
   - Total Pendapatan
   - Total Estimasi Laba
   - Rata-rata Margin %

3. **Tabel Laporan Detail per Job Order:**
   - Kolom: No. Pesanan, Pelanggan, Tanggal, Status, Bahan Baku, Tenaga Kerja, Overhead, Total Biaya, Pendapatan, Laba, Margin %
   - Baris footer "Total Keseluruhan" dengan penjumlahan semua kolom numerik

4. **Tombol Export** (placeholder untuk fitur export di masa depan)

---

## 6. ATURAN & VALIDASI DALAM SISTEM

### 6.1 Aturan Status Pesanan

Sistem mengenali 3 status pesanan yang merepresentasikan alur produksi:

```
┌────────┐     ┌──────────┐     ┌─────────┐
│ Draft  │ ──→ │ Produksi │ ──→ │ Selesai │
└────────┘     └──────────┘     └─────────┘
```

| Status | Warna Badge | Arti |
|---|---|---|
| **Draft** | Amber (kuning lembut) | Pesanan telah dibuat tetapi belum mulai diproduksi. Data biaya mungkin belum lengkap. |
| **Produksi** | Brand Blue (biru) | Pesanan sedang dalam proses produksi. Biaya sedang dicatat secara bertahap. |
| **Selesai** | Emerald (hijau lembut) | Pesanan telah selesai diproduksi. Semua biaya telah dicatat. |

**Aturan constraint database:**
```sql
status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Produksi', 'Selesai'))
```
Database menolak nilai status di luar ketiga pilihan ini.

### 6.2 Validasi Database (Triggers)

Sistem menerapkan validasi di level database menggunakan PostgreSQL triggers, sehingga aturan tidak bisa dilewati bahkan jika ada bug di frontend:

#### Trigger 1: Auto-update `updated_at`
```sql
CREATE FUNCTION update_updated_at()
-- Setiap kali record job_orders di-UPDATE,
-- kolom updated_at otomatis diisi dengan NOW()
```
Tujuan: Melacak kapan terakhir kali data pesanan diubah, berguna untuk audit dan debugging.

#### Trigger 2: Validasi `harga_jual` tidak negatif
```sql
CREATE FUNCTION validate_harga_jual()
-- Jika harga_jual < 0, database menolak operasi
-- dengan pesan: "harga_jual tidak boleh negatif"
```
Tujuan: Mencegah input harga jual negatif yang akan menghasilkan perhitungan laba yang salah.

#### Trigger 3: Validasi `jumlah` harus lebih dari 0
```sql
CREATE FUNCTION validate_jumlah()
-- Jika jumlah ≤ 0, database menolak operasi
-- dengan pesan: "jumlah pesanan harus lebih dari 0"
```
Tujuan: Pesanan dengan jumlah 0 atau negatif tidak masuk akal dalam konteks produksi dan akan menghasilkan total pendapatan = 0.

### 6.3 Aturan Relasi (Foreign Key)

- Setiap record di `materials`, `labors`, dan `overheads` **wajib** memiliki `job_order_id` yang merujuk ke record yang ada di `job_orders` (NOT NULL + FK constraint)
- Jika sebuah `job_orders` dihapus, semua `materials`, `labors`, dan `overheads` yang terkait **otomatis terhapus** (`ON DELETE CASCADE`)
- Hal ini mencegah " orphaned records" — data biaya tanpa pesanan induk

### 6.4 Aturan Keamanan (Row Level Security)

Semua 4 tabel mengaktifkan RLS:
```sql
ALTER TABLE job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE labors     ENABLE ROW LEVEL SECURITY;
ALTER TABLE overheads  ENABLE ROW LEVEL SECURITY;
```

Policy saat ini: `USING (true) WITH CHECK (true)` — mengizinkan semua operasi untuk anon key. **Ini adalah konfigurasi development/MVP.** Untuk production, policy ini harus diganti dengan yang lebih ketat (misalnya berbasis `auth.uid()` untuk membatasi akses per user).

### 6.5 Aturan Format Nomor Pesanan

Nomor pesanan mengikuti format: `JO-YYYY-NNN`
- `JO` — prefix tetap (Job Order)
- `YYYY` — tahun pesanan
- `NNN` — nomor urut (001, 002, 003, ...)
- Contoh: `JO-2026-001`, `JO-2026-012`

Kolom `nomor` memiliki constraint `UNIQUE` — tidak boleh ada dua pesanan dengan nomor yang sama.

### 6.6 Aturan Perhitungan di Frontend

Frontend tidak menyimpan total biaya di database — semua total **dihitung secara real-time** dari data detail. Ini berarti:
- Total Biaya Bahan Baku dihitung ulang setiap kali halaman dimuat atau data berubah
- Total Biaya Produksi selalu konsisten dengan data materials, labors, dan overheads yang ada
- Tidak ada risiko data tidak sinkron antara total yang disimpan dan data detail

---

## 7. LOGIKA AKUNTANSI BIAYA PESANAN

### 7.1 Konsep Dasar

Dalam **Job Order Costing**, biaya produksi setiap pesanan dihitung dengan menjumlahkan tiga elemen biaya:

```
Total Biaya Produksi = Biaya Bahan Baku + Biaya Tenaga Kerja Langsung + Biaya Overhead Pabrik
```

Setiap elemen biaya dilacak secara individual untuk setiap pesanan (job order), bukan dirata-ratakan across semua pesanan.

### 7.2 Formula Perhitungan

#### 1. Total Biaya Bahan Baku (Direct Materials)

```
Total Bahan Baku = Σ (harga_per_satuan × qty_digunakan) untuk setiap material
```

**Contoh untuk JO-2026-001 (Kaos Jersey Futsal, 100 pcs):**
| Material | Harga | Qty Used | Subtotal |
|---|---|---|---|
| Kain Cotton PE 20s | Rp 26.000/meter | 140 meter | Rp 3.640.000 |
| Tinta Sablon Plastisol | Rp 85.000/kg | 4 kg | Rp 340.000 |
| Benang Jahit Polyester | Rp 12.000/gulung | 8 gulung | Rp 96.000 |
| Label Baju Woven | Rp 800/pcs | 105 pcs | Rp 84.000 |
| Plastik OPP Packaging | Rp 500/pcs | 105 pcs | Rp 52.500 |
| **Total Bahan Baku** | | | **Rp 4.212.500** |

#### 2. Total Biaya Tenaga Kerja Langsung (Direct Labor)

```
Total Tenaga Kerja = Σ (jam_kerja × tarif_per_jam) untuk setiap pekerja
```

**Contoh untuk JO-2026-001:**
| Pekerja | Pekerjaan | Jam Kerja | Tarif/Jam | Total |
|---|---|---|---|---|
| Andi Saputra | Sablon | 30 jam | Rp 25.000 | Rp 750.000 |
| Rudi Hartono | Jahit | 45 jam | Rp 22.000 | Rp 990.000 |
| Siti Aminah | Finishing | 15 jam | Rp 18.000 | Rp 270.000 |
| Joko Widodo | Quality Control | 10 jam | Rp 20.000 | Rp 200.000 |
| **Total Tenaga Kerja** | | | | **Rp 2.210.000** |

#### 3. Total Biaya Overhead Pabrik (Factory Overhead)

```
Total Overhead = Σ biaya untuk setiap item overhead
```

**Contoh untuk JO-2026-001:**
| Overhead | Biaya |
|---|---|
| Listrik Produksi | Rp 420.000 |
| Penyusutan Mesin Sablon | Rp 350.000 |
| Penyusutan Mesin Jahit | Rp 180.000 |
| Biaya Air & Kebersihan | Rp 75.000 |
| **Total Overhead** | **Rp 1.025.000** |

#### 4. Total Biaya Produksi

```
Total Biaya Produksi = Total Bahan Baku + Total Tenaga Kerja + Total Overhead
```

**Contoh JO-2026-001:**
```
Rp 4.212.500 + Rp 2.210.000 + Rp 1.025.000 = Rp 7.447.500
```

#### 5. Total Pendapatan

```
Total Pendapatan = harga_jual × jumlah
```

**Contoh JO-2026-001:**
```
Rp 95.000 × 100 pcs = Rp 9.500.000
```

**Penting:** `harga_jual` di database adalah harga **per pcs**, bukan total. Sistem mengalikan dengan `jumlah` untuk mendapatkan total pendapatan.

#### 6. Estimasi Laba

```
Estimasi Laba = Total Pendapatan − Total Biaya Produksi
```

**Contoh JO-2026-001:**
```
Rp 9.500.000 − Rp 7.447.500 = Rp 2.052.500
```

#### 7. Margin Keuntungan

```
Margin (%) = (Estimasi Laba ÷ Total Pendapatan) × 100
```

**Contoh JO-2026-001:**
```
(Rp 2.052.500 ÷ Rp 9.500.000) × 100 = 21.6%
```

### 7.3 Implementasi Formula dalam Kode

Semua formula diimplementasikan di `src/lib/format.ts`:

```typescript
// Total biaya per kategori
totalMaterial  = (o) => o.materials.reduce((s, m) => s + m.harga * m.qtyUsed, 0)
totalLabor     = (o) => o.labors.reduce((s, l) => s + l.jamKerja * l.tarifPerJam, 0)
totalOverhead  = (o) => o.overheads.reduce((s, o) => s + o.biaya, 0)

// Total biaya produksi
totalProduksi  = (o) => totalMaterial(o) + totalLabor(o) + totalOverhead(o)

// Total pendapatan (harga per pcs × jumlah)
totalPendapatan = (o) => o.hargaJual * o.jumlah

// Estimasi laba
estimasiLaba   = (o) => totalPendapatan(o) - totalProduksi(o)

// Margin (%)
margin         = (o) => totalPendapatan(o) > 0 ? (estimasiLaba(o) / totalPendapatan(o)) * 100 : 0
```

### 7.4 Akumulasi Tingkat Agregat (Laporan)

Untuk laporan keseluruhan, formula diperluas ke semua pesanan:

```
Total Semua Bahan Baku    = Σ totalMaterial(job_order) untuk setiap pesanan
Total Semua Tenaga Kerja  = Σ totalLabor(job_order) untuk setiap pesanan
Total Semua Overhead      = Σ totalOverhead(job_order) untuk setiap pesanan
Total Semua Biaya Produksi = Σ totalProduksi(job_order) untuk setiap pesanan
Total Semua Pendapatan    = Σ totalPendapatan(job_order) untuk setiap pesanan
Total Semua Laba          = Σ estimasiLaba(job_order) untuk setiap pesanan
Rata-rata Margin          = (Total Semua Laba ÷ Total Semua Pendapatan) × 100
```

### 7.5 Aliran Biaya dalam Sistem

```
        BAHAN BAKU              TENAGA KERJA           OVERHEAD
     (Direct Materials)      (Direct Labor)         (Factory OH)
           │                      │                      │
           ▼                      ▼                      ▼
     Σ harga × qty_used     Σ jam × tarif/jam      Σ biaya overhead
           │                      │                      │
           └──────────┬───────────┘──────────────────────┘
                      ▼
           TOTAL BIAYA PRODUKSI
           (per Job Order)
                      │
                      ▼
     ┌────────────────┴────────────────┐
     ▼                                 ▼
  HARGA JUAL × JUMLAH           ESTIMASI LABA
  = TOTAL PENDAPATAN         = Pendapatan − Biaya
     │                                 │
     └────────────┬────────────────────┘
                  ▼
            MARGIN (%)
         = Laba ÷ Pendapatan × 100
```

### 7.6 Komposisi Biaya (Donut Chart di Dashboard)

Dashboard menampilkan proporsi tiga elemen biaya dalam bentuk donut chart:

```
Komposisi Biaya:
├── Bahan Baku    (warna biru muda  #59affd)  → biasanya 50-60% dari total
├── Tenaga Kerja  (warna biru sedang #226ff0) → biasanya 20-30% dari total
└── Overhead      (warna biru terang #8ecffe) → biasanya 10-20% dari total
```

---

## 8. ALUR KERJA (WORKFLOW) SISTEM

### 8.1 Alur Pengguna (User Flow)

```
1. Buka aplikasi
   │
   ▼
2. Dashboard tampil → lihat ringkasan statistik & grafik
   │
   ├──→ Klik "Semua Pesanan" → 3. Halaman Data Pesanan
   │         │
   │         ├──→ Filter by status (Draft/Produksi/Selesai)
   │         ├──→ Search by nomor/pelanggan/produk
   │         ├──→ Klik "Tambah Pesanan" → isi form → simpan
   │         └──→ Klik baris pesanan → 4. Halaman Detail
   │
   ├──→ Klik "Kartu Biaya" (sidebar) → 5. Halaman Kartu Biaya
   │         │
   │         ├──→ Pilih job order dari selector
   │         ├──→ Lihat ringkasan biaya (Job Cost Sheet)
   │         └──→ Klik "Lihat Detail Lengkap" → 4. Halaman Detail
   │
   └──→ Klik "Laporan" (sidebar) → 6. Halaman Laporan
             │
             └──→ Lihat ringkasan & tabel laporan semua pesanan
```

### 8.2 Alur Data (Data Flow) — Tambah Pesanan Baru

```
User mengisi form "Tambah Pesanan"
    │
    ▼
React state form diisi (nomor, pelanggan, produk, jumlah, tanggal, hargaJual, status)
    │
    ▼
Klik "Simpan Pesanan"
    │
    ▼
App.tsx → handleAddOrder(data)
    │
    ▼
jobOrderService.ts → createOrder(data)
    │
    ▼
supabase.from('job_orders').insert({ id, nomor, pelanggan, ... })
    │
    ▼
Database: INSERT record ke tabel job_orders
    ├── Trigger validate_harga_jual() → cek harga_jual ≥ 0
    ├── Trigger validate_jumlah() → cek jumlah > 0
    └── Trigger update_updated_at() → (skip, ini INSERT bukan UPDATE)
    │
    ▼
Sukses → React state diupdate (orders ditambah di awal array)
    │
    ▼
UI menampilkan pesanan baru di tabel
```

### 8.3 Alur Data — Tambah Material ke Pesanan

```
User berada di halaman Detail Job Order
    │
    ▼
Klik "+ Tambah" di section Bahan Baku
    │
    ▼
Baris form muncul di tabel (inline)
    │
    ▼
User mengisi: kode, nama, satuan, harga, qty_used, stok
    │
    ▼
Klik tombol check (✓)
    │
    ▼
handleAddMaterial()
    │
    ▼
jobOrderService.ts → addMaterial(order.id, materialForm)
    │
    ▼
supabase.from('materials').insert({ id, job_order_id, kode, nama, ... })
    │
    ▼
Database: INSERT record ke tabel materials
    └── FK constraint: job_order_id harus ada di job_orders
    │
    ▼
Sukses → onOrderChange() dipanggil
    │
    ▼
App.tsx → setOrders() mengupdate state pesanan
    │
    ▼
UI refresh: tabel material, total bahan baku, ringkasan biaya semua terupdate
```

### 8.4 Alur Data — Load Awal

```
Aplikasi pertama kali dimuat (App.tsx)
    │
    ▼
useEffect → loadOrders()
    │
    ▼
Loading state ditampilkan (spinner + "Memuat data dari database…")
    │
    ▼
jobOrderService.ts → fetchAllOrders()
    │
    ▼
supabase.from('job_orders')
  .select('*, materials(*), labors(*), overheads(*)')
  .order('tanggal', { ascending: false })
    │
    ▼
Database: SELECT dengan nested join
    ├── Ambil semua job_orders (urut by tanggal desc)
    ├── Untuk setiap job_order, ambil semua materials terkait
    ├── Untuk setiap job_order, ambil semua labors terkait
    └── Untuk setiap job_order, ambil semua overheads terkait
    │
    ▼
Hasil JSON dikembalikan ke service layer
    │
    ▼
Service layer: map snake_case → camelCase
    ├── mapJobOrder(): harga_jual → hargaJual, job_order_id → jobOrderId, dll
    ├── mapMaterial(): qty_used → qtyUsed
    ├── mapLabor(): jenis_pekerjaan → jenisPekerjaan, jam_kerja → jamKerja, dll
    └── mapOverhead(): (sudah camelCase)
    │
    ▼
React state `orders` diisi dengan array JobOrder[]
    │
    ▼
Loading selesai → Dashboard dirender dengan data
```

### 8.5 Alur Data — Error Handling

```
Jika koneksi ke Supabase gagal (App.tsx)
    │
    ▼
Error state ditampilkan:
    ├── Ikon error merah
    ├── Pesan: "Koneksi Database Gagal"
    ├── Detail error dari exception
    └── Tombol "Coba Lagi" → reload data
```

---

## 9. STRUKTUR FOLDER & PENJELASAN FILE

```
project/
│
├── src/                              # Source code aplikasi React
│   ├── main.tsx                      # Entry point React (render ke #root)
│   ├── App.tsx                       # Komponen utama: routing, state management, data loading
│   ├── types.ts                      # Definisi tipe TypeScript (JobOrder, Material, Labor, dll)
│   ├── index.css                     # Global styles + Tailwind directives + komponen utility
│   ├── vite-env.d.ts                 # Type declaration untuk Vite
│   │
│   ├── components/                   # Komponen UI yang dapat digunakan ulang
│   │   ├── Sidebar.tsx              # Sidebar navigation + Topbar (search, notif, profile)
│   │   ├── StatCard.tsx             # Kartu statistik dengan ikon & trend indicator
│   │   ├── StatusBadge.tsx          # Badge status pesanan (Draft/Produksi/Selesai)
│   │   └── Charts.tsx               # Bar chart & Donut chart (SVG-based, no library)
│   │
│   ├── pages/                        # Halaman-halaman aplikasi
│   │   ├── Dashboard.tsx            # Halaman dashboard dengan statistik & grafik
│   │   ├── Pesanan.tsx              # Halaman daftar pesanan + modal tambah
│   │   ├── JobDetail.tsx            # Halaman detail pesanan + CRUD biaya
│   │   ├── KartuBiaya.tsx           # Halaman kartu biaya (Job Cost Sheet)
│   │   └── Laporan.tsx              # Halaman laporan ringkasan & detail
│   │
│   ├── lib/                          # Logika bisnis & utility
│   │   ├── supabase.ts              # Konfigurasi & inisialisasi Supabase client
│   │   ├── jobOrderService.ts       # Layer akses data: CRUD untuk semua entitas
│   │   ├── format.ts                # Helper: formatRupiah, formatDate, formula akuntansi
│   │   └── (sampleData.ts)          # Data contoh statis (digunakan jika DB tidak tersedia)
│   │
│   └── data/
│       └── sampleData.ts            # 6 pesanan contoh untuk demo/UI testing
│
├── backend/                          # Script SQL untuk setup database
│   ├── schema.sql                   # DDL: CREATE TABLE, index, RLS, triggers
│   ├── seed.sql                     # Data awal: 12 job order lengkap dengan relasi
│   ├── seed_tambahan.sql            # Data tambahan: 3 job order ekstra
│   └── triggers.sql                 # Trigger functions terpisah
│
├── supabase_schema.sql               # Duplikat schema.sql (untuk Supabase SQL Editor)
├── supabase_seed.sql                 # Duplikat seed.sql (untuk Supabase SQL Editor)
│
├── frontend/                         # Versi legacy (vanilla HTML/CSS/JS)
│   ├── index.html                   # Struktur HTML 3 halaman (Dashboard, Pesanan, Laporan)
│   ├── style.css                    # Styling manual dengan CSS variables
│   └── script.js                    # Logic: fetch dari Supabase REST API, render DOM
│
├── .github/workflows/
│   └── deploy.yml                   # CI/CD: build & deploy ke GitHub Pages
│
├── index.html                        # HTML entry point untuk Vite
├── package.json                      # Dependencies & scripts (dev, build, lint, typecheck)
├── vite.config.ts                    # Konfigurasi Vite (plugin React, path alias @/)
├── tailwind.config.js                # Konfigurasi Tailwind (custom colors, animations)
├── postcss.config.js                 # PostCSS config (Tailwind + Autoprefixer)
├── tsconfig.json                     # Root TypeScript config
├── tsconfig.app.json                 # TypeScript config untuk aplikasi
├── tsconfig.node.json                # TypeScript config untuk Vite config
├── eslint.config.js                  # ESLint config (React hooks, TypeScript)
└── .env                              # Environment variables (VITE_SUPABASE_URL, dll)
```

### 9.1 Penjelasan File Kunci

#### `src/types.ts` — Definisi Tipe

Mendefinisikan struktur data untuk seluruh aplikasi:
- `OrderStatus` — Union type: `'Draft' | 'Produksi' | 'Selesai'`
- `Material` — Interface untuk bahan baku
- `Labor` — Interface untuk tenaga kerja
- `OverheadItem` — Interface untuk biaya overhead
- `JobOrder` — Interface utama yang menggabungkan semua entitas
- `PageKey` — Union type untuk navigasi antar halaman

#### `src/lib/jobOrderService.ts` — Layer Akses Data

File ini adalah **satu-satunya jembatan** antara frontend dan database. Semua operasi database melewati file ini. Fungsi yang tersedia:

| Fungsi | Operasi | Tabel |
|---|---|---|
| `fetchAllOrders()` | SELECT semua pesanan + nested relations | job_orders + materials + labors + overheads |
| `fetchOrderById(id)` | SELECT satu pesanan by id | job_orders + materials + labors + overheads |
| `createOrder(data)` | INSERT pesanan baru | job_orders |
| `updateOrder(id, data)` | UPDATE header pesanan | job_orders |
| `deleteOrder(id)` | DELETE pesanan (cascade) | job_orders |
| `addMaterial(jobOrderId, material)` | INSERT bahan baku | materials |
| `updateMaterial(id, data)` | UPDATE bahan baku | materials |
| `deleteMaterial(id)` | DELETE bahan baku | materials |
| `addLabor(jobOrderId, labor)` | INSERT tenaga kerja | labors |
| `updateLabor(id, data)` | UPDATE tenaga kerja | labors |
| `deleteLabor(id)` | DELETE tenaga kerja | labors |
| `addOverhead(jobOrderId, overhead)` | INSERT overhead | overheads |
| `updateOverhead(id, data)` | UPDATE overhead | overheads |
| `deleteOverhead(id)` | DELETE overhead | overheads |

File ini juga berisi fungsi **mapping** yang menerjemahkan nama kolom database (snake_case) ke nama properti TypeScript (camelCase):
- `harga_jual` → `hargaJual`
- `qty_used` → `qtyUsed`
- `jenis_pekerjaan` → `jenisPekerjaan`
- `jam_kerja` → `jamKerja`
- `tarif_per_jam` → `tarifPerJam`

#### `src/lib/format.ts` — Formula & Formatting

Berisi semua formula akuntansi (lihat section 7) dan fungsi formatting:
- `formatRupiah(n)` — Format ke "Rp 1.234.567"
- `formatRupiahShort(n)` — Format ringkas: "Rp 1.2 jt", "Rp 850 rb"
- `formatDate(iso)` — Format tanggal Indonesia: "02 Okt 2026"

#### `src/lib/supabase.ts` — Konfigurasi Supabase

Menginisialisasi Supabase client dengan URL dan anon key. Membaca dari environment variable `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` saat development, dengan fallback ke nilai hardcoded untuk deployment ke GitHub Pages (yang tidak mendukung environment variables).

#### `src/App.tsx` — Komponen Utama

Orkestrator aplikasi yang mengatur:
- State management (orders, loading, error, page, selectedOrderId, sidebarCollapsed, searchQuery)
- Data loading awal via `useEffect` → `fetchAllOrders()`
- Routing antar halaman (state-based, bukan URL-based)
- Handler untuk tambah pesanan, pilih pesanan, navigasi, dan update data pesanan
- Tampilan loading (spinner) dan error (retry button)

---

## 10. DATA CONTOH (SAMPLE DATA)

### 10.1 Data di Database (seed.sql)

Sistem dilengkapi dengan **12 job order** realistis yang mencakup berbagai jenis pelanggan dan produk:

| No. | Pelanggan | Produk | Jumlah | Harga/pcs | Status |
|---|---|---|---|---|---|
| JO-2026-001 | PT Garuda Sport | Kaos Jersey Futsal | 100 | Rp 95.000 | Selesai |
| JO-2026-002 | Kopi Kenangan Manis | Kaos Promo Grand Opening | 250 | Rp 78.000 | Selesai |
| JO-2026-003 | SMA Negeri 3 Semarang | Kaos Angkatan 2026 | 180 | Rp 82.000 | Selesai |
| JO-2026-004 | Komunitas Lari Semarang | Kaos Event Half Marathon | 120 | Rp 88.000 | Selesai |
| JO-2026-005 | CV Berkah Jaya | Seragam Karyawan Polo Shirt | 75 | Rp 125.000 | Selesai |
| JO-2026-006 | Universitas Diponegoro | Kaos KKN Periode 2026 | 350 | Rp 72.000 | Selesai |
| JO-2026-007 | OSIS SMP Negeri 7 Solo | Kaos Pensi & Perpisahan | 150 | Rp 85.000 | Selesai |
| JO-2026-008 | PT Astra Motor Jateng | Kaos Seragam Mekanik | 60 | Rp 145.000 | Produksi |
| JO-2026-009 | Warung Nasi Bu Sari | Kaos Seragam Pelayan | 25 | Rp 98.000 | Produksi |
| JO-2026-010 | Tim Basket Undip | Jersey Basket Sublim Full Print | 40 | Rp 175.000 | Produksi |
| JO-2026-011 | Dinas Pemuda Kota Semarang | Kaos Hari Sumpah Pemuda | 500 | Rp 68.000 | Draft |
| JO-2026-012 | Klinik Sehat Bersama | Seragam Tenaga Medis | 45 | Rp 135.000 | Draft |

Setiap job order memiliki:
- **5 jenis bahan baku** (kain, tinta, benang, aksesoris, packaging)
- **3-4 tenaga kerja** (variasi: Sablon/Sublim/Bordir, Jahit, Finishing, QC)
- **4-5 biaya overhead** (listrik, penyusutan mesin, air & kebersihan, opsional sewa)

### 10.2 Data di Frontend (sampleData.ts)

Terdapat juga 6 pesanan contoh statis di `src/data/sampleData.ts` yang digunakan untuk UI testing tanpa database. Data ini sudah tidak digunakan saat sistem terhubung ke Supabase, tetapi tetap ada sebagai fallback.

### 10.3 Tenaga Kerja yang Terdaftar

| Nama | Keahlian | Tarif/Jam |
|---|---|---|
| Andi Saputra | Sablon | Rp 25.000 |
| Budi Santoso | Sublim | Rp 28.000 |
| Dewi Lestari | Finishing / Bordir | Rp 18.000 / Rp 28.000 |
| Rudi Hartono | Jahit | Rp 22.000 |
| Siti Aminah | Finishing | Rp 18.000 |
| Joko Widodo | Quality Control | Rp 20.000 |

### 10.4 Jenis Kain yang Digunakan

| Kode | Nama Kain | Harga/meter | Karakteristik |
|---|---|---|---|
| KBL-001 | Cotton Combed 30s | Rp 28.000 | Halus, nyaman, untuk kaos daily |
| KBL-002 | Cotton Combed 24s | Rp 32.000 | Lebih tebal, premium |
| KBL-003 | Dryfit Polyester | Rp 35.000 | Adem, untuk olahraga |
| KBL-005 | Cotton PE 20s | Rp 26.000 | Ekonomis, untuk sablon |
| KBL-006 | Lacoste PE | Rp 42.000 | Untuk polo shirt |
| KBL-007 | Drill Cotton | Rp 38.000 | Untuk seragam kerja |
| KBL-008 | Dryfit Premium | Rp 48.000 | Olahraga premium |
| KBL-009 | Cotton Combed 20s | Rp 24.000 | Ekonomis, volume besar |
| KBL-010 | Katun Ripstop | Rp 55.000 | Tahan lama, seragam medis |

---

## 11. DEPLOYMENT

### 11.1 Pipeline CI/CD

Sistem menggunakan GitHub Actions untuk deploy otomatis ke GitHub Pages:

```
Push ke branch "main"
    │
    ▼
GitHub Actions trigger (.github/workflows/deploy.yml)
    │
    ├── 1. Checkout code dari repository
    ├── 2. Setup Node.js 20
    ├── 3. npm install (install dependencies)
    ├── 4. npm run build (Vite build → dist/)
    ├── 5. Copy dist/index.html → dist/404.html (SPA fallback)
    └── 6. Deploy dist/ ke branch gh-pages (peaceiris/actions-gh-pages)
    │
    ▼
GitHub Pages menyajikan aplikasi di:
https://<username>.github.io/<repository>/
```

### 11.2 Konfigurasi Build

- **Build command:** `npm run build` (menjalankan `vite build`)
- **Output directory:** `dist/`
- **SPA fallback:** `404.html` disalin dari `index.html` agar routing client-side bekerja saat user refresh halaman
- **Node version:** 20
- **Deployment method:** `peaceiris/actions-gh-pages@v3` dengan `force_orphan: true` (clean deploy setiap kali)

### 11.3 Environment Variables

Sistem membaca konfigurasi Supabase dari environment variables:

| Variable | Lokasi | Fungsi |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | `.env` | Anon key untuk akses API |

Jika environment variables tidak tersedia (seperti di GitHub Pages), sistem menggunakan nilai fallback yang di-hardcoded di `src/lib/supabase.ts`.

---

## 12. KEAMANAN & CATATAN PENGEMBANGAN

### 12.1 Status Keamanan Saat Ini (MVP)

Sistem ini adalah **MVP (Minimum Viable Product)** yang dirancang untuk presentasi dan demo. Beberapa aspek keamanan yang perlu diperhatikan:

| Aspek | Status Saat Ini | Rekomendasi Production |
|---|---|---|
| Row Level Security | Aktif, tapi policy `USING (true)` (open all) | Ganti dengan policy berbasis `auth.uid()` |
| Authentication | Tidak ada (anon key access) | Tambahkan Supabase Auth (email/password) |
| API Keys | Anon key terlihat di frontend | Anon key memang public, tapi RLS harus ketat |
| Input Validation | Frontend + database triggers | Tambahkan validasi server-side yang lebih lengkap |
| HTTPS | Supabase & GitHub Pages sudah HTTPS | Sudah aman |

### 12.2 Yang Sudah Berfungsi dengan Baik

- Validasi database via triggers (harga_jual ≥ 0, jumlah > 0)
- Foreign key constraint dengan CASCADE delete
- Index database untuk performa query
- Type safety TypeScript untuk mencegah bug frontend
- Error handling untuk koneksi database gagal
- Loading state saat mengambil data
- Responsive design (desktop & tablet)

### 12.3 Potensi Pengembangan Lanjutan

| Fitur | Penjelasan |
|---|---|
| Authentication | Tambah login untuk membatasi akses ke sistem |
| Export laporan | Implementasi export ke PDF/Excel (tombol sudah ada) |
| Grafik trend waktu | Tambah line chart untuk trend biaya & laba per bulan |
| Manajemen stok | Otomatis kurangi stok saat material digunakan |
| Multi-user & role | Admin, operator produksi, akuntan dengan hak akses berbeda |
| Notifikasi | Real-time notifikasi saat pesanan status berubah |
| Mobile app | Responsive untuk smartphone atau PWA |
| Backup & restore | Export/import data database |
| Audit trail | Log siapa mengubah apa dan kapan |

---

*Dokumentasi ini menjelaskan seluruh aspek Sistem Akuntansi Biaya Pesanan (Job Order Costing) untuk Konveksi & Sablon Kaos Custom — dari konsep akuntansi, arsitektur teknologi, struktur database, hingga alur kerja dan logika perhitungan.*
