import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Mail, 
  AlertTriangle,
  Flag,
  Archive,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PhishIncident, StudentProfile } from '../../../types';
import { sound } from '../../../utils/sound';
import { verifySaltedHash } from '../../../utils/security';

interface PhishGuardProps {
  student: StudentProfile | null;
  onPointsEarned: (pts: number, badge?: string) => void;
}

const INCIDENTS: PhishIncident[] = [
  {
    id: 'inc-1',
    senderName: 'School Accounts Office',
    senderAddress: 'fees@thekhaltanschool.org',
    subject: 'URGENT: Annual Fee Discrepancy & Account Suspension',
    receivedTime: '09:40 AM',
    body: 'Dear Student,\nAn unpaid fee was flagged on your student portal. You must confirm your payment receipt within 2 hours by logging in here: http://khaitan-fee-portal-direct.online/login',
    urgency: 'High',
    indicators: ['Typosquatted domain ("thekhaltanschool.org" has "l" instead of "i")', 'Insecure HTTP link', 'Urgent suspension threat'],
    classification: 'PHISHING',
    actionDigest: '2e440e35',
    explanation: 'Correct! The sender domain was misspelled ("thekhaltanschool.org") and directed you to an insecure external website.'
  },
  {
    id: 'inc-2',
    senderName: 'Principal Office',
    senderAddress: 'principal@thekhaitanschool.org',
    subject: 'Circular: Science & Cyber Exhibition 2026',
    receivedTime: '10:15 AM',
    body: 'Dear Students,\nThe annual Science & Cyber Exhibition will be held next Friday. The official schedule is published on the school noticeboard and student portal. No action is required unless participating.',
    urgency: 'Low',
    indicators: ['Legitimate @thekhaitanschool.org domain', 'Informational only', 'No credential harvesting links'],
    classification: 'BENIGN',
    actionDigest: '1422dea9',
    explanation: 'Correct! This is a legitimate circular sent from the official school domain without deceptive links.'
  },
  {
    id: 'inc-3',
    senderName: 'National Merit Scholarship Trust',
    senderAddress: 'scholarship-claims@free-webhost.in',
    subject: 'Approval Notice: Rs 40,000 Student Grant - Send OTP to Claim',
    receivedTime: '11:30 AM',
    body: 'Your school ID was selected for the National Merit Grant. Reply with your bank account details and the 6-digit verification code just sent to your phone to release the scholarship.',
    urgency: 'Critical',
    indicators: ['Impersonation of Government authority', 'Asking for banking OTP', 'Sent from free hosting server'],
    classification: 'GOV_ALERT',
    actionDigest: '97689335',
    explanation: 'Correct! Financial scams soliciting bank details or OTPs should be immediately reported to CERT-In or 1930.'
  },
  {
    id: 'inc-4',
    senderName: 'Computer Lab Administrator',
    senderAddress: 'lab-admin@thekhaitanschool.org',
    subject: 'Class 10 Python Practice Exam Tools',
    receivedTime: '01:20 PM',
    body: 'Hello,\nPlease download and execute the attached batch script for tomorrow\'s lab session: PythonLabTest_Installer.bat',
    urgency: 'Medium',
    indicators: ['Executable .bat file attached', 'Unsolicited script', 'Potential trojan'],
    classification: 'MALWARE_DROP',
    actionDigest: '5f4ffc28',
    explanation: 'Correct! Unsolicited executable files (.bat, .exe) must always be quarantined to prevent potential malware execution.'
  },
  {
    id: 'inc-5',
    senderName: 'CERT-In Cyber Advisory',
    senderAddress: 'alerts@cert-in.org.in',
    subject: 'Advisory: Important Security Updates for Student Devices',
    receivedTime: '02:45 PM',
    body: 'Students are advised to update their web browsers to the latest stable versions to protect against known zero-day vulnerabilities in JavaScript engines.',
    urgency: 'High',
    indicators: ['Official CERT-In domain', 'Public security advisory', 'No credential requests'],
    classification: 'BENIGN',
    actionDigest: 'ff085bc8',
    explanation: 'Correct! This is an authentic advisory from CERT-In providing helpful cyber hygiene recommendations.'
  }
];

