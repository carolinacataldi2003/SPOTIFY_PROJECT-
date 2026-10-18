export type PlanId = 'individual' | 'student' | 'duo' | 'family';

export interface PlanConfig {
  id: PlanId;
  name: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  priceHeadline: string;
  priceSubline?: string;
  monthlyPrice: number;
  hasFreeTrial: boolean;
  freeTrialMonths: number;
  accountsCount: number;
  features: string[];
  ctaText: string;
  finePrint: string;
  isPopular?: boolean;
}

export interface RegionConfig {
  code: string;
  name: string;
  localName: string;
  currencySymbol: string;
  currencyCode: string;
  currencyRate: number; // multiplier from SGD
  bannerLabel: string;
}

export const SUPPORTED_REGIONS: RegionConfig[] = [
  {
    code: 'SG',
    name: 'Singapore',
    localName: '新加坡 (简体中文)',
    currencySymbol: '$',
    currencyCode: 'SGD',
    currencyRate: 1.0,
    bannerLabel: '新加坡 (简体中文)'
  },
  {
    code: 'US',
    name: 'United States',
    localName: 'United States (English)',
    currencySymbol: '$',
    currencyCode: 'USD',
    currencyRate: 0.75,
    bannerLabel: 'United States (English)'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    localName: 'United Kingdom (English)',
    currencySymbol: '£',
    currencyCode: 'GBP',
    currencyRate: 0.60,
    bannerLabel: 'United Kingdom (English)'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    localName: 'Malaysia (English)',
    currencySymbol: 'RM',
    currencyCode: 'MYR',
    currencyRate: 3.3,
    bannerLabel: 'Malaysia (Bahasa & English)'
  },
  {
    code: 'AU',
    name: 'Australia',
    localName: 'Australia (English)',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    currencyRate: 1.15,
    bannerLabel: 'Australia (English)'
  },
  {
    code: 'DE',
    name: 'Germany',
    localName: 'Deutschland (Deutsch)',
    currencySymbol: '€',
    currencyCode: 'EUR',
    currencyRate: 0.70,
    bannerLabel: 'Deutschland (Deutsch)'
  }
];

export interface UserSubscription {
  active: boolean;
  planId: PlanId;
  planName: string;
  trialExpiresAt: string;
  nextBillingDate: string;
  monthlyAmount: number;
  paymentMethod: string;
  paymentDetails: string;
}
