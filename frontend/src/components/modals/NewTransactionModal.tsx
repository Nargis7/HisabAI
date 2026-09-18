import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus, Minus, Trash2, CheckCircle2, IndianRupee, Search, Calendar, User, Package } from 'lucide-react';
import { Customer, Product, Transaction } from '../../types';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  productId?: string;
}

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer: Customer | null;
  customers: Customer[];
  products: Product[];
  onSaveTransaction: (transaction: Transaction) => void;
  onCreateCustomer?: (customer: Customer) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  selectedCustomer,
  customers,
  products,
  onSaveTransaction,
  onCreateCustomer
}) => {
  const [activeCustomerId, setActiveCustomerId] = useState<string>('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [productSearch, setProductSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Quick custom item inputs
  const [quickItemName, setQuickItemName] = useState('');
  const [quickItemPrice, setQuickItemPrice] = useState<number>(100);
  const [quickItemQty, setQuickItemQty] = useState<number>(1);
  const [quickItemUnit, setQuickItemUnit] = useState<string>('unit');

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'partially-paid'>('paid');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Credit / Khata'>('UPI');
  const [dueDate, setDueDate] = useState<string>('Friday, 25 Sept');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedCustomer) {
        setActiveCustomerId(selectedCustomer.id);
      } else if (customers.length > 0) {
        setActiveCustomerId(customers[0].id);
      } else {
        setActiveCustomerId('new');
      }
      setCart([]);
      setIsSuccess(false);
      setProductSearch('');
      setQuickItemName('');
    }
  }, [isOpen, selectedCustomer, customers]);

  const currentCustomer = customers.find((c) => c.id === activeCustomerId);

  // Calculate totals
  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const balancePending =
    paymentStatus === 'paid' ? 0 : Math.max(0, totalAmount - (amountPaid || 0));

  // Sync amountPaid when paymentStatus changes or totalAmount updates
  const handlePaymentStatusChange = (status: 'paid' | 'pending' | 'partially-paid') => {
    setPaymentStatus(status);
    if (status === 'paid') {
      setAmountPaid(totalAmount);
      setPaymentMethod('UPI');
    } else if (status === 'pending') {
      setAmountPaid(0);
      setPaymentMethod('Credit / Khata');
    } else {
      setAmountPaid(Math.floor(totalAmount / 2));
      setPaymentMethod('Cash');
    }
  };

  const handleAddProductToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          quantity: 1,
          unit: product.unit,
          unitPrice: product.sellingPrice
        }
      ];
    });
  };

  const handleAddQuickCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickItemName.trim() || quickItemPrice <= 0) return;

    setCart((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: quickItemName.trim(),
        quantity: Number(quickItemQty) || 1,
        unit: quickItemUnit,
        unitPrice: Number(quickItemPrice) || 0
      }
    ]);

    setQuickItemName('');
    setQuickItemPrice(100);
    setQuickItemQty(1);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let targetCustomerId = activeCustomerId;
    let targetCustomerName = '';
    let targetCustomerPhone = '';

    if (activeCustomerId === 'new' || !currentCustomer) {
      if (!newCustName.trim()) return;
      targetCustomerId = `cust-${Date.now()}`;
      targetCustomerName = newCustName.trim();
      targetCustomerPhone = newCustPhone.trim() || '+91 98000 00000';

      if (onCreateCustomer) {
        onCreateCustomer({
          id: targetCustomerId,
          name: targetCustomerName,
          phone: targetCustomerPhone,
          status: balancePending > 0 ? 'payment-pending' : 'new',
          statusLabel: balancePending > 0 ? 'Payment Pending' : 'New Customer',
          lifetimePurchases: totalAmount,
          outstandingAmount: balancePending,
          visitsCount: 1,
          activeOrdersCount: 0,
          lastPurchaseDate: 'Today',
          lastPurchaseSummary: cart.map((i) => i.name).join(', '),
          promisedDueDate: balancePending > 0 ? dueDate : undefined,
          timeline: []
        });
      }
    } else {
      targetCustomerName = currentCustomer.name;
      targetCustomerPhone = currentCustomer.phone;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      customerId: targetCustomerId,
      customerName: targetCustomerName,
      customerPhone: targetCustomerPhone,
      date: `Today, ${timeStr}`,
      timestamp: now.toISOString(),
      items: cart.map((item) => ({
        productId: item.productId || `prod-custom-${Date.now()}`,
        productName: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity
      })),
      totalAmount,
      amountPaid: paymentStatus === 'paid' ? totalAmount : Number(amountPaid) || 0,
      balancePending,
      paymentStatus,
      paymentMethod,
      dueDate: balancePending > 0 ? dueDate : undefined,
      notes: notes.trim() || undefined,
      recordedVia: 'manual'
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSaveTransaction(newTxn);
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(productSearch.toLowerCase())) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Transaction"
      subtitle="Record counter sale, update stock, and track customer khata commitment."
      maxWidth="xl"
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">
            Sale Recorded in Shop Memory!
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            Total ₹{totalAmount} saved to customer register and persistent storage.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection Row */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90">
            <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Counter Customer</span>
            </label>

            {customers.length > 0 ? (
              <select
                value={activeCustomerId}
                onChange={(e) => setActiveCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) {c.outstandingAmount > 0 ? `· ₹${c.outstandingAmount} due` : ''}
                  </option>
                ))}
                <option value="new">+ Quick Add New Customer</option>
              </select>
            ) : null}

            {(customers.length === 0 || activeCustomerId === 'new') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Customer Full Name *"
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                />
                <input
                  type="tel"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  className="px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
            )}
          </div>

          {/* Two Column Layout: Items Picker vs Cart & Checkout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Select Items from Catalog or Add Custom Item */}
            <div className="space-y-3">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  <span>Add Items</span>
                </span>
                {products.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    {products.length} catalog items
                  </span>
                )}
              </div>

              {/* Quick custom item input */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="text-[11px] font-semibold text-slate-600">
                  Quick Add Any Item (Manual or Not in Inventory):
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickItemName}
                    onChange={(e) => setQuickItemName(e.target.value)}
                    placeholder="Item name (e.g. 2kg Rice, Sugar)"
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                  />
                  <input
                    type="number"
                    min="1"
                    value={quickItemPrice}
                    onChange={(e) => setQuickItemPrice(Number(e.target.value))}
                    placeholder="₹ Price"
                    className="w-20 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickCustomItem}
                    className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Store Catalog Items List if available */}
              {products.length > 0 && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search inventory catalog..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                    {filteredProducts.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleAddProductToCart(p)}
                        className="p-2.5 flex items-center justify-between hover:bg-indigo-50/60 transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {p.category} · Stock: {p.stock} {p.unit}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 font-mono text-xs">
                            ₹{p.sellingPrice}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            + Add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Active Cart & Payment Commitment */}
            <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Items in Sale ({cart.length})</span>
                <span className="font-mono text-sm text-indigo-700 font-extrabold">
                  ₹{totalAmount}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="p-6 text-center text-slate-400 border border-dashed border-slate-300 rounded-lg bg-white">
                  Add items using the left panel or quick add box.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ₹{item.unitPrice} × {item.quantity} = ₹{item.unitPrice * item.quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Settlement Options */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">Payment Terms</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handlePaymentStatusChange('paid')}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Fully Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentStatusChange('partially-paid')}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      paymentStatus === 'partially-paid'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Partially Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentStatusChange('pending')}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      paymentStatus === 'pending'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Credit / Khata
                  </button>
                </div>

                {/* Amount details */}
                {paymentStatus !== 'paid' && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block">
                          Amount Paid Now (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={totalAmount}
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-amber-700 font-semibold block">
                          Baaki / Due (₹)
                        </label>
                        <div className="px-2.5 py-1.5 text-xs font-mono font-bold text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                          ₹{balancePending}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block">
                        Promised Due Date
                      </label>
                      <input
                        type="text"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="e.g. This Friday, 25 Sept"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={cart.length === 0}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Save Transaction (₹{totalAmount})
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