export const PhishGuard: React.FC<PhishGuardProps> = ({ student, onPointsEarned }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentIncident = INCIDENTS[currentIdx];

  useEffect(() => {
    if (isGameOver || feedback || !currentIncident) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleAction('ALLOW', true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, feedback, currentIncident]);

  const handleAction = (action: 'ALLOW' | 'QUARANTINE' | 'REPORT_CERTIN', timedOut = false) => {
    if (feedback || isGameOver) return;

    const isCorrect = !timedOut && verifySaltedHash(currentIncident.id, action, currentIncident.actionDigest);

    if (isCorrect) {
      sound.playSuccess();
      const pointsWon = 100;
      setScore(prev => prev + pointsWon);
      onPointsEarned(pointsWon, 'PhishGuard Defense');
      setFeedback({
        isCorrect: true,
        text: currentIncident.explanation
      });
    } else {
      sound.playError();
      setFeedback({
        isCorrect: false,
        text: timedOut
          ? 'Time expired for this notice. In active cyber triage, inspect sender verification and links quickly.'
          : 'Incorrect triage decision. Check the sender domain, headers, and indicators carefully.'
      });
    }
  };

  const handleNextIncident = () => {
    sound.playClick();
    setFeedback(null);
    setTimer(15);

    if (currentIdx < INCIDENTS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsGameOver(true);
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setScore(0);
    setTimer(15);
    setIsGameOver(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0c0c0f] p-4 rounded-none border-2 border-zinc-800 comic-shadow blocky-card-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white comic-shadow-sm">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
              [ ACT.02 // INCIDENT RESPONSE ]
            </div>
            <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
              PhishGuard SOC Triage
            </h3>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Triage Score</div>
          <div className="text-base font-black text-white">{score} pts</div>
          {!student && (
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Guest (Not Saved)</div>
          )}
        </div>
      </div>

      {!isGameOver && currentIncident ? (
        <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-5 space-y-4 comic-shadow blocky-card-dark">
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-3">
            <span className="text-[#9d9e99] font-bold uppercase tracking-wider">
              INTERCEPTED NOTICE 0{currentIdx + 1} // 0{INCIDENTS.length}
            </span>
            <span className="font-mono text-white bg-zinc-900 px-2.5 py-0.5 rounded-none border border-zinc-700 flex items-center gap-1.5 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{timer}S REMAINING</span>
            </span>
          </div>

          {/* Email Container (Manga Inked Transmission Box) */}
          <div className="rounded-none bg-[#141418] border-2 border-zinc-800 p-4 space-y-3 text-xs comic-shadow-sm">
            <div className="border-b border-zinc-800 pb-2.5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Sender Telemetry:</div>
                <div className="font-bold text-white mt-0.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentIncident.senderName}</span>
                  <span className="font-mono text-zinc-400 font-normal">&lt;{currentIncident.senderAddress}&gt;</span>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-none border uppercase ${
                currentIncident.urgency === 'Critical' 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600/80' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}>
                {currentIncident.urgency} Urgency
              </span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Subject Header:</div>
              <div className="text-zinc-200 mt-0.5 font-bold font-mono">{currentIncident.subject}</div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-none border border-zinc-800 font-mono text-zinc-200 whitespace-pre-line leading-relaxed text-xs">
              {currentIncident.body}
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9d9e99] mb-1.5 font-bold">
                // FORENSIC INDICATORS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentIncident.indicators.map((ind, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-none bg-zinc-900 text-zinc-300 border border-zinc-700 flex items-center gap-1 font-mono font-medium"
                  >
                    <AlertTriangle className="w-3 h-3 text-[#9d9e99]" />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!feedback ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => handleAction('ALLOW')}
                className="p-3 rounded-none border-2 border-emerald-600/70 bg-[#121216] hover:bg-emerald-950/40 text-emerald-300 text-xs font-black uppercase font-mono flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow-sm blocky-btn"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>ALLOW NOTICE</span>
              </button>

              <button
                onClick={() => handleAction('QUARANTINE')}
                className="p-3 rounded-none border-2 border-amber-500/70 bg-[#121216] hover:bg-amber-950/40 text-amber-300 text-xs font-black uppercase font-mono flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow-sm blocky-btn"
              >
                <Archive className="w-4 h-4 text-amber-400" />
                <span>QUARANTINE</span>
              </button>

              <button
                onClick={() => handleAction('REPORT_CERTIN')}
                className="p-3 rounded-none border-2 border-rose-600/70 bg-[#121216] hover:bg-rose-950/40 text-rose-300 text-xs font-black uppercase font-mono flex items-center justify-center gap-1.5 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow-sm blocky-btn"
              >
                <Flag className="w-4 h-4 text-rose-400" />
                <span>REPORT TO 1930</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-4 rounded-none border-2 text-xs leading-relaxed comic-shadow-sm font-sans ${
                feedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500 text-zinc-200'
                  : 'bg-rose-950/40 border-rose-500 text-zinc-200'
              }`}>
                <div className="font-black text-white font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5 text-xs">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{feedback.isCorrect ? 'DECISION VERIFIED // PASS' : 'INCORRECT ASSESSMENT // FAILED'}</span>
                </div>
                {feedback.text}
              </div>

              <button
                onClick={handleNextIncident}
                className="w-full py-3 px-4 rounded-none font-black text-xs bg-white hover:bg-zinc-200 text-black transition-transform active:translate-y-0.5 cursor-pointer comic-shadow font-mono uppercase tracking-wider blocky-btn"
              >
                <span>{currentIdx < INCIDENTS.length - 1 ? 'NEXT INTERCEPTED NOTICE →' : 'CONCLUDE SOC SESSION →'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed */
        <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-8 text-center space-y-4 comic-shadow blocky-card-dark">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white mx-auto comic-shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h4 className="text-xl font-black text-white font-mono uppercase tracking-wide">
            SOC TRIAGE COMPLETED // MISSION COMPLETE
          </h4>
          <p className="text-xs text-zinc-400">
            {student ? (
              <>You scored <strong className="text-white font-mono">{score} points</strong>. All points have been credited to your class.</>
            ) : (
              <span className="text-amber-400 font-mono font-bold">
                Guest Mode: You scored {score} points, but scores are NOT credited to the leaderboard. Sign in to save your progress!
              </span>
            )}
          </p>
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-none bg-white hover:bg-zinc-200 text-black font-black text-xs inline-flex items-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow uppercase font-mono tracking-wider blocky-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART TRIAGE SESSION</span>
          </button>
        </div>
      )}
    </div>
  );
};
