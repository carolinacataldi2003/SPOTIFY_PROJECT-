import React, { useState } from 'react';
import { UserSubscription, PlanConfig } from '../types/soundflow';
import { X, CheckCircle, AlertTriangle, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription | null;
  plans: PlanConfig[];
  onCancelSubscription: () => void;
  onSwitchPlan: (newPlan: PlanConfig) => void;
}

export const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  isOpen,
  onClose,
  subscription,
  plans,
  onCancelSubscription,
  onSwitchPlan
}) => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState('');

  if (!isOpen) return null;

  if (!subscription || !subscription.active) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 text-white text-center space-y-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-[#282828] text-[#888] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">No Active Premium Plan</h3>
          <p className="text-xs text-[#a7a7a7]">
            You are currently on SoundFlow Free. Subscribe to any plan to enjoy ad-free music, lossless audio, and offline downloads.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-2.5 rounded-full text-xs transition"
          >
            View Available Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span className="font-bold text-sm tracking-tight">Your SoundFlow Account</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Subscription status */}
          <div className="bg-[#242424] rounded-xl p-4 border border-[#333333] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded">
                  Active Subscription
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{subscription.planName}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  ${subscription.monthlyAmount.toFixed(2)} / mo
                </span>
                <div className="text-[10px] text-brand-green">Trial in progress</div>
              </div>
            </div>

            <hr className="border-[#383838]" />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#888] block text-[10px]">Payment Method:</span>
                <span className="font-medium text-white flex items-center gap-1 mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-brand-green" />
                  {subscription.paymentMethod} {subscription.paymentDetails}
                </span>
              </div>
              <div>
                <span className="text-[#888] block text-[10px]">Next Billing Date:</span>
                <span className="font-medium text-white mt-0.5 block">{subscription.nextBillingDate}</span>
              </div>
            </div>
          </div>

          {/* Plan switch options */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Switch SoundFlow Plan
            </h5>
            <div className="space-y-2">
              {plans
                .filter((p) => p.id !== subscription.planId)
                .map((p) => (
                  <div 
                    key={p.id}
                    className="p-3 rounded-xl bg-[#202020] border border-[#2d2d2d] flex items-center justify-between hover:border-[#444] transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-[#888]">{p.accountsCount} account(s) · ${p.monthlyPrice}/mo</p>
                    </div>
                    <button
                      onClick={() => onSwitchPlan(p)}
                      className="px-3 py-1 bg-[#2e2e2e] hover:bg-brand-green hover:text-black text-white text-xs font-semibold rounded-full transition"
                    >
                      Change Plan
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Cancellation section */}
          <div className="border-t border-[#262626] pt-4">
            {confirmCancel ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Are you sure you want to cancel your trial?</span>
                </div>
                <p className="text-[11px] text-[#bbb]">
                  You will lose ad-free playback, offline downloads, and lossless HiFi audio after {subscription.nextBillingDate}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onCancelSubscription();
                      onClose();
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition"
                  >
                    Yes, Cancel Subscription
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-2 rounded-lg text-xs transition"
                  >
                    Keep My Premium
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#888]">Need to cancel? No fees.</span>
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs text-red-400 hover:underline font-medium"
                >
                  Cancel Premium Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
