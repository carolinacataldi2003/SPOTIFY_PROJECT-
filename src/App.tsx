import React, { useState, useEffect } from 'react';
import { PlanConfig, RegionConfig, UserSubscription, SUPPORTED_REGIONS } from './types/soundflow';
import { SoundFlowLanding } from './components/SoundFlowLanding';
import { CheckoutModal } from './components/CheckoutModal';
import { StudentVerificationModal } from './components/StudentVerificationModal';
import { RegionModal } from './components/RegionModal';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { SupportModal } from './components/SupportModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { WebPlayerDemo } from './components/WebPlayerDemo';
import { SoundFlowVersionB } from './components/SoundFlowVersionB';
import { VersionSwitcher } from './components/VersionSwitcher';
import { AcademicDisclosure } from './components/AcademicDisclosure';

const EXPERIMENT_STORAGE_KEY = 'soundflow_assigned_variant';

function determineInitialVariant(): { variant: 'A' | 'B'; isPreview: boolean } {
  if (typeof window === 'undefined') return { variant: 'A', isPreview: false };

  const urlParams = new URLSearchParams(window.location.search);
  const isPreview = urlParams.get('preview') === '1' || urlParams.get('preview') === 'true';

  // Evaluator-only preview mode: allows explicit version inspection via ?preview=1&v=a or ?preview=1&v=b
  if (isPreview) {
    const vParam = urlParams.get('v');
    if (vParam === 'b' || vParam === 'B') return { variant: 'B', isPreview: true };
    if (vParam === 'a' || vParam === 'A') return { variant: 'A', isPreview: true };

    const saved = localStorage.getItem(EXPERIMENT_STORAGE_KEY);
    if (saved === 'A' || saved === 'B') {
      return { variant: saved, isPreview: true };
    }
    return { variant: 'A', isPreview: true };
  }

  // Normal Visitor Mode:
  // 1. Check persistent browser storage
  try {
    const saved = localStorage.getItem(EXPERIMENT_STORAGE_KEY);
    if (saved === 'A' || saved === 'B') {
      return { variant: saved, isPreview: false };
    }

    // 2. First-time visitor: 50/50 probability automatic random assignment
    const assigned: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(EXPERIMENT_STORAGE_KEY, assigned);
    return { variant: assigned, isPreview: false };
  } catch {
    const fallback: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    return { variant: fallback, isPreview: false };
  }
}

