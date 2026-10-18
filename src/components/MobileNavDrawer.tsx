import React from 'react';
import { X, Sparkles, Music, HelpCircle, GraduationCap, Globe, User, Shield } from 'lucide-react';
import { UserSubscription, RegionConfig } from '../types/soundflow';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription | null;
  currentRegion: RegionConfig;
  onOpenWebPlayer: () => void;
  onOpenPlans: () => void;
  onOpenStudent: () => void;
  onOpenSupport: () => void;
  onOpenRegion: () => void;
  onOpenAccount: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  subscription,
  currentRegion,
  onOpenWebPlayer,
  onOpenPlans,
  onOpenStudent,
  onOpenSupport,
  onOpenRegion,
  onOpenAccount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xs bg-black h-full border-l border-[#282828] p-6 flex flex-col justify-between text-white overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#282828]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-white">SoundFlow</span>
            </div>
            <button 
              onClick={onClose}
              className="text-[#a7a7a7] hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="py-6 space-y-4">
            <button
              onClick={() => {
                onClose();
                onOpenPlans();
              }}
              className="w-full text-left font-bold text-lg text-white hover:text-brand-green transition flex items-center justify-between"
            >
              <span>Premium Plans</span>
              <span className="text-[10px] bg-brand-green/20 text-brand-green font-bold px-2 py-0.5 rounded">
                $0 Trial
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWebPlayer();
              }}
              className="w-full text-left font-bold text-lg text-white hover:text-brand-green transition flex items-center gap-2.5"
            >
              <Music className="w-5 h-5 text-brand-green" />
              <span>Web Player Demo</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStudent();
              }}
              className="w-full text-left font-bold text-lg text-white hover:text-brand-green transition flex items-center gap-2.5"
            >
              <GraduationCap className="w-5 h-5 text-[#C4B5FD]" />
              <span>Student Discount</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSupport();
              }}
              className="w-full text-left font-bold text-lg text-white hover:text-brand-green transition flex items-center gap-2.5"
            >
              <HelpCircle className="w-5 h-5 text-[#888]" />
              <span>Support & FAQ</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenRegion();
              }}
              className="w-full text-left font-medium text-sm text-[#a7a7a7] hover:text-white transition flex items-center gap-2.5 pt-4 border-t border-[#222]"
            >
              <Globe className="w-4 h-4 text-brand-green" />
              <span>{currentRegion.localName}</span>
            </button>
          </nav>
        </div>

        {/* Footer in Drawer */}
        <div className="space-y-4 border-t border-[#282828] pt-6">
          <button
            onClick={() => {
              onClose();
              onOpenAccount();
            }}
            className="w-full bg-[#202020] hover:bg-[#282828] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-green" />
              <span>{subscription?.active ? subscription.planName : 'Account Overview'}</span>
            </div>
            <span className="text-[10px] text-[#888]">Manage</span>
          </button>

          <p className="text-[10px] text-[#666] leading-tight">
            SoundFlow AB · Premium Music Streaming Experience
          </p>
        </div>
      </div>
    </div>
  );
};
