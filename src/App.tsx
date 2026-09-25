import { useState, useEffect } from 'react';
import { CosmicBackground } from './components/Background/CosmicBackground';
import { Header } from './components/Navbar/Header';
import { LoginModal } from './components/Auth/LoginModal';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { CyberIntelHub } from './components/Intel/CyberIntelHub';
import { CyberQuiz } from './components/Games/Quiz/CyberQuiz';
import { CyberHunt } from './components/Games/CyberHunt/CyberHunt';
import { PasswordGame } from './components/Games/PasswordGame/PasswordGame';
import { PhishGuard } from './components/Games/PhishGuard/PhishGuard';
import { SchoolLeaderboard } from './components/Leaderboard/SchoolLeaderboard';
import { MetallicCreditsModal } from './components/Credits/MetallicCreditsModal';
import { ProfileCentreModal } from './components/Profile/ProfileCentreModal';
import type { StudentProfile } from './types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getStoredStudents, 
  saveOrUpdateStudent, 
  addPointsToCurrentStudent 
} from './utils/storage';
import { sound } from './utils/sound';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentStudent, setStudent] = useState<StudentProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [checklistClaimed, setChecklistClaimed] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setStudent(user);
    } else {
      setIsLoginOpen(true);
    }
  }, []);

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleLoginSuccess = (profile: StudentProfile) => {
    const saved = saveOrUpdateStudent(profile);
    setStudent(saved);
  };

  const handleLogout = () => {
    sound.playClick();
    setCurrentUser(null);
    setStudent(null);
    setIsLoginOpen(true);
  };

  const handlePointsEarned = (points: number, badgeName?: string) => {
    const updated = addPointsToCurrentStudent(points, badgeName);
    if (updated) {
      setStudent(updated);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Black Starry Background with Rare Blue Comet and Red Star */}
      <CosmicBackground />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          student={currentStudent}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => {
            setViewingStudent(currentStudent);
            setIsProfileOpen(true);
          }}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
        />

        <main className={`flex-1 w-full mx-auto ${activeTab === 'hunt' ? 'max-w-[1850px] px-2 sm:px-4' : 'max-w-6xl px-4 sm:px-6'} pt-4 pb-10 transition-all`}>
          {activeTab === 'dashboard' && (
            <StudentDashboard
              student={currentStudent}
              onNavigateTab={setActiveTab}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          )}

          {activeTab === 'hunt' && (
            <CyberHunt
              student={currentStudent}
              onPointsEarned={handlePointsEarned}
            />
          )}

          {activeTab === 'quiz' && (
            <CyberQuiz
              student={currentStudent}
              onPointsEarned={handlePointsEarned}
            />
          )}

          {activeTab === 'password' && (
            <PasswordGame
              student={currentStudent}
              onPointsEarned={handlePointsEarned}
            />
          )}

          {activeTab === 'phishguard' && (
            <PhishGuard
              student={currentStudent}
              onPointsEarned={handlePointsEarned}
            />
          )}

          {activeTab === 'intel' && (
            <CyberIntelHub
              hasClaimedBonus={checklistClaimed}
              onAwardChecklistBonus={(pts) => {
                setChecklistClaimed(true);
                handlePointsEarned(pts, 'Hygiene Checklist');
              }}
            />
          )}

          {activeTab === 'leaderboard' && (
            <SchoolLeaderboard
              currentStudent={currentStudent}
              onViewProfile={(st) => {
                setViewingStudent(st);
                setIsProfileOpen(true);
              }}
            />
          )}
        </main>

        {/* Clean Scrolled-Down Footer: Far Left The Khaitan School, Middle Arya & Akshaj */}
        <footer className="relative z-20 border-t-2 border-zinc-800 bg-[#08080a]/95 backdrop-blur-md py-4 px-4 sm:px-6">
          <div className="w-full max-w-[1850px] mx-auto grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs">
            {/* Far Left: The Khaitan School */}
            <div className="text-zinc-300 font-black font-mono tracking-wider uppercase text-center sm:text-left select-none text-xs">
              The Khaitan School
            </div>

            {/* Middle: Built by Arya and Akshaj */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsCreditsOpen(true);
                }}
                className="text-xs text-[#9d9e99] hover:text-white transition-colors cursor-pointer group flex items-center justify-center gap-1.5 font-bold uppercase font-mono select-none"
              >
                <span>BUILT BY</span>
                <span className="text-white font-black underline underline-offset-4 decoration-zinc-500 group-hover:decoration-white transition-colors">
                  ARYA AND AKSHAJ
                </span>
              </button>
            </div>

            {/* Far Right: Cyber Security Initiative */}
            <div className="text-[#9d9e99] font-mono text-[11px] font-bold uppercase tracking-widest text-center sm:text-right hidden sm:block select-none">
              [ NEXUM PROTOCOL // DEFENSE GRID ]
            </div>
          </div>
        </footer>
      </div>

      {/* Clean Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        existingStudents={getStoredStudents()}
      />

      {/* Profile Centre Modal */}
      <ProfileCentreModal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setViewingStudent(null);
        }}
        currentStudent={currentStudent}
        viewingStudent={viewingStudent}
        onUpdateStudent={(updated) => {
          const saved = saveOrUpdateStudent(updated);
          setStudent(saved);
        }}
      />

      {/* Metallic Card for Arya & Akshaj leading to GitHub */}
      <MetallicCreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />
    </div>
  );
}

export default App;