export default function App() {
  const [experimentState, setExperimentState] = useState(determineInitialVariant);
  const currentVersion = experimentState.variant;
  const isPreviewMode = experimentState.isPreview;

  const [currentScreen, setCurrentScreen] = useState<'landing' | 'player'>('landing');
  const [currentRegion, setCurrentRegion] = useState<RegionConfig>(SUPPORTED_REGIONS[0]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  // Evaluator-only switch handler (only active when preview=1)
  const handleSwitchVersion = (version: 'A' | 'B') => {
    setExperimentState({ variant: version, isPreview: true });
    try {
      localStorage.setItem(EXPERIMENT_STORAGE_KEY, version);
      const url = new URL(window.location.href);
      url.searchParams.set('preview', '1');
      url.searchParams.set('v', version.toLowerCase());
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore
    }
  };

  // Reset 50/50 randomization in preview mode to test fresh visitor assignment
  const handleResetRandomization = () => {
    try {
      localStorage.removeItem(EXPERIMENT_STORAGE_KEY);
      const freshVariant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(EXPERIMENT_STORAGE_KEY, freshVariant);
      setExperimentState({ variant: freshVariant, isPreview: true });
    } catch {
      // Ignore
    }
  };

  // Exit preview mode and return to normal visitor experience
  const handleExitPreview = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('preview');
    url.searchParams.delete('v');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setExperimentState(prev => ({ ...prev, isPreview: false }));
  };

  // Modal open states
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanConfig | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Restore stored subscription if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('soundflow_sub');
      if (stored) {
        setSubscription(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleSubscriptionSuccess = (newSub: UserSubscription) => {
    setSubscription(newSub);
    try {
      localStorage.setItem('soundflow_sub', JSON.stringify(newSub));
    } catch {
      // Ignore
    }
  };

  const handleCancelSubscription = () => {
    setSubscription(null);
    try {
      localStorage.removeItem('soundflow_sub');
    } catch {
      // Ignore
    }
  };

  const handleSwitchPlan = (newPlan: PlanConfig) => {
    setIsAccountModalOpen(false);
    setSelectedPlanForCheckout(newPlan);
  };

  // Student plan template for checkout
  const studentPlanConfig: PlanConfig = {
    id: 'student',
    name: 'Student',
    badgeText: '$0 for 1 month',
    badgeBg: '#C4B5FD',
    badgeTextColor: '#000000',
    priceHeadline: '$0 for 1 month',
    priceSubline: `$${(6.48 * currentRegion.currencyRate).toFixed(2)} / month after`,
    monthlyPrice: 6.48,
    hasFreeTrial: true,
    freeTrialMonths: 1,
    accountsCount: 1,
    features: ['1 verified Premium account', 'Discount for eligible students', 'Cancel anytime'],
    ctaText: 'Try 1 month for $0',
    finePrint: `$0 for 1 month, then $${(6.48 * currentRegion.currencyRate).toFixed(2)} per month after.`
  };

  const allPlans: PlanConfig[] = [
    {
      id: 'individual',
      name: 'Individual',
      badgeText: '$0 for 1 month',
      badgeBg: '#FFD2D7',
      badgeTextColor: '#000000',
      priceHeadline: '$0 for 1 month',
      monthlyPrice: 11.98,
      hasFreeTrial: true,
      freeTrialMonths: 1,
      accountsCount: 1,
      features: ['1 Premium account', 'Cancel anytime'],
      ctaText: 'Try 1 month for $0',
      finePrint: '$0 for 1 month, then $11.98 per month after.'
    },
    studentPlanConfig,
    {
      id: 'duo',
      name: 'Duo',
      badgeText: '2 accounts',
      badgeBg: '#FFC862',
      badgeTextColor: '#000000',
      priceHeadline: `$${(16.98 * currentRegion.currencyRate).toFixed(2)} / month`,
      monthlyPrice: 16.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 2,
      features: ['2 Premium accounts', 'Cancel anytime'],
      ctaText: 'Get Premium Duo',
      finePrint: 'For couples who reside at the same address.'
    },
    {
      id: 'family',
      name: 'Family',
      badgeText: 'Up to 6 accounts',
      badgeBg: '#A5F3FC',
      badgeTextColor: '#000000',
      priceHeadline: `$${(20.98 * currentRegion.currencyRate).toFixed(2)} / month`,
      monthlyPrice: 20.98,
      hasFreeTrial: false,
      freeTrialMonths: 0,
      accountsCount: 6,
      features: ['Up to 6 Premium accounts', 'Parental controls', 'Cancel anytime'],
      ctaText: 'Get Premium Family',
      finePrint: 'For up to 6 family members residing at the same address.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Evaluator-Only Preview Mode Bar: Visible strictly when ?preview=1 is in the URL */}
      {isPreviewMode && (
        <VersionSwitcher 
          currentVersion={currentVersion} 
          onSwitchVersion={handleSwitchVersion} 
          onResetRandomization={handleResetRandomization}
          onExitPreview={handleExitPreview}
        />
      )}

      {/* Neutral Academic Project Disclosure Notice: Displayed on both Version A & B */}
      <AcademicDisclosure />

      {/* View routing: Landing or Web Player */}
      {currentScreen === 'player' ? (
        <WebPlayerDemo
          subscription={subscription}
          onBackToLanding={() => setCurrentScreen('landing')}
          onOpenCheckout={() => setSelectedPlanForCheckout(allPlans[0])}
        />
      ) : currentVersion === 'B' ? (
        <SoundFlowVersionB
          region={currentRegion}
          subscription={subscription}
          isPreview={isPreviewMode}
          onOpenCheckout={(plan) => setSelectedPlanForCheckout(plan)}
          onOpenStudent={() => setIsStudentModalOpen(true)}
          onOpenRegion={() => setIsRegionModalOpen(true)}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onOpenMenu={() => setIsMobileNavOpen(true)}
          onOpenWebPlayer={() => setCurrentScreen('player')}
          onOpenAccount={() => setIsAccountModalOpen(true)}
        />
      ) : (
        <SoundFlowLanding
          region={currentRegion}
          subscription={subscription}
          onOpenCheckout={(plan) => setSelectedPlanForCheckout(plan)}
          onOpenStudent={() => setIsStudentModalOpen(true)}
          onOpenRegion={() => setIsRegionModalOpen(true)}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onOpenMenu={() => setIsMobileNavOpen(true)}
          onOpenWebPlayer={() => setCurrentScreen('player')}
          onOpenAccount={() => setIsAccountModalOpen(true)}
        />
      )}

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          plan={selectedPlanForCheckout}
          region={currentRegion}
          isOpen={true}
          onClose={() => setSelectedPlanForCheckout(null)}
          onSuccess={handleSubscriptionSuccess}
          onOpenWebPlayer={() => {
            setSelectedPlanForCheckout(null);
            setCurrentScreen('player');
          }}
        />
      )}

      {/* Student Verification Modal */}
      <StudentVerificationModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onVerified={() => {
          setIsStudentModalOpen(false);
          setSelectedPlanForCheckout(studentPlanConfig);
        }}
      />

      {/* Region & Language Selector Modal */}
      <RegionModal
        isOpen={isRegionModalOpen}
        currentRegion={currentRegion}
        onClose={() => setIsRegionModalOpen(false)}
        onSelectRegion={(reg) => setCurrentRegion(reg)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        subscription={subscription}
        currentRegion={currentRegion}
        onOpenWebPlayer={() => {
          setIsMobileNavOpen(false);
          setCurrentScreen('player');
        }}
        onOpenPlans={() => {
          setIsMobileNavOpen(false);
          setCurrentScreen('landing');
          setTimeout(() => {
            document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenStudent={() => {
          setIsMobileNavOpen(false);
          setIsStudentModalOpen(true);
        }}
        onOpenSupport={() => {
          setIsMobileNavOpen(false);
          setIsSupportModalOpen(true);
        }}
        onOpenRegion={() => {
          setIsMobileNavOpen(false);
          setIsRegionModalOpen(true);
        }}
        onOpenAccount={() => {
          setIsMobileNavOpen(false);
          setIsAccountModalOpen(true);
        }}
      />

      {/* Support & FAQ Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onOpenPlans={() => {
          setIsSupportModalOpen(false);
          document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Account / Subscription Manager Modal */}
      <AccountManagerModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        subscription={subscription}
        plans={allPlans}
        onCancelSubscription={handleCancelSubscription}
        onSwitchPlan={handleSwitchPlan}
      />
    </div>
  );
}
