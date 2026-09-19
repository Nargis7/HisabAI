import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Calendar,
  IndianRupee,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Plus,
  Send,
  Mic,
  ArrowLeft,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { Customer } from '../../types';

interface CustomersPageProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string | null) => void;
  onOpenCreateCustomer: () => void;
  onOpenNewTransaction: (customer: Customer) => void;
  onOpenVoice: () => void;
  onOpenSendReminder: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  onSettleBalance?: (id: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onOpenCreateCustomer,
  onOpenNewTransaction,
  onOpenVoice,
  onOpenSendReminder,
  onEditCustomer,
  onDeleteCustomer,
  onSettleBalance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'frequent' | 'recent'>('all');
  const [profileTab, setProfileTab] = useState<'timeline' | 'warranty' | 'notes'>('timeline');

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  // Filtered customer list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, ''));

    if (!matchesSearch) return false;

    if (filterTab === 'pending') return c.outstandingAmount > 0;
    if (filterTab === 'frequent') return c.visitsCount >= 5;
    if (filterTab === 'recent') return true;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* If a customer is selected, show Customer Profile with Customer Memory Timeline */}
      {selectedCustomer ? (
        <div className="space-y-6">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelectCustomer(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all customers</span>
            </button>
            <span className="text-xs text-slate-400">
              Customer ID: <span className="font-mono text-slate-600">{selectedCustomer.id}</span>
            </span>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedCustomer.name}
                    </h2>
                    <StatusBadge status={selectedCustomer.statusLabel} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.address && (
                      <span className="text-slate-400 font-sans hidden sm:inline">
                        · {selectedCustomer.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {onEditCustomer && (
                  <Button
                    onClick={() => onEditCustomer(selectedCustomer)}
                    variant="outline"
                    size="md"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit Profile
                  </Button>
                )}

                {selectedCustomer.outstandingAmount > 0 && onSettleBalance && (
                  <Button
                    onClick={() => onSettleBalance(selectedCustomer.id)}
                    variant="secondary"
                    size="md"
                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Settle Udhaar (₹{selectedCustomer.outstandingAmount})
                  </Button>
                )}

                <Button
                  id="btn-profile-new-transaction"
                  onClick={() => onOpenNewTransaction(selectedCustomer)}
                  variant="primary"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                >
                  New Transaction
                </Button>

                <Button
                  onClick={onOpenVoice}
                  variant="outline"
                  size="md"
                  icon={<Mic className="w-3.5 h-3.5 text-indigo-600" />}
                >
                  Voice Entry
                </Button>

                {selectedCustomer.outstandingAmount > 0 && (
                  <Button
                    onClick={() => onOpenSendReminder(selectedCustomer)}
                    variant="secondary"
                    size="md"
                    className="border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    icon={<Send className="w-3.5 h-3.5 text-amber-600" />}
                  >
                    Reminder
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Lifetime Purchases
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ₹{selectedCustomer.lifetimePurchases.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Counter volume</div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Outstanding Due
                </div>
                <div className={`text-xl font-bold mt-1 ${selectedCustomer.outstandingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  ₹{selectedCustomer.outstandingAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {selectedCustomer.promisedDueDate ? `Promised: ${selectedCustomer.promisedDueDate}` : 'No balance due'}
                </div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Counter Visits
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {selectedCustomer.visitsCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Registered interactions</div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Active Orders
                </div>
                <div className="text-xl font-bold text-indigo-700 mt-1">
                  {selectedCustomer.activeOrdersCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pickup pending</div>
              </div>
            </div>
          </div>

          {/* CUSTOMER MEMORY TIMELINE SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    CUSTOMER MEMORY TIMELINE
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological record of purchases, payments, udhaar, and shopkeeper notes.
                </p>
              </div>

              {/* Memory Subtabs */}
              <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">
                {(
                  [
                    { id: 'timeline', label: 'All Memory' },
                    { id: 'warranty', label: 'Returns & Warranty' },
                    { id: 'notes', label: 'Shopkeeper Notes' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      profileTab === tab.id
                        ? 'bg-white text-indigo-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Body */}
            {profileTab === 'timeline' && (
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                  selectedCustomer.timeline.map((item) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                          item.type === 'purchase'
                            ? 'bg-indigo-600 text-white'
                            : item.type === 'payment'
                            ? 'bg-emerald-600 text-white'
                            : item.type === 'return'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-400 text-white'
                        }`}
                      >
                        {item.type === 'purchase' ? '₹' : item.type === 'payment' ? '✓' : '•'}
                      </div>

                      {/* Card Content */}
                      <div className="bg-slate-50/70 group-hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {item.title}
                            </span>
                            {item.paymentStatus && (
                              <StatusBadge status={item.paymentStatus} size="sm" />
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {item.date}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Items breakdown if purchase */}
                        {item.items && item.items.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {item.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200/60"
                              >
                                <span className="font-medium text-slate-700">
                                  {it.name} <span className="text-slate-400 font-normal">({it.quantity})</span>
                                </span>
                                <span className="font-bold text-slate-900 font-mono">
                                  ₹{it.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Payment method badge */}
                        {item.paymentMethod && (
                          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                            <span>Method: <strong className="text-slate-600">{item.paymentMethod}</strong></span>
                            {item.amount !== undefined && (
                              <span>Total: <strong className="text-slate-700 font-mono">₹{item.amount}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic py-4">
                    No transactions or events recorded yet for this customer profile.
                  </div>
                )}
              </div>
            )}

            {/* Warranty & Returns Tab */}
            {profileTab === 'warranty' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Warranty & Returns Log</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Any electrical appliances, pressure cooker gaskets, or items with shopkeeper warranty sold to this customer.
                      </p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                        No active warranty disputes or open return requests on file for {selectedCustomer.name}.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {profileTab === 'notes' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Shopkeeper Private Counter Memory</span>
                    </span>
                    {onEditCustomer && (
                      <button
                        onClick={() => onEditCustomer(selectedCustomer)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Edit Notes
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedCustomer.shopkeeperNotes ||
                      'No custom notes added yet. Click "Edit Profile" to add customer preferences, usual order brands, or delivery instructions.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Customers List Directory */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Customers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Your shop’s relationship memory. Every customer purchase, udhaar, and preference remembered.
              </p>
            </div>

            <Button
              id="btn-add-customer-header"
              onClick={onOpenCreateCustomer}
              variant="primary"
              size="md"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add Customer
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or phone (98765...)"
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(
                [
                  { id: 'all', label: `All (${customers.length})` },
                  { id: 'pending', label: `Pending Udhaar (${customers.filter((c) => c.outstandingAmount > 0).length})` },
                  { id: 'frequent', label: 'Frequent' },
                  { id: 'recent', label: 'Recent' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    filterTab === tab.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Cards Grid or Empty State */}
          {customers.length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6 text-indigo-600" />}
              title="No customers in shop memory yet"
              description="Start building your neighbourhood customer directory. Scan customer QR or add their name and phone to track purchases, promises, and store credit."
              actionLabel="+ Add First Customer"
              onAction={onOpenCreateCustomer}
            />
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No matching customers</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                No customer matched "{searchQuery}". You can clear search or create a new profile.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
                <Button variant="primary" size="sm" onClick={onOpenCreateCustomer}>
                  + Add This Customer
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div
                        onClick={() => onSelectCustomer(c.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-[10rem]"
                      >
                        <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {c.name}
                          </h4>
                          <div className="text-xs text-slate-500 font-mono whitespace-nowrap">
                            {c.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 w-full justify-between pt-0.5">
                        <StatusBadge status={c.statusLabel} size="sm" />
                        {onEditCustomer && (
                          <button
                            title="Edit Profile"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCustomer(c);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Relationship Snapshot */}
                    <div
                      onClick={() => onSelectCustomer(c.id)}
                      className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5 cursor-pointer"
                    >
                      <div className="text-slate-600 truncate">
                        <span className="font-semibold text-slate-700">Last: </span>
                        {c.lastPurchaseSummary || 'Profile established'}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{c.visitsCount} visits</span>
                        <span>Total: ₹{c.lifetimePurchases.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Outstanding & Action */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Outstanding
                      </span>
                      <span className={`font-bold text-sm ${c.outstandingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{c.outstandingAmount}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectCustomer(c.id)}
                      className="text-indigo-600 font-semibold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                    >
                      <span>View Memory</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
