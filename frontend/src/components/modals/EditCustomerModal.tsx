import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, Phone, MapPin, Sparkles, Trash2, Calendar } from 'lucide-react';
import { Customer } from '../../types';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSaveCustomer: (updated: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSaveCustomer,
  onDeleteCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shopkeeperNotes, setShopkeeperNotes] = useState('');
  const [promisedDueDate, setPromisedDueDate] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setShopkeeperNotes(customer.shopkeeperNotes || '');
      setPromisedDueDate(customer.promisedDueDate || '');
      setIsConfirmingDelete(false);
    }
  }, [customer, isOpen]);

  if (!customer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Customer = {
      ...customer,
      name: name.trim(),
      phone: phone.trim() || customer.phone,
      address: address.trim() || undefined,
      shopkeeperNotes: shopkeeperNotes.trim() || undefined,
      promisedDueDate: promisedDueDate.trim() || undefined
    };

    onSaveCustomer(updated);
    onClose();
  };

  const handleDelete = () => {
    onDeleteCustomer(customer.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Customer Profile"
      subtitle={`Update relationship memory and contact details for ${customer.name}`}
      maxWidth="md"
    >
      {isConfirmingDelete ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete {customer.name} from shop memory?</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            This will permanently remove this customer profile, relationship notes, and history from your shop database. This cannot be undone.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDelete}
            >
              Yes, Delete Permanently
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Address / Building / Street
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 302, Sai Residency"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {customer.outstandingAmount > 0 && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Promised Due Date (Udhaar)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={promisedDueDate}
                  onChange={(e) => setPromisedDueDate(e.target.value)}
                  placeholder="e.g. This Friday, 25 Sept"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Shopkeeper Relationship Memory & Notes</span>
            </label>
            <textarea
              rows={3}
              value={shopkeeperNotes}
              onChange={(e) => setShopkeeperNotes(e.target.value)}
              placeholder="e.g. Prefers Kolam rice (soft grain). Usually pays on Friday evenings."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Private notes remembered exclusively at your shop counter.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Customer</span>
            </button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
