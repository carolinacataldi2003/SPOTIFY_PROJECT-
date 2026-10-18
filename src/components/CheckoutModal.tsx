import React, { useState } from 'react';
import { PlanConfig, RegionConfig, UserSubscription } from '../types/soundflow';
import { X, CheckCircle, CreditCard, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  plan: PlanConfig;
  region: RegionConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sub: UserSubscription) => void;
  onOpenWebPlayer: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  region,
  isOpen,
  onClose,
  onSuccess,
  onOpenWebPlayer,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'grabpay' | 'singtel'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [cardName, setCardName] = useState('Alex Tan');
  const [phoneNumber, setPhoneNumber] = useState('+65 9123 4567');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const rawMonthly = plan.monthlyPrice * region.currencyRate;
  const formattedMonthly = `${region.currencySymbol}${rawMonthly.toFixed(2)}`;

  // Calculate dates
  const today = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(today.getDate() + 30);
  const formattedTrialEnd = trialEndDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SOUNDFLOW2026' || promoCode.trim().toUpperCase() === 'FREEVIP') {
      setPromoApplied(true);
      setPromoDiscount(rawMonthly);
    } else {
      alert('Invalid promo code. Try "SOUNDFLOW2026" for a special discount!');
    }
  };

  const handleCompleteOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1ED760', '#C2F738', '#A5F3FC', '#FFFFFF'],
      });

      const newSub: UserSubscription = {
        active: true,
        planId: plan.id,
        planName: `SoundFlow ${plan.name}`,
        trialExpiresAt: formattedTrialEnd,
        nextBillingDate: formattedTrialEnd,
        monthlyAmount: promoApplied ? 0 : rawMonthly,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDetails: paymentMethod === 'card' ? `Ending in ${cardNumber.slice(-4)}` : paymentMethod === 'singtel' ? phoneNumber : 'Account linked',
      };
      onSuccess(newSub);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight">SoundFlow Checkout</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Welcome to SoundFlow Premium!</h3>
            <p className="text-sm text-[#b3b3b3] max-w-sm mx-auto leading-relaxed">
              Your <strong className="text-white">{plan.name}</strong> subscription is now active with all Premium perks. Enjoy ad-free listening, lossless audio, and unlimited downloads.
            </p>

            <div className="bg-[#242424] rounded-xl p-4 text-xs text-left border border-[#333] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#a7a7a7]">Subscription:</span>
                <span className="font-semibold text-white">SoundFlow {plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a7a7a7]">Billed today:</span>
                <span className="font-semibold text-brand-green">$0.00 (30-day Free Trial)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a7a7a7]">Next billing date:</span>
                <span className="font-semibold text-white">{formattedTrialEnd} ({formattedMonthly}/mo)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenWebPlayer();
                }}
                className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3.5 rounded-full text-sm transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Open SoundFlow Web Player
              </button>
              <button
                onClick={onClose}
                className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white font-medium py-3 rounded-full text-xs transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Order Details & Payment Form */
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Plan Summary Card */}
            <div className="bg-[#242424] rounded-xl p-4 border border-[#333333] flex items-center justify-between">
              <div>
                <span 
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-1"
                  style={{ backgroundColor: plan.badgeBg, color: plan.badgeTextColor }}
                >
                  {plan.badgeText}
                </span>
                <h4 className="text-lg font-bold text-white leading-tight">SoundFlow {plan.name}</h4>
                <p className="text-xs text-[#b3b3b3]">
                  {plan.hasFreeTrial ? '30 days free · Cancel anytime' : `${plan.accountsCount} Premium account(s)`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-brand-green">
                  {plan.hasFreeTrial ? '$0.00' : formattedMonthly}
                </div>
                <div className="text-[11px] text-[#a7a7a7]">
                  {plan.hasFreeTrial ? `then ${formattedMonthly}/mo` : 'per month'}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2.5">
                Select Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    paymentMethod === 'card'
                      ? 'bg-[#2a2a2a] border-brand-green text-white shadow'
                      : 'bg-[#202020] border-[#333] text-[#a7a7a7] hover:border-[#444]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-brand-green" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    paymentMethod === 'paypal'
                      ? 'bg-[#2a2a2a] border-brand-green text-white shadow'
                      : 'bg-[#202020] border-[#333] text-[#a7a7a7] hover:border-[#444]'
                  }`}
                >
                  <span className="font-bold text-sky-400">P</span>
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('grabpay')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    paymentMethod === 'grabpay'
                      ? 'bg-[#2a2a2a] border-brand-green text-white shadow'
                      : 'bg-[#202020] border-[#333] text-[#a7a7a7] hover:border-[#444]'
                  }`}
                >
                  <span className="font-bold text-emerald-400">G</span>
                  <span>GrabPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('singtel')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    paymentMethod === 'singtel'
                      ? 'bg-[#2a2a2a] border-brand-green text-white shadow'
                      : 'bg-[#202020] border-[#333] text-[#a7a7a7] hover:border-[#444]'
                  }`}
                >
                  <span className="font-bold text-red-500">S</span>
                  <span>Singtel</span>
                </button>
              </div>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-[#202020] p-4 rounded-xl border border-[#2d2d2d]">
                <div>
                  <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
                    placeholder="Name as printed on card"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-green"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-green"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-green"
                      placeholder="•••"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'singtel' && (
              <div className="space-y-3 bg-[#202020] p-4 rounded-xl border border-[#2d2d2d]">
                <p className="text-xs text-[#b3b3b3]">
                  Direct carrier billing: Monthly SoundFlow subscription charges will be charged to your Singtel mobile bill.
                </p>
                <div>
                  <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Singtel Mobile Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-green"
                    placeholder="+65 9123 4567"
                  />
                </div>
              </div>
            )}

            {(paymentMethod === 'paypal' || paymentMethod === 'grabpay') && (
              <div className="bg-[#202020] p-4 rounded-xl border border-[#2d2d2d] text-center space-y-2">
                <p className="text-xs text-[#b3b3b3]">
                  You will be securely redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'GrabPay'} to authorize your recurring monthly SoundFlow agreement after trial.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-brand-green font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-bit SSL encrypted connection</span>
                </div>
              </div>
            )}

            {/* Promo code accordion */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#777] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (try: SOUNDFLOW2026)"
                  className="w-full bg-[#202020] border border-[#333] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-brand-green"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Apply
              </button>
            </form>

            {promoApplied && (
              <div className="text-xs text-brand-green bg-brand-green/10 border border-brand-green/30 rounded-lg p-2.5 flex items-center justify-between">
                <span>Code SOUNDFLOW2026 applied: Extra 30-day VIP pass added!</span>
                <span className="font-bold">-$0.00</span>
              </div>
            )}

            {/* Trust and Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-[#a7a7a7] pt-1">
              <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
              <span>No commitment. Cancel anytime online in your account settings.</span>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={isSubmitting}
                className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-extrabold py-3.5 px-6 rounded-full text-center text-sm transition duration-150 shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : plan.hasFreeTrial ? (
                  `Start 30-Day Free Trial ($0.00)`
                ) : (
                  `Subscribe to SoundFlow ${plan.name}`
                )}
              </button>
              <p className="text-[10px] text-[#888] text-center mt-2 leading-relaxed">
                By clicking, you authorize SoundFlow to bill {formattedMonthly}/mo after your free trial unless cancelled. <a href="#" className="underline">Terms apply.</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
