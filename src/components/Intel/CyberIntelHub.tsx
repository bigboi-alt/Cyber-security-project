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
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c0f] border-2 border-zinc-800 rounded-xl p-5 comic-shadow">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#9d9e99] font-bold">
            [ OPERATIVE INTEL ARCHIVE // 安全指針 ]
          </div>
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-tight mt-0.5">
            Cyber Defense Field Manual
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Operational safety directives and threat mitigation protocols for students.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 font-bold">
            HELPLINE: <strong className="text-white">1930</strong>
          </span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-white bg-[#141418] hover:bg-zinc-800 border-2 border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors comic-shadow-sm"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Topics Sidebar + Stream (Comic Dossier Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Left Column: Topics Sidebar */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-black text-white uppercase font-mono tracking-widest px-1">
            // INTEL DIRECTORIES
          </div>
          <div className="space-y-1.5">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopic(topic);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-between border-2 ${
                    isSelected
                      ? 'bg-white text-black border-white comic-shadow-sm'
                      : 'bg-[#0c0c0f] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span className="uppercase">{topic}</span>
                  {isSelected && <ChevronRight className="w-4 h-4 text-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Materials Stream */}
        <div className="md:col-span-3 space-y-4">
          <div className="text-[10px] font-black text-white uppercase font-mono tracking-widest px-1">
            // {selectedTopic.toUpperCase()} DIRECTIVE FILES ({filteredItems.length})
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#0c0c0f] border-2 border-zinc-800 p-4 transition-all hover:border-zinc-600 space-y-2 comic-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5 comic-shadow-sm">
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-white font-mono uppercase tracking-wide">{item.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase font-semibold">
                          {item.topic}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        {item.shortSummary}
                      </p>
                      <div className="mt-2.5 text-[11px] text-zinc-300 bg-[#141418] border-l-4 border-l-white border-y border-r border-zinc-800/80 p-2.5 rounded-r font-mono">
                        <strong className="text-white uppercase">// MANDATE:</strong> {item.keyRule}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Hygiene Assignment Card (Manga Certification Checklist) */}
          <div className="rounded-xl bg-[#0c0c0f] border-2 border-zinc-800 p-5 mt-6 comic-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-white" />
                <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest">
                  OPERATIVE COMPLIANCE CHECKLIST // 点検
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60 font-bold uppercase">
                {checkedItems.length} OF {CHECKLIST.length} ATTESTED
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {CHECKLIST.map((item, idx) => {
                const isChecked = checkedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-lg border-2 text-xs flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/70 text-white comic-shadow-sm font-semibold'
                        : 'bg-[#141418] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <span className="font-mono text-[11px]">{item}</span>
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
