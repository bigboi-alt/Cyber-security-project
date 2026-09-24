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

export const PasswordGame: React.FC<PasswordGameProps> = ({ onPointsEarned }) => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121214] p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">The Password Game</h3>
            <p className="text-xs text-zinc-400">Cyber Security Password Challenge</p>
          </div>
        </div>

        {/* 2FA token */}
        <div className="flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-lg border border-zinc-800 font-mono text-xs">
          <span className="text-zinc-400">2FA:</span>
          <span className="text-white font-bold tracking-wider">{twoFactorToken}</span>
          <span className="text-zinc-500 flex items-center gap-1 border-l border-zinc-800 pl-2">
            <Clock className="w-3 h-3" /> {twoFactorTimer}s
          </span>
        </div>
      </div>

      {/* Input */}
      <div className="rounded-xl bg-[#121214] border border-zinc-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Enter Password</span>
          </label>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span>Length: <strong className="text-white">{password.length}</strong></span>
            <span>Digit Sum: <strong className={digitSum === 25 ? 'text-green-400' : 'text-zinc-200'}>{digitSum}</strong></span>
            <span>Roman Sum: <strong className={romanSum === 35 ? 'text-green-400' : 'text-zinc-200'}>{romanSum}</strong></span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Start typing your password..."
          className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-500 rounded-lg p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
        />

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{maxSatisfiedIndex} of {RULES.length} rules passed</span>
          <button
            onClick={() => {
              sound.playClick();
              setPassword('');
            }}
            className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-2">
        {visibleRules.slice().reverse().map((rule) => {
          const isValid = rule.validator(password);
          return (
            <div
              key={rule.id}
              className={`rounded-lg p-3 border transition-colors ${
                isValid
                  ? 'bg-zinc-800/40 border-zinc-700 text-zinc-200'
                  : 'bg-[#18181b] border-zinc-800 text-zinc-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{rule.title}</div>
                    <div className="text-zinc-400 mt-0.5">{rule.description}</div>
                    {!isValid && (
                      <div className="text-red-400 text-[11px] mt-1 font-mono">
                        {rule.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                  isValid ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-500'
                }`}>
                  {isValid ? 'PASSED' : 'PENDING'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted && (
        <div className="rounded-xl bg-[#121214] border border-zinc-700 p-6 text-center space-y-2">
          <h4 className="text-lg font-bold text-white">All 15 Rules Satisfied!</h4>
          <p className="text-xs text-zinc-400">
            You successfully completed the password challenge. +300 bonus points have been added to your class.
          </p>
        </div>
      )}
    </div>
  );
};
