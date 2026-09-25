import React, { useState } from 'react';
import { 
  Shield, 
  AlertCircle, 
  User, 
  Mail, 
  GraduationCap, 
  ArrowRight, 
  Check, 
  UserCheck, 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Fingerprint
} from 'lucide-react';
import type { ClassGrade, ClassSection, StudentProfile } from '../../types';
import { sound } from '../../utils/sound';

interface AuthPortalProps {
  onLoginSuccess: (student: StudentProfile) => void;
  existingStudents: StudentProfile[];
  onClose?: () => void;
  canClose?: boolean;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onLoginSuccess,
  existingStudents,
  onClose,
  canClose = true,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<ClassGrade>('10');
  const [section, setSection] = useState<ClassSection>('B');
  const [error, setError] = useState<string | null>(null);

  // Quick auto-complete domain
  const handleAutoCompleteDomain = () => {
    sound.playClick();
    if (!email.includes('@')) {
      setEmail(email.trim() + '@thekhaitanschool.org');
    } else {
      const parts = email.split('@');
      setEmail(parts[0] + '@thekhaitanschool.org');
    }
  };

  // Sign In handler
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your school email address.');
      sound.playError();
      return;
    }

    if (!cleanEmail.endsWith('@thekhaitanschool.org')) {
      setError('Access restricted: Must use an official @thekhaitanschool.org email.');
      sound.playError();
      return;
    }

    sound.playSuccess();
    const existing = existingStudents.find(s => s.email.toLowerCase() === cleanEmail);
    const studentId = cleanEmail.split('@')[0];

    const profile: StudentProfile = existing || {
      id: studentId,
      name: name.trim() || studentId.toUpperCase(),
      email: cleanEmail,
      grade,
      section,
      avatar: 'Student',
      points: 0,
      easterEggsFound: [],
      completedQuizzes: [],
      huntLevelReached: 1,
      passwordGameHighScore: 0,
      phishGuardScore: 0,
      joinedAt: new Date().toISOString(),
      badges: ['Enrolled']
    };

    onLoginSuccess(profile);
    if (onClose) onClose();
  };

  // Sign Up handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      sound.playError();
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your school email address.');
      sound.playError();
      return;
    }

    if (!cleanEmail.endsWith('@thekhaitanschool.org')) {
      setError('Official email required: Please end with @thekhaitanschool.org.');
      sound.playError();
      return;
    }

    sound.playSuccess();
    const studentId = cleanEmail.split('@')[0];

    const newProfile: StudentProfile = {
      id: studentId,
      name: cleanName,
      email: cleanEmail,
      grade,
      section,
      avatar: 'Student',
      points: 0,
      easterEggsFound: [],
      completedQuizzes: [],
      huntLevelReached: 1,
      passwordGameHighScore: 0,
      phishGuardScore: 0,
      joinedAt: new Date().toISOString(),
      badges: ['Enrolled', 'Cadet Initialized']
    };

    onLoginSuccess(newProfile);
    if (onClose) onClose();
  };

  // Quick Select Existing Cadet
  const handleSelectCadet = (st: StudentProfile) => {
    sound.playClick();
    onLoginSuccess(st);
    if (onClose) onClose();
  };

  const handleGuestContinue = () => {
    sound.playClick();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white text-zinc-900 flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b-2 border-black bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-mono font-black text-base shadow-[2px_2px_0px_#000000]">
            N
          </div>
          <div>
            <div className="font-mono font-black text-sm uppercase tracking-wider text-black">
              NEXUM // CYBER SECURITY INITIATIVE
            </div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              The Khaitan School • Defense Gateway
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-700 border-2 border-black px-3 py-1 bg-zinc-50 shadow-[2px_2px_0px_#000000]">
            <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse" />
            <span className="font-bold uppercase tracking-wider">GATEWAY SECURED</span>
          </div>

          {canClose && onClose && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer font-mono text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_#000000]"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">DISMISS</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content: Split Screen with Cyber Security Brand Graphics & Auth Form */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        
        {/* LEFT COLUMN: Clean High-Tech Cyber Security Branding Showcase */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
          
          {/* Cyber Security Emblem & Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-100 border-2 border-black w-fit font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Official Institutional Cyber Defense Portal</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono uppercase tracking-tight text-black leading-tight">
              Train. Defend. <br />
              <span className="text-zinc-500">Outsmart The Threat.</span>
            </h1>
            <p className="text-sm text-zinc-600 font-sans max-w-lg leading-relaxed">
              Equip yourself with institutional cyber security skills. Learn defensive web browsing, identify typosquatted domains, quarantine social engineering attacks, and compete on the school leaderboard.
            </p>
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 border-2 border-black bg-zinc-50 shadow-[3px_3px_0px_#000000] flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs font-black uppercase text-black">Web Simulator</div>
                <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Detect deceptive links, typosquats & malicious downloads.</div>
              </div>
            </div>

            <div className="p-3.5 border-2 border-black bg-zinc-50 shadow-[3px_3px_0px_#000000] flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs font-black uppercase text-black">PhishGuard SOC</div>
                <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Triage live alerts, quarantine traps & report fraud to 1930.</div>
              </div>
            </div>

            <div className="p-3.5 border-2 border-black bg-zinc-50 shadow-[3px_3px_0px_#000000] flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs font-black uppercase text-black">Cipher Gauntlet</div>
                <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Solve escalating cryptographic password constraints.</div>
              </div>
            </div>

            <div className="p-3.5 border-2 border-black bg-zinc-50 shadow-[3px_3px_0px_#000000] flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs font-black uppercase text-black">Inspect-Proof Vault</div>
                <div className="text-[11px] text-zinc-500 leading-snug mt-0.5">Salted hash verification prevents cheating in DevTools.</div>
              </div>
            </div>
          </div>

          {/* Guest Mode Notice */}
          <div className="p-3 bg-amber-50 border-2 border-amber-500/80 text-amber-900 text-xs font-mono flex items-center justify-between gap-3 shadow-[2px_2px_0px_#f59e0b]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Playing without signing in? Mini-game results won't save to the leaderboard.</span>
            </div>
            <button
              type="button"
              onClick={handleGuestContinue}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold uppercase text-[10px] shrink-0 border border-amber-600 cursor-pointer"
            >
              Play As Guest
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Cyber Security Sign In / Sign Up Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] relative">
            
            {/* Top Security Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-black" />
                <span className="font-mono font-black text-sm uppercase tracking-wider text-black">
                  STUDENT ACCESS GATE
                </span>
              </div>
              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                {authMode === 'signin' ? 'AUTHENTICATION' : 'REGISTRATION'}
              </span>
            </div>

            {/* Mode Toggle Tabs: SIGN IN vs SIGN UP */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuthMode('signin');
                  setError(null);
                }}
                className={`py-2.5 px-3 font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                  authMode === 'signin'
                    ? 'bg-black text-white shadow-[2px_2px_0px_#000000]'
                    : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                SIGN IN
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuthMode('signup');
                  setError(null);
                }}
                className={`py-2.5 px-3 font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                  authMode === 'signup'
                    ? 'bg-black text-white shadow-[2px_2px_0px_#000000]'
                    : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                CADET ENLISTMENT
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 text-red-700 font-mono text-xs flex items-start gap-2 shadow-[2px_2px_0px_#dc2626]">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            {/* MODE 1: SIGN IN */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> SCHOOL EMAIL ID
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCompleteDomain}
                      className="font-mono text-[10px] text-zinc-500 hover:text-black underline font-bold cursor-pointer"
                    >
                      + @thekhaitanschool.org
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. k-6764@thekhaitanschool.org"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 mt-2"
                >
                  <span>SIGN IN TO CADET ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Enrolled Cadets Roster (Convenience) */}
                {existingStudents.length > 0 && (
                  <div className="pt-4 border-t-2 border-zinc-200 mt-5">
                    <div className="font-mono text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> REGISTERED CADETS ON THIS DEVICE:
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {existingStudents.slice(0, 4).map((st) => (
                        <div
                          key={st.id}
                          onClick={() => handleSelectCadet(st)}
                          className="flex items-center justify-between p-2 border-2 border-black bg-zinc-50 hover:bg-black hover:text-white transition-colors cursor-pointer text-xs font-mono group shadow-[2px_2px_0px_#000000]"
                        >
                          <span className="font-bold truncate">{st.name} (Class {st.grade}-{st.section})</span>
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-bold shrink-0 ml-2">
                            {st.points} PTS →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Continue as Guest Button */}
                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={handleGuestContinue}
                    className="text-xs font-mono text-zinc-500 hover:text-black underline cursor-pointer"
                  >
                    Continue as Guest (No score saving)
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: CADET ENROLLMENT (SIGN UP) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your student name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                {/* School Email */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> SCHOOL EMAIL ID
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCompleteDomain}
                      className="font-mono text-[10px] text-zinc-500 hover:text-black underline font-bold cursor-pointer"
                    >
                      + @thekhaitanschool.org
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. k-6764@thekhaitanschool.org"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors shadow-[2px_2px_0px_#000000]"
                  />
                </div>

                {/* Grade & Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-black mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> CLASS
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as ClassGrade)}
                      className="w-full bg-zinc-50 border-2 border-black px-3 py-2.5 font-mono text-xs text-black font-bold cursor-pointer focus:bg-white shadow-[2px_2px_0px_#000000]"
                    >
                      {['6', '7', '8', '9', '10', '11', '12'].map((g) => (
                        <option key={g} value={g}>
                          CLASS {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                      SECTION
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value as ClassSection)}
                      className="w-full bg-zinc-50 border-2 border-black px-3 py-2.5 font-mono text-xs text-black font-bold cursor-pointer focus:bg-white shadow-[2px_2px_0px_#000000]"
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((s) => (
                        <option key={s} value={s}>
                          SECTION {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 leading-tight">
                  * Note: School class assignment cannot be modified once cadet registration is initialized.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 mt-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>INITIALIZE OPERATIVE ACCOUNT</span>
                </button>

                {/* Continue as Guest Button */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleGuestContinue}
                    className="text-xs font-mono text-zinc-500 hover:text-black underline cursor-pointer"
                  >
                    Continue as Guest (No score saving)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 w-full border-t-2 border-black bg-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-zinc-600">
        <div>
          The Khaitan School • All Rights Reserved
        </div>
        <div className="font-bold text-black uppercase">
          BUILT BY ARYA AND AKSHAJ
        </div>
      </footer>
    </div>
  );
};

