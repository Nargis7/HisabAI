import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MessageSquare, CheckCircle2, Copy, Send, Smartphone } from 'lucide-react';
import { Customer } from '../../types';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!customer) return null;

  const reminderMessage = `Namaste ${customer.name} ji, this is a gentle reminder from Rajesh Kirana Store regarding your pending balance of ₹${customer.outstandingAmount} (Promised: ${customer.promisedDueDate || 'Friday'}). You can also pay via UPI to our shop QR. Thank you for your continued trust!`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(reminderMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Courteous Payment Reminder"
      subtitle="Friendly neighbourhood message designed to preserve customer relationship trust."
      maxWidth="md"
    >
      {sent ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">
            Reminder Dispatched via WhatsApp!
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Sent to {customer.name} ({customer.phone}).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Customer Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900">{customer.name}</div>
              <div className="text-xs text-slate-500 font-mono">{customer.phone}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Outstanding Due</div>
              <div className="text-lg font-extrabold text-amber-600">
                ₹{customer.outstandingAmount}
              </div>
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Message Preview (Polite & Cultured)</span>
              <button
                onClick={handleCopy}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy text'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-slate-800 leading-relaxed font-sans">
              {reminderMessage}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleCopy}
              icon={<Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied' : 'Copy Message'}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSend}
              icon={<Send className="w-4 h-4" />}
            >
              Send on WhatsApp
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
