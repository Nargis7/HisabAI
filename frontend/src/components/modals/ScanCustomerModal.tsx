import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { QrCode, Phone, UserPlus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Customer } from '../../types';

interface ScanCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onCustomerIdentified: (customer: Customer) => void;
  onOpenCreateCustomer: () => void;
}

export const ScanCustomerModal: React.FC<ScanCustomerModalProps> = ({
  isOpen,
  onClose,
  customers,
  onCustomerIdentified,
  onOpenCreateCustomer
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'phone'>('camera');
  const [phoneInput, setPhoneInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedCustomer, setIdentifiedCustomer] = useState<Customer | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleScanCustomer = (targetCust?: Customer) => {
    setIsScanning(true);
    setSearchError('');
    setTimeout(() => {
      setIsScanning(false);
      if (targetCust) {
        setIdentifiedCustomer(targetCust);
      } else if (customers.length > 0) {
        setIdentifiedCustomer(customers[0]);
      } else {
        // If no customer exists yet, direct to create
        onClose();
        onOpenCreateCustomer();
      }
    }, 800);
  };

  const handlePhoneLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const cleanNumber = phoneInput.replace(/\D/g, '');
    if (!cleanNumber && !phoneInput.trim()) {
      setSearchError('Please enter a phone number or customer name');
      return;
    }

    const matched = customers.find(
      (c) =>
        (cleanNumber && c.phone.replace(/\D/g, '').includes(cleanNumber)) ||
        c.name.toLowerCase().includes(phoneInput.toLowerCase())
    );

    if (matched) {
      setIdentifiedCustomer(matched);
    } else {
      setSearchError(`No customer found matching "${phoneInput}". You can register them right away.`);
    }
  };

  const handleConfirmIdentified = () => {
    if (identifiedCustomer) {
      onCustomerIdentified(identifiedCustomer);
      onClose();
      setIdentifiedCustomer(null);
      setPhoneInput('');
    }
  };

  const resetState = () => {
    setIdentifiedCustomer(null);
    setPhoneInput('');
    setSearchError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetState}
      title="Scan Counter Customer"
      subtitle="Scan customer QR code or lookup phone number to load shop relationship memory."
      maxWidth="md"
    >
      {/* Identified Success State */}
      {identifiedCustomer ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Customer Profile Identified
          </span>

          <h3 className="text-xl font-bold text-slate-900 mt-2">
            {identifiedCustomer.name}
          </h3>
          <p className="text-sm text-slate-500 font-mono mt-0.5">
            {identifiedCustomer.phone}
          </p>

          <div className="grid grid-cols-2 gap-3 my-5 max-w-sm mx-auto bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-left">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Outstanding Balance
              </span>
              <span
                className={`font-bold text-base font-mono ${
                  identifiedCustomer.outstandingAmount > 0
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                ₹{identifiedCustomer.outstandingAmount}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Counter Visits
              </span>
              <span className="font-bold text-base text-slate-900 font-mono">
                {identifiedCustomer.visitsCount} visits
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 max-w-sm mx-auto">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIdentifiedCustomer(null)}
            >
              Scan Another
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleConfirmIdentified}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Open Customer Memory
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
            <button
              onClick={() => setActiveMode('camera')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'camera'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Camera / QR Scanner</span>
            </button>
            <button
              onClick={() => setActiveMode('phone')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'phone'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone / Name Lookup</span>
            </button>
          </div>

          {activeMode === 'camera' ? (
            <div className="flex flex-col items-center">
              {/* Scanner Viewfinder */}
              <div className="relative w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner group">
                {/* Camera Corner Guides */}
                <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-indigo-400 rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-indigo-400 rounded-tr-sm" />
                <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-indigo-400 rounded-bl-sm" />
                <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-indigo-400 rounded-br-sm" />

                {/* Simulated QR Code in Frame */}
                <div className="w-36 h-36 border border-slate-700/60 rounded-lg p-2 bg-slate-800/80 flex flex-col items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-300 opacity-80" />
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    HISABAI-SCAN-CAM
                  </span>
                </div>

                {/* Animated Laser Scanning Beam */}
                <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_12px_#818cf8] animate-pulse transition-all" />

                {isScanning && (
                  <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <Sparkles className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                    <span className="text-xs font-semibold">Reading Customer QR...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-5 space-y-2.5">
                {customers.length > 0 ? (
                  <>
                    <Button
                      id="btn-scan-first-customer"
                      variant="primary"
                      size="md"
                      fullWidth
                      disabled={isScanning}
                      onClick={() => handleScanCustomer(customers[0])}
                      icon={<QrCode className="w-4 h-4" />}
                    >
                      {isScanning
                        ? 'Identifying...'
                        : `Scan Customer: ${customers[0].name} (${customers[0].phone})`}
                    </Button>

                    {customers.length > 1 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                        <span>Or quick identify:</span>
                        {customers.slice(1, 4).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleScanCustomer(c)}
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-xs text-slate-500">
                      No customers registered in your shop operating memory yet.
                    </p>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => {
                        onClose();
                        onOpenCreateCustomer();
                      }}
                      icon={<UserPlus className="w-4 h-4" />}
                    >
                      + Register First Customer
                    </Button>
                  </div>
                )}

                <p className="text-[11px] text-center text-slate-400 pt-2">
                  Shopkeepers can scan customer WhatsApp QR, phone barcode, or printed khata card.
                </p>
              </div>
            </div>
          ) : (
            /* Phone Lookup */
            <div className="space-y-4">
              <form onSubmit={handlePhoneLookup} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Phone Number or Name
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. 98765 43210 or Ramesh"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {searchError && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                    <p>{searchError}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onOpenCreateCustomer();
                      }}
                      icon={<UserPlus className="w-3.5 h-3.5" />}
                    >
                      + Register New Customer
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Lookup Profile
                </Button>
              </form>

              {customers.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Recent Customers:
                  </span>
                  <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                    {customers.slice(0, 5).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setIdentifiedCustomer(c)}
                        className="py-1.5 px-2 flex items-center justify-between text-xs hover:bg-slate-50 rounded cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{c.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
