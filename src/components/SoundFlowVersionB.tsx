import React, { useState } from 'react';
import { PlanConfig, RegionConfig, UserSubscription } from '../types/soundflow';
import { soundflowAudio, SOUNDFLOW_TRACKS } from '../utils/audioEngine';
import { 
  Sparkles, Music, Volume2, Users, Check, ChevronDown, 
  ChevronUp, HelpCircle, ShieldCheck, ArrowRight, RotateCcw
} from 'lucide-react';

interface SoundFlowVersionBProps {
  region: RegionConfig;
  subscription: UserSubscription | null;
  isPreview?: boolean;
  onOpenCheckout: (plan: PlanConfig) => void;
  onOpenStudent: () => void;
  onOpenRegion: () => void;
  onOpenSupport: () => void;
  onOpenMenu: () => void;
  onOpenWebPlayer: () => void;
  onOpenAccount: () => void;
}

export const SoundFlowVersionB: React.FC<SoundFlowVersionBProps> = ({
  region,
  subscription,
  isPreview = false,
  onOpenCheckout,
  onOpenStudent,
  onOpenRegion,
  onOpenSupport,
  onOpenMenu,
  onOpenWebPlayer,
  onOpenAccount
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playingFeedback, setPlayingFeedback] = useState<string | null>(null);
  
  // Issue 1: Expandable details toggle per card
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Issue 4: Interactive Plan Selection Guide state
  const [guideOpen, setGuideOpen] = useState(true);
  const [guideListeners, setGuideListeners] = useState<'1' | '2' | 'family' | null>(null);
  const [guideIsStudent, setGuideIsStudent] = useState<boolean | null>(null);

  // Dynamic currency calculations
  const formatPrice = (sgdAmount: number) => {
    const val = (sgdAmount * region.currencyRate).toFixed(2);
    return `${region.currencySymbol}${val}`;
  };

  const individualPrice = formatPrice(11.98);
  const studentPrice = formatPrice(6.48);
  const duoPrice = formatPrice(16.98);
  const familyPrice = formatPrice(20.98);

  // Dates for transparent pricing conditions (Issue 3)
  const today = new Date();
  const renewalDate = new Date();
  renewalDate.setDate(today.getDate() + 30);
  const formattedRenewal = renewalDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const PLANS: PlanConfig[] = [
    {
      id: 'individual',
      name: 'Individual',
      badgeText: 'Single listener',
      badgeBg: '#2a2a2a',
      badgeTextColor: '#e5e7eb',
      priceHeadline: `${individualPrice} / month`,
      priceSubline: `First 30 days: $0.00 trial · Renews ${formattedRenewal}`,
      monthlyPrice: 11.98,
      hasFreeTrial: true,
      freeTrialMonths: 1,
      accountsCount: 1,
      features: [
        '1 private Premium account',
        'Lossless FLAC & offline downloads',
        'Ad-free listening on any device'
      ],
      ctaText: 'Start 30-Day Free Trial',
      finePrint: `Free for 30 days, then ${individualPrice}/month billed automatically. Cancel anytime before ${formattedRenewal} in 1 click online with no fees.`
    },
    {
      id: 'student',
      name: 'Student',
      badgeText: 'Verified student discount',
      badgeBg: '#2a2a2a',
      badgeTextColor: '#e5e7eb',
      priceHeadline: `${studentPrice} / month`,
      priceSubline: `Save 46% vs Individual · First 30 days $0.00`,
      monthlyPrice: 6.48,
      hasFreeTrial: true,
      freeTrialMonths: 1,
      accountsCount: 1,
      features: [
        '1 verified student Premium account',
        'Full lossless audio & offline mode',
        'Discount renewable annually (up to 4 yrs)'
      ],
      ctaText: 'Verify & Start Trial',
      finePrint: `Eligible for enrolled higher education students. Free for 30 days, then ${studentPrice}/month. Cancel anytime online.`
    },
    {
      id: 'duo',
      name: 'Duo',
      badgeText: '2 people at 1 address',
      badgeBg: '#2a2a2a',
      badgeTextColor: '#e5e7eb',
      priceHeadline: `${duoPrice} / month`,
      priceSubline: `${formatPrice(8.49)} per listener / month`,
      monthlyPrice: 16.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 2,
      features: [
        '2 independent Premium accounts',
        'Separate saved playlists & library',
        'Shared Duo Mix playlist for household'
      ],
      ctaText: 'Get Premium Duo',
      finePrint: `Billed at ${duoPrice}/month. Requires both listeners to reside at the same household address. Cancel anytime online.`
    },
    {
      id: 'family',
      name: 'Family',
      badgeText: 'Up to 6 accounts',
      badgeBg: '#2a2a2a',
      badgeTextColor: '#e5e7eb',
      priceHeadline: `${familyPrice} / month`,
      priceSubline: `As low as ${formatPrice(3.50)} per user / month`,
      monthlyPrice: 20.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 6,
      features: [
        'Up to 6 independent accounts',
        'Parental explicit-content filter',
        'Family Mix playlist & separate libraries'
      ],
      ctaText: 'Get Premium Family',
      finePrint: `Billed at ${familyPrice}/month for up to 6 household members. Cancel anytime online without penalty.`
    }
  ];

  // Issue 4: Recommendation Logic
  let recommendedPlanId: string | null = null;
  let recommendationReason: string | null = null;

  if (guideListeners === 'family') {
    recommendedPlanId = 'family';
    recommendationReason = `Best value for households: Up to 6 separate accounts for ${familyPrice}/month (${formatPrice(3.50)}/person).`;
  } else if (guideListeners === '2') {
    recommendedPlanId = 'duo';
    recommendationReason = `Best value for two: 2 accounts for ${duoPrice}/month (${formatPrice(8.49)}/person) instead of two Individual plans (${formatPrice(23.96)}).`;
  } else if (guideListeners === '1') {
    if (guideIsStudent === true) {
      recommendedPlanId = 'student';
      recommendationReason = `Best value for students: 46% student discount at ${studentPrice}/month with 30-day free trial.`;
    } else if (guideIsStudent === false) {
      recommendedPlanId = 'individual';
      recommendationReason = `Best for solo listening: 1 private account for ${individualPrice}/month with 30-day free trial.`;
    }
  }

  const handleTileClick = (trackId: string, trackName: string) => {
    if (playingTrackId === trackId) {
      soundflowAudio.stop();
      setPlayingTrackId(null);
      setPlayingFeedback(null);
    } else {
      soundflowAudio.playTrack(trackId);
      setPlayingTrackId(trackId);
      setPlayingFeedback(`Previewing: ${trackName}`);
      setTimeout(() => {
        setPlayingFeedback(null);
      }, 3500);
    }
  };

  const scrollToPlans = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('plans-v2');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#121212] text-white antialiased flex flex-col min-h-screen">
      {/* Top Banner (Clean, balanced) */}
      {showBanner && (
        <aside 
          className="bg-[#1e293b] text-white text-xs px-4 py-2 flex items-center justify-between border-b border-[#334155]"
          data-purpose="country-language-banner"
        >
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Region:</span>
            <button 
              onClick={onOpenRegion}
              className="text-white hover:underline font-medium cursor-pointer"
            >
              {region.localName} ({region.currencyCode})
            </button>
          </div>
          <button 
            aria-label="Close banner" 
            onClick={() => setShowBanner(false)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Main Header */}
      <header className="bg-[#121212] text-white px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#282828] backdrop-blur-md">
        <a 
          className="flex items-center gap-2.5 group cursor-pointer" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">SoundFlow</span>
            <span className="text-[10px] text-slate-400 font-medium">
              Subscription Guide{isPreview ? ' · Version B' : ''}
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#plans-v2" onClick={scrollToPlans} className="hover:text-white transition">
              Compare All Plans
            </a>
            <button onClick={onOpenWebPlayer} className="hover:text-brand-green transition flex items-center gap-1.5 cursor-pointer">
              <Music className="w-4 h-4 text-brand-green" />
              <span>Web Player</span>
            </button>
            <button onClick={onOpenSupport} className="hover:text-white transition cursor-pointer">
              Billing FAQ
            </button>
            <button 
              onClick={subscription?.active ? onOpenAccount : () => onOpenCheckout(PLANS[0])}
              className="text-xs font-semibold bg-[#242424] hover:bg-[#333] text-white px-3.5 py-1.5 rounded-lg border border-[#3e3e3e] transition"
            >
              {subscription?.active ? 'Manage Plan' : 'Sign In'}
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button 
            aria-label="Open mobile navigation menu" 
            onClick={onOpenMenu}
            className="text-white p-1 focus:outline-none hover:text-brand-green transition cursor-pointer md:hidden"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Floating Audio Toast */}
      {playingFeedback && (
        <div className="fixed top-20 right-4 z-50 bg-[#1e1e1e] border border-brand-green/40 text-brand-green px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <span>{playingFeedback}</span>
        </div>
      )}

      {/* Subscription Active Indicator */}
      {subscription?.active && (
        <div className="bg-[#183424] border-b border-brand-green/30 px-5 py-2.5 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <span>
              <strong>{subscription.planName}</strong> is active · Billed: ${subscription.monthlyAmount.toFixed(2)}/mo.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWebPlayer}
              className="bg-brand-green text-black font-semibold px-3 py-1 rounded-full text-[11px] hover:bg-brand-green-hover transition"
            >
              Open Web Player
            </button>
            <button
              onClick={onOpenAccount}
              className="text-brand-green underline text-[11px] hover:text-white"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-5xl mx-auto w-full px-5 sm:px-8 py-8 space-y-12">
        {/* HERO SECTION – Balanced Salience & Transparent Value Proposition */}
        <section className="space-y-6">
          <div className="text-center sm:text-left space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl">
              Compare SoundFlow Premium Plans with Complete Price Transparency
            </h1>
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              Explore all four subscription tiers side-by-side. Every plan includes ad-free listening, offline downloads, and lossless audio. Cancel anytime with zero hidden fees.
            </p>
          </div>

          {/* Album Collage with audio preview */}
          <div 
            className="relative w-full h-52 sm:h-56 overflow-hidden rounded-2xl bg-gradient-to-r from-[#14261d] to-[#121212] border border-[#262626] p-4 flex items-center justify-center select-none"
            title="Click an album cover to preview audio"
          >
            <div className="absolute left-4 top-4 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-brand-green" />
              <span>Interactive Catalog Audio Previews</span>
            </div>

            <div className="relative w-full max-w-md h-40 flex items-center justify-center">
              {/* Tile 1 */}
              <div 
                onClick={() => handleTileClick('phonk-1', 'Drift Mirage (Phonk)')}
                className={`art-tile absolute left-4 w-28 h-28 bg-gradient-to-br from-purple-800 to-indigo-950 rounded-lg p-2 transform -rotate-6 border border-purple-400/30 cursor-pointer shadow-lg ${
                  playingTrackId === 'phonk-1' ? 'ring-2 ring-brand-green scale-105 z-20' : ''
                }`}
              >
                <span className="text-[10px] font-black tracking-widest text-purple-300">PHONK</span>
              </div>

              {/* Tile 2 */}
              <div 
                onClick={() => handleTileClick('friday-2', 'Warm Sunlight & Coffee (Easy on Friday)')}
                className={`art-tile absolute left-28 w-32 h-32 bg-[#f3efe6] text-black rounded-lg p-2.5 shadow-xl transform rotate-3 border border-amber-200 cursor-pointer z-10 ${
                  playingTrackId === 'friday-2' ? 'ring-2 ring-brand-green scale-105 z-20' : ''
                }`}
              >
                <p className="font-serif italic font-bold text-xs text-stone-800">easy on</p>
                <p className="font-black text-sm tracking-tighter text-stone-900 uppercase">FRIDAY</p>
              </div>

              {/* Tile 3 */}
              <div 
                onClick={() => handleTileClick('housewerk-3', 'Club Paradigm (Housewerk)')}
                className={`art-tile absolute right-24 w-32 h-32 bg-[#C2F738] text-black rounded-lg p-2.5 shadow-xl transform -rotate-3 border border-black/20 cursor-pointer z-10 ${
                  playingTrackId === 'housewerk-3' ? 'ring-2 ring-brand-green scale-105 z-20' : ''
                }`}
              >
                <span className="text-[10px] font-black uppercase">HOUSEWERK</span>
                <div className="mt-2 w-full h-12 border border-black flex items-center justify-center">
                  <div className="w-6 h-6 border border-black rotate-45"></div>
                </div>
              </div>

              {/* Tile 4 */}
              <div 
                onClick={() => handleTileClick('reggaeton-4', 'Noche de Gasolina (Reggaeton)')}
                className={`art-tile absolute right-2 w-28 h-28 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 rounded-lg p-2 shadow-lg transform rotate-6 border border-white/20 cursor-pointer ${
                  playingTrackId === 'reggaeton-4' ? 'ring-2 ring-brand-green scale-105 z-20' : ''
                }`}
              >
                <span className="text-[9px] font-bold text-white uppercase block text-center">REGGAETON</span>
              </div>
            </div>

            <div className="absolute right-4 bottom-3 text-[11px] text-slate-400">
              Click any card to audition high-fidelity sound
            </div>
          </div>
        </section>

        {/* ISSUE 4 IMPROVEMENT: Interactive Plan Selection Guide */}
        <section className="bg-[#181818] rounded-2xl border border-[#2e2e2e] p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                ?
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Plan Selection Guide (Optional)</h3>
                <p className="text-xs text-slate-400">
                  Answer 2 quick questions to find the most cost-effective plan for your household.
                </p>
              </div>
            </div>

            <button
              onClick={() => setGuideOpen(!guideOpen)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>{guideOpen ? 'Collapse Guide' : 'Expand Guide'}</span>
              {guideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {guideOpen && (
            <div className="space-y-4 pt-2 border-t border-[#262626]">
              {/* Question 1: Number of Listeners */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  1. How many people need separate music accounts in your household?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setGuideListeners('1')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      guideListeners === '1'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-[#202020] border-[#333] text-slate-300 hover:border-[#444]'
                    }`}
                  >
                    <span className="font-bold block text-white">Just me (1 person)</span>
                    <span className="text-[11px] text-slate-400">Individual or Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGuideListeners('2');
                      setGuideIsStudent(null);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      guideListeners === '2'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-[#202020] border-[#333] text-slate-300 hover:border-[#444]'
                    }`}
                  >
                    <span className="font-bold block text-white">2 people (1 household)</span>
                    <span className="text-[11px] text-slate-400">Premium Duo ({formatPrice(8.49)}/ea)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGuideListeners('family');
                      setGuideIsStudent(null);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                      guideListeners === 'family'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-[#202020] border-[#333] text-slate-300 hover:border-[#444]'
                    }`}
                  >
                    <span className="font-bold block text-white">3 to 6 people</span>
                    <span className="text-[11px] text-slate-400">Family plan with parental controls</span>
                  </button>
                </div>
              </div>

              {/* Question 2: Student eligibility if single listener */}
              {guideListeners === '1' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    2. Are you an enrolled student at an accredited college or university?
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setGuideIsStudent(true)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-center ${
                        guideIsStudent === true
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-[#202020] border-[#333] text-slate-300 hover:border-[#444]'
                      }`}
                    >
                      Yes, I am a student
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuideIsStudent(false)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-center ${
                        guideIsStudent === false
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-[#202020] border-[#333] text-slate-300 hover:border-[#444]'
                      }`}
                    >
                      No, not a student
                    </button>
                  </div>
                </div>
              )}

              {/* Recommendation Box */}
              {recommendedPlanId && (
                <div className="p-4 rounded-xl bg-[#202823] border border-emerald-500/40 text-xs text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Recommended Plan Based on Your Answers
                    </span>
                    <button
                      onClick={() => {
                        setGuideListeners(null);
                        setGuideIsStudent(null);
                      }}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-white">
                    SoundFlow {PLANS.find(p => p.id === recommendedPlanId)?.name}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {recommendationReason}
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={() => {
                        const targetPlan = PLANS.find(p => p.id === recommendedPlanId);
                        if (targetPlan) {
                          if (targetPlan.id === 'student') {
                            onOpenStudent();
                          } else {
                            onOpenCheckout(targetPlan);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-black font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Select Recommended Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-400">or compare all plans below</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ISSUES 1, 2, 3 IMPROVEMENTS: Balanced Plan Comparison Matrix & Cards */}
        <section id="plans-v2" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                All 4 SoundFlow Premium Plans
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Standard monthly pricing displayed with equal prominence. Each plan includes identical high-fidelity audio quality.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cancel anytime online with 1 click</span>
            </div>
          </div>

          {/* Quick 3-Attribute Matrix Overview (Issue 1) */}
          <div className="hidden lg:block overflow-x-auto bg-[#181818] rounded-xl border border-[#2e2e2e] p-4 text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2e2e2e] text-slate-400 font-semibold">
                  <th className="pb-3 w-3/12">Plan Name</th>
                  <th className="pb-3 w-3/12">Standard Monthly Cost</th>
                  <th className="pb-3 w-2/12">Account Capacity</th>
                  <th className="pb-3 w-4/12">Best Suited For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                <tr>
                  <td className="py-2.5 font-bold text-white">Individual</td>
                  <td className="py-2.5 text-slate-200">{individualPrice} / mo</td>
                  <td className="py-2.5 text-slate-300">1 account</td>
                  <td className="py-2.5 text-slate-400">Single listeners wanting ad-free offline music</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Student</td>
                  <td className="py-2.5 text-slate-200">{studentPrice} / mo</td>
                  <td className="py-2.5 text-slate-300">1 verified account</td>
                  <td className="py-2.5 text-slate-400">Enrolled college/university students (save 46%)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Duo</td>
                  <td className="py-2.5 text-slate-200">{duoPrice} / mo</td>
                  <td className="py-2.5 text-slate-300">2 accounts</td>
                  <td className="py-2.5 text-slate-400">Two listeners residing at the same address ({formatPrice(8.49)}/ea)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Family</td>
                  <td className="py-2.5 text-slate-200">{familyPrice} / mo</td>
                  <td className="py-2.5 text-slate-300">Up to 6 accounts</td>
                  <td className="py-2.5 text-slate-400">Households with up to 6 members + parental filters</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4 Balanced Subscription Cards (Issues 1, 2, 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PLANS.map((plan) => {
              const isRecommended = recommendedPlanId === plan.id;
              const isExpanded = expandedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`bg-[#181818] rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                    isRecommended
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/5 bg-[#1a1f1b]'
                      : 'border-[#2e2e2e] hover:border-[#3e3e3e]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header line: Title + Capacity Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          {isRecommended && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                              Your Match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {plan.accountsCount === 1 ? '1 independent account' : `${plan.accountsCount} separate accounts (same address)`}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold text-white block">
                          {plan.monthlyPrice === 11.98 ? individualPrice : plan.monthlyPrice === 6.48 ? studentPrice : plan.monthlyPrice === 16.98 ? duoPrice : familyPrice}
                        </span>
                        <span className="text-[10px] text-slate-400 block">per month</span>
                      </div>
                    </div>

                    {/* Issue 3: Explicit Cost & Trial Timeline */}
                    <div className="bg-[#202020] rounded-xl p-3 border border-[#2d2d2d] space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Billing timeline:</span>
                        <span className="font-semibold text-white">
                          {plan.hasFreeTrial ? '30 Days Free Trial ($0.00)' : 'Monthly billing starts today'}
                        </span>
                      </div>
                      {plan.hasFreeTrial && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">First recurring charge:</span>
                          <span className="text-emerald-400 font-semibold">{formattedRenewal}</span>
                        </div>
                      )}
                    </div>

                    {/* Key Attributes 3-Bullet List (Issue 1) */}
                    <div className="space-y-2 text-xs text-slate-200">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Essential Benefits:
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expandable detailed section (Issue 1) */}
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide terms & requirements' : 'View terms & requirements'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-lg bg-[#202020] border border-[#2a2a2a] text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                          <p>{plan.finePrint}</p>
                          <p className="text-slate-500">
                            Payment accepted: VISA, Mastercard, AMEX, PayPal, GrabPay, Singtel carrier billing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA & Cancellation Conditions (Issue 3) */}
                  <div className="mt-6 pt-4 border-t border-[#262626] space-y-2.5">
                    <button
                      onClick={() => {
                        if (plan.id === 'student') {
                          onOpenStudent();
                        } else {
                          onOpenCheckout(plan);
                        }
                      }}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-brand-green hover:bg-brand-green-hover text-black transition shadow cursor-pointer text-center"
                    >
                      {plan.ctaText}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Cancel online anytime before {formattedRenewal} with 0 penalties</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment Methods Bar */}
        <section className="bg-[#181818] rounded-xl border border-[#282828] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Supported payment options:</span>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">VISA</span>
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">Mastercard</span>
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">AMEX</span>
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">PayPal</span>
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">GrabPay</span>
            <span className="bg-[#242424] text-slate-300 font-semibold px-2.5 py-1 rounded border border-[#333]">Singtel</span>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-4 pt-4 border-t border-[#262626]">
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-xs open:bg-[#1e1e1e]">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
                <span>When will my payment method be charged?</span>
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-2 text-slate-400 leading-relaxed border-t border-[#2d2d2d] pt-2">
                If you select Individual or Student, your first 30 days are $0.00. Your card or account will be billed automatically on day 30 ({formattedRenewal}) unless you cancel before that date. For Duo and Family, your first standard monthly billing begins at checkout.
              </p>
            </details>

            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-xs open:bg-[#1e1e1e]">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How easy is it to cancel or switch plans?</span>
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-2 text-slate-400 leading-relaxed border-t border-[#2d2d2d] pt-2">
                You can cancel or switch plans at any time from your Account Overview in 1 click. There are no cancellation fees, no phone calls required, and your premium perks remain active until the end of the billing period.
              </p>
            </details>

            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-xs open:bg-[#1e1e1e]">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
                <span>What is the eligibility requirement for Duo and Family plans?</span>
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-2 text-slate-400 leading-relaxed border-t border-[#2d2d2d] pt-2">
                All members in Duo (2 members) or Family (up to 6 members) must live at the same physical residential address. Each person gets their own private account, distinct login, and personal playlists.
              </p>
            </details>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-400 pt-10 pb-8 px-5 sm:px-8 border-t border-[#222] mt-12 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <span>SoundFlow AB</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">Support</button>
            <button onClick={onOpenWebPlayer} className="hover:text-white cursor-pointer">Web Player</button>
            <button onClick={onOpenRegion} className="hover:text-white cursor-pointer">{region.localName}</button>
          </div>

          <p className="text-[11px] text-slate-500">
            {isPreview ? 'Version B · Behavioral Choice Architecture Study' : '© 2026 SoundFlow AB'}
          </p>
        </div>
      </footer>
    </div>
  );
};
