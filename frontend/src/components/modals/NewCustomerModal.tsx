import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { Customer } from '../../types';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomer: (customer: Customer) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onCreateCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCust, setCreatedCust] = useState<Customer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`;
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: formattedPhone,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      status: 'new',
      statusLabel: 'New Customer',
      lifetimePurchases: 0,
      outstandingAmount: 0,
      visitsCount: 1,
      activeOrdersCount: 0,
      lastPurchaseDate: 'Just now',
      lastPurchaseSummary: 'Profile initiated',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          type: 'note',
          date: 'Just now',
          relativeTime: 'Today',
          title: 'Customer Profile Created',
          description: 'Shop relationship memory established at counter terminal.'
        }
      ]
    };

    setCreatedCust(newCustomer);
    setIsSuccess(true);

    setTimeout(() => {
      onCreateCustomer(newCustomer);
      handleReset();
    }, 1200);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setIsSuccess(false);
    setCreatedCust(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="New Customer"
      subtitle="Establish customer memory in your shop operating system."
      maxWidth="md"
    >
      {isSuccess && createdCust ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">
            Customer Profile Created!
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Opening {createdCust.name}’s profile to record transaction...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikas Gupta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
                +91
              </div>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address or Locality <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. House 42, Gali No. 3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={handleReset}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              icon={<UserPlus className="w-4 h-4" />}
            >
              Create Customer
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
