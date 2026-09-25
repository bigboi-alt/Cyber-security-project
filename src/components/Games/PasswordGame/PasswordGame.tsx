import React, { useState, useEffect, useMemo } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Lock, 
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PasswordRule, StudentProfile } from '../../../types';
import { sound } from '../../../utils/sound';

interface PasswordGameProps {
  student: StudentProfile | null;
  onPointsEarned: (pts: number, badge?: string) => void;
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const PROTOCOLS = ['HTTPS', 'SSH', 'AES', 'TLS', 'VPN', 'RSA'];

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};

export const PasswordGame: React.FC<PasswordGameProps> = ({ student, onPointsEarned }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [twoFactorToken, setTwoFactorToken] = useState('7842');
  const [twoFactorTimer, setTwoFactorTimer] = useState(25);
  const [highestRuleUnlocked, setHighestRuleUnlocked] = useState(1);
  const [pointsGivenForRules, setPointsGivenForRules] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTwoFactorTimer(prev => {
        if (prev <= 1) {
          const newToken = Math.floor(1000 + Math.random() * 9000).toString();
          setTwoFactorToken(newToken);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const digitSum = useMemo(() => {
    const matches = password.match(/\d/g);
    if (!matches) return 0;
    return matches.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  }, [password]);

  // Fixed Roman numeral calculation: sum of Roman numeral values (e.g. XXXV = 10 + 10 + 10 + 5 = 35)
  const romanSum = useMemo(() => {
    const matches = password.match(/[IVXLCDM]/g);
    if (!matches || matches.length === 0) return 0;
    return matches.reduce((acc, curr) => acc + (ROMAN_VALUES[curr] || 0), 0);
  }, [password]);

  const RULES: PasswordRule[] = [
    {
      id: 1,
      title: 'Rule 1: Length',
      description: 'Your password must be at least 6 characters long.',
      validator: (p) => p.length >= 6,
      errorMessage: 'Needs at least 6 characters.'
    },
    {
      id: 2,
      title: 'Rule 2: Number',
      description: 'Your password must include at least one number.',
      validator: (p) => /\d/.test(p),
      errorMessage: 'Missing a numeric digit.'
    },
    {
      id: 3,
      title: 'Rule 3: Uppercase',
      description: 'Your password must include an uppercase letter.',
      validator: (p) => /[A-Z]/.test(p),
      errorMessage: 'Missing an uppercase letter.'
    },
    {
      id: 4,
      title: 'Rule 4: Special Character',
      description: 'Your password must include a special character (!@#$%^&*).',
      validator: (p) => /[!@#$%^&*_\-+=]/.test(p),
      errorMessage: 'Missing a special symbol.'
    },
    {
      id: 5,
      title: 'Rule 5: Digits Sum',
      description: 'The digits in your password must sum up to exactly 25.',
      validator: () => digitSum === 25,
      errorMessage: `Current sum is ${digitSum} (must equal 25).`
    },
    {
      id: 6,
      title: 'Rule 6: Calendar Month',
      description: 'Your password must include the name of any month (e.g. may, august).',
      validator: (p) => MONTHS.some(m => p.toLowerCase().includes(m)),
      errorMessage: 'Missing a month name (e.g. "march", "june").'
    },
    {
      id: 7,
      title: 'Rule 7: Roman Numeral',
      description: 'Your password must include at least one Roman numeral (I, V, X, L, C, D, M).',
      validator: (p) => /[IVXLCDM]/.test(p),
      errorMessage: 'Missing a Roman numeral character.'
    },
    {
      id: 8,
      title: 'Rule 8: Cyber Protocol',
      description: 'Your password must contain a security protocol acronym (HTTPS, SSH, AES, TLS, or VPN).',
      validator: (p) => PROTOCOLS.some(proto => p.includes(proto)),
      errorMessage: 'Must include: HTTPS, SSH, AES, TLS, or VPN.'
    },
    {
      id: 9,
      title: 'Rule 9: Roman Numeral Target',
      description: 'The Roman numerals in your password must sum up to exactly 35 (e.g. XXXV = 10 + 10 + 10 + 5 = 35).',
      validator: () => romanSum === 35,
      errorMessage: `Current Roman numeral sum is ${romanSum} (must equal 35. Tip: use XXXV).`
    },
    {
      id: 10,
      title: 'Rule 10: Secure Web Port',
      description: 'Your password must contain the standard encrypted web port number: 443.',
      validator: (p) => p.includes('443'),
      errorMessage: 'Must contain "443".'
    },
    {
      id: 11,
      title: 'Rule 11: Cyber Helpline',
      description: 'Your password must include the National Cyber Helpline number: 1930.',
      validator: (p) => p.includes('1930'),
      errorMessage: 'Must contain "1930".'
    },
    {
      id: 12,
      title: 'Rule 12: Hex Color',
      description: 'Your password must contain a valid 6-character hex color code (e.g. #333333).',
      validator: (p) => /#[0-9a-fA-F]{6}/.test(p),
      errorMessage: 'Must contain a # followed by 6 hex characters (e.g. #ffffff).'
    },
    {
      id: 13,
      title: 'Rule 13: 2FA Token',
      description: `Your password must include the current 2FA token (${twoFactorToken}).`,
      validator: (p) => p.includes(twoFactorToken),
      errorMessage: `Must include the live token: ${twoFactorToken}`
    },
    {
      id: 14,
      title: 'Rule 14: School Name',
      description: 'Your password must include our school keyword: KHAITAN.',
      validator: (p) => p.includes('KHAITAN'),
      errorMessage: 'Must contain "KHAITAN".'
    },
    {
      id: 15,
      title: 'Rule 15: No Consecutive Identical Characters',
      description: 'Your password must not contain any two consecutive identical characters.',
      validator: (p) => !/(.)\1/.test(p),
      errorMessage: 'Has duplicate characters right next to each other (e.g. "aa").'
    }
  ];

  let maxSatisfiedIndex = 0;
  for (let i = 0; i < RULES.length; i++) {
    if (RULES[i].validator(password)) {
      maxSatisfiedIndex = i + 1;
    } else {
      break;
    }
  }

  const currentVisibleCount = Math.max(highestRuleUnlocked, Math.min(RULES.length, maxSatisfiedIndex + 1));

  useEffect(() => {
    if (currentVisibleCount > highestRuleUnlocked) {
      sound.playSuccess();
      setHighestRuleUnlocked(currentVisibleCount);
    }

    const newlyBeaten: number[] = [];
    for (let r = 1; r <= maxSatisfiedIndex; r++) {
      if (!pointsGivenForRules.includes(r)) {
        newlyBeaten.push(r);
      }
    }

    if (newlyBeaten.length > 0) {
      setPointsGivenForRules(prev => [...prev, ...newlyBeaten]);
      const addedPoints = newlyBeaten.length * 50;
      onPointsEarned(addedPoints, `Password Lvl ${maxSatisfiedIndex}`);
    }

    if (maxSatisfiedIndex === RULES.length && !isCompleted) {
      setIsCompleted(true);
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 70 });
      onPointsEarned(300, 'Password Master');
    }
  }, [maxSatisfiedIndex, currentVisibleCount, highestRuleUnlocked, pointsGivenForRules, isCompleted, RULES.length, onPointsEarned]);

  const visibleRules = RULES.slice(0, currentVisibleCount);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c0f] p-4 rounded-none border-2 border-zinc-800 comic-shadow blocky-card-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white comic-shadow-sm">
            <KeyRound className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
              [ ACT.03 // CIPHER PROTOCOL ]
            </div>
            <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
              Cipher Gauntlet Challenge
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!student && (
            <div className="hidden sm:inline-block px-2.5 py-1.5 bg-amber-950/60 border-2 border-amber-500/60 text-amber-300 text-[10px] font-mono font-bold uppercase">
              Guest (No Save)
            </div>
          )}
          {/* 2FA token with Comic Anime Ticker */}
          <div className="flex items-center gap-2.5 bg-[#141418] px-3.5 py-1.5 rounded-none border-2 border-zinc-800 font-mono text-xs comic-shadow-sm">
            <span className="text-zinc-500 font-bold uppercase text-[10px]">2FA TOKEN:</span>
            <span className="text-white font-black tracking-widest text-sm">{twoFactorToken}</span>
            <span className="text-zinc-400 flex items-center gap-1 border-l border-zinc-800 pl-2 text-[11px] font-bold">
              <Clock className="w-3 h-3 text-[#9d9e99]" /> {twoFactorTimer}s
            </span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-5 space-y-3.5 comic-shadow blocky-card-dark">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>ENCRYPTED INPUT BUFFER</span>
          </label>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span>LEN: <strong className="text-white">{password.length}</strong></span>
            <span>DIGIT: <strong className={digitSum === 25 ? 'text-emerald-400 font-black' : 'text-zinc-300'}>{digitSum}/25</strong></span>
            <span>ROMAN: <strong className={romanSum === 35 ? 'text-emerald-400 font-black' : 'text-zinc-300'}>{romanSum}/35</strong></span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Construct cryptographic string satisfying active constraints..."
          className="w-full bg-[#141418] border-2 border-zinc-800 focus:border-white rounded-none p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none comic-shadow-sm font-semibold"
        />

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#9d9e99] font-bold uppercase tracking-wider">
            {maxSatisfiedIndex} OF {RULES.length} CONSTRAINTS SATISFIED
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setPassword('');
            }}
            className="hover:text-white text-zinc-400 flex items-center gap-1 cursor-pointer transition-colors font-bold uppercase text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CLEAR BUFFER</span>
          </button>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-2.5">
        {visibleRules.slice().reverse().map((rule) => {
          const isValid = rule.validator(password);
          return (
            <div
              key={rule.id}
              className={`rounded-none p-3.5 border-2 transition-all ${
                isValid
                  ? 'bg-emerald-950/30 border-emerald-500/70 text-zinc-200 comic-shadow-sm'
                  : 'bg-[#0c0c0f] border-zinc-800 text-zinc-300 comic-shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-black text-white font-mono uppercase tracking-wide text-xs">
                      {rule.title}
                    </div>
                    <div className="text-zinc-300 mt-0.5 font-sans leading-relaxed text-[11px]">
                      {rule.description}
                    </div>
                    {!isValid && (
                      <div className="text-rose-400 text-[11px] mt-1 font-mono font-semibold">
                        // {rule.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-none font-black uppercase shrink-0 border ${
                  isValid 
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600/70' 
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}>
                  {isValid ? 'CLEARED' : 'PENDING'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted && (
        <div className="rounded-none bg-[#0c0c0f] border-2 border-emerald-500 p-6 text-center space-y-2 comic-shadow blocky-card-dark">
          <div className="w-10 h-10 rounded-none bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-black text-white font-mono uppercase tracking-wide">
            ALL 15 CIPHER RULES SATISFIED! // COMPLETED
          </h4>
          <p className="text-xs text-zinc-300">
            {student ? (
              <>You forged an impenetrable cryptographic key. +300 bonus XP logged to your class.</>
            ) : (
              <span className="text-amber-400 font-mono font-bold">
                Guest Mode: You cleared all 15 rules, but your score is NOT logged to the leaderboard. Sign in to save your ranking!
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
