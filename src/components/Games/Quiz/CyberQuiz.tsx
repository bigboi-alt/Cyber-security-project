import React, { useState } from 'react';
import { 
  FileQuestion, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Mail, 
  Smartphone, 
  Globe, 
  HardDrive
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizQuestion, StudentProfile } from '../../../types';
import { sound } from '../../../utils/sound';
import { verifySaltedHash } from '../../../utils/security';

interface CyberQuizProps {
  student: StudentProfile | null;
  onPointsEarned: (pts: number, badge?: string) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    title: 'The Exam Timetable Notice',
    category: 'Phishing',
    difficulty: 'Cadet',
    scenario: 'You receive an urgent email during exam week claiming your board timetable was revised. Check the sender and URL.',
    visualType: 'email',
    visualContent: {
      sender: 'circulars@thekhaltanschool.org',
      subject: 'URGENT: Revised Examination Schedule - Download Circular',
      body: 'Dear Student,\nYour upcoming examination schedule has been altered. Log in via the link below with your school credentials within 30 minutes to confirm your seat:\n\nhttp://khaitan-portal-portal-verify.in/login.php',
    },
    options: [
      { id: 'a', text: 'Click the link immediately and enter your school password so you don\'t miss exams.' },
      { id: 'b', text: 'Notice the misspelled sender domain ("thekhaltanschool.org" uses an "l" instead of "i") and report it.' },
      { id: 'c', text: 'Forward the email to your entire class WhatsApp group.' },
      { id: 'd', text: 'Reply with your phone number asking if this notice is real.' },
    ],
    hashDigest: '2b83508f',
    explanation: 'Correct! The sender address uses a typosquatted domain ("thekhaltanschool.org" with an "l" instead of "i") and creates artificial urgency linking to an insecure HTTP site.',
    points: 100
  },
  {
    id: 'q2',
    title: 'The Flash Drive in the Lab',
    category: 'Malware',
    difficulty: 'Operative',
    scenario: 'You find an unlabeled USB flash drive on a table in the school computer lab.',
    visualType: 'code',
    visualContent: {
      body: 'Label handwritten on drive: "Class 10 CBSE Leaked Paper 2026"\nFile found inside: "Question_Paper_Final.pdf.exe"'
    },
    options: [
      { id: 'a', text: 'Double click the file to view the leaked questions.' },
      { id: 'b', text: 'Copy the file onto your personal laptop and run it.' },
      { id: 'c', text: 'Recognize the double extension ".pdf.exe" as executable malware (USB Drop Baiting) and give it to the teacher.' },
      { id: 'd', text: 'Rename the file to remove ".exe" and execute it.' }
    ],
    hashDigest: '95149865',
    explanation: 'Correct! Attackers use deceptive filenames like ".pdf.exe" to trick users into running executable malware or spyware.',
    points: 100
  },
  {
    id: 'q3',
    title: 'The Free Game Pass Message',
    category: 'Social Engineering',
    difficulty: 'Cadet',
    scenario: 'Someone sharing a mutual gaming group with you sends you a message on Discord.',
    visualType: 'sms',
    visualContent: {
      sender: 'Classmate_Alex',
      body: 'Hey! I got a promotional voucher for free premium gaming skins, but it needs an active school email. I just triggered the reset link—can you tell me the 6-digit code sent to your phone real quick?'
    },
    options: [
      { id: 'a', text: 'Share the 6-digit OTP since they are in your mutual group.' },
      { id: 'b', text: 'Never share the OTP—it is a two-factor verification code that would allow them to take over your account.' },
      { id: 'c', text: 'Ask for the voucher code first, then share the OTP.' },
      { id: 'd', text: 'Send the OTP to see if it actually works.' }
    ],
    hashDigest: '3db487e1',
    explanation: 'Correct! Never share verification codes or OTPs with anyone under any circumstances. They were attempting an account takeover.',
    points: 100
  },
  {
    id: 'q4',
    title: 'Open Wi-Fi at a Nearby Cafe',
    category: 'Network',
    difficulty: 'Operative',
    scenario: 'You are studying at a cafe near school and open your Wi-Fi settings.',
    visualType: 'url',
    visualContent: {
      url: 'Network 1: CafeGuest_Encrypted [Password Protected, WPA2]\nNetwork 2: Free_Khaitan_UltraFast_WiFi [Open, No Password]'
    },
    options: [
      { id: 'a', text: 'Connect to the Open Wi-Fi because it has the school name and doesn\'t require a password.' },
      { id: 'b', text: 'Connect to the protected cafe network and avoid rogue open access points ("Evil Twin").' },
      { id: 'c', text: 'Connect to both simultaneously.' },
      { id: 'd', text: 'Open your netbanking on the open Wi-Fi to test the speed.' }
    ],
    hashDigest: '240158f4',
    explanation: 'Correct! Rogue open networks ("Evil Twins") are easily created by attackers to intercept and snoop on unencrypted traffic.',
    points: 100
  },
  {
    id: 'q5',
    title: 'Subdomain Verification',
    category: 'Privacy',
    difficulty: 'Sentinel',
    scenario: 'Inspect this URL closely. What is the real root domain hosting this page?',
    visualType: 'url',
    visualContent: {
      url: 'https://accounts.google.com.security-check-portal.org/login'
    },
    options: [
      { id: 'a', text: 'google.com (Google\'s official authentication service).' },
      { id: 'b', text: 'security-check-portal.org (an unrelated third-party domain).' },
      { id: 'c', text: 'accounts.com (Accounts domain).' },
      { id: 'd', text: 'login.org (Login organization).' }
    ],
    hashDigest: '2d6f94db',
    explanation: 'Correct! In domain hierarchy, the actual domain is "security-check-portal.org". The "accounts.google.com" part is merely a subdomain prefix created to fool unsuspecting users.',
    points: 100
  }
];

