import React, { useState } from 'react';
import { 
  Lock, 
  Wifi, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  FileText,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface CyberIntelHubProps {
  onAwardChecklistBonus: (pts: number) => void;
  hasClaimedBonus: boolean;
}

interface GuideItem {
  id: string;
  topic: string;
  title: string;
  shortSummary: string;
  keyRule: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOPICS = ['All Topics', 'Phishing & Emails', 'Passwords & 2FA', 'Safe Browsing', 'Social Engineering'];

const GUIDE_ITEMS: GuideItem[] = [
  {
    id: 'g1',
    topic: 'Phishing & Emails',
    title: 'Spotting Spoofed School Circulars',
    shortSummary: 'Attackers create fake email notices that look identical to school announcements to steal your password.',
    keyRule: 'Always verify the sender domain ends in exactly "@thekhaitanschool.org" before opening attachments or links.',
    icon: Mail
  },
  {
    id: 'g2',
    topic: 'Phishing & Emails',
    title: 'Suspicious File Extensions',
    shortSummary: 'Files labeled ".pdf.exe" or ".docx.bat" are disguised malware programs waiting to infect your device.',
    keyRule: 'Never open double-extension files or executable installers sent via unsolicited email.',
    icon: FileText
  },
  {
    id: 'g3',
    topic: 'Passwords & 2FA',
    title: 'Strong Passphrases & 2FA',
    shortSummary: 'Combining 3-4 unrelated words creates an uncrackable password that is easy for you to remember.',
    keyRule: 'Never reuse your school password on gaming sites like Discord, Steam, or Roblox.',
    icon: Lock
  },
  {
    id: 'g4',
    topic: 'Passwords & 2FA',
    title: 'One-Time Passwords (OTPs) are Private',
    shortSummary: 'No school staff member, teacher, or tech support will ever ask you for an OTP sent to your phone.',
    keyRule: 'If someone asks you for a 6-digit verification code, they are actively attempting an account takeover.',
    icon: ShieldCheck
  },
  {
    id: 'g5',
    topic: 'Safe Browsing',
    title: 'Open Public Wi-Fi Risks',
    shortSummary: 'Free unencrypted Wi-Fi in cafes or transit can expose your browsing data to nearby eavesdroppers.',
    keyRule: 'Ensure the padlock icon (HTTPS) is visible and avoid logging into school portals on open networks.',
    icon: Wifi
  },
  {
    id: 'g6',
    topic: 'Social Engineering',
    title: 'Free Game Currency & Giveaways',
    shortSummary: 'Promises of free Robux, V-Bucks, or leaked exam papers are standard lures to capture school logins.',
    keyRule: 'Never input your school email and password into third-party survey or giveaway links.',
    icon: Smartphone
  }
];

const CHECKLIST = [
  'I use a unique password for my school email account',
  'I verify sender addresses on school circulars before clicking links',
  'I have enabled Two-Factor Authentication (2FA) where possible',
  'I never share verification OTPs with anyone',
  'I avoid logging into sensitive accounts on open public Wi-Fi',
  'I know the National Cyber Crime Helpline number is 1930'
];

export const CyberIntelHub: React.FC<CyberIntelHubProps> = ({
  onAwardChecklistBonus,
  hasClaimedBonus,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const filteredItems = selectedTopic === 'All Topics'
    ? GUIDE_ITEMS
    : GUIDE_ITEMS.filter(item => item.topic === selectedTopic);

  const toggleCheck = (index: number) => {
    sound.playClick();
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      const next = [...checkedItems, index];
      setCheckedItems(next);
      if (next.length === CHECKLIST.length && !hasClaimedBonus) {
        sound.playSuccess();
        onAwardChecklistBonus(150);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121214] border border-zinc-800 rounded-xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Cyber Guide</h2>
          <p className="text-xs text-zinc-400">
            Categorized quick-reference safety guides for students.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>National Helpline: <strong className="text-white font-mono">1930</strong></span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:underline flex items-center gap-1 font-medium"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Google Classroom Layout: Sidebar Topics + Stream */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Left Column: Topics Sidebar (Google Classroom style) */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
            Topics
          </div>
          <div className="space-y-1">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopic(topic);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span>{topic}</span>
                  {isSelected && <ChevronRight className="w-3 h-3 text-zinc-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Materials Stream */}
        <div className="md:col-span-3 space-y-3.5">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            {selectedTopic} ({filteredItems.length} guides)
          </div>

          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#121214] border border-zinc-800 p-4 transition-colors hover:border-zinc-700 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {item.topic}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        {item.shortSummary}
                      </p>
                      <div className="mt-2 text-[11px] text-zinc-400 border-l-2 border-zinc-700 pl-2 py-0.5">
                        <strong className="text-zinc-200">Rule:</strong> {item.keyRule}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Hygiene Assignment Card (Classroom style) */}
          <div className="rounded-xl bg-[#121214] border border-zinc-800 p-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-white" />
                <h4 className="text-xs font-semibold text-white">Student Safety Checklist</h4>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {checkedItems.length} of {CHECKLIST.length} completed
              </span>
            </div>

            <div className="space-y-2">
              {CHECKLIST.map((item, idx) => {
                const isChecked = checkedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-zinc-800/60 border-zinc-600 text-white'
                        : 'bg-[#18181b] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
