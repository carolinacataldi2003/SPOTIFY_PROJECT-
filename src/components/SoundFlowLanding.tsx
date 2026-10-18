import React, { useState } from 'react';
import { PlanConfig, RegionConfig, UserSubscription } from '../types/soundflow';
import { soundflowAudio, SOUNDFLOW_TRACKS } from '../utils/audioEngine';
import { Sparkles, Music, Volume2 } from 'lucide-react';

interface SoundFlowLandingProps {
  region: RegionConfig;
  subscription: UserSubscription | null;
  onOpenCheckout: (plan: PlanConfig) => void;
  onOpenStudent: () => void;
  onOpenRegion: () => void;
  onOpenSupport: () => void;
  onOpenMenu: () => void;
  onOpenWebPlayer: () => void;
  onOpenAccount: () => void;
}

export const SoundFlowLanding: React.FC<SoundFlowLandingProps> = ({
  region,
  subscription,
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

  // Dynamic currency calculations based on selected region
  const formatPrice = (sgdAmount: number) => {
    const val = (sgdAmount * region.currencyRate).toFixed(2);
    return `${region.currencySymbol}${val}`;
  };

  const individualPrice = formatPrice(11.98);
  const studentPrice = formatPrice(6.48);
  const duoPrice = formatPrice(16.98);
  const familyPrice = formatPrice(20.98);

  const PLANS: PlanConfig[] = [
    {
      id: 'individual',
      name: 'Individual',
      badgeText: '$0 for 1 month',
      badgeBg: '#FFD2D7',
      badgeTextColor: '#000000',
      priceHeadline: '$0 for 1 month',
      priceSubline: `${individualPrice} / month after`,
      monthlyPrice: 11.98,
      hasFreeTrial: true,
      freeTrialMonths: 1,
      accountsCount: 1,
      features: ['1 Premium account', 'Cancel anytime'],
      ctaText: 'Try 1 month for $0',
      finePrint: `$0 for 1 month, then ${individualPrice} per month after. Offer only available if you haven’t tried Premium before. Terms apply.`
    },
    {
      id: 'student',
      name: 'Student',
      badgeText: '$0 for 1 month',
      badgeBg: '#C4B5FD',
      badgeTextColor: '#000000',
      priceHeadline: '$0 for 1 month',
      priceSubline: `${studentPrice} / month after`,
      monthlyPrice: 6.48,
      hasFreeTrial: true,
      freeTrialMonths: 1,
      accountsCount: 1,
      features: [
        '1 verified Premium account',
        'Discount for eligible students',
        'Cancel anytime'
      ],
      ctaText: 'Try 1 month for $0',
      finePrint: `$0 for 1 month, then ${studentPrice} per month after. Offer reserved for students enrolled in an eligible accredited institution of higher education. Not available to users who have already tried Premium. Subject to the SoundFlow student discount Terms and Conditions.`
    },
    {
      id: 'duo',
      name: 'Duo',
      badgeText: '2 accounts',
      badgeBg: '#FFC862',
      badgeTextColor: '#000000',
      priceHeadline: `${duoPrice} / month`,
      monthlyPrice: 16.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 2,
      features: ['2 Premium accounts', 'Cancel anytime'],
      ctaText: 'Get Premium Duo',
      finePrint: `For couples who reside at the same address. Terms apply.`
    },
    {
      id: 'family',
      name: 'Family',
      badgeText: 'Up to 6 accounts',
      badgeBg: '#A5F3FC',
      badgeTextColor: '#000000',
      priceHeadline: `${familyPrice} / month`,
      monthlyPrice: 20.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 6,
      features: [
        'Up to 6 Premium accounts',
        'Parental controls for the plan manager',
        'Cancel anytime'
      ],
      ctaText: 'Get Premium Family',
      finePrint: `For up to 6 family members residing at the same address. Terms apply.`
    }
  ];

  // Tile preview audio click handler
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
    const elem = document.getElementById('plans');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#121212] text-white antialiased flex flex-col min-h-screen">
      {/* BEGIN: TopNotificationBanner */}
      {showBanner && (
        <aside 
          className="bg-[#0D72EA] text-white text-xs px-4 py-2.5 flex items-center justify-between font-medium transition duration-200" 
          data-purpose="country-language-banner"
        >
          <button 
            onClick={onOpenRegion}
            className="hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
          >
            <span>{region.bannerLabel}</span>
          </button>
          <button 
            aria-label="Close language selector banner" 
            onClick={() => setShowBanner(false)}
            className="text-white hover:opacity-80 p-0.5 cursor-pointer focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
            </svg>
          </button>
        </aside>
      )}
      {/* END: TopNotificationBanner */}

      {/* BEGIN: MainHeader */}
      <header className="bg-black text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#202020]">
        {/* SoundFlow Brand Logo */}
        <a 
          aria-label="SoundFlow Home" 
          className="flex items-center gap-2 group cursor-pointer" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center transition-transform group-hover:scale-105">
            {/* Sleek audio wave / soundflow icon */}
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z"></path>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">SoundFlow</span>
        </a>

        {/* Desktop nav links + Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#plans" onClick={scrollToPlans} className="text-[#d1d5db] hover:text-white transition">
              Premium Plans
            </a>
            <button onClick={onOpenWebPlayer} className="text-[#d1d5db] hover:text-brand-green transition flex items-center gap-1.5 cursor-pointer">
              <Music className="w-4 h-4 text-brand-green" />
              <span>Web Player</span>
            </button>
            <button onClick={onOpenSupport} className="text-[#d1d5db] hover:text-white transition cursor-pointer">
              Support
            </button>
            <button 
              onClick={subscription?.active ? onOpenAccount : () => onOpenCheckout(PLANS[0])}
              className="text-xs font-bold bg-[#242424] hover:bg-[#333] text-white px-3.5 py-1.5 rounded-full border border-[#3e3e3e] transition"
            >
              {subscription?.active ? 'My Account' : 'Log In'}
            </button>
          </nav>

          {/* Mobile Hamburger Menu Button */}
          <button 
            aria-label="Open mobile navigation menu" 
            onClick={onOpenMenu}
            className="text-white p-1 focus:outline-none hover:text-brand-green transition cursor-pointer"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* Floating Audio Feedback Toast */}
      {playingFeedback && (
        <div className="fixed top-16 right-4 z-50 bg-[#1e1e1e] border border-brand-green/40 text-brand-green px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Volume2 className="w-4 h-4" />
          <span>{playingFeedback}</span>
        </div>
      )}

      {/* Active Subscription Banner (if user activated a plan) */}
      {subscription?.active && (
        <div className="bg-[#183424] border-b border-brand-green/30 px-5 py-2.5 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <span>
              <strong>{subscription.planName}</strong> is active! Trial expires: {subscription.trialExpiresAt}.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWebPlayer}
              className="bg-brand-green text-black font-bold px-3 py-1 rounded-full text-[11px] hover:bg-brand-green-hover transition"
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

      <main className="flex-grow">
        {/* BEGIN: HeroSection */}
        <section 
          className="relative overflow-hidden bg-gradient-to-b from-[#0b3821] via-[#121212] to-[#121212] pt-6 pb-12 px-5 sm:px-8 max-w-4xl mx-auto" 
          data-purpose="hero-promotional"
        >
          {/* Dynamic collage of music album covers (Clickable to preview audio!) */}
          <div 
            className="relative w-full h-64 overflow-hidden mb-6 -mx-2 select-none" 
            data-purpose="hero-artwork-collage"
            title="Click any album cover to preview its sound loop!"
          >
            {/* Album Tile 1: Phonk Purple */}
            <div 
              onClick={() => handleTileClick('phonk-1', 'Drift Mirage (Phonk)')}
              className={`art-tile absolute -left-8 top-1 w-36 h-36 bg-gradient-to-br from-purple-800 to-indigo-950 rounded-lg p-2.5 transform -rotate-12 border border-purple-400/30 cursor-pointer ${
                playingTrackId === 'phonk-1' ? 'ring-2 ring-brand-green scale-105' : ''
              }`}
            >
              <div className="h-full flex flex-col justify-between text-white">
                <span className="text-xs font-black tracking-widest text-purple-300">PHONK</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/40 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Album Tile 2: Easy on Friday */}
            <div 
              onClick={() => handleTileClick('friday-2', 'Warm Sunlight & Coffee (Easy on Friday)')}
              className={`art-tile absolute left-20 -top-2 w-40 h-40 bg-[#f3efe6] text-black rounded-lg p-3 shadow-2xl transform rotate-6 border border-amber-200 cursor-pointer ${
                playingTrackId === 'friday-2' ? 'ring-2 ring-brand-green scale-105' : ''
              }`}
            >
              <p className="font-serif italic font-bold text-lg leading-tight text-stone-800">easy on</p>
              <p className="font-black text-2xl tracking-tighter text-stone-900 uppercase">FRIDAY</p>
              <div className="mt-4 flex justify-end">
                <span className="text-[10px] font-mono tracking-widest bg-stone-300 px-1.5 py-0.5 rounded">FLOW</span>
              </div>
            </div>

            {/* Album Tile 3: Housewerk Neon Green/Yellow */}
            <div 
              onClick={() => handleTileClick('housewerk-3', 'Club Paradigm (Housewerk)')}
              className={`art-tile absolute left-16 top-24 w-44 h-44 bg-[#C2F738] text-black rounded-lg p-3 shadow-2xl transform -rotate-6 z-10 border border-black/20 cursor-pointer ${
                playingTrackId === 'housewerk-3' ? 'ring-2 ring-brand-green scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-tight">HOUSEWERK</span>
                <div className="w-3.5 h-3.5 rounded-full bg-black"></div>
              </div>
              {/* Geometric Labyrinth Pattern */}
              <div className="mt-2 w-full h-24 border-2 border-black flex items-center justify-center p-1">
                <div className="w-full h-full border border-black flex items-center justify-center">
                  <div className="w-8 h-8 border border-black rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Album Tile 4: Old School Reggaeton CD */}
            <div 
              onClick={() => handleTileClick('reggaeton-4', 'Noche de Gasolina (Old School Reggaeton)')}
              className={`art-tile absolute right-2 top-10 w-40 h-40 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 rounded-lg p-2.5 shadow-2xl transform rotate-12 border border-white/20 cursor-pointer ${
                playingTrackId === 'reggaeton-4' ? 'ring-2 ring-brand-green scale-105' : ''
              }`}
            >
              <div className="w-full h-full rounded-full border-4 border-slate-300/80 bg-stone-900/90 flex flex-col items-center justify-center text-center p-2">
                <span className="text-[9px] font-bold text-yellow-300 uppercase tracking-wider">OLD SCHOOL</span>
                <span className="text-xs font-black text-white italic">REGGAETON</span>
                <div className="w-4 h-4 rounded-full bg-white mt-1"></div>
              </div>
            </div>

            {/* Album Tile 5: Sunset Movie quote */}
            <div 
              onClick={() => handleTileClick('sunset-5', 'Neon Horizon at Dusk (My Life is a Movie)')}
              className={`art-tile absolute right-20 -top-6 w-36 h-36 bg-gradient-to-t from-pink-600 to-violet-800 rounded-lg p-2 shadow-lg transform -rotate-3 opacity-90 cursor-pointer ${
                playingTrackId === 'sunset-5' ? 'ring-2 ring-brand-green scale-105' : ''
              }`}
            >
              <div className="h-full flex items-end">
                <span className="text-[11px] text-yellow-200 font-mono">[my life is a movie]</span>
              </div>
            </div>
          </div>

          {/* Hero Typography & CTAs */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Listen without limits. Try 1 month of Premium Individual for $0.
            </h1>
            <p className="text-base font-medium text-white/90">
              Only {individualPrice}/month after. Cancel anytime.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onOpenCheckout(PLANS[0])}
                className="w-full sm:w-auto flex-1 bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3.5 px-8 rounded-full text-center text-base transition duration-200 shadow-lg active:scale-95 cursor-pointer" 
                data-purpose="cta-try-free"
              >
                Try 1 month for $0
              </button>
              <a 
                href="#plans" 
                onClick={scrollToPlans}
                className="w-full sm:w-auto flex-1 bg-transparent border border-white/70 hover:border-white text-white font-bold py-3.5 px-8 rounded-full text-center text-base transition duration-200 block active:scale-95 cursor-pointer" 
                data-purpose="cta-view-plans"
              >
                View all plans
              </a>
            </div>

            {/* Hero Fine Print */}
            <p className="text-[11px] text-[#A7A7A7] leading-relaxed pt-2">
              $0 for 1 month, then {individualPrice} per month after. Offer only available if you haven’t tried Premium before.{' '}
              <button onClick={onOpenSupport} className="underline hover:text-white cursor-pointer">
                Terms apply.
              </button>
            </p>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: ComparisonSection */}
        <section className="py-12 px-5 sm:px-8 bg-[#121212] border-t border-[#282828] max-w-4xl mx-auto" data-purpose="comparison-features">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Experience the difference
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Go Premium and enjoy full control of your listening. Cancel anytime.
            </p>
          </div>

          {/* Feature Comparison Table Card */}
          <div className="overflow-x-auto bg-[#181818] rounded-2xl border border-[#2e2e2e] p-4 shadow-xl">
            <table aria-label="Feature comparison between Free and Premium plans" className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider text-brand-muted w-5/12" scope="col">
                    What you’ll get
                  </th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider text-center text-brand-muted w-3/12" scope="col">
                    SoundFlow Free
                  </th>
                  <th className="pb-4 font-bold text-xs uppercase tracking-wider text-center text-brand-green w-4/12" scope="col">
                    SoundFlow Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a] text-xs sm:text-sm">
                {/* Row 1 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Ad-free music listening</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Download to listen offline</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Play songs in any order</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Lossless audio quality</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                {/* Row 5 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Listen with friends in real time</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
                {/* Row 6 */}
                <tr className="hover:bg-white/[0.02] transition">
                  <th className="py-3.5 pr-2 font-normal text-white" scope="row">Organise listening queue</th>
                  <td className="py-3.5 text-center text-brand-muted">—</td>
                  <td className="py-3.5 text-center text-brand-green">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Web player interactive test affordance */}
          <div className="mt-4 p-4 rounded-xl bg-[#181818] border border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#d1d5db]">
                Want to hear the difference? Test Lossless audio, ad-free skipping, and offline downloads in our interactive player.
              </p>
            </div>
            <button
              onClick={onOpenWebPlayer}
              className="whitespace-nowrap px-4 py-2 bg-[#282828] hover:bg-brand-green hover:text-black text-white text-xs font-bold rounded-full transition shadow cursor-pointer"
            >
              Test Premium Simulator →
            </button>
          </div>
        </section>
        {/* END: ComparisonSection */}

        {/* BEGIN: PlansSection */}
        <section className="py-12 px-5 sm:px-8 bg-[#121212] max-w-4xl mx-auto" data-purpose="subscription-plans" id="plans">
          {/* Section Title & Intro */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Affordable plans for any situation
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Choose a Premium plan and listen to ad-free music without limits on your phone, speaker and other devices. Pay in various ways. Cancel anytime.
            </p>

            {/* Accepted Payment Methods Bar */}
            <div aria-label="Accepted Payment methods" className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">VISA</span>
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">Mastercard</span>
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">AMEX</span>
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">PayPal</span>
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">GrabPay</span>
              <span className="bg-[#242424] text-white text-[11px] font-semibold px-2.5 py-1 rounded border border-[#333]">Singtel</span>
            </div>
          </div>

          {/* Feature Inclusion Pill Notice */}
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-4 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green mb-2.5">
              ALL PREMIUM PLANS INCLUDE:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d1d5db]">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Ad-free music listening
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Download to listen offline
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Play songs in any order
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Lossless audio quality
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Listen with friends in real time
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                </svg>
                Organise listening queue
              </li>
            </ul>
          </div>

          {/* Plan Cards Stack */}
          <div className="space-y-6">
            {/* Card 1: Individual */}
            <article 
              className="bg-[#242424] rounded-2xl p-5 border border-[#333333] shadow-md flex flex-col justify-between hover:border-[#444] transition" 
              data-purpose="plan-card-individual"
            >
              <div>
                {/* Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-[#FFD2D7] text-[#000000] text-xs font-bold px-2.5 py-1 rounded-md">
                    $0 for 1 month
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Individual</h3>
                <p className="text-sm font-semibold text-white mb-0.5">$0 for 1 month</p>
                <p className="text-xs text-brand-muted mb-4">{individualPrice} / month after</p>
                <hr className="border-[#383838] my-4"/>
                {/* Plan Features List */}
                <ul className="space-y-2.5 text-xs text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>1 Premium account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => onOpenCheckout(PLANS[0])}
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-4 rounded-full text-center text-sm transition duration-150 active:scale-95 cursor-pointer shadow"
                >
                  Try 1 month for $0
                </button>
                <p className="text-[10px] text-brand-muted leading-tight mt-3 text-center">
                  $0 for 1 month, then {individualPrice} per month after. Offer only available if you haven’t tried Premium before.{' '}
                  <button onClick={onOpenSupport} className="underline hover:text-white cursor-pointer">
                    Terms apply.
                  </button>
                </p>
              </div>
            </article>

            {/* Card 2: Student */}
            <article 
              className="bg-[#242424] rounded-2xl p-5 border border-[#333333] shadow-md flex flex-col justify-between hover:border-[#444] transition" 
              data-purpose="plan-card-student"
            >
              <div>
                {/* Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-[#C4B5FD] text-[#000000] text-xs font-bold px-2.5 py-1 rounded-md">
                    $0 for 1 month
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Student</h3>
                <p className="text-sm font-semibold text-white mb-0.5">$0 for 1 month</p>
                <p className="text-xs text-brand-muted mb-4">{studentPrice} / month after</p>
                <hr className="border-[#383838] my-4"/>
                {/* Plan Features List */}
                <ul className="space-y-2.5 text-xs text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>1 verified Premium account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Discount for eligible students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => onOpenStudent()}
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-4 rounded-full text-center text-sm transition duration-150 active:scale-95 cursor-pointer shadow"
                >
                  Try 1 month for $0
                </button>
                <p className="text-[10px] text-brand-muted leading-tight mt-3 text-center">
                  $0 for 1 month, then {studentPrice} per month after. Offer reserved for students enrolled in an eligible accredited institution of higher education. Not available to users who have already tried Premium. Subject to the SoundFlow student discount{' '}
                  <button onClick={onOpenSupport} className="underline hover:text-white cursor-pointer">
                    Terms and Conditions
                  </button>.
                </p>
              </div>
            </article>

            {/* Card 3: Duo */}
            <article 
              className="bg-[#242424] rounded-2xl p-5 border border-[#333333] shadow-md flex flex-col justify-between hover:border-[#444] transition" 
              data-purpose="plan-card-duo"
            >
              <div>
                {/* Header */}
                <div className="mb-3">
                  <span className="inline-block bg-[#FFC862] text-[#000000] text-xs font-bold px-2.5 py-1 rounded-md">
                    2 accounts
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Duo</h3>
                <p className="text-sm font-semibold text-white mb-4">{duoPrice} / month</p>
                <hr className="border-[#383838] my-4"/>
                {/* Plan Features List */}
                <ul className="space-y-2.5 text-xs text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>2 Premium accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => onOpenCheckout(PLANS[2])}
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-4 rounded-full text-center text-sm transition duration-150 active:scale-95 cursor-pointer shadow"
                >
                  Get Premium Duo
                </button>
                <p className="text-[10px] text-brand-muted leading-tight mt-3 text-center">
                  For couples who reside at the same address.{' '}
                  <button onClick={onOpenSupport} className="underline hover:text-white cursor-pointer">
                    Terms apply.
                  </button>
                </p>
              </div>
            </article>

            {/* Card 4: Family */}
            <article 
              className="bg-[#242424] rounded-2xl p-5 border border-[#333333] border-l-4 border-l-brand-green shadow-md flex flex-col justify-between hover:border-[#444] transition" 
              data-purpose="plan-card-family"
            >
              <div>
                {/* Header */}
                <div className="mb-3">
                  <span className="inline-block bg-[#A5F3FC] text-[#000000] text-xs font-bold px-2.5 py-1 rounded-md">
                    Up to 6 accounts
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Family</h3>
                <p className="text-sm font-semibold text-white mb-4">{familyPrice} / month</p>
                <hr className="border-[#383838] my-4"/>
                {/* Plan Features List */}
                <ul className="space-y-2.5 text-xs text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Up to 6 Premium accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Parental controls for the plan manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-green text-sm leading-none">•</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => onOpenCheckout(PLANS[3])}
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-4 rounded-full text-center text-sm transition duration-150 active:scale-95 cursor-pointer shadow"
                >
                  Get Premium Family
                </button>
                <p className="text-[10px] text-brand-muted leading-tight mt-3 text-center">
                  For up to 6 family members residing at the same address.{' '}
                  <button onClick={onOpenSupport} className="underline hover:text-white cursor-pointer">
                    Terms apply.
                  </button>
                </p>
              </div>
            </article>
          </div>
        </section>
        {/* END: PlansSection */}

        {/* BEGIN: FAQSection */}
        <section className="py-12 px-5 sm:px-8 bg-[#121212] border-t border-[#262626] max-w-4xl mx-auto" data-purpose="faq-accordion">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Questions? We’ve got answers.
            </h2>
          </div>
          <div className="space-y-3">
            {/* FAQ Item 1 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How does the SoundFlow Premium trial work?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                If you have never subscribed to SoundFlow Premium before, you are eligible for a 1-month trial for $0. You'll get all the benefits of ad-free listening, offline downloads, and lossless audio. After the trial ends, you will be billed the regular monthly price unless you cancel beforehand.
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How do I cancel my Premium plan?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                You can easily cancel your subscription anytime online from your account overview page under "Available Plans". There are no cancellation fees, and your Premium access will stay active until the end of your billing cycle.
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How does the Premium Duo plan work?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                Premium Duo is tailored for two people living under the same roof. Each person gets their own individual Premium account with distinct saved music, playlists, and recommendations.
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How does the Premium Family plan work?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                Premium Family gives up to 6 members of your household their own individual Premium accounts with separate playlists, plus parental controls to block explicit music for younger listeners.
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How does the Premium Student Plan work?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                Eligible students attending an accredited college or university receive a discounted monthly rate for up to 4 consecutive years, re-verified annually through an approved student verification service.
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="group bg-[#181818] rounded-xl border border-[#2a2a2a] p-4 text-sm open:bg-[#222]">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-white">
                <span>How much is SoundFlow Premium in {region.name}?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-[#2d2d2d] pt-3">
                Individual is {individualPrice}/month after a 1-month free trial. Student is {studentPrice}/month. Premium Duo is {duoPrice}/month for two accounts, and Premium Family is {familyPrice}/month for up to 6 accounts.
              </div>
            </details>
          </div>
        </section>
        {/* END: FAQSection */}
      </main>

      {/* BEGIN: MobileFooter */}
      <footer className="bg-black text-white pt-10 pb-8 px-5 sm:px-8 border-t border-[#222] max-w-4xl mx-auto w-full" data-purpose="site-footer">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-full bg-brand-green flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z"></path>
            </svg>
          </div>
          <span className="font-extrabold text-lg text-white">SoundFlow</span>
        </div>

        {/* Navigation Columns Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Company</p>
            <ul className="space-y-2.5 font-medium text-xs">
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>About</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>Jobs</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>For the Record</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Communities</p>
            <ul className="space-y-2.5 font-medium text-xs">
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>For Artists</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>Developers</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>Advertising</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>Investors</a></li>
              <li><a className="hover:text-brand-green transition" href="#plans" onClick={scrollToPlans}>Vendors</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Useful links</p>
            <ul className="space-y-2.5 font-medium text-xs">
              <li><button onClick={onOpenSupport} className="hover:text-brand-green transition cursor-pointer text-left">Support</button></li>
              <li><button onClick={onOpenWebPlayer} className="hover:text-brand-green transition cursor-pointer text-left">Web Player</button></li>
              <li><button onClick={onOpenSupport} className="hover:text-brand-green transition cursor-pointer text-left">Free Mobile App</button></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">SoundFlow Plans</p>
            <ul className="space-y-2.5 font-medium text-xs">
              <li><button onClick={() => onOpenCheckout(PLANS[0])} className="hover:text-brand-green transition cursor-pointer text-left">Premium Individual</button></li>
              <li><button onClick={() => onOpenCheckout(PLANS[2])} className="hover:text-brand-green transition cursor-pointer text-left">Premium Duo</button></li>
              <li><button onClick={() => onOpenCheckout(PLANS[3])} className="hover:text-brand-green transition cursor-pointer text-left">Premium Family</button></li>
              <li><button onClick={onOpenStudent} className="hover:text-brand-green transition cursor-pointer text-left">Premium Student</button></li>
              <li><button onClick={onOpenWebPlayer} className="hover:text-brand-green transition cursor-pointer text-left">SoundFlow Free</button></li>
            </ul>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <a aria-label="Instagram" className="w-10 h-10 rounded-full bg-[#222] hover:bg-brand-green hover:text-black text-white flex items-center justify-center transition" href="#">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
          </a>
          <a aria-label="Twitter / X" className="w-10 h-10 rounded-full bg-[#222] hover:bg-brand-green hover:text-black text-white flex items-center justify-center transition" href="#">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
          <a aria-label="Facebook" className="w-10 h-10 rounded-full bg-[#222] hover:bg-brand-green hover:text-black text-white flex items-center justify-center transition" href="#">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
          </a>
        </div>

        {/* Country Selector Indicator */}
        <div className="flex items-center justify-end text-xs text-brand-muted hover:text-white mb-6">
          <button onClick={onOpenRegion} className="flex items-center gap-1.5 cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span>{region.localName}</span>
          </button>
        </div>

        {/* Legal Links & Copyright */}
        <div className="text-[11px] text-brand-muted space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">Legal</button>
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">Safety &amp; Privacy Center</button>
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">Privacy Policy</button>
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">Cookies</button>
            <button onClick={onOpenSupport} className="hover:text-white cursor-pointer">About Ads</button>
          </div>
          <p className="pt-2 text-white/50">
            © 2026 SoundFlow AB
          </p>
        </div>
      </footer>
      {/* END: MobileFooter */}
    </div>
  );
};
