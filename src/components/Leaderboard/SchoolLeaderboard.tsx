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
      
      {/* 1. Header Block */}
      <div className="rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#9d9e99]">
              Institutional Rankings
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5 mt-0.5">
              <Trophy className="w-6 h-6 text-white" />
              <span>NEXUM Hall of Fame</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Live standings across registered classes and individual cyber defenders.
            </p>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#9d9e99]">Filter:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#121215] border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9d9e99] cursor-pointer font-mono shadow-sm"
            >
              <option value="all">All Grades (6-12)</option>
              {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                <option key={g} value={g}>Class {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 pt-6 border-t border-zinc-800/80 mt-5">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('sections');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#121215] border border-zinc-800 text-[#9d9e99] hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Class Standings ({filteredSections.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('students');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#121215] border border-zinc-800 text-[#9d9e99] hover:text-white hover:bg-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Individual Cadets ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards (If at least 1 entry exists) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {top3.map((item: any, idx) => {
            const isRank1 = idx === 0;
            const isRank2 = idx === 1;
            const isRank3 = idx === 2;

            const title = activeTab === 'sections' 
              ? `Class ${item.grade}-${item.section}` 
              : item.name;
            const subtitle = activeTab === 'sections'
              ? `${item.studentCount} student${item.studentCount > 1 ? 's' : ''}`
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
                className={`p-5 rounded-2xl border text-center space-y-2 relative overflow-hidden shadow-lg transition-all ${
                  activeTab === 'students' ? 'cursor-pointer hover:border-zinc-500' : ''
                } ${
                  isRank1
                    ? 'bg-[#121216] border-zinc-500 shadow-zinc-900/50'
                    : 'bg-[#0e0e11] border-zinc-800'
                }`}
              >
                {/* Brushed highlight line */}
                {isRank1 && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9d9e99] to-transparent" />
                )}

                <div className="flex items-center justify-center">
                  {isRank1 ? (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-white shadow-inner">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#9d9e99]">
                      <Medal className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-mono uppercase tracking-widest text-[#9d9e99]">
                  {isRank1 ? 'Rank #1 Champion' : isRank2 ? 'Rank #2 Contender' : 'Rank #3 Finalist'}
                </div>

                <h3 className="text-base font-bold text-white truncate px-2">
                  {title}
                </h3>

                <p className="text-xs text-zinc-500 font-mono">
                  {subtitle}
                </p>

                <div className="pt-2 border-t border-zinc-800/80 font-mono">
                  <span className="text-lg font-black text-white">{points}</span>
                  <span className="text-xs text-[#9d9e99] ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Detailed Rankings Table */}
      <div className="rounded-2xl bg-[#0c0c0e] border border-zinc-800 overflow-hidden shadow-lg">
        {activeTab === 'sections' ? (
          filteredSections.length > 0 ? (
            <div className="divide-y divide-zinc-800/70">
              {filteredSections.map((sec, idx) => {
                const isMySection = currentStudent && currentStudent.grade === sec.grade && currentStudent.section === sec.section;
                return (
                  <div
                    key={`${sec.grade}-${sec.section}`}
                    className={`flex items-center justify-between p-4 text-xs transition-colors ${
                      isMySection ? 'bg-[#151519] border-l-2 border-l-white' : 'hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        idx === 0 
                          ? 'bg-white text-black' 
                          : idx === 1 || idx === 2 
                          ? 'bg-zinc-800 text-white border border-zinc-700' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">Class {sec.grade}-{sec.section}</span>
                          {isMySection && (
                            <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-[#9d9e99] px-2 py-0.5 rounded font-mono font-semibold">
                              Your Class
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          {sec.studentCount} enrolled cadet{sec.studentCount > 1 ? 's' : ''}
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
            <div className="divide-y divide-zinc-800/70">
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
                      isCurrentUser ? 'bg-[#151519] border-l-2 border-l-white' : 'hover:bg-zinc-900/60'
                    }`}
                    title="Click to view cadet dossier and badges"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        idx === 0 
                          ? 'bg-white text-black' 
                          : idx === 1 || idx === 2 
                          ? 'bg-zinc-800 text-white border border-zinc-700' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white group-hover:underline underline-offset-2">{st.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-[#9d9e99] px-2 py-0.5 rounded font-mono font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Class {st.grade}-{st.section} • {st.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile →
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
              No students registered in this tier yet.
            </div>
          )
        )}
      </div>
    </div>
  );
};

