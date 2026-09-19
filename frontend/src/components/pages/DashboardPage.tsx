import React from 'react';
import {
  QrCode,
  Mic,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  UserPlus,
  Receipt,
  Plus
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Customer, ShopPulseItem, Transaction, Order, Product, NavigationTab } from '../../types';
import { storageService } from '../../services/storageService';

interface DashboardPageProps {
  customers: Customer[];
  transactions: Transaction[];
  orders: Order[];
  products: Product[];
  shopPulse?: ShopPulseItem[];
  onOpenScan: () => void;
  onOpenVoice: () => void;
  onOpenNewTransaction: () => void;
  onOpenNewCustomer?: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  customers,
  transactions,
  orders,
  products,
  shopPulse,
  onOpenScan,
  onOpenVoice,
  onOpenNewTransaction,
  onOpenNewCustomer,
  onNavigate,
  onSelectCustomer
}) => {
  // Purely computed metrics from live entered persistent data
  const todaySales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const estimatedProfit = Math.round(todaySales * 0.25);
  const moneyOutside = customers.reduce((sum, c) => sum + c.outstandingAmount, 0);
  const dueTodayCount = customers.filter(
    (c) => c.outstandingAmount > 0 && Boolean(c.promisedDueDate)
  ).length;
  const ordersReadyCount = orders.filter((o) => o.status === 'ready').length;

  const pulseList = shopPulse || storageService.deriveShopPulse(customers, products, orders);
  const attentionItems = pulseList.filter((p) => p.category === 'attention');
  const upcomingItems = pulseList.filter((p) => p.category === 'upcoming');

  const handlePulseClick = (item: ShopPulseItem) => {
    if (item.actionTarget === 'commitments') {
      onNavigate('commitments');
    } else if (item.actionTarget === 'inventory') {
      onNavigate('inventory');
    } else if (item.actionTarget === 'orders') {
      onNavigate('orders');
    } else if (item.actionTarget === 'sales') {
      onNavigate('sales');
    }
  };

  const isStoreFresh = customers.length === 0 && transactions.length === 0 && products.length === 0 && orders.length === 0;

  // Keep the triage list scannable: a dashboard column should not run 10+ rows
  // deep. The rest stay one click away on the commitments page.
  const ATTENTION_PREVIEW_LIMIT = 6;
  const visibleAttentionItems = attentionItems.slice(0, ATTENTION_PREVIEW_LIMIT);
  const hiddenAttentionCount = attentionItems.length - visibleAttentionItems.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Hero Greeting & Scan Customer Dominant Button */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-white via-white to-indigo-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Good day, Shopkeeper 👋
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isStoreFresh
              ? 'Your HisabAI digital memory is ready. Start by scanning or adding your first customer.'
              : 'Here is what needs your attention in your shop memory today.'}
          </p>
        </div>

        {/* The dominant SCAN CUSTOMER primary CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            id="btn-main-scan-customer"
            onClick={onOpenScan}
            variant="primary"
            size="lg"
            className="shadow-sm ring-4 ring-indigo-50 group hover:ring-indigo-100 transition-all cursor-pointer text-sm sm:text-base font-bold px-6 py-3"
            icon={<QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          >
            Scan Customer
          </Button>

          <Button
            onClick={onOpenVoice}
            variant="secondary"
            size="lg"
            className="border border-slate-200/90 hover:border-indigo-200"
            icon={<Mic className="w-4 h-4 text-indigo-600" />}
          >
            Voice Entry
          </Button>

          <Button
            id="btn-main-new-sale"
            onClick={onOpenNewTransaction}
            variant="outline"
            size="lg"
            className="border border-slate-200/90 hover:border-indigo-200"
            icon={<Receipt className="w-4 h-4 text-slate-500" />}
          >
            New Sale
          </Button>
        </div>
      </div>

      {/* Fresh Store Getting Started Card if no data */}
      {isStoreFresh && (
        <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-white p-6 rounded-2xl border border-indigo-100/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Quick Start HisabAI Memory</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                HisabAI persists all your customers, sales, inventory, and pending commitments locally and securely. Add records manually, through camera scan, or by speaking into the microphone.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onOpenNewCustomer && (
                <Button
                  onClick={onOpenNewCustomer}
                  variant="primary"
                  size="sm"
                  icon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  + Add First Customer
                </Button>
              )}
              <Button
                onClick={() => onNavigate('inventory')}
                variant="outline"
                size="sm"
                icon={<Package className="w-3.5 h-3.5" />}
              >
                + Add Inventory Item
              </Button>

              <Button
                onClick={() => storageService.loadSampleData()}
                variant="ghost"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              >
                Load Sample Shop Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards - 4 key numbers calculated from live data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          id="metric-today-sales"
          icon={<Receipt className="w-4 h-4" />}
          title="Today's Sales"
          value={`₹${todaySales.toLocaleString('en-IN')}`}
          subtitle={todaySales > 0 ? `${transactions.length} sales recorded` : 'No sales recorded yet'}
          badge={{ text: todaySales > 0 ? `${transactions.length} Transactions` : 'Ready' }}
          accent="indigo"
          onClick={() => onNavigate('sales')}
        />
        <MetricCard
          id="metric-estimated-profit"
          icon={<TrendingUp className="w-4 h-4" />}
          title="Estimated Profit"
          value={`₹${estimatedProfit.toLocaleString('en-IN')}`}
          subtitle={todaySales > 0 ? 'Calculated on counter margin' : 'Based on recorded sales'}
          badge={{ text: todaySales > 0 ? 'Estimated' : '₹0' }}
          accent="emerald"
          onClick={() => onNavigate('sales')}
        />
        <MetricCard
          id="metric-money-outside"
          icon={<Clock className="w-4 h-4" />}
          title="Money Outside"
          value={`₹${moneyOutside.toLocaleString('en-IN')}`}
          subtitle={
            moneyOutside > 0
              ? `${dueTodayCount > 0 ? `${dueTodayCount} due today` : 'Khata commitments outside'}`
              : 'All customer balances settled'
          }
          badge={{
            text: moneyOutside > 0 ? `${dueTodayCount > 0 ? `${dueTodayCount} Due Today` : 'Pending'}` : 'All Clear'
          }}
          accent="amber"
          onClick={() => onNavigate('commitments')}
        />
        <MetricCard
          id="metric-orders-ready"
          icon={<ShoppingBag className="w-4 h-4" />}
          title="Orders Ready"
          value={`${ordersReadyCount}`}
          subtitle={ordersReadyCount > 0 ? 'Awaiting customer pickup' : 'No pickups waiting'}
          badge={{ text: ordersReadyCount > 0 ? 'Ready' : 'None' }}
          accent="indigo"
          onClick={() => onNavigate('orders')}
        />
      </div>

      {/* SHOP PULSE - Action-Oriented Attention & Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              SHOP PULSE
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              · Real-time operating memory priorities
            </span>
          </div>
          <button
            onClick={() => onNavigate('commitments')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View all commitments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Attention Needed Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Attention Needed</span>
              <span className={attentionItems.length > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                {attentionItems.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {attentionItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">All clear on attention items</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No overdue payments, low stock warnings, or pending orders.
                  </p>
                </div>
              ) : (
                visibleAttentionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePulseClick(item)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 group-hover:border-indigo-200">
                        {item.type === 'payment_due' && <Clock className="w-4 h-4 text-amber-600" />}
                        {item.type === 'low_stock' && <Package className="w-4 h-4 text-rose-600" />}
                        {item.type === 'order_ready' && <ShoppingBag className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 flex items-center gap-2">
                          <span>{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <StatusBadge status={item.badgeText} size="sm" />
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))
              )}

              {hiddenAttentionCount > 0 && (
                <button
                  onClick={() => onNavigate('commitments')}
                  className="w-full p-2.5 rounded-xl border border-dashed border-slate-200 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                >
                  +{hiddenAttentionCount} more needing attention
                </button>
              )}
            </div>
          </div>

          {/* Upcoming Flow Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Upcoming Flow</span>
              <span className="text-indigo-600 font-semibold">{upcomingItems.length} items</span>
            </div>

            <div className="space-y-2.5">
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePulseClick(item)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-white transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 group-hover:border-indigo-200">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <StatusBadge status={item.badgeText} size="sm" />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}

              {/* Khata Migration Teaser in Pulse */}
              <div
                onClick={() => onNavigate('khata-migration')}
                className="p-3.5 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white text-indigo-600 shadow-2xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-950">
                      Have handwritten bahi-khatas?
                    </div>
                    <p className="text-[11px] text-indigo-700/80">
                      Upload photo · AI digitizes entries into shop memory
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-white text-xs">
                  Digitize
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Customer Activity Memory Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Counter Customers
            </h3>
            <p className="text-xs text-slate-500">
              {customers.length > 0
                ? 'Tap any customer to inspect their full relationship memory, past purchases, and commitments.'
                : 'No customers recorded yet in shop memory.'}
            </p>
          </div>
          {customers.length > 0 && (
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all customers ({customers.length})
            </button>
          )}
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2.5">
              <UserPlus className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Customers in Memory Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
              Scan customer QR, lookup phone, or add a customer to start building purchase histories and udhaar tracking.
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={onOpenScan} variant="primary" size="sm" icon={<QrCode className="w-3.5 h-3.5" />}>
                Scan Customer
              </Button>
              {onOpenNewCustomer && (
                <Button onClick={onOpenNewCustomer} variant="outline" size="sm">
                  + Add Customer
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customers.slice(0, 3).map((cust) => (
              <div
                key={cust.id}
                onClick={() => {
                  onSelectCustomer(cust.id);
                  onNavigate('customers');
                }}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-300 bg-slate-50/40 hover:bg-white transition-all cursor-pointer flex items-start gap-3 shadow-2xs group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  {cust.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 truncate">
                      {cust.name}
                    </h4>
                    <StatusBadge status={cust.statusLabel} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {cust.phone}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 truncate">
                      {cust.lastPurchaseSummary ? `Last: ${cust.lastPurchaseSummary}` : 'Profile created'}
                    </span>
                    <span className="font-bold text-slate-800 shrink-0 ml-1">
                      {cust.outstandingAmount > 0 ? (
                        <span className="text-amber-600 font-semibold">₹{cust.outstandingAmount} due</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Clear</span>
                      )}
                    </span>
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
