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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Student Sign In
            </h2>
            <p className="text-xs text-zinc-400">
              The Khaitan School Cyber Security Portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* School Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" /> School Email ID
              </label>
              <button
                type="button"
                onClick={handleAutoCompleteDomain}
                className="text-[11px] text-zinc-400 hover:text-white transition-colors font-mono cursor-pointer"
              >
                + @thekhaitanschool.org
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. k-6764@thekhaitanschool.org"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono transition-colors"
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 transition-colors"
            />
          </div>

          {/* Grade & Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> Class
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as ClassGrade)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-500 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer"
              >
                {['6', '7', '8', '9', '10', '11', '12'].map((g) => (
                  <option key={g} value={g} className="bg-zinc-900">
                    Class {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as ClassSection)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-500 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map((s) => (
                  <option key={s} value={s} className="bg-zinc-900">
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-medium bg-white hover:bg-zinc-200 text-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Enter Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
