import React, { useState } from 'react';
import { Store, QrCode, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface LoginPageProps {
  onSignInSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSignInSuccess }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('+91 98765 00001');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignInSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Product Branding & Philosophy */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight font-sans">
                HISAB<span className="text-indigo-400">AI</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Operating Memory for Local Commerce</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
              "Your shop remembers everything."
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8">
              Local shopkeepers have valuable business information scattered across paper khatas, phone contacts, WhatsApp, receipts, and human memory. HisabAI turns it into one actionable operating memory.
            </p>

            {/* Subtle Visual Diagram: Customer -> Transaction -> Memory -> Action */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4.5 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                The HisabAI Operating Memory Loop
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/60">
                  <div className="font-bold text-indigo-300">SCAN</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Identify</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/60">
                  <div className="font-bold text-amber-300">RECORD</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Voice / POS</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/60">
                  <div className="font-bold text-emerald-300">REMEMBER</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Timeline</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/60">
                  <div className="font-bold text-rose-300">ACT</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Shop Pulse</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted local shop data · Offline capable terminal</span>
          </div>
        </div>

        {/* Right Side: Clean Login Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sign in to your shop terminal
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your mobile number or email to access shop memory.
              </p>
            </div>

            {/* Quick 1-Click Hackathon Demo Sign-In */}
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-950">
                    Demo Shopkeeper Access
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    Preloaded with Rajesh Kirana Store & Ramesh's memory
                  </div>
                </div>
                <Button
                  onClick={onSignInSuccess}
                  variant="primary"
                  size="sm"
                  className="shadow-2xs"
                >
                  Quick Sign In
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    PIN or Password
                  </label>
                  <a href="#" className="text-xs text-indigo-600 hover:underline">
                    Forgot PIN?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to HisabAI
              </Button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-xs text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={onSignInSuccess}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
