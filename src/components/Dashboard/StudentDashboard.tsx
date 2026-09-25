import React from 'react';
import { 
  Globe, 
  KeyRound, 
  FileQuestion, 
  ArrowRight, 
  ShieldAlert,
  Sparkles, 
  ShieldCheck, 
  Award,
  Zap
} from 'lucide-react';
import type { StudentProfile } from '../../types';
import { sound } from '../../utils/sound';

interface StudentDashboardProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onNavigateTab,
  onOpenLogin,
}) => {
  const isGuest = !student;
  const displayStudent: StudentProfile = student || {
    id: 'guest',
    name: 'Unenrolled Cadet',
    email: 'guest@thekhaitanschool.org',
    grade: '10',
    section: 'A',
    avatar: 'Student',
    points: 0,
    easterEggsFound: [],
    completedQuizzes: [],
    huntLevelReached: 1,
    passwordGameHighScore: 0,
    phishGuardScore: 0,
    joinedAt: new Date().toISOString(),
    badges: ['Guest Operative']
  };

  // Detect which tasks are completed based on points / badges
  const badges = displayStudent.badges || [];
  const hasQuizBadge = badges.some(b => b.includes('Quiz') || b.includes('Scholar') || b.includes('Analyst'));
  const hasPasswordBadge = badges.some(b => b.includes('Password') || b.includes('Cipher') || b.includes('Crypt'));
  const hasPhishGuardBadge = badges.some(b => b.includes('Guardian') || b.includes('SOC') || b.includes('Sentinel'));
  const hasChecklistBadge = badges.some(b => b.includes('Checklist') || b.includes('Hygiene'));

  // Task Inventory
  const tasks = [
    {
      id: 'browser-amazon',
      title: 'E-Commerce Typosquat Defense',
      isCompleted: badges.some(b => b.includes('Safe Shopper')) || displayStudent.points >= 150,
    },
    {
      id: 'browser-tmail',
      title: 'Email Credential Harvesting Defense',
      isCompleted: badges.some(b => b.includes('Phish')) || displayStudent.points >= 300,
    },
    {
      id: 'browser-cloud',
      title: 'Cloud Malvertising Defense',
      isCompleted: badges.some(b => b.includes('Navigator')) || displayStudent.points >= 500,
    },
    {
      id: 'quiz',
      title: 'Scenario-Based Threat Quiz',
      isCompleted: hasQuizBadge || displayStudent.points >= 600,
    },
    {
      id: 'password',
      title: 'Cryptographic Password Construction',
      isCompleted: hasPasswordBadge || displayStudent.points >= 750,
    },
    {
      id: 'phishguard',
      title: 'SOC Incident Triage Center',
      isCompleted: hasPhishGuardBadge,
    },
    {
      id: 'intel-checklist',
      title: 'Operational Cyber Hygiene Checklist',
      isCompleted: hasChecklistBadge,
    }
  ];

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Manga Operative Dossier Header (Consolidated, Zero Duplicate Clutter) */}
      <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-6 sm:p-7 comic-shadow relative overflow-hidden blocky-card-dark">
        {/* Subtle Manga Accent Corner */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
            // OPS
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Operative Identity & Progress */}
          <div className="space-y-3.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-none bg-zinc-900 border border-zinc-700 text-[#9d9e99] font-bold">
                [ CLASS {displayStudent.grade}-{displayStudent.section} ]
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                ID: {displayStudent.email}
              </span>
              {isGuest ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenLogin();
                  }}
                  className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-none border border-amber-600/60 flex items-center gap-1 font-bold cursor-pointer hover:bg-amber-900/60 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-none bg-amber-400 animate-pulse" />
                  GUEST SESSION // AUTH TO RECORD RESULTS →
                </button>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-none border border-emerald-600/60 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                  VERIFIED // ACTIVE STATUS
                </span>
              )}
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase mb-0.5">
                CADET OPERATIVE // IDENTIFIER
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono uppercase">
                {displayStudent.name}
              </h1>
            </div>

            {/* Integrated Segmented Manga Progress Gauge */}
            <div className="space-y-1.5 pt-1 max-w-lg">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>Mission Clearance Progress</span>
                </span>
                <span className="font-bold text-white tracking-wider">
                  {completedTasksCount} / {tasks.length} CLEARED
                </span>
              </div>

              {/* Segmented Comic Gauge Bar */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    title={`${t.title}: ${t.isCompleted ? 'Cleared' : 'Pending'}`}
                    className={`h-3 flex-1 rounded-none border transition-all ${
                      t.isCompleted
                        ? 'bg-white border-white comic-shadow-sm'
                        : 'bg-zinc-900/90 border-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* High-Contrast Comic Stat Blocks */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Score Block */}
            <div className="p-4 rounded-none bg-[#121216] border-2 border-zinc-800 text-center min-w-[130px] comic-shadow blocky-card-dark">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99] font-bold">
                Score Accumulation
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {displayStudent.points}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                XP CREDITED
              </div>
            </div>

            {/* Badges Block */}
            <div className="p-4 rounded-none bg-[#121216] border-2 border-zinc-800 text-center min-w-[120px] comic-shadow blocky-card-dark">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99] font-bold">
                Badges Unlocked
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {badges.length}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                CREDENTIALS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Manga Badges Showcase (Comic Action Stamps) */}
      {badges.length > 0 && (
        <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-5 sm:p-6 comic-shadow space-y-3 blocky-card-dark">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-white" />
              <h3 className="text-xs font-black text-white tracking-widest uppercase font-mono">
                [ UNLOCKED CREDENTIALS // SYSTEM BADGES ]
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {badges.length} ISSUED
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {badges.map((badge, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-zinc-900 border-2 border-zinc-700 text-xs font-mono text-white comic-shadow-sm font-semibold hover:border-zinc-400 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9d9e99]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Manga Chapter Operations (4 Streamlined Defense Modules) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9d9e99] font-bold">
              [ TACTICAL MODULES // TACTICAL MODULES ]
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            SIMULATION SANDBOX READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* ACT 01: Browser Simulator */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('hunt');
            }}
            className="p-5 rounded-none bg-[#0c0c0f] border-2 border-zinc-800 hover:border-white transition-all cursor-pointer group flex flex-col justify-between comic-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:comic-shadow-lg blocky-card-dark"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-700 tracking-wider">
                  ACT.01
                </span>
                <Globe className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </div>

              <h4 className="text-sm font-black text-white font-mono uppercase mb-1.5 tracking-tight group-hover:text-white transition-colors">
                Browser Simulator
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Neutralize typosquats, credential traps in spoofed Tmail, and cloud malvertising traps.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">Web Sandbox</span>
              <span className="text-white font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                DEPLOY <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* ACT 02: PhishGuard SOC */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('phishguard');
            }}
            className="p-5 rounded-none bg-[#0c0c0f] border-2 border-zinc-800 hover:border-white transition-all cursor-pointer group flex flex-col justify-between comic-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:comic-shadow-lg blocky-card-dark"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-700 tracking-wider">
                  ACT.02
                </span>
                <ShieldAlert className="w-4 h-4 text-zinc-400 group-hover:text-rose-400 transition-colors" />
              </div>

              <h4 className="text-sm font-black text-white font-mono uppercase mb-1.5 tracking-tight group-hover:text-white transition-colors">
                PhishGuard SOC
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Operate the high-speed security terminal: triage incoming circulars under time pressure.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">SOC Terminal</span>
              <span className="text-white font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                DEPLOY <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* ACT 03: Password Gauntlet */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('password');
            }}
            className="p-5 rounded-none bg-[#0c0c0f] border-2 border-zinc-800 hover:border-white transition-all cursor-pointer group flex flex-col justify-between comic-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:comic-shadow-lg blocky-card-dark"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-700 tracking-wider">
                  ACT.03
                </span>
                <KeyRound className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </div>

              <h4 className="text-sm font-black text-white font-mono uppercase mb-1.5 tracking-tight group-hover:text-white transition-colors">
                Cipher Gauntlet
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Forge a hardened cryptographic key through 15 progressive constraints and live 2FA tokens.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">15 Rules</span>
              <span className="text-white font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                DEPLOY <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* ACT 04: Cyber Threat Quiz */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('quiz');
            }}
            className="p-5 rounded-none bg-[#0c0c0f] border-2 border-zinc-800 hover:border-white transition-all cursor-pointer group flex flex-col justify-between comic-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:comic-shadow-lg blocky-card-dark"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-700 tracking-wider">
                  ACT.04
                </span>
                <FileQuestion className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </div>

              <h4 className="text-sm font-black text-white font-mono uppercase mb-1.5 tracking-tight group-hover:text-white transition-colors">
                Threat Evaluation
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Evaluate realistic attack vectors including juice jacking, spoofed subdomains, and SMS traps.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">5 Scenarios</span>
              <span className="text-white font-bold group-hover:underline flex items-center gap-1 text-[11px]">
                DEPLOY <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
