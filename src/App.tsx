import { useState, useEffect, useCallback } from 'react';
import Sidebar, { Topbar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pesanan from './pages/Pesanan';
import JobDetail from './pages/JobDetail';
import KartuBiaya from './pages/KartuBiaya';
import Laporan from './pages/Laporan';
import { fetchAllOrders, createOrder } from './lib/jobOrderService';
import type { PageKey, JobOrder } from './types';

const pageMeta: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan performa produksi & keuangan' },
  pesanan: { title: 'Data Pesanan', subtitle: 'Kelola semua job order produksi' },
  detail: { title: 'Detail Job Order', subtitle: 'Rincian biaya bahan, tenaga kerja & overhead' },
  'kartu-biaya': { title: 'Kartu Biaya Pesanan', subtitle: 'Job cost sheet untuk setiap pesanan' },
  laporan: { title: 'Laporan', subtitle: 'Ringkasan biaya, pendapatan & laba' },
};

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [orders, setOrders] = useState<JobOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  // Ambil data dari Supabase saat pertama kali mount
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleNavigate = (key: PageKey) => {
    setPage(key);
    if (key !== 'detail') setSelectedOrderId(null);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setPage('detail');
  };

  const handleAddOrder = async (
    data: Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads'>
  ) => {
    try {
      const newOrder = await createOrder(data);
      setOrders((prev) => [newOrder, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal membuat pesanan');
    }
  };

  // Dipanggil dari JobDetail saat material/labor/overhead berubah
  const handleOrderChange = (updated: JobOrder) => {
    setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
  };

  const meta = pageMeta[page];

  // Tampilan loading awal
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-gray-500">Memuat data dari database…</p>
        </div>
      </div>
    );
  }

  // Tampilan error koneksi
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-lg font-semibold text-red-600">Koneksi Database Gagal</p>
          <p className="mb-6 text-sm text-gray-500">{error}</p>
          <button
            onClick={loadOrders}
            className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-50">
      <Sidebar active={page} onNavigate={handleNavigate} collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
          onSearch={setSearchQuery}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {page === 'dashboard' && (
            <Dashboard orders={orders} onSelectOrder={handleSelectOrder} onNavigate={handleNavigate} />
          )}
          {page === 'pesanan' && (
            <Pesanan orders={orders} onSelectOrder={handleSelectOrder} onAddOrder={handleAddOrder} searchQuery={searchQuery} />
          )}
          {page === 'detail' && selectedOrder && (
            <JobDetail order={selectedOrder} onBack={() => handleNavigate('pesanan')} onOrderChange={handleOrderChange} />
          )}
          {page === 'kartu-biaya' && <KartuBiaya orders={orders} onSelectOrder={handleSelectOrder} />}
          {page === 'laporan' && <Laporan orders={orders} />}
        </main>
      </div>
    </div>
  );
}
