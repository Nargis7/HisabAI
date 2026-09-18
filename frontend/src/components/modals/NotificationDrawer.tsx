import React from 'react';
import { Modal } from '../common/Modal';
import { Bell, AlertTriangle, CheckCircle2, Clock, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { NotificationItem, NavigationTab } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectAction: (tab: NavigationTab, targetId?: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectAction,
  onMarkAllRead
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'payment':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-rose-600" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-indigo-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (notif.type === 'payment') {
      onSelectAction('commitments', notif.actionableId);
    } else if (notif.type === 'inventory') {
      onSelectAction('inventory', notif.actionableId);
    } else if (notif.type === 'order') {
      onSelectAction('orders', notif.actionableId);
    } else {
      onSelectAction('dashboard');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shop Notifications & Action Alerts"
      subtitle="Critical payment commitments, inventory warnings, and order pickups."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.filter((n) => !n.read).length} unread alerts
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                n.read
                  ? 'bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-50/80 border-indigo-200 text-slate-900 shadow-2xs hover:bg-indigo-50/40'
              }`}
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200/80 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="font-semibold text-xs text-slate-900">{n.title}</div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
