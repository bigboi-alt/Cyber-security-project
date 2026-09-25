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
  X
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
  canClose = false,
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 w-full border-b-2 border-black bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-black text-sm">
            N
          </div>
          <div>
            <div className="font-mono font-black text-sm uppercase tracking-wider">
              NEXUM // CYBER SECURITY INITIATIVE
            </div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              The Khaitan School • Defense Terminal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-600 border border-black px-3 py-1 bg-zinc-50">
            <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse" />
            <span className="font-bold text-black uppercase">PORTAL ONLINE</span>
          </div>

          {canClose && onClose && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer blocky-btn font-mono text-xs font-bold flex items-center gap-1"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">DISMISS</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content: Split Screen with Assembling Suit Shadow Painting & Blocky Form */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Animated Assembling Suit Silhouette Shadow Painting */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center relative select-none">
          
          {/* Operative Suit Silhouette Shadow Artwork (Layered SVG with Assembly Animations) */}
          <div className="relative w-72 h-80 sm:w-88 sm:h-96 flex items-center justify-center">
            
            {/* Layer 1: Ambient Shadow Aura & Splatter Base */}
            <div className="absolute inset-0 flex items-center justify-center animate-suit-aura">
              <svg viewBox="0 0 400 450" className="w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)]">
                {/* Shadow wash behind operative */}
                <ellipse cx="200" cy="240" rx="140" ry="170" fill="#f3f4f6" />
                <path d="M70,390 Q200,430 330,390 L310,430 L90,430 Z" fill="#e5e7eb" opacity="0.6" />
                {/* Tactical framing brackets */}
                <path d="M40,50 L40,30 L80,30" stroke="#000000" strokeWidth="2" fill="none" />
                <path d="M360,50 L360,30 L320,30" stroke="#000000" strokeWidth="2" fill="none" />
                <path d="M40,380 L40,400 L80,400" stroke="#000000" strokeWidth="2" fill="none" />
                <path d="M360,380 L360,400 L320,400" stroke="#000000" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Layer 2: Main Suit Silhouette (Assembled with CSS animations) */}
            <svg 
              viewBox="0 0 400 450" 
              className="w-full h-full relative z-10"
              style={{ filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.9))' }}
            >
              {/* Head & Hair Silhouette Shadow */}
              <g className="animate-suit-center">
                {/* Hair contour */}
                <path 
                  d="M170,110 C165,70 235,70 230,110 C235,130 220,150 200,155 C180,150 165,130 170,110 Z" 
                  fill="#000000" 
                />
                {/* Jaw & Ear Shadow */}
                <path 
                  d="M178,125 L182,145 L200,160 L218,145 L222,125 Z" 
                  fill="#18181b" 
                />
                {/* Neck & Shading */}
                <path d="M185,148 L185,185 L215,185 L215,148 Z" fill="#27272a" />
              </g>

              {/* Layer 3: Left Jacket Panel, Shoulder & Sleeve (Slides from Left) */}
              <g className="animate-suit-left">
                {/* Left Shoulder & Outer Arm */}
                <path 
                  d="M185,180 L90,215 L70,390 L135,405 L155,275 L185,250 Z" 
                  fill="#09090b" 
                />
                {/* Left Lapel Shadow */}
                <path 
                  d="M185,180 L135,235 L175,310 L195,310 L185,180 Z" 
                  fill="#1c1917" 
                  stroke="#27272a" 
                  strokeWidth="1"
                />
                {/* Left Inner Shadow Crease */}
                <path d="M140,240 L115,370" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Layer 4: Right Jacket Panel, Shoulder & Pocket Square (Slides from Right) */}
              <g className="animate-suit-right">
                {/* Right Shoulder & Outer Arm */}
                <path 
                  d="M215,180 L310,215 L330,390 L265,405 L245,275 L215,250 Z" 
                  fill="#09090b" 
                />
                {/* Right Lapel Shadow */}
                <path 
                  d="M215,180 L265,235 L225,310 L205,310 L215,180 Z" 
                  fill="#18181b" 
                  stroke="#27272a" 
                  strokeWidth="1"
                />
                {/* Crisp White Pocket Square */}
                <polygon points="260,250 275,245 272,253 258,255" fill="#ffffff" stroke="#000000" strokeWidth="1" />
                {/* Right Inner Shadow Crease */}
                <path d="M260,240 L285,370" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Layer 5: High-Contrast Shirt & Collar (Slides down from Center) */}
              <g className="animate-suit-center">
                {/* Shirt Chest Triangle */}
                <polygon points="185,180 215,180 200,285" fill="#f4f4f5" />
                
                {/* Left Collar Tip */}
                <polygon points="185,180 200,205 180,200" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                {/* Right Collar Tip */}
                <polygon points="215,180 200,205 220,200" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              </g>

              {/* Layer 6: Tailored Black Tie & Clip (Assembles into knot) */}
              <g className="animate-suit-tie">
                {/* Tie Knot */}
                <polygon points="194,202 206,202 204,214 196,214" fill="#000000" />
                {/* Tie Blade */}
                <polygon points="196,214 204,214 207,315 200,325 193,315" fill="#000000" />
                {/* Metallic Silver Tie Bar */}
                <rect x="195" y="255" width="13" height="2.5" fill="#d4d4d8" stroke="#000000" strokeWidth="0.5" />
                {/* Jacket Center Button */}
                <circle cx="200" cy="335" r="4" fill="#27272a" stroke="#000000" strokeWidth="1" />
              </g>
            </svg>
          </div>

          {/* Slogan & Tactical Status */}
          <div className="mt-4 space-y-1">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-zinc-400">
              OPERATIVE PROFILE // SECURE DOSSIER
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-tight text-black">
              Elegance in Defense
            </h2>
            <p className="text-xs text-zinc-500 font-mono max-w-sm mx-auto">
              Equip yourself with institutional cyber defense credentials. Authorized for Khaitan students.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Blocky Sign In / Sign Up Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          
          <div className="bg-white border-2 border-black p-6 sm:p-8 blocky-card relative">
            
            {/* Top Tactical Label */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-black" />
                <span className="font-mono font-black text-sm uppercase tracking-wider">
                  SECURITY GATEWAY
                </span>
              </div>
              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                AUTH REQUIRED
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
                CADET ENROLLMENT
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-600 text-red-700 font-mono text-xs flex items-start gap-2">
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
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer blocky-btn mt-2"
                >
                  <span>ACCESS TERMINAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Enrolled Cadets Roster (Testing & Demo Convenience) */}
                {existingStudents.length > 0 && (
                  <div className="pt-4 border-t-2 border-zinc-200 mt-5">
                    <div className="font-mono text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> REGISTERED CADETS ON THIS DEVICE:
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {existingStudents.slice(0, 3).map((st) => (
                        <div
                          key={st.id}
                          onClick={() => handleSelectCadet(st)}
                          className="flex items-center justify-between p-2 border border-black bg-zinc-50 hover:bg-black hover:text-white transition-colors cursor-pointer text-xs font-mono group"
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
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors"
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
                    className="w-full bg-zinc-50 border-2 border-black px-3.5 py-2.5 font-mono text-xs text-black placeholder-zinc-400 font-bold focus:bg-white transition-colors"
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
                      className="w-full bg-zinc-50 border-2 border-black px-3 py-2.5 font-mono text-xs text-black font-bold cursor-pointer focus:bg-white"
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
                      className="w-full bg-zinc-50 border-2 border-black px-3 py-2.5 font-mono text-xs text-black font-bold cursor-pointer focus:bg-white"
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
                  className="w-full py-3 px-4 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer blocky-btn mt-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>INITIALIZE OPERATIVE ACCOUNT</span>
                </button>
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