export const CyberQuiz: React.FC<CyberQuizProps> = ({ student, onPointsEarned }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = verifySaltedHash(currentQ.id, selectedOptionId, currentQ.hashDigest);
    if (isCorrect) {
      sound.playSuccess();
      const pointsWon = currentQ.points;
      setScore(prev => prev + pointsWon);
      onPointsEarned(pointsWon, 'Quiz Completed');
    } else {
      sound.playError();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      sound.playSuccess();
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0c0c0f] p-4 rounded-none border-2 border-zinc-800 comic-shadow blocky-card-dark">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white comic-shadow-sm">
            <FileQuestion className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
              [ ACT.04 // THREAT EVALUATION ]
            </div>
            <h3 className="text-sm font-black text-white font-mono uppercase tracking-wide">
              Threat Scenario Evaluation
            </h3>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Earned XP</div>
          <div className="text-base font-black text-white">{score} pts</div>
          {!student && (
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Guest (Not Saved)</div>
          )}
        </div>
      </div>

      {!isCompleted ? (
        <div className="rounded-none bg-[#0c0c0f] border-2 border-zinc-800 p-5 sm:p-6 space-y-5 comic-shadow blocky-card-dark">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-3">
            <span className="text-[#9d9e99] font-bold uppercase tracking-wider">
              SCENARIO 0{currentIndex + 1} // 0{QUIZ_QUESTIONS.length}
            </span>
            <span className="font-mono text-white bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-700 text-[11px] font-bold">
              +{currentQ.points} PTS
            </span>
          </div>

          {/* Scenario */}
          <div className="space-y-1.5">
            <h4 className="text-base font-black text-white tracking-tight font-mono uppercase">
              {currentQ.title}
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {currentQ.scenario}
            </p>
          </div>

          {/* Visual Scenario Card (Comic Callout / Dossier) */}
          {currentQ.visualContent && (
            <div className="rounded-none bg-[#141418] border-2 border-zinc-800 p-4 text-xs font-mono comic-shadow-sm">
              {currentQ.visualType === 'email' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-zinc-300 font-sans border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#9d9e99]">
                      <Mail className="w-3.5 h-3.5 text-white" />
                      <span>Intercepted Email Notice</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Incoming Telemetry</span>
                  </div>
                  <div className="text-zinc-400"><strong>From:</strong> {currentQ.visualContent.sender}</div>
                  <div className="text-zinc-400"><strong>Subject:</strong> {currentQ.visualContent.subject}</div>
                  <div className="pt-2 text-zinc-200 whitespace-pre-line border-t border-zinc-800/80 leading-relaxed">
                    {currentQ.visualContent.body}
                  </div>
                </div>
              )}

              {currentQ.visualType === 'sms' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-zinc-300 font-sans border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#9d9e99]">
                      <Smartphone className="w-3.5 h-3.5 text-white" />
                      <span>Direct Cellular Message</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{currentQ.visualContent.sender}</span>
                  </div>
                  <div className="text-zinc-200 leading-relaxed">
                    {currentQ.visualContent.body}
                  </div>
                </div>
              )}

              {currentQ.visualType === 'url' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[#9d9e99] font-sans border-b border-zinc-800 pb-2 text-xs font-bold uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-white" />
                    <span>Target URL Inspection</span>
                  </div>
                  <div className="text-zinc-200 break-all select-all font-mono bg-zinc-950 p-2.5 rounded-none border border-zinc-800 text-xs">
                    {currentQ.visualContent.url}
                  </div>
                </div>
              )}

              {currentQ.visualType === 'code' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[#9d9e99] font-sans border-b border-zinc-800 pb-2 text-xs font-bold uppercase tracking-wider">
                    <HardDrive className="w-3.5 h-3.5 text-white" />
                    <span>Storage Registry Dump</span>
                  </div>
                  <div className="text-zinc-200 whitespace-pre-line bg-zinc-950 p-2.5 rounded-none border border-zinc-800 text-xs leading-relaxed">
                    {currentQ.visualContent.body}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = verifySaltedHash(currentQ.id, option.id, currentQ.hashDigest);
              let style = 'bg-[#121216] border-2 border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white';

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  style = 'bg-emerald-950/40 border-2 border-emerald-500 text-white font-bold comic-shadow-sm';
                } else if (isSelected && !isCorrectOption) {
                  style = 'bg-rose-950/40 border-2 border-rose-500 text-zinc-200 comic-shadow-sm';
                } else {
                  style = 'bg-[#0f0f13] border-2 border-zinc-900 text-zinc-600';
                }
              } else if (isSelected) {
                style = 'bg-zinc-800 border-2 border-white text-white font-semibold comic-shadow-sm';
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-3.5 rounded-none text-left text-xs flex items-start gap-3 transition-all cursor-pointer ${style}`}
                >
                  <span className="font-mono uppercase font-black w-5 mt-0.5 text-zinc-400">
                    [{option.id}]
                  </span>
                  <span className="flex-1 leading-relaxed">{option.text}</span>
                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action */}
          {!isAnswerSubmitted ? (
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmitAnswer}
              className={`w-full py-3 px-4 rounded-none font-black text-xs flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow uppercase tracking-wider font-mono blocky-btn ${
                selectedOptionId
                  ? 'bg-white hover:bg-zinc-200 text-black'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-60'
              }`}
            >
              <span>CONFIRM OPERATIVE VERDICT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-none bg-[#141418] border-2 border-zinc-800 text-xs text-zinc-200 leading-relaxed comic-shadow-sm">
                <div className="font-black text-white font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[11px]">
                  <span>// DEBRIEFING ANALYSIS</span>
                </div>
                {currentQ.explanation}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3 px-4 rounded-none font-black text-xs bg-white hover:bg-zinc-200 text-black transition-transform active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer comic-shadow uppercase tracking-wider font-mono blocky-btn"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'NEXT SCENARIO →' : 'CONCLUDE ASSESSMENT →'}</span>
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
          <h3 className="text-xl font-black text-white font-mono uppercase tracking-wide">
            EVALUATION CONCLUDED // OPERATION FINISHED
          </h3>
          <p className="text-xs text-zinc-400">
            {student ? (
              <>You achieved an operative score of <strong className="text-white font-mono">{score} points</strong>. All telemetry has been recorded to your class dossier.</>
            ) : (
              <span className="text-amber-400 font-mono font-bold">
                Guest Mode: You achieved {score} points, but results are NOT recorded on the leaderboard. Sign in to save future attempts!
              </span>
            )}
          </p>
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-none bg-white hover:bg-zinc-200 text-black font-black text-xs inline-flex items-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer comic-shadow uppercase font-mono tracking-wider blocky-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RE-EVALUATE SCENARIOS</span>
          </button>
        </div>
      )}
    </div>
  );
};
