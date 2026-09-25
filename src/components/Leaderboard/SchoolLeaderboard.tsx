import React, { useState } from 'react';
import { Trophy, Users, User, Medal, Crown } from 'lucide-react';
import type { StudentProfile } from '../../types';
import { getStoredStudents, getAllSectionRankings } from '../../utils/storage';
import { sound } from '../../utils/sound';

interface SchoolLeaderboardProps {
  currentStudent: StudentProfile | null;
  onViewProfile?: (student: StudentProfile) => void;
}

export const SchoolLeaderboard: React.FC<SchoolLeaderboardProps> = ({ currentStudent, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'students'>('sections');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const allStudents = getStoredStudents();
  const allSections = getAllSectionRankings();

  // Filter sections
  const filteredSections = selectedGrade === 'all'
    ? allSections
    : allSections.filter(s => s.grade === selectedGrade);

  // Filter students
  const filteredStudents = selectedGrade === 'all'
    ? [...allStudents].sort((a, b) => b.points - a.points)
    : allStudents.filter(s => s.grade === selectedGrade).sort((a, b) => b.points - a.points);

  const top3 = activeTab === 'sections' ? filteredSections.slice(0, 3) : filteredStudents.slice(0, 3);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Header Block (Comic Anime Tournament Ladder) */}
      <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-6 sm:p-7 comic-shadow blocky-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#9d9e99] font-bold">
              [ TOURNAMENT STANDINGS // CADET RANKINGS ]
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5 mt-0.5 font-mono uppercase">
              <Trophy className="w-6 h-6 text-white" />
              <span>NEXUM Hall of Fame</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Live standings across registered class squads and individual cyber defenders.
            </p>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-mono text-[#9d9e99] font-bold uppercase text-[11px]">FILTER:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#141418] border-2 border-zinc-700 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-white cursor-pointer font-mono font-bold comic-shadow-sm"
            >
              <option value="all">ALL GRADES (6-12)</option>
              {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                <option key={g} value={g}>CLASS {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 pt-6 border-t-2 border-zinc-800/80 mt-5">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('sections');
            }}
            className={`px-4 py-2.5 rounded-none text-xs font-black uppercase font-mono flex items-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer blocky-btn ${
              activeTab === 'sections'
                ? 'bg-white text-black comic-shadow'
                : 'bg-[#141418] border-2 border-zinc-800 text-[#9d9e99] hover:text-white hover:border-zinc-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CLASS STANDINGS ({filteredSections.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('students');
            }}
            className={`px-4 py-2.5 rounded-none text-xs font-black uppercase font-mono flex items-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer blocky-btn ${
              activeTab === 'students'
                ? 'bg-white text-black comic-shadow'
                : 'bg-[#141418] border-2 border-zinc-800 text-[#9d9e99] hover:text-white hover:border-zinc-600'
            }`}
          >
            <User className="w-4 h-4" />
            <span>INDIVIDUAL CADETS ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards (If at least 1 entry exists) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((item: any, idx) => {
            const isRank1 = idx === 0;
            const isRank2 = idx === 1;
            const isRank3 = idx === 2;

            const title = activeTab === 'sections' 
              ? `Class ${item.grade}-${item.section}` 
              : item.name;
            const subtitle = activeTab === 'sections'
              ? `${item.studentCount} enrolled operative${item.studentCount > 1 ? 's' : ''}`
              : `Class ${item.grade}-${item.section}`;
            const points = activeTab === 'sections' ? item.totalPoints : item.points;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (activeTab === 'students' && onViewProfile) {
                    sound.playClick();
                    onViewProfile(item as StudentProfile);
                  }
                }}
                className={`p-5 rounded-none border-2 text-center space-y-2 relative overflow-hidden transition-all blocky-card-dark ${
                  activeTab === 'students' ? 'cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px]' : ''
                } ${
                  isRank1
                    ? 'bg-[#141418] border-white comic-shadow-white'
                    : 'bg-[#0c0c0f] border-zinc-800 comic-shadow'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isRank1 ? (
                    <div className="w-11 h-11 rounded-none bg-zinc-900 border-2 border-white flex items-center justify-center text-white comic-shadow-sm">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-[#9d9e99]">
                      <Medal className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-mono uppercase tracking-widest font-black text-[#9d9e99]">
                  {isRank1 ? 'RANK #1 // S-TIER' : isRank2 ? 'RANK #2 // A-TIER' : 'RANK #3 // B-TIER'}
                </div>

                <h3 className="text-base font-black text-white truncate px-2 font-mono uppercase">
                  {title}
                </h3>

                <p className="text-xs text-zinc-400 font-mono">
                  {subtitle}
                </p>

                <div className="pt-2 border-t border-zinc-800 font-mono">
                  <span className="text-xl font-black text-white">{points}</span>
                  <span className="text-xs text-[#9d9e99] ml-1 font-bold">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Detailed Rankings Table */}
      <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 overflow-hidden comic-shadow blocky-card-dark">
        {activeTab === 'sections' ? (
          filteredSections.length > 0 ? (
            <div className="divide-y-2 divide-zinc-800/80">
              {filteredSections.map((sec, idx) => {
                const isMySection = currentStudent && currentStudent.grade === sec.grade && currentStudent.section === sec.section;
                return (
                  <div
                    key={`${sec.grade}-${sec.section}`}
                    className={`flex items-center justify-between p-4 text-xs transition-colors ${
                      isMySection ? 'bg-[#141418] border-l-4 border-l-white' : 'hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-none flex items-center justify-center font-mono font-black text-xs border ${
                        idx === 0 
                          ? 'bg-white text-black border-white' 
                          : idx === 1 || idx === 2 
                          ? 'bg-zinc-800 text-white border-zinc-600' 
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white font-mono uppercase">Class {sec.grade}-{sec.section}</span>
                          {isMySection && (
                            <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-[#9d9e99] px-2 py-0.5 rounded-none font-mono font-bold">
                              YOUR SQUAD
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {sec.studentCount} enrolled operative{sec.studentCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-black text-white text-base">{sec.totalPoints} pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-zinc-500 font-mono">
              No class sections registered in this tier yet.
            </div>
          )
        ) : (
          filteredStudents.length > 0 ? (
            <div className="divide-y-2 divide-zinc-800/80">
              {filteredStudents.map((st, idx) => {
                const isCurrentUser = currentStudent && (currentStudent.id === st.id || currentStudent.email === st.email);
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (onViewProfile) {
                        sound.playClick();
                        onViewProfile(st);
                      }
                    }}
                    className={`flex items-center justify-between p-4 text-xs transition-colors cursor-pointer group ${
                      isCurrentUser ? 'bg-[#141418] border-l-4 border-l-white' : 'hover:bg-zinc-900/50'
                    }`}
                    title="Click to view operative dossier and badges"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-none flex items-center justify-center font-mono font-black text-xs border ${
                        idx === 0 
                          ? 'bg-white text-black border-white' 
                          : idx === 1 || idx === 2 
                          ? 'bg-zinc-800 text-white border-zinc-600' 
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white font-mono uppercase group-hover:underline underline-offset-2">{st.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-[#9d9e99] px-2 py-0.5 rounded-none font-mono font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Class {st.grade}-{st.section} • {st.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#9d9e99] hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        VIEW DOSSIER →
                      </span>
                      <div className="text-right font-mono">
                        <div className="font-black text-white text-base">{st.points} pts</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-zinc-500 font-mono">
              No operatives registered in this tier yet.
            </div>
          )
        )}
      </div>
    </div>
  );
};

