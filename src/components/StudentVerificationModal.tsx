import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface StudentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const UNIVERSITIES = [
  'National University of Singapore (NUS)',
  'Nanyang Technological University (NTU)',
  'Singapore Management University (SMU)',
  'Singapore University of Technology and Design (SUTD)',
  'Singapore Institute of Technology (SIT)',
  'Singapore University of Social Sciences (SUSS)',
  'International / Overseas University (Global SheerID)'
];

export const StudentVerificationModal: React.FC<StudentVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified
}) => {
  const [selectedSchool, setSelectedSchool] = useState(UNIVERSITIES[0]);
  const [fullName, setFullName] = useState('Carolina Cataldi');
  const [studentEmail, setStudentEmail] = useState('carolina.c@u.nus.edu');
  const [dob, setDob] = useState('2003-05-14');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#C4B5FD] text-black flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight">Student Status Verification</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Student Status Verified!</h3>
            <p className="text-xs text-[#b3b3b3] leading-relaxed">
              We confirmed your enrollment with <strong className="text-white">{selectedSchool}</strong>. You are qualified for SoundFlow Student at just <span className="text-brand-green font-semibold">$6.48/month</span> (with 1 month free trial).
            </p>

            <button
              onClick={() => {
                onClose();
                onVerified();
              }}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-6 rounded-full text-xs transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>Continue to Student Plan Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-left space-y-1">
              <h3 className="text-base font-bold text-white">Get SoundFlow Student for $6.48/mo</h3>
              <p className="text-xs text-[#a7a7a7]">
                Verified through SheerID verification network. Fast & instant.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Institution</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full bg-[#202020] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
              >
                {UNIVERSITIES.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#202020] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Student (.edu or university email)</label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="w-full bg-[#202020] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#b3b3b3] mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#202020] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#888]">
              <Shield className="w-3.5 h-3.5 text-brand-green shrink-0" />
              <span>SheerID student status is valid for 12 months, renewed annually.</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold py-3 px-4 rounded-full text-xs transition duration-150 shadow-md flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify Student Status'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
