export type ClassGrade = '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type ClassSection = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  grade: ClassGrade;
  section: ClassSection;
  avatar: string;
  points: number;
  easterEggsFound: string[];
  completedQuizzes: string[];
  huntLevelReached: number;
  passwordGameHighScore: number;
  phishGuardScore: number;
  joinedAt: string;
  badges: string[];
}

export interface ClassSectionStats {
  grade: ClassGrade;
  section: ClassSection;
  totalPoints: number;
  memberCount: number;
  activeOperatives: number;
}

export interface QuizQuestion {
  id: string;
  title: string;
  category: 'Phishing' | 'Network' | 'Social Engineering' | 'Malware' | 'Privacy';
  difficulty: 'Cadet' | 'Operative' | 'Sentinel';
  scenario: string;
  visualType?: 'email' | 'sms' | 'url' | 'code' | 'terminal';
  visualContent?: {
    sender?: string;
    subject?: string;
    body?: string;
    url?: string;
    details?: string[];
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  points: number;
}

export interface HuntLevel {
  level: number;
  title: string;
  codename: string;
  briefing: string;
  intelClue: string;
  clueType: 'code' | 'network_dump' | 'dns_inspect' | 'stego_matrix' | 'cipher';
  clueData: {
    rawText?: string;
    codeSnippet?: string;
    headers?: Record<string, string>;
    matrixGrid?: number[][];
    cipherPrompt?: string;
  };
  hint: string;
  acceptedFlags: string[];
  points: number;
  unlockedTool?: string;
}

export interface PasswordRule {
  id: number;
  title: string;
  description: string;
  validator: (password: string, extraData?: any) => boolean;
  errorMessage: string;
}

export interface PhishIncident {
  id: string;
  senderName: string;
  senderAddress: string;
  subject: string;
  receivedTime: string;
  body: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  indicators: string[];
  classification: 'BENIGN' | 'PHISHING' | 'MALWARE_DROP' | 'GOV_ALERT';
  recommendedAction: 'ALLOW' | 'QUARANTINE' | 'REPORT_CERTIN';
  explanation: string;
}
