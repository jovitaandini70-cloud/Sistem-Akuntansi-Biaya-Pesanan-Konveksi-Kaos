import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ReceiptText,
  BarChart3,
  Shirt,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PageKey } from '../types';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ReceiptText,
  BarChart3,
};

const navItems: { key: PageKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { key: 'pesanan', label: 'Data Pesanan', icon: 'ClipboardList' },
  { key: 'kartu-biaya', label: 'Kartu Biaya', icon: 'ReceiptText' },
  { key: 'laporan', label: 'Laporan', icon: 'BarChart3' },
];

export default function Sidebar({
  active,
  onNavigate,
  collapsed,
}: {
  active: PageKey;
  onNavigate: (key: PageKey) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-64'
      } shrink-0 bg-white border-r border-brand-100 flex flex-col transition-all duration-300 h-screen sticky top-0`}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-brand-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Shirt size={22} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-ink-900 text-sm leading-tight">JobOrder</p>
            <p className="text-xs text-ink-400 leading-tight">Costing System</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Menu Utama</p>
        )}
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = active === item.key || (active === 'detail' && item.key === 'pesanan');
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`nav-item w-full ${isActive ? 'nav-item-active' : ''} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-4 border border-brand-200/50">
            <div className="flex items-center gap-2 mb-1.5">
              <Settings size={16} className="text-brand-600" />
              <p className="text-xs font-bold text-brand-700">MVP Mode</p>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">
              Data demo untuk presentasi. Belum terhubung ke database.
            </p>
          </div>
        </div>
      )}

      <div className={`flex items-center gap-3 px-4 h-14 border-t border-brand-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-200 text-brand-700 font-bold text-sm">
          AD
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-ink-800 leading-tight truncate">Admin Produksi</p>
              <p className="text-xs text-ink-400 leading-tight truncate">admin@konveksi.co</p>
            </div>
            <LogOut size={18} className="text-ink-400 cursor-pointer hover:text-red-500 transition-colors" />
          </>
        )}
      </div>
    </aside>
  );
}

export function Topbar({
  title,
  subtitle,
  onToggleSidebar,
  onSearch,
}: {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
  onSearch?: (q: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-brand-100 h-16 flex items-center px-6 gap-4">
      <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-brand-50 text-ink-500 transition-colors">
        <ChevronRight size={20} className="rotate-180" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-ink-900 leading-tight truncate">{title}</h1>
        <p className="text-xs text-ink-400 leading-tight truncate">{subtitle}</p>
      </div>
      <div className="hidden md:flex relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Cari pesanan, pelanggan..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-64 lg:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50/50 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all"
        />
      </div>
      <button className="relative p-2.5 rounded-xl hover:bg-brand-50 text-ink-500 transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-sm">
        AD
      </div>
    </header>
  );
}
