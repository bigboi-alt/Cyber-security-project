import React, { useState } from 'react';
import { 
  Shield, 
  AlertCircle, 
  User, 
  Mail, 
  GraduationCap, 
  X, 
  ArrowRight
} from 'lucide-react';
import type { ClassGrade, ClassSection, StudentProfile } from '../../types';
import { sound } from '../../utils/sound';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentProfile) => void;
  existingStudents: StudentProfile[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingStudents,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<ClassGrade>('10');
  const [section, setSection] = useState<ClassSection>('B');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setError(null);

    const match = existingStudents.find(s => s.email.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setName(match.name);
      setGrade(match.grade);
      setSection(match.section);
    }
  };

  const handleAutoCompleteDomain = () => {
    sound.playClick();
    if (!email.includes('@')) {
      setEmail(email.trim() + '@thekhaitanschool.org');
    } else {
      const parts = email.split('@');
      setEmail(parts[0] + '@thekhaitanschool.org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setError('Please enter your school email ID.');
      sound.playError();
      return;
    }

    if (!cleanEmail.endsWith('@thekhaitanschool.org')) {
      setError('Access restricted to school students. Please use your official @thekhaitanschool.org email.');
      sound.playError();
      return;
    }

    if (!cleanName) {
      setError('Please enter your name.');
      sound.playError();
      return;
    }

    sound.playSuccess();

    const existing = existingStudents.find(s => s.email.toLowerCase() === cleanEmail);
    const studentId = cleanEmail.split('@')[0];

    const profile: StudentProfile = {
      id: existing ? existing.id : studentId,
      name: cleanName,
      email: cleanEmail,
      grade,
      section,
      avatar: 'Student',
      points: existing ? existing.points : 0,
      easterEggsFound: existing ? existing.easterEggsFound : [],
      completedQuizzes: existing ? existing.completedQuizzes : [],
      huntLevelReached: existing ? existing.huntLevelReached : 1,
      passwordGameHighScore: existing ? existing.passwordGameHighScore : 0,
      phishGuardScore: existing ? existing.phishGuardScore : 0,
      joinedAt: existing ? existing.joinedAt : new Date().toISOString(),
      badges: existing ? existing.badges : ['Enrolled']
    };

    onLoginSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-[#0c0c0f] border-2 border-zinc-700 rounded-xl comic-shadow-lg p-6 sm:p-7 text-left space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b-2 border-zinc-800">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white comic-shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
              [ OPERATIVE ENROLLMENT // 入隊登録 ]
            </div>
            <h2 className="text-base font-black text-white tracking-tight font-mono uppercase">
              Cadet Sign In
            </h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border-2 border-rose-500 text-zinc-200 text-xs flex items-start gap-2 comic-shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="font-mono text-[11px]">{error}</div>
            </div>
          )}

          {/* School Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold uppercase text-[#9d9e99] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" /> SCHOOL EMAIL ID
              </label>
              <button
                type="button"
                onClick={handleAutoCompleteDomain}
                className="text-[10px] text-zinc-400 hover:text-white transition-colors font-mono font-bold cursor-pointer"
              >
                + @thekhaitanschool.org
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. k-6764@thekhaitanschool.org"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full bg-[#141418] border-2 border-zinc-700 focus:border-white rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono transition-colors comic-shadow-sm font-semibold"
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#9d9e99] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> FULL NAME
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#141418] border-2 border-zinc-700 focus:border-white rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 transition-colors comic-shadow-sm font-mono font-semibold"
            />
          </div>

          {/* Grade & Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#9d9e99] mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> CLASS
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as ClassGrade)}
                className="w-full bg-[#141418] border-2 border-zinc-700 focus:border-white rounded-lg px-3 py-2.5 text-xs text-white cursor-pointer font-mono font-bold comic-shadow-sm"
              >
                {['6', '7', '8', '9', '10', '11', '12'].map((g) => (
                  <option key={g} value={g} className="bg-zinc-900 font-mono">
                    CLASS {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#9d9e99] mb-1.5">
                SECTION
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as ClassSection)}
                className="w-full bg-[#141418] border-2 border-zinc-700 focus:border-white rounded-lg px-3 py-2.5 text-xs text-white cursor-pointer font-mono font-bold comic-shadow-sm"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map((s) => (
                  <option key={s} value={s} className="bg-zinc-900 font-mono">
                    SECTION {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 px-4 rounded-lg font-black bg-white hover:bg-zinc-200 text-black text-xs transition-transform active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer comic-shadow font-mono uppercase tracking-wider"
          >
            <span>ENTER NEXUM TERMINAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
