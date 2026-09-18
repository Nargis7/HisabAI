import React from 'react';
import {
  Search,
  Mic,
  Bell,
  Sparkles,
  QrCode,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenNotifications: () => void;
  onOpenScan: () => void;
  onToggleMobileMenu: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenVoice,
  onOpenNotifications,
  onOpenScan,
  onToggleMobileMenu,
  unreadCount = 3
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Shop Title */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">
              Rajesh Kirana & General Store
            </h1>
            <p className="text-[11px] text-slate-500">
              Terminal 01 · Shop Memory Synced Today
            </p>
          </div>

          <div className="sm:hidden font-bold text-sm text-slate-900 tracking-tight">
            Hisab<span className="text-indigo-600">AI</span>
          </div>
        </div>

        {/* Center: Global Memory Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 text-xs flex items-center justify-between transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
              <span className="truncate text-slate-500 group-hover:text-slate-700">
                Ask your shop memory... <span className="hidden md:inline text-slate-400">("What did Ramesh buy last time?")</span>
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              Search
            </span>
          </button>
        </div>

        {/* Right: Actions (Voice, Notifications, Mobile Scan) */}
        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            onClick={onOpenVoice}
            title="Record with Voice (Hindi/English)"
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-xs font-semibold transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Quick Scan Customer Header CTA on tablet/desktop */}
          <button
            onClick={onOpenScan}
            title="Scan customer QR code or phone"
            className="hidden lg:flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
