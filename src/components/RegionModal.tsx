import React from 'react';
import { RegionConfig, SUPPORTED_REGIONS } from '../types/soundflow';
import { X, Globe2, Check } from 'lucide-react';

interface RegionModalProps {
  isOpen: boolean;
  currentRegion: RegionConfig;
  onClose: () => void;
  onSelectRegion: (region: RegionConfig) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  isOpen,
  currentRegion,
  onClose,
  onSelectRegion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-brand-green" />
            <span className="font-bold text-sm">Select Region & Language</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          {SUPPORTED_REGIONS.map((region) => {
            const isSelected = region.code === currentRegion.code;
            return (
              <button
                key={region.code}
                onClick={() => {
                  onSelectRegion(region);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition ${
                  isSelected ? 'bg-brand-green/10 text-brand-green font-semibold' : 'text-[#d1d5db] hover:bg-[#222]'
                }`}
              >
                <div>
                  <div className="text-sm">{region.localName}</div>
                  <div className="text-xs text-[#777]">
                    Currency: {region.currencyCode} ({region.currencySymbol})
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-green" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
