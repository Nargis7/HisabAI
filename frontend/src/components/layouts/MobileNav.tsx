import React from 'react';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Package,
  QrCode,
  MoreHorizontal
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileNavProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenScan: () => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onNavigate,
  onOpenScan,
  onOpenMore
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 px-3 py-1.5 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Customers */}
        <button
          onClick={() => onNavigate('customers')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'customers' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Customers</span>
        </button>

        {/* Prominent Center Scan Button */}
        <div className="relative -top-3">
          <button
            onClick={onOpenScan}
            aria-label="Scan Customer"
            className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center shadow-md ring-4 ring-white transition-transform active:scale-95"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>

        {/* Sales */}
        <button
          onClick={() => onNavigate('sales')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentTab === 'sales' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Receipt className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Sales</span>
        </button>

        {/* More Menu (Inventory, Orders, Commitments, Migration) */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            ['inventory', 'orders', 'commitments', 'khata-migration'].includes(currentTab)
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>
    </div>
  );
};
