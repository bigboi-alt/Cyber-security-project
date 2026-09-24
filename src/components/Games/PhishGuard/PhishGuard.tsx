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
    recommendedAction: 'QUARANTINE',
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
    recommendedAction: 'ALLOW',
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
    recommendedAction: 'REPORT_CERTIN',
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
    recommendedAction: 'QUARANTINE',
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
    recommendedAction: 'ALLOW',
    explanation: 'Correct! This is an authentic advisory from CERT-In providing helpful cyber hygiene recommendations.'
  }
];

export const PhishGuard: React.FC<PhishGuardProps> = ({ onPointsEarned }) => {
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

    const isCorrect = !timedOut && action === currentIncident.recommendedAction;

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
          ? `Time expired. Recommended action was: ${currentIncident.recommendedAction}.`
          : `Incorrect. Recommended action was: ${currentIncident.recommendedAction}. ${currentIncident.explanation}`
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
      <div className="flex items-center justify-between bg-[#121214] p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">PhishGuard Triage</h3>
            <p className="text-xs text-zinc-400">Review and classify incoming school notices and alerts</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-[11px] text-zinc-400">Score</div>
          <div className="text-sm font-bold text-white">{score} pts</div>
        </div>
      </div>

      {!isGameOver && currentIncident ? (
        <div className="rounded-xl bg-[#121214] border border-zinc-800 p-5 space-y-4">
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Notice {currentIdx + 1} of {INCIDENTS.length}</span>
            <span className="font-mono text-zinc-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" /> {timer}s
            </span>
          </div>

          {/* Email Container */}
          <div className="rounded-lg bg-[#18181b] border border-zinc-800 p-4 space-y-3 text-xs">
            <div className="border-b border-zinc-800 pb-2.5">
              <div className="text-zinc-400 font-medium">From:</div>
              <div className="font-semibold text-white mt-0.5 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{currentIncident.senderName}</span>
                <span className="font-mono text-zinc-400 font-normal">&lt;{currentIncident.senderAddress}&gt;</span>
              </div>
            </div>

            <div>
              <div className="text-zinc-400 font-medium">Subject:</div>
              <div className="text-zinc-200 mt-0.5 font-medium">{currentIncident.subject}</div>
            </div>

            <div className="p-3 bg-zinc-900 rounded border border-zinc-800/80 font-mono text-zinc-200 whitespace-pre-line leading-relaxed">
              {currentIncident.body}
            </div>

            <div>
              <div className="text-[11px] text-zinc-400 mb-1.5 font-medium">Indicators:</div>
              <div className="flex flex-wrap gap-1.5">
                {currentIncident.indicators.map((ind, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-zinc-400" />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!feedback ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => handleAction('ALLOW')}
                className="p-2.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Allow (Legitimate)</span>
              </button>

              <button
                onClick={() => handleAction('QUARANTINE')}
                className="p-2.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-yellow-400" />
                <span>Quarantine</span>
              </button>

              <button
                onClick={() => handleAction('REPORT_CERTIN')}
                className="p-2.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-red-400" />
                <span>Report to 1930</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                feedback.isCorrect
                  ? 'bg-zinc-800/80 border-green-500/60 text-zinc-200'
                  : 'bg-zinc-800/80 border-red-500/60 text-zinc-200'
              }`}>
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{feedback.isCorrect ? 'Correct Decision' : 'Incorrect Decision'}</span>
                </div>
                {feedback.text}
              </div>

              <button
                onClick={handleNextIncident}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-xs bg-white hover:bg-zinc-200 text-black transition-colors cursor-pointer"
              >
                <span>{currentIdx < INCIDENTS.length - 1 ? 'Next Notice' : 'Finish Triage'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed */
        <div className="rounded-xl bg-[#121214] border border-zinc-800 p-8 text-center space-y-4">
          <h4 className="text-xl font-bold text-white">Triage Session Finished</h4>
          <p className="text-xs text-zinc-400">
            You scored <strong className="text-white font-mono">{score} points</strong>. All points have been credited to your class.
          </p>
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Triage</span>
          </button>
        </div>
      )}
    </div>
  );
};
