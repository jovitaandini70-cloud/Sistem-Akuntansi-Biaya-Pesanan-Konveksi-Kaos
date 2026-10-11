// ============================================================
// script.js — Sistem Akuntansi Biaya Pesanan Konveksi Kaos
// Terhubung ke Supabase via REST API (tidak butuh Node.js)
// ============================================================

const SUPABASE_URL     = 'https://wyregioulsmolaltauym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cmVnaW91bHNtb2xhbHRhdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1OTQ3NjMsImV4cCI6MjEwNjE3MDc2M30.qqogm2fYYrAiijMCdypMeY4AlFnulObXhpVGUPMDEI4';

// ── Helper: fetch dari Supabase ───────────────────────────────
async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Format Rupiah ─────────────────────────────────────────────
function rp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

// ── Badge status ──────────────────────────────────────────────
function badge(status) {
  const map = { Draft: 'badge-draft', Produksi: 'badge-produksi', Selesai: 'badge-selesai' };
  return `<span class="badge ${map[status] || 'badge-draft'}">${status}</span>`;
}

// ── Kalkulasi biaya per order ─────────────────────────────────
function hitungBiaya(order) {
  const bahan = (order.materials || []).reduce((s, m) => s + m.harga * m.qty_used, 0);
  const tk    = (order.labors    || []).reduce((s, l) => s + l.jam_kerja * l.tarif_per_jam, 0);
  const oh    = (order.overheads || []).reduce((s, o) => s + Number(o.biaya), 0);
  const total = bahan + tk + oh;
  const pendapatan = order.harga_jual * order.jumlah;
  const laba  = pendapatan - total;
  const margin = pendapatan > 0 ? ((laba / pendapatan) * 100).toFixed(1) : '0.0';
  return { bahan, tk, oh, total, pendapatan, laba, margin };
}

// ── Muat data dari Supabase ───────────────────────────────────
let allOrders = [];

async function loadData() {
  showLoading(true);
  try {
    // Ambil job_orders beserta relasi via select
    const orders = await sbFetch(
      'job_orders?select=*,materials(*),labors(*),overheads(*)&order=tanggal.desc'
    );
    allOrders = orders;
    renderDashboard(orders);
    renderPesanan(orders);
    renderLaporan(orders);
    showLoading(false);
  } catch (err) {
    showLoading(false);
    showError(err.message);
  }
}

// ── Dashboard ─────────────────────────────────────────────────
function renderDashboard(orders) {
  const total     = orders.length;
  const produksi  = orders.filter(o => o.status === 'Produksi').length;
  let totalPend   = 0;
  let totalLaba   = 0;

  orders.forEach(o => {
    const b = hitungBiaya(o);
    totalPend += b.pendapatan;
    totalLaba += b.laba;
  });

  document.getElementById('statTotal').textContent     = total;
  document.getElementById('statProduksi').textContent  = produksi;
  document.getElementById('statPendapatan').textContent = rp(totalPend);
  document.getElementById('statLaba').textContent      = rp(totalLaba);

  const tbody = document.querySelector('#tblDashboard tbody');
  tbody.innerHTML = orders.slice(0, 5).map(o => `
    <tr>
      <td><strong style="color:#3b82f6">${o.nomor}</strong></td>
      <td>${o.pelanggan}</td>
      <td>${o.produk}</td>
      <td style="text-align:center">${o.jumlah} pcs</td>
      <td>${o.tanggal}</td>
      <td>${badge(o.status)}</td>
    </tr>
  `).join('');
}

// ── Data Pesanan ──────────────────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';

function renderPesanan(orders) {
  let list = orders;
  if (currentFilter !== 'all') list = list.filter(o => o.status === currentFilter);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(o =>
      o.nomor.toLowerCase().includes(q) ||
      o.pelanggan.toLowerCase().includes(q) ||
      o.produk.toLowerCase().includes(q)
    );
  }

  const tbody = document.querySelector('#tblPesanan tbody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#94a3b8">Tidak ada pesanan ditemukan</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(o => {
    const b = hitungBiaya(o);
    return `
      <tr>
        <td><strong style="color:#3b82f6">${o.nomor}</strong></td>
        <td>${o.pelanggan}</td>
        <td>${o.produk}</td>
        <td style="text-align:center">${o.jumlah} pcs</td>
        <td>${o.tanggal}</td>
        <td>${badge(o.status)}</td>
        <td class="num">${rp(o.harga_jual)}</td>
        <td class="num">${rp(b.pendapatan)}</td>
      </tr>`;
  }).join('');
}

// ── Laporan ───────────────────────────────────────────────────
function renderLaporan(orders) {
  const tbody = document.querySelector('#tblLaporan tbody');
  tbody.innerHTML = orders.map(o => {
    const b = hitungBiaya(o);
    const labaClass = b.laba >= 0 ? 'laba-pos' : 'laba-neg';
    return `
      <tr>
        <td><strong style="color:#3b82f6">${o.nomor}</strong></td>
        <td>${o.pelanggan}</td>
        <td>${o.produk}</td>
        <td style="text-align:center">${o.jumlah}</td>
        <td class="num">${rp(b.bahan)}</td>
        <td class="num">${rp(b.tk)}</td>
        <td class="num">${rp(b.oh)}</td>
        <td class="num">${rp(b.total)}</td>
        <td class="num">${rp(b.pendapatan)}</td>
        <td class="num ${labaClass}">${rp(b.laba)}</td>
        <td style="text-align:right">${b.margin}%</td>
      </tr>`;
  }).join('');
}

// ── Navigasi ──────────────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.page;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ── Filter & Search ───────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;
    renderPesanan(allOrders);
  });
});

document.getElementById('searchInput').addEventListener('input', e => {
  currentSearch = e.target.value;
  renderPesanan(allOrders);
});

// ── Loading / Error helpers ───────────────────────────────────
function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('hidden', !show);
}
function showError(msg) {
  document.getElementById('errorMsg').textContent = 'Gagal memuat data: ' + msg;
  document.getElementById('errorOverlay').classList.remove('hidden');
}

// ── Init ──────────────────────────────────────────────────────
loadData();
