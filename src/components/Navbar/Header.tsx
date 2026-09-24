import React from 'react';
import { 
  Shield, 
  User, 
  Trophy, 
  LogOut,
  Globe,
  KeyRound,
  FileQuestion,
  BookOpen,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import type { StudentProfile } from '../../types';
import { sound } from '../../utils/sound';

interface HeaderProps {
  student: StudentProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  activeTab,
  onTabChange,
  onOpenLogin,
  onLogout,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hunt', label: 'Browser Simulator', icon: Globe },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion },
    { id: 'password', label: 'Password Game', icon: KeyRound },
    { id: 'phishguard', label: 'PhishGuard', icon: ShieldAlert },
    { id: 'intel', label: 'Cyber Guide', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/60 border-b border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: NEXUM (No logo, no tags, pure all caps wordmark) */}
        <div 
          onClick={() => {
            sound.playClick();
            onTabChange('dashboard');
          }}
          className="cursor-pointer shrink-0 select-none group py-1"
        >
          <span className="text-base sm:text-lg font-black tracking-[0.28em] text-white group-hover:text-[#9d9e99] transition-colors font-mono">
            NEXUM
          </span>
        </div>

        {/* Center: Directly Spaced Navigation Links (No island container/background) */}
        <nav className="hidden lg:flex items-center gap-7 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-2 py-1 text-xs font-medium tracking-wide whitespace-nowrap transition-colors cursor-pointer relative group ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-[#9d9e99] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : 'text-[#9d9e99] group-hover:text-white'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Profile & Login */}
        <div className="flex items-center gap-2 shrink-0">
          {student ? (
            <div className="flex items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-sm">
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="text-left cursor-pointer group hover:opacity-85 transition-opacity"
                title="Click to view and edit profile"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white whitespace-nowrap group-hover:underline underline-offset-2">
                    {student.name}
                  </span>
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                    {student.grade}-{student.section}
                  </span>
                </div>
                <div className="text-[11px] text-[#9d9e99] font-mono">
                  {student.points} pts
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Sign out or switch student"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenLogin();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Nav Bar */}
      <div className="lg:hidden border-t border-zinc-800/70 bg-zinc-950/90 overflow-x-auto px-3 py-1.5 no-scrollbar">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
