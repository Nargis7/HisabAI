import React, { useState } from 'react';
import { ShoppingBag, Search, CheckCircle2, Clock, Calendar, ArrowRight, User, Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { Order, Customer } from '../../types';
import { NewOrderModal } from '../modals/NewOrderModal';

interface OrdersPageProps {
  orders: Order[];
  customers?: Customer[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSelectCustomer: (customerId: string) => void;
  onSaveOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  customers = [],
  onUpdateOrderStatus,
  onSelectCustomer,
  onSaveOrder,
  onDeleteOrder
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Customer Advance Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Packaged groceries, special bulk tins, and festival pre-orders awaiting counter pickup.
          </p>
        </div>

        {onSaveOrder && (
          <Button
            onClick={() => setIsNewOrderOpen(true)}
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Order
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name, items..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(
            [
              { id: 'all', label: `All (${orders.length})` },
              { id: 'ready', label: `Ready for Pickup (${readyCount})` },
              { id: 'pending', label: `Preparing (${pendingCount})` },
              { id: 'completed', label: `Completed (${completedCount})` }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid or Empty State */}
      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6 text-indigo-600" />}
          title="No customer advance orders"
          description="Track orders placed in advance by customers. Keep tabs on packaged items, advance deposits, and pickup schedules."
          actionLabel={onSaveOrder ? '+ Create First Order' : undefined}
          onAction={onSaveOrder ? () => setIsNewOrderOpen(true) : undefined}
        />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No matching orders</h4>
          <p className="text-xs text-slate-400 mt-1">
            No advance orders matched your search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {o.orderNumber}
                      </span>
                      <button
                        onClick={() => onSelectCustomer(o.customerId)}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {o.customerName}
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {o.customerPhone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={
                        o.status === 'ready'
                          ? 'Ready for pickup'
                          : o.status === 'completed'
                          ? 'Completed'
                          : 'Preparing / Pending'
                      }
                      size="sm"
                    />
                    {onDeleteOrder && (
                      <button
                        title="Delete Order"
                        onClick={() => onDeleteOrder(o.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Items Content */}
                <div className="my-3 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-800">
                    {o.itemsSummary}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Pickup: <strong className="text-slate-700">{o.pickupDate}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Order Total
                  </span>
                  <span className="font-extrabold text-base text-slate-900 font-mono">
                    ₹{o.totalAmount}
                  </span>
                  {o.depositPaid > 0 && (
                    <span className="text-[11px] text-emerald-600 block">
                      (₹{o.depositPaid} deposit paid)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {o.status === 'pending' && (
                    <Button
                      onClick={() => onUpdateOrderStatus(o.id, 'ready')}
                      variant="primary"
                      size="sm"
                    >
                      Mark Ready
                    </Button>
                  )}

                  {o.status === 'ready' && (
                    <Button
                      onClick={() => onUpdateOrderStatus(o.id, 'completed')}
                      variant="secondary"
                      size="sm"
                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                      Complete Pickup
                    </Button>
                  )}

                  {o.status === 'completed' && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Picked Up
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Order Modal */}
      {isNewOrderOpen && onSaveOrder && (
        <NewOrderModal
          isOpen={isNewOrderOpen}
          onClose={() => setIsNewOrderOpen(false)}
          customers={customers}
          onSaveOrder={onSaveOrder}
        />
      )}
    </div>
  );
};
