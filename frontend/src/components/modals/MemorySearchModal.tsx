import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Search, Sparkles, ArrowRight, CornerDownLeft, Clock, History, User, Package, ShoppingBag, IndianRupee } from 'lucide-react';
import { NavigationTab, Customer, Product, Transaction, Order } from '../../types';

interface MemorySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectCustomer: (customerId: string) => void;
  customers?: Customer[];
  products?: Product[];
  transactions?: Transaction[];
  orders?: Order[];
}

interface SearchAnswer {
  category: string;
  headline: string;
  details: Array<{ label: string; value: string }>;
  quickAction?: {
    label: string;
    navigateTo?: NavigationTab;
    customerId?: string;
  };
}

export const MemorySearchModal: React.FC<MemorySearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCustomer,
  customers = [],
  products = [],
  transactions = [],
  orders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  // Default suggestions based on what's actually in the shop
  const sampleSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    if (customers.length > 0) {
      suggestions.push(`What did ${customers[0].name.split(' ')[0]} buy?`);
      suggestions.push(`Who has pending udhaar?`);
    } else {
      suggestions.push('Who has pending udhaar?');
    }
    if (products.some((p) => p.status === 'low' || p.status === 'out_of_stock')) {
      suggestions.push('Which items are low in stock?');
    } else {
      suggestions.push('Show all store products');
    }
    if (orders.length > 0) {
      suggestions.push('Any orders ready for pickup?');
    }
    return suggestions.slice(0, 4);
  }, [customers, products, orders]);

  // Compute structured dynamic search result
  const computedResult: SearchAnswer | null = useMemo(() => {
    const term = (searchTerm || activeQuery).trim().toLowerCase();
    if (!term) return null;

    // 1. Check if user is searching for low stock / inventory
    if (term.includes('stock') || term.includes('inventory') || term.includes('khatam') || term.includes('low')) {
      const lowItems = products.filter((p) => p.status === 'low' || p.status === 'out_of_stock');
      if (lowItems.length > 0) {
        return {
          category: 'INVENTORY MEMORY',
          headline: `${lowItems.length} items require supplier replenishment`,
          details: lowItems.map((item) => ({
            label: item.name,
            value: `Only ${item.stock} ${item.unit} remaining (Min: ${item.minAlertThreshold})`
          })),
          quickAction: {
            label: 'Open Inventory',
            navigateTo: 'inventory'
          }
        };
      } else {
        return {
          category: 'INVENTORY MEMORY',
          headline: 'All registered stock levels healthy',
          details: [
            { label: 'Total Products in Memory', value: `${products.length} catalog items` },
            { label: 'Low Stock Status', value: 'Zero items below threshold' }
          ],
          quickAction: {
            label: 'View Catalog',
            navigateTo: 'inventory'
          }
        };
      }
    }

    // 2. Check for udhaar / pending payment / due
    if (term.includes('udhaar') || term.includes('baaki') || term.includes('pending') || term.includes('due') || term.includes('kisko')) {
      const pendingCusts = customers.filter((c) => c.outstandingAmount > 0);
      const totalPending = pendingCusts.reduce((sum, c) => sum + c.outstandingAmount, 0);

      if (pendingCusts.length > 0) {
        return {
          category: 'PAYMENT COMMITMENTS',
          headline: `₹${totalPending.toLocaleString('en-IN')} pending across ${pendingCusts.length} accounts`,
          details: pendingCusts.map((c) => ({
            label: c.name,
            value: `₹${c.outstandingAmount} due ${c.promisedDueDate ? `(Promised: ${c.promisedDueDate})` : ''}`
          })),
          quickAction: {
            label: 'View Commitments',
            navigateTo: 'commitments'
          }
        };
      } else {
        return {
          category: 'PAYMENT COMMITMENTS',
          headline: 'No pending udhaar on record',
          details: [
            { label: 'Outstanding Balance', value: '₹0' },
            { label: 'Status', value: 'All customer accounts fully clear' }
          ],
          quickAction: {
            label: 'View Customers',
            navigateTo: 'customers'
          }
        };
      }
    }

    // 3. Check for orders
    if (term.includes('order') || term.includes('pickup') || term.includes('ready')) {
      const readyOrders = orders.filter((o) => o.status === 'ready');
      if (readyOrders.length > 0) {
        return {
          category: 'ORDER MEMORY',
          headline: `${readyOrders.length} customer orders packed & ready for pickup`,
          details: readyOrders.map((o) => ({
            label: `${o.orderNumber} - ${o.customerName}`,
            value: `${o.itemsSummary} (₹${o.totalAmount})`
          })),
          quickAction: {
            label: 'Open Orders',
            navigateTo: 'orders'
          }
        };
      }
      return {
        category: 'ORDER MEMORY',
        headline: `${orders.length} total customer advance orders`,
        details: orders.slice(0, 4).map((o) => ({
          label: `${o.orderNumber} - ${o.customerName}`,
          value: `${o.itemsSummary} · Status: ${o.status}`
        })),
        quickAction: {
          label: 'View All Orders',
          navigateTo: 'orders'
        }
      };
    }

    // 4. Search by customer name or phone
    const matchedCustomer = customers.find(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        term.includes(c.name.toLowerCase().split(' ')[0]) ||
        c.phone.includes(term)
    );

    if (matchedCustomer) {
      return {
        category: 'CUSTOMER MEMORY',
        headline: `${matchedCustomer.name} (${matchedCustomer.phone})`,
        details: [
          { label: 'Last Purchase', value: matchedCustomer.lastPurchaseSummary || 'Profile established' },
          { label: 'Outstanding Due', value: `₹${matchedCustomer.outstandingAmount} ${matchedCustomer.promisedDueDate ? `(Due: ${matchedCustomer.promisedDueDate})` : ''}` },
          { label: 'Counter Visits', value: `${matchedCustomer.visitsCount} visits` },
          { label: 'Lifetime Purchases', value: `₹${matchedCustomer.lifetimePurchases.toLocaleString('en-IN')}` }
        ],
        quickAction: {
          label: `Open ${matchedCustomer.name.split(' ')[0]}’s Profile`,
          customerId: matchedCustomer.id
        }
      };
    }

    // 5. Search by product
    const matchedProduct = products.find(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(term))
    );

    if (matchedProduct) {
      return {
        category: 'PRODUCT MEMORY',
        headline: `${matchedProduct.name} (${matchedProduct.category})`,
        details: [
          { label: 'Current In-Store Stock', value: `${matchedProduct.stock} ${matchedProduct.unit}` },
          { label: 'Selling Price', value: `₹${matchedProduct.sellingPrice} per ${matchedProduct.unit}` },
          { label: 'Status', value: matchedProduct.status === 'healthy' ? 'Stock OK' : 'Replenishment Needed' }
        ],
        quickAction: {
          label: 'Open Inventory',
          navigateTo: 'inventory'
        }
      };
    }

    // 6. Generic search across transactions
    const matchedTxn = transactions.find((t) =>
      t.items.some((it) => it.productName.toLowerCase().includes(term)) ||
      t.customerName.toLowerCase().includes(term)
    );

    if (matchedTxn) {
      return {
        category: 'SALES TRANSACTION MEMORY',
        headline: `Found counter sale: ${matchedTxn.customerName} on ${matchedTxn.date}`,
        details: [
          { label: 'Items Sold', value: matchedTxn.items.map((i) => `${i.productName} (${i.quantity})`).join(', ') },
          { label: 'Total Amount', value: `₹${matchedTxn.totalAmount} (${matchedTxn.paymentStatus})` }
        ],
        quickAction: {
          label: 'View in Sales Register',
          navigateTo: 'sales'
        }
      };
    }

    // Fallback if no specific record found
    return {
      category: 'SHOP OPERATING MEMORY',
      headline: `No exact record matched "${searchTerm || activeQuery}"`,
      details: [
        { label: 'Active Store Records', value: `${customers.length} customers, ${products.length} products, ${transactions.length} sales` },
        { label: 'Tip', value: 'Try searching a customer name, "low stock", or "pending udhaar"' }
      ]
    };
  }, [searchTerm, activeQuery, customers, products, transactions, orders]);

  const handleAction = () => {
    if (!computedResult?.quickAction) return;

    const action = computedResult.quickAction;
    if (action.customerId) {
      onSelectCustomer(action.customerId);
      onNavigate('customers');
    } else if (action.navigateTo) {
      onNavigate(action.navigateTo);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ask Your Shop Memory"
      subtitle="Instant structured answers from customers, transactions, inventory, and khata records."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setActiveQuery(searchTerm);
          }}
          className="relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveQuery(e.target.value);
            }}
            placeholder="Ask anything: 'What did Ramesh buy?', 'Low stock', 'Pending udhaar'..."
            autoFocus
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
          >
            <span>Ask</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>

        {/* Suggested Memory Queries Chips */}
        {sampleSuggestions.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Suggested Shopkeeper Queries</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleSuggestions.map((queryText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchTerm(queryText);
                    setActiveQuery(queryText);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    searchTerm === queryText
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  "{queryText}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Structured Result Display */}
        {computedResult && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                {computedResult.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">Verified Ledger Memory</span>
            </div>

            <div className="font-bold text-slate-900 text-sm sm:text-base">
              {computedResult.headline}
            </div>

            <div className="bg-white rounded-lg border border-slate-200/90 divide-y divide-slate-100 overflow-hidden text-xs">
              {computedResult.details.map((d, i) => (
                <div key={i} className="flex items-start justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-1/3 shrink-0">
                    {d.label}
                  </span>
                  <span className="text-slate-900 font-medium text-right w-2/3">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>

            {computedResult.quickAction && (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                >
                  <span>{computedResult.quickAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
