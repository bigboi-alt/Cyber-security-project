import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Award, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Mail, 
  GraduationCap
} from 'lucide-react';
import type { StudentProfile } from '../../types';
import { sound } from '../../utils/sound';

interface ProfileCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile | null;
  viewingStudent?: StudentProfile | null;
  onUpdateStudent?: (updated: StudentProfile) => void;
}

export const ProfileCentreModal: React.FC<ProfileCentreModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  viewingStudent,
  onUpdateStudent
}) => {
  // Determine if viewing own profile or another student's profile
  const targetStudent = viewingStudent || currentStudent;
  const isSelf = !!(currentStudent && targetStudent && currentStudent.id === targetStudent.id);

  const [name, setName] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (targetStudent) {
      setName(targetStudent.name || '');
      // If user has chosen displayedBadges, use those; otherwise default to all earned badges
      if (targetStudent.displayedBadges) {
        setSelectedBadges(targetStudent.displayedBadges);
      } else {
        setSelectedBadges(targetStudent.badges || []);
      }
      setIsSaved(false);
    }
  }, [targetStudent, isOpen]);

  if (!isOpen || !targetStudent) return null;

  const handleToggleBadge = (badge: string) => {
    if (!isSelf) return;
    sound.playClick();
    setSelectedBadges(prev => {
      if (prev.includes(badge)) {
        return prev.filter(b => b !== badge);
      } else {
        return [...prev, badge];
      }
    });
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSelf || !currentStudent) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    sound.playSuccess();
    const updated: StudentProfile = {
      ...currentStudent,
      name: trimmed,
      displayedBadges: selectedBadges
    };

    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Badges to display for public view
  const publicBadges = isSelf 
    ? selectedBadges 
    : (targetStudent.displayedBadges && targetStudent.displayedBadges.length > 0 
        ? targetStudent.displayedBadges 
        : targetStudent.badges);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0c0c0f] border-2 border-zinc-700 rounded-xl p-6 sm:p-7 comic-shadow-lg relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white comic-shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
                [ OPERATIVE DOSSIER // 個別記録 ]
              </div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2 font-mono uppercase">
                <span>{isSelf ? 'Profile Center' : 'Cadet Record'}</span>
                {!isSelf && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-white border border-zinc-700 font-bold">
                    PUBLIC VIEW
                  </span>
                )}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Form / View */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9d9e99] font-bold mb-1.5">
              FULL NAME {isSelf && <span className="text-zinc-500 font-normal lowercase">(editable)</span>}
            </label>
            {isSelf ? (
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsSaved(false);
                  }}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141418] border-2 border-zinc-700 focus:border-white focus:outline-none text-white text-xs font-mono font-bold placeholder:text-zinc-600 transition-colors comic-shadow-sm"
                />
              </div>
            ) : (
              <div className="px-3.5 py-2.5 rounded-lg bg-[#141418] border-2 border-zinc-800 text-white text-xs font-mono font-bold">
                {targetStudent.name}
              </div>
            )}
          </div>

          {/* Locked Class & Section Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#9d9e99] font-bold">
                CLASS & SECTION
              </label>
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 font-bold">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>PERMANENTLY LOCKED</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-zinc-950 border-2 border-zinc-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-zinc-400" />
                <span className="font-black text-white">CLASS {targetStudent.grade} - SECTION {targetStudent.section}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-emerald-800 font-bold uppercase">
                Verified
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              Institutional squad assignments cannot be altered once verified.
            </p>
          </div>

          {/* School Email & Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[#141418] border-2 border-zinc-800 space-y-1 comic-shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9d9e99] flex items-center gap-1 font-bold">
                <Mail className="w-3 h-3" />
                <span>School Email</span>
              </div>
              <div className="text-xs font-mono text-zinc-200 truncate font-semibold">
                {targetStudent.email}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#141418] border-2 border-zinc-800 space-y-1 comic-shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9d9e99] flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                <span>Total XP Logged</span>
              </div>
              <div className="text-xs font-mono text-white font-black">
                {targetStudent.points} PTS
              </div>
            </div>
          </div>

          {/* Badges Display Customization */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white uppercase font-mono tracking-wider">
                  {isSelf ? 'Choose Badges to Showcase' : 'Showcased Badges'}
                </span>
              </div>
              {isSelf && (
                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                  {selectedBadges.length} SHOWCASED
                </span>
              )}
            </div>

            {isSelf ? (
              targetStudent.badges.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {targetStudent.badges.map((badge, idx) => {
                    const isDisplayed = selectedBadges.includes(badge);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleBadge(badge)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border-2 text-xs cursor-pointer transition-all ${
                          isDisplayed
                            ? 'bg-[#18181e] border-white text-white comic-shadow-sm font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <Sparkles className={`w-3.5 h-3.5 ${isDisplayed ? 'text-white' : 'text-zinc-600'}`} />
                          <span>{badge}</span>
                        </div>

                        <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors ${
                          isDisplayed 
                            ? 'bg-white border-white text-black' 
                            : 'border-zinc-700 bg-zinc-900'
                        }`}>
                          {isDisplayed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-500 font-mono">
                  No badges unlocked yet. Clear challenges to earn credentials.
                </div>
              )
            ) : (
              publicBadges && publicBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {publicBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border-2 border-zinc-700 text-xs font-mono text-white comic-shadow-sm font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9d9e99]" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-500 font-mono">
                  This operative has not showcased any badges on their public profile yet.
                </div>
              )
            )}
          </div>

          {/* Action Row for Self */}
          {isSelf && (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-lg font-black text-xs bg-white hover:bg-zinc-200 text-black flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow font-mono uppercase tracking-wider"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>DOSSIER UPDATED!</span>
                  </>
                ) : (
                  <span>SAVE PROFILE CHANGES</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="py-3 px-4 rounded-lg font-black text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer uppercase font-mono tracking-wider"
              >
                CLOSE
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
