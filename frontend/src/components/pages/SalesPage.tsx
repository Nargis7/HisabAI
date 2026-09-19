import React, { useState } from 'react';
import { Receipt, Search, Filter, Calendar, IndianRupee, Mic, QrCode, ArrowRight, User, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { EmptyState } from '../common/EmptyState';
import { Transaction } from '../../types';

interface SalesPageProps {
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
  onOpenVoice: () => void;
  onSelectCustomer: (customerId: string) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({
  transactions,
  onOpenNewTransaction,
  onOpenVoice,
  onSelectCustomer,
  onDeleteTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerPhone.includes(searchQuery) ||
      t.items.some((it) => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === 'paid') return t.paymentStatus === 'paid';
    if (filter === 'pending') return t.paymentStatus === 'pending' || t.paymentStatus === 'partially-paid';
    return true;
  });

  const totalVolume = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const paidCount = transactions.filter((t) => t.paymentStatus === 'paid').length;
  const pendingCount = transactions.filter(
    (t) => t.paymentStatus === 'pending' || t.paymentStatus === 'partially-paid'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Sales & Transaction Memory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Complete searchable register of cash counter, UPI, and credit transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenVoice}
            variant="outline"
            size="md"
            icon={<Mic className="w-4 h-4 text-indigo-600" />}
          >
            Voice Entry
          </Button>
          <Button
            onClick={onOpenNewTransaction}
            variant="primary"
            size="md"
            icon={<Receipt className="w-4 h-4" />}
          >
            + New Transaction
          </Button>
        </div>
      </div>

      {/* Metric strip if transactions exist */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <MetricCard
            icon={<IndianRupee className="w-4 h-4" />}
            title="Total Recorded Volume"
            value={`₹${totalVolume.toLocaleString('en-IN')}`}
            subtitle={`${transactions.length} total entries`}
          />

          <MetricCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            title="Fully Settled"
            value={String(paidCount)}
            subtitle="Cash & UPI receipts"
            tone="emerald"
          />

          <MetricCard
            icon={<Clock className="w-4 h-4" />}
            title="Credit / Udhaar Sales"
            value={String(pendingCount)}
            subtitle="Khata entries with balance"
            tone="amber"
          />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, phone, or items (chawal, tel)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(
            [
              { id: 'all', label: `All (${transactions.length})` },
              { id: 'paid', label: `Fully Paid (${paidCount})` },
              { id: 'pending', label: `Credit / Khata (${pendingCount})` }
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

      {/* Transaction List or Empty State */}
      {transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-6 h-6 text-indigo-600" />}
          title="No transactions in store register yet"
          description="Every sale recorded here establishes customer purchase habits, updates inventory, and tracks customer credit balances automatically."
          actionLabel="+ Record New Transaction"
          onAction={onOpenNewTransaction}
          secondaryActionLabel="Try Voice Entry"
          onSecondaryAction={onOpenVoice}
        />
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No matching transactions</h4>
          <p className="text-xs text-slate-400 mt-1">
            No transaction records matched your search query.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {t.recordedVia === 'voice_ai' ? (
                    <Mic className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Receipt className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCustomer(t.customerId)}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {t.customerName}
                    </button>
                    <StatusBadge status={t.paymentStatus} size="sm" />
                    {t.recordedVia === 'voice_ai' && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                        Voice AI
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    {t.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{t.date}</span>
                    <span>· Method: {t.paymentMethod}</span>
                    {t.dueDate && (
                      <span className="text-amber-700 font-medium">
                        Due: {t.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{t.totalAmount}
                  </div>
                  {t.balancePending > 0 ? (
                    <div className="text-xs font-semibold text-amber-600">
                      ₹{t.balancePending} Baaki
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-emerald-600">
                      Paid in full
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectCustomer(t.customerId)}
                  >
                    History →
                  </Button>
                  {onDeleteTransaction && (
                    <button
                      title="Delete Transaction"
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
