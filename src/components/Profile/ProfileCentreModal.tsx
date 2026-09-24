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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0e0e11] border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brushed Titanium Top Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9d9e99] to-transparent rounded-t-2xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <User className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{isSelf ? 'Profile Centre' : 'Cadet Dossier'}</span>
                {!isSelf && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#9d9e99] border border-zinc-700">
                    Public View
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                The Khaitan School Cyber Security Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Details Form / View */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9d9e99] mb-1.5">
              Full Name {isSelf && <span className="text-zinc-500 font-normal lowercase">(editable)</span>}
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-zinc-700 focus:border-white focus:outline-none text-white text-xs font-medium placeholder:text-zinc-600 transition-colors"
                />
              </div>
            ) : (
              <div className="px-3.5 py-2.5 rounded-xl bg-[#141418] border border-zinc-800 text-white text-xs font-semibold">
                {targetStudent.name}
              </div>
            )}
          </div>

          {/* Locked Class & Section Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#9d9e99]">
                Class & Section
              </label>
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Permanently Locked</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-xs font-mono">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-zinc-400" />
                <span className="font-bold text-white">Class {targetStudent.grade} - Section {targetStudent.section}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Verified Enrollment
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              School class assignments cannot be altered once enrolled.
            </p>
          </div>

          {/* School Email & Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#121215] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9d9e99] flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>School Email</span>
              </div>
              <div className="text-xs font-mono text-zinc-200 truncate font-medium">
                {targetStudent.email}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#121215] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9d9e99] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                <span>Total Points</span>
              </div>
              <div className="text-xs font-mono text-white font-bold">
                {targetStudent.points} pts
              </div>
            </div>
          </div>

          {/* Badges Display Customization */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#9d9e99]" />
                <span className="text-xs font-bold text-white">
                  {isSelf ? 'Choose Badges to Showcase' : 'Showcased Badges'}
                </span>
              </div>
              {isSelf && (
                <span className="text-[10px] font-mono text-zinc-400">
                  {selectedBadges.length} showcased
                </span>
              )}
            </div>

            {isSelf ? (
              // Self: Select which earned badges to display on public profile
              targetStudent.badges.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {targetStudent.badges.map((badge, idx) => {
                    const isDisplayed = selectedBadges.includes(badge);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleBadge(badge)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isDisplayed
                            ? 'bg-zinc-800/90 border-zinc-500 text-white'
                            : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <Sparkles className={`w-3.5 h-3.5 ${isDisplayed ? 'text-[#9d9e99]' : 'text-zinc-600'}`} />
                          <span className="font-medium">{badge}</span>
                        </div>

                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isDisplayed 
                            ? 'bg-white border-white text-black' 
                            : 'border-zinc-700 bg-zinc-950'
                        }`}>
                          {isDisplayed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center text-xs text-zinc-500 font-mono">
                  No badges earned yet. Complete challenges and quiz scenarios to unlock badges.
                </div>
              )
            ) : (
              // Public View: Only show badges chosen by the student
              publicBadges && publicBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {publicBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-[#9d9e99]" />
                      <span className="font-semibold">{badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center text-xs text-zinc-500 font-mono">
                  This student has not showcased any badges on their public profile yet.
                </div>
              )
            )}
          </div>

          {/* Action Row for Self */}
          {isSelf && (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-white hover:bg-zinc-200 text-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl font-medium text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
