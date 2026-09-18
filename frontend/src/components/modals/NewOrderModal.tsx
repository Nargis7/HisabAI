import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShoppingBag, User, Calendar, IndianRupee, Phone } from 'lucide-react';
import { Customer, Order } from '../../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSaveOrder: (order: Order) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSaveOrder
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(500);
  const [depositPaid, setDepositPaid] = useState<number>(0);
  const [pickupDate, setPickupDate] = useState('Tomorrow, 11:00 AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let customerId = selectedCustomerId;
    let customerName = '';
    let customerPhone = '';

    if (selectedCustomerId === 'new' || !selectedCustomerId) {
      if (!customCustomerName.trim()) return;
      customerId = `cust-${Date.now()}`;
      customerName = customCustomerName.trim();
      customerPhone = customCustomerPhone.trim() || '+91 98000 00000';
    } else {
      const existing = customers.find((c) => c.id === selectedCustomerId);
      if (existing) {
        customerName = existing.name;
        customerPhone = existing.phone;
      }
    }

    if (!itemsSummary.trim()) return;

    const orderNumber = `DK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId,
      customerName,
      customerPhone,
      itemsSummary: itemsSummary.trim(),
      totalAmount: Number(totalAmount) || 0,
      depositPaid: Number(depositPaid) || 0,
      pickupDate: pickupDate.trim() || 'Tomorrow',
      status: 'pending',
      items: [
        {
          name: itemsSummary.trim(),
          quantity: '1 order pack',
          price: Number(totalAmount) || 0
        }
      ]
    };

    onSaveOrder(newOrder);
    onClose();
    // Reset
    setItemsSummary('');
    setTotalAmount(500);
    setDepositPaid(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Advance Customer Order"
      subtitle="Register packaged groceries, special ration tins, or festival bulk orders."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Customer
          </label>
          {customers.length > 0 ? (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
              <option value="new">+ Enter New Customer Name</option>
            </select>
          ) : null}

          {(customers.length === 0 || selectedCustomerId === 'new') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              <div>
                <input
                  type="text"
                  required
                  value={customCustomerName}
                  onChange={(e) => setCustomCustomerName(e.target.value)}
                  placeholder="Customer Full Name *"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={customCustomerPhone}
                  onChange={(e) => setCustomCustomerPhone(e.target.value)}
                  placeholder="Phone Number (optional)"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Order Items & Packaging Summary <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={itemsSummary}
            onChange={(e) => setItemsSummary(e.target.value)}
            placeholder="e.g. 10kg Aashirvaad Atta + 15L Gemini Groundnut Oil Tin"
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Total Order Value (₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Advance Deposit Paid (₹)
            </label>
            <input
              type="number"
              min="0"
              value={depositPaid}
              onChange={(e) => setDepositPaid(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Scheduled Pickup Time</span>
          </label>
          <input
            type="text"
            required
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            placeholder="e.g. Tomorrow, 5:00 PM or Friday morning"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" icon={<ShoppingBag className="w-4 h-4" />}>
            Create Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};
