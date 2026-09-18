import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Package,
  ShoppingBag,
  Clock,
  FileSpreadsheet,
  QrCode,
  Store,
  LogOut,
  Sparkles,
  ShieldCheck,
  Search,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenScan: () => void;
  onOpenVoice: () => void;
  onOpenSearch: () => void;
  pendingCount?: number;
  ordersReadyCount?: number;
  lowStockCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenScan,
  onOpenVoice,
  onOpenSearch,
  pendingCount = 2,
  ordersReadyCount = 4,
  lowStockCount = 2
}) => {
  const isMoreActive = currentTab === 'commitments' || currentTab === 'khata-migration';
  const [isMoreOpen, setIsMoreOpen] = useState(isMoreActive);

  // Keep More open if user is currently on commitments or khata-migration
  React.useEffect(() => {
    if (isMoreActive) {
      setIsMoreOpen(true);
    }
  }, [isMoreActive]);

  const primaryNavItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Home',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'customers' as NavigationTab,
      label: 'Customers',
      icon: <Users className="w-4 h-4" />,
      badge: pendingCount > 0 ? `${pendingCount} due` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'sales' as NavigationTab,
      label: 'Sales',
      icon: <Receipt className="w-4 h-4" />
    },
    {
      id: 'inventory' as NavigationTab,
      label: 'Inventory',
      icon: <Package className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'orders' as NavigationTab,
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: ordersReadyCount > 0 ? `${ordersReadyCount} ready` : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans">
                Hisab<span className="text-indigo-600">AI</span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-tight">
          The operating memory for local commerce
        </p>
      </div>

      {/* Dominant Primary CTA: Scan Customer */}
      <div className="p-4 pb-2">
        <button
          id="btn-sidebar-scan-customer"
          onClick={onOpenScan}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="p-1 rounded-md bg-white/15 text-white group-hover:scale-105 transition-transform">
            <QrCode className="w-4 h-4" />
          </div>
          <span>Scan Customer</span>
        </button>

        {/* Quick Memory Search bar trigger */}
        <button
          onClick={onOpenSearch}
          className="w-full mt-2.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Ask shop memory...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav Menu: Home, Customers, Sales, Inventory, Orders, More */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        
        {primaryNavItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More Item */}
        <div>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isMoreActive
                ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={isMoreActive ? 'text-indigo-600' : 'text-slate-400'}>
                <MoreHorizontal className="w-4 h-4" />
              </span>
              <span>More</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isMoreOpen ? 'rotate-180 text-indigo-600' : ''
              }`}
            />
          </button>

          {/* Submenu under More: Commitments & Khata Migration */}
          {isMoreOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
              <button
                onClick={() => onNavigate('commitments')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  currentTab === 'commitments'
                    ? 'text-indigo-700 font-semibold bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pending Commitments</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('khata-migration')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  currentTab === 'khata-migration'
                    ? 'text-indigo-700 font-semibold bg-indigo-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                  <span>Khata Migration</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  OCR
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Voice Assistant Pill */}
      <div className="px-4 py-2 border-t border-slate-100">
        <button
          onClick={onOpenVoice}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-xs transition-colors group text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-[11px] group-hover:text-indigo-700">
                Voice Entry AI
              </div>
              <div className="text-[10px] text-slate-500">Record in Hindi / Hinglish</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-indigo-600 px-1.5 py-0.5 rounded bg-indigo-50">
            Mic
          </span>
        </button>
      </div>

      {/* Store Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              RK
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Rajesh Kirana & Store
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Memory Active</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            title="Switch account / Login screen"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
