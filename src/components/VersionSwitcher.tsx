import React, { useState } from 'react';
import { Layers, Info, X, CheckCircle2 } from 'lucide-react';

interface VersionSwitcherProps {
  currentVersion: 'A' | 'B';
  onSwitchVersion: (version: 'A' | 'B') => void;
}

export const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  currentVersion,
  onSwitchVersion
}) => {
  const [showAuditInfo, setShowAuditInfo] = useState(false);

  return (
    <>
      {/* Sticky top-level bar */}
      <div className="bg-[#0f172a] text-slate-200 border-b border-slate-700/80 px-4 py-2 flex items-center justify-between text-xs z-50 sticky top-0 shadow-md">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Study Variant:</span>
          <div className="flex items-center bg-[#1e293b] p-0.5 rounded-lg border border-slate-600">
            <button
              onClick={() => onSwitchVersion('A')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                currentVersion === 'A'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Version A (Original)
            </button>
            <button
              onClick={() => onSwitchVersion('B')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                currentVersion === 'B'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Version B (Behavioral Redesign)
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowAuditInfo(true)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Audit Hypotheses</span>
        </button>
      </div>

      {/* Audit Hypotheses Quick Modal */}
      {showAuditInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-lg bg-[#181818] border border-slate-700 rounded-2xl shadow-2xl p-6 text-white space-y-4 max-h-[85vh] overflow-y-auto text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Audit.md Behavioral Improvements in Version B</h3>
              </div>
              <button 
                onClick={() => setShowAuditInfo(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed">
              <div className="p-3 bg-[#202020] rounded-xl border border-[#2d2d2d]">
                <strong className="text-white block mb-0.5">Issue 1: Choice Overload & Cognitive Load</strong>
                <p>
                  Version B introduces a 3-attribute uniform card structure (Price, Number of Users, Core Benefits) plus expandable sections to reduce decision effort.
                </p>
              </div>

              <div className="p-3 bg-[#202020] rounded-xl border border-[#2d2d2d]">
                <strong className="text-white block mb-0.5">Issue 2: Salience & Visual Attention</strong>
                <p>
                  Eliminated asymmetric borders and distracting candy badges so users compare plans based on relevant attributes rather than artificial visual salience.
                </p>
              </div>

              <div className="p-3 bg-[#202020] rounded-xl border border-[#2d2d2d]">
                <strong className="text-white block mb-0.5">Issue 3: Framing of Subscription Costs</strong>
                <p>
                  Full price transparency: displays recurring monthly costs upfront, clear 30-day trial dates, and exact renewal and 1-click cancellation conditions right next to each CTA.
                </p>
              </div>

              <div className="p-3 bg-[#202020] rounded-xl border border-[#2d2d2d]">
                <strong className="text-white block mb-0.5">Issue 4: Decision Support & Personalization</strong>
                <p>
                  Includes an optional 2-question Plan Selection Guide to recommend the most cost-effective plan based on listener count and student status.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAuditInfo(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
