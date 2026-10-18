import React, { useState } from 'react';
import { X, Search, HelpCircle, FileText, ChevronRight } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlans: () => void;
}

const HELP_TOPICS = [
  {
    title: 'How does the 1-month free trial billing work?',
    category: 'Billing',
    content: 'When you sign up for SoundFlow Premium Individual, Duo, or Student, you are not charged today ($0.00). Your trial lasts 30 calendar days. If you do not cancel before day 30, your chosen payment method will be charged the monthly fee automatically.'
  },
  {
    title: 'Can I cancel anytime without fees?',
    category: 'Subscription',
    content: 'Yes! SoundFlow has no lock-in contracts or cancellation penalties. You can cancel in one click from your Account Overview, and your premium perks remain active until the end of your billing cycle.'
  },
  {
    title: 'How do you verify Duo or Family plan address?',
    category: 'Plans',
    content: 'All members invited to a SoundFlow Duo or Family plan must reside at the same physical residential address. We verify this via address confirmation during invitation onboarding.'
  },
  {
    title: 'How do I download music for offline listening?',
    category: 'Features',
    content: 'In the SoundFlow app or Web Player, tap the downward arrow icon on any album or playlist. Once downloaded, you can toggle Offline Mode in Settings to play music with zero cellular data.'
  },
  {
    title: 'What audio quality does Lossless HiFi stream at?',
    category: 'Audio',
    content: 'SoundFlow Premium streams in bit-perfect FLAC audio format up to 24-bit 96kHz, delivering pure studio-master clarity with zero lossy compression.'
  }
];

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, onOpenPlans }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredTopics = HELP_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-green" />
            <span className="font-bold text-sm tracking-tight">SoundFlow Help & Support</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (trial, billing, offline...)"
              className="w-full bg-[#242424] border border-[#333] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#777] focus:outline-none focus:border-brand-green"
            />
          </div>

          <div className="space-y-2">
            {filteredTopics.map((topic, i) => {
              const isExpanded = expandedTopic === i;
              return (
                <div 
                  key={i}
                  className="bg-[#202020] border border-[#2d2d2d] rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : i)}
                    className="w-full text-left p-3.5 flex items-center justify-between gap-2 hover:bg-[#262626] transition"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider block mb-0.5">
                        {topic.category}
                      </span>
                      <p className="text-xs font-semibold text-white">{topic.title}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-[#888] shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="p-3.5 pt-0 text-xs text-[#a7a7a7] leading-relaxed border-t border-[#2a2a2a] bg-[#1a1a1a]">
                      {topic.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#242424] p-4 rounded-xl text-center space-y-2 border border-[#333]">
            <p className="text-xs font-semibold text-white">Still have questions about our plans?</p>
            <button
              onClick={() => {
                onClose();
                onOpenPlans();
              }}
              className="text-xs text-brand-green hover:underline font-bold"
            >
              Compare SoundFlow Free & Premium Plans →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
