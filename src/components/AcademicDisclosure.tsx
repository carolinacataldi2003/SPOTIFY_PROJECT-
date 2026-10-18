import React from 'react';
import { Info } from 'lucide-react';

export const AcademicDisclosure: React.FC = () => {
  return (
    <aside 
      aria-label="Academic Project Disclosure"
      className="bg-[#111827] border-b border-slate-700/80 text-slate-300 text-xs py-2 px-4 text-center font-medium shadow-sm relative z-30"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="leading-tight">
          This website is an academic project created to study how interface design influences subscription decisions. It is not a real subscription service.
        </span>
      </div>
    </aside>
  );
};
