import { useState } from 'react';
import Sidebar, { Topbar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pesanan from './pages/Pesanan';
import JobDetail from './pages/JobDetail';
import KartuBiaya from './pages/KartuBiaya';
import Laporan from './pages/Laporan';
import { sampleOrders } from './data/sampleData';
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
  const [orders, setOrders] = useState<JobOrder[]>(sampleOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleNavigate = (key: PageKey) => {
    setPage(key);
    if (key !== 'detail') setSelectedOrderId(null);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setPage('detail');
  };

  const handleAddOrder = (data: Omit<JobOrder, 'id' | 'materials' | 'labors' | 'overheads'>) => {
    const newOrder: JobOrder = {
      ...data,
      id: `jo-${Date.now()}`,
      materials: [],
      labors: [],
      overheads: [],
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const meta = pageMeta[page];

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
            <JobDetail order={selectedOrder} onBack={() => handleNavigate('pesanan')} />
          )}
          {page === 'kartu-biaya' && <KartuBiaya orders={orders} onSelectOrder={handleSelectOrder} />}
          {page === 'laporan' && <Laporan orders={orders} />}
        </main>
      </div>
    </div>
  );
}
