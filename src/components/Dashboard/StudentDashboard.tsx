import React from 'react';
import { 
  Trophy, 
  Globe, 
  KeyRound, 
  FileQuestion, 
  ArrowRight, 
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Award
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
  if (!student) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white mx-auto mb-4 shadow-inner">
          <ShieldCheck className="w-6 h-6 text-[#9d9e99]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          NEXUM CYBER PORTAL
        </h2>
        <p className="text-zinc-400 text-xs leading-relaxed mb-6 max-w-sm mx-auto">
          Sign in with your registered school email (<code className="text-[#9d9e99] font-mono">@thekhaitanschool.org</code>) to access interactive browser simulations, password defense challenges, and track your tasks.
        </p>
        <button
          onClick={() => {
            sound.playClick();
            onOpenLogin();
          }}
          className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-2 shadow-lg"
        >
          <span>Student Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Detect which tasks are completed based on points / badges
  const badges = student.badges || [];
  const hasHuntBadge = badges.some(b => b.includes('Safe Shopper') || b.includes('Phish') || b.includes('Navigator'));
  const hasQuizBadge = badges.some(b => b.includes('Quiz') || b.includes('Scholar') || b.includes('Analyst'));
  const hasPasswordBadge = badges.some(b => b.includes('Password') || b.includes('Cipher') || b.includes('Crypt'));
  const hasPhishGuardBadge = badges.some(b => b.includes('Guardian') || b.includes('SOC') || b.includes('Sentinel'));
  const hasChecklistBadge = badges.some(b => b.includes('Checklist') || b.includes('Hygiene'));

  // Task Inventory
  const tasks = [
    {
      id: 'browser-amazon',
      title: 'E-Commerce Typosquat Defense',
      category: 'Browser Simulator',
      tab: 'hunt',
      points: 150,
      isCompleted: badges.some(b => b.includes('Safe Shopper')) || student.points >= 150,
      description: 'Search Google for Amazon, avoid typosquatted domain (amazon.ti), and order verified textbook.'
    },
    {
      id: 'browser-tmail',
      title: 'Email Credential Harvesting Defense',
      category: 'Browser Simulator',
      tab: 'hunt',
      points: 150,
      isCompleted: badges.some(b => b.includes('Phish')) || student.points >= 300,
      description: 'Inspect Kabir birthday invite in Tmail, spot fraudulent RSVP password trap, and close safely.'
    },
    {
      id: 'browser-cloud',
      title: 'Cloud Malvertising Defense',
      category: 'Browser Simulator',
      tab: 'hunt',
      points: 200,
      isCompleted: badges.some(b => b.includes('Navigator')) || student.points >= 500,
      description: 'Navigate to School Cloud and bypass fake high-speed setup .exe ads to acquire the genuine project PDF.'
    },
    {
      id: 'quiz',
      title: 'Scenario-Based Threat Quiz',
      category: 'Security Quiz',
      tab: 'quiz',
      points: 500,
      isCompleted: hasQuizBadge || student.points >= 600,
      description: 'Analyze real-life email circulars, deceptive SMS links, and public charging station attacks.'
    },
    {
      id: 'password',
      title: 'Cryptographic Password Construction',
      category: 'Password Game',
      tab: 'password',
      points: 750,
      isCompleted: hasPasswordBadge || student.points >= 750,
      description: 'Build a compliant password satisfying Roman numeral sums, 2FA OTP synchronization, and port numbers.'
    },
    {
      id: 'phishguard',
      title: 'SOC Incident Triage Center',
      category: 'PhishGuard',
      tab: 'phishguard',
      points: 500,
      isCompleted: hasPhishGuardBadge,
      description: 'Act as cyber defender under time pressure: analyze raw emails and allow or quarantine attacks.'
    },
    {
      id: 'intel-checklist',
      title: 'Operational Cyber Hygiene Checklist',
      category: 'Cyber Guide',
      tab: 'intel',
      points: 150,
      isCompleted: hasChecklistBadge,
      description: 'Review the Google Classroom safety modules and certify your school device compliance.'
    }
  ];

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Black Blocky User & Class Header Block */}
      <div className="rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User & Class Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[#9d9e99]">
                Class {student.grade} • Section {student.section}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {student.email}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {student.name}
            </h1>

            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Your student telemetry and completed defense activities are recorded below. All points contribute to your personal rank and Class {student.grade}-{student.section} standings.
            </p>
          </div>

          {/* Blocky Score Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Points Block */}
            <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800 text-center min-w-[120px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99]">
                Personal Points
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {student.points}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                pts accumulated
              </div>
            </div>

            {/* Completed Tasks Block */}
            <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800 text-center min-w-[120px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99]">
                Tasks Cleared
              </div>
              <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono mt-1">
                {completedTasksCount}/{tasks.length}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {Math.round((completedTasksCount / tasks.length) * 100)}% complete
              </div>
            </div>

            {/* Badges Block */}
            <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99]">
                Badges Earned
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {badges.length}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                credentials
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Simple Activity Progress Block */}
      <div className="rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#9d9e99]">
            Activity Progress
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>Modules & Tasks Completed</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Progress tracked across simulation modules, threat scenarios, and operational exercises.
          </p>
        </div>

        <div className="flex items-center gap-5 bg-[#121215] border border-zinc-800 px-6 py-4 rounded-xl shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#9d9e99]">
              Status
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Completed
            </div>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
            {completedTasksCount}<span className="text-zinc-500 font-normal text-2xl">/{tasks.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Badges Earned Block */}
      {badges.length > 0 && (
        <div className="rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#9d9e99]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Unlocked Badges & Certifications
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {badges.map((badge, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-[#9d9e99]" />
                <span className="font-semibold">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Quick Activity Launcher Blocks */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#9d9e99] mb-1">
          Cyber Defense Modules
        </div>
        <h3 className="text-base font-bold text-white mb-3 tracking-tight">
          Launch Interactive Training Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Browser Simulator */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('hunt');
            }}
            className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3 group-hover:border-[#9d9e99] transition-colors">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-white transition-colors">
                Browser Simulator
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Full-screen browser with Google, Tmail, and Amazon threat defense scenarios.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-[#9d9e99]">
              <span>+500 pts total</span>
              <span className="text-white flex items-center gap-1">Launch <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>

          {/* Password Game */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('password');
            }}
            className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3 group-hover:border-[#9d9e99] transition-colors">
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-white transition-colors">
                Password Game
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                15 rule progressive cryptographic password builder with live Roman sums.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-[#9d9e99]">
              <span>+750 pts total</span>
              <span className="text-white flex items-center gap-1">Play <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>

          {/* Quiz */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('quiz');
            }}
            className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3 group-hover:border-[#9d9e99] transition-colors">
                <FileQuestion className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-white transition-colors">
                Security Quiz
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Visual scenarios with simulated school circulars, URLs, and QR code traps.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-[#9d9e99]">
              <span>+500 pts total</span>
              <span className="text-white flex items-center gap-1">Start <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>

          {/* PhishGuard */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigateTab('phishguard');
            }}
            className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3 group-hover:border-[#9d9e99] transition-colors">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-white transition-colors">
                PhishGuard SOC
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Rapid triage console: analyze email headers and isolate cyber threats.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-[#9d9e99]">
              <span>+500 pts total</span>
              <span className="text-white flex items-center gap-1">Open <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
