import React, { useState } from 'react';
import { Clock, Send, CheckCircle2, AlertCircle, Calendar, Phone, Search, Sparkles, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { EmptyState } from '../common/EmptyState';
import { Customer } from '../../types';

interface CommitmentsPageProps {
  customers: Customer[];
  onOpenSendReminder: (customer: Customer) => void;
  onSettleBalance: (customerId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const CommitmentsPage: React.FC<CommitmentsPageProps> = ({
  customers,
  onOpenSendReminder,
  onSettleBalance,
  onSelectCustomer
}) => {
  const [filter, setFilter] = useState<'all' | 'due-today' | 'pending' | 'settled'>('all');
  const [search, setSearch] = useState('');

  // Purely computed from real persistent customer data
  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingAmount, 0);
  const pendingCustomers = customers.filter((c) => c.outstandingAmount > 0);
  const dueTodayCustomers = customers.filter(
    (c) => c.outstandingAmount > 0 && Boolean(c.promisedDueDate)
  );
  const dueTodayTotal = dueTodayCustomers.reduce((sum, c) => sum + c.outstandingAmount, 0);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.replace(/\D/g, '').includes(search.replace(/\D/g, ''));

    if (!matchesSearch) return false;
    if (filter === 'due-today') return dueTodayCustomers.some((d) => d.id === c.id);
    if (filter === 'pending') return c.outstandingAmount > 0;
    if (filter === 'settled') return c.outstandingAmount === 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Payment Commitments & Baaki
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent, trust-based neighbourhood payment schedules. No predatory scoring—just clear commitments.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          icon={<AlertCircle className="w-4 h-4" />}
          title="Total Money Outside"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          subtitle={
            pendingCustomers.length > 0
              ? `Across ${pendingCustomers.length} customer accounts`
              : 'No pending balances'
          }
          tone="amber"
        />

        <MetricCard
          icon={<Calendar className="w-4 h-4" />}
          title="Commitments Scheduled"
          value={`₹${dueTodayTotal.toLocaleString('en-IN')}`}
          subtitle={
            dueTodayCustomers.length > 0
              ? `${dueTodayCustomers.length} customers with promised due dates`
              : 'No specific due dates set'
          }
        />

        <MetricCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          title="Settled Customers"
          value={String(customers.filter((c) => c.outstandingAmount === 0).length)}
          subtitle="Fully clear accounts in shop memory"
          tone="emerald"
        />
      </div>

      {/* Filter and List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name or phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(
              [
                { id: 'all', label: `All (${customers.length})` },
                { id: 'pending', label: `Pending Udhaar (${pendingCustomers.length})` },
                { id: 'due-today', label: `Due Dates (${dueTodayCustomers.length})` },
                { id: 'settled', label: 'Clear' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filter === t.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commitment Items Table / List */}
        {customers.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-6 h-6 text-indigo-600" />}
            title="No customer commitments yet"
            description="When you record a counter purchase on credit or khata, customer payment promises and pending balances will be tracked here automatically."
          />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No customer commitments matched your criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {c.name.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCustomer(c.id)}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {c.name}
                      </button>
                      <StatusBadge
                        status={c.outstandingAmount > 0 ? 'Payment Pending' : 'Paid in Full'}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>{c.phone}</span>
                      {c.address && <span className="font-sans text-slate-400 hidden sm:inline">· {c.address}</span>}
                    </div>

                    {c.promisedDueDate && c.outstandingAmount > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 inline-flex mt-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Promised Due Date: <strong>{c.promisedDueDate}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Balance
                    </span>
                    <span
                      className={`text-base font-extrabold font-mono ${
                        c.outstandingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      ₹{c.outstandingAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.outstandingAmount > 0 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          onClick={() => onSettleBalance(c.id)}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Settle
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          onClick={() => onOpenSendReminder(c)}
                          icon={<Send className="w-3.5 h-3.5" />}
                        >
                          Reminder
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectCustomer(c.id)}
                    >
                      Profile →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
