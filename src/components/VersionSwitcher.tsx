import React, { useState } from 'react';
import { Layers, Info, X, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';

interface VersionSwitcherProps {
  currentVersion: 'A' | 'B';
  onSwitchVersion: (version: 'A' | 'B') => void;
  onResetRandomization: () => void;
  onExitPreview: () => void;
}

export const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  currentVersion,
  onSwitchVersion,
  onResetRandomization,
  onExitPreview
}) => {
  const [showAuditInfo, setShowAuditInfo] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const handleReset = () => {
    onResetRandomization();
    setResetFeedback('Participant storage reset! Next normal visit will draw a fresh 50/50 coin flip.');
    setTimeout(() => {
      setResetFeedback(null);
    }, 4000);
  };

  return (
    <>
      {/* Evaluator-Only Preview Mode Bar */}
      <div className="bg-[#090d16] text-slate-200 border-b border-indigo-500/40 px-4 py-2 text-xs z-50 sticky top-0 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 bg-indigo-900/60 text-indigo-300 font-mono text-[11px] px-2.5 py-0.5 rounded border border-indigo-500/40 font-semibold">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              EVALUATOR PREVIEW (?preview=1)
            </span>

            <div className="flex items-center bg-[#1e293b] p-0.5 rounded-lg border border-slate-700">
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
                Version B (Redesign)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition cursor-pointer"
              title="Clears persistent assignment in localStorage to simulate a brand-new visitor"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset 50/50 Draw</span>
            </button>

            <button
              onClick={() => setShowAuditInfo(true)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Hypotheses</span>
            </button>

            <button
              onClick={onExitPreview}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded transition cursor-pointer"
              title="Test the real visitor view without ?preview=1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Exit Preview</span>
            </button>
          </div>
        </div>

        {resetFeedback && (
          <div className="max-w-6xl mx-auto mt-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded">
            {resetFeedback}
          </div>
        )}
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
                <h3 className="text-sm font-bold text-white">Pre-Implementation Hypotheses (Audit.md)</h3>
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
                  Version B introduces a 3-attribute uniform card structure (Price, Number of Users, Core Benefits) plus expandable sections to reduce decision effort while preserving access to all 4 plans.
                </p>
              </div>

              <div className="p-3 bg-[#202020] rounded-xl border border-[#2d2d2d]">
                <strong className="text-white block mb-0.5">Issue 2: Salience & Visual Attention</strong>
                <p>
                  Eliminates asymmetric borders and distracting candy badges so users compare plans based on relevant attributes rather than artificial visual salience.
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

              <div className="p-3 bg-[#1e293b] rounded-xl border border-indigo-500/30 text-indigo-200">
                <strong className="text-white block mb-0.5">Experiment Randomization Details</strong>
                <p>
                  In visitor mode (without <code>?preview=1</code>), visitors are randomized 50/50 on their first visit and persisted in <code>localStorage</code> under <code>soundflow_experiment_variant</code>. The preview switcher is hidden from study participants.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAuditInfo(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
