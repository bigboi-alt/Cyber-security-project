import React, { useState } from 'react';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Search, 
  Mail, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Plus, 
  ExternalLink, 
  History, 
  Lock, 
  Download, 
  PartyPopper,
  Maximize2,
  Minimize2,
  Trash2,
  Home,
  ListTodo,
  ShieldAlert,
  ChevronRight,
  Info,
  ShieldCheck,
  FileText,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { StudentProfile } from '../../../types';
import { sound } from '../../../utils/sound';

interface CyberHuntProps {
  student: StudentProfile | null;
  onPointsEarned: (pts: number, badge?: string) => void;
}

type PageType = 
  | 'google' 
  | 'tmail' 
  | 'amazon_legit' 
  | 'amazon_fake' 
  | 'party_invite' 
  | 'download_portal' 
  | 'history' 
  | 'newtab';

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  type: PageType;
  canClose: boolean;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  type: PageType;
  timestamp: string;
  category: 'safe' | 'phishing' | 'threat' | 'internal';
  notes: string;
}

export const CyberHunt: React.FC<CyberHuntProps> = ({ student: _, onPointsEarned }) => {
  // Tab Management: Starts with ONLY Google (no random open pages!)
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Google',
      url: 'https://www.google.com',
      type: 'google',
      canClose: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Omnibox & Navigation
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [navHistory, setNavHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Fullscreen and Layout
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTodoSidebar, setShowTodoSidebar] = useState(true);

  // Google Search Engine State
  const [searchQuery, setSearchQuery] = useState('amazon');
  const [hasSearched, setHasSearched] = useState(true);

  // To-Do Checklist & Mission Tracking
  const [task1Done, setTask1Done] = useState(false);
  const [task2Done, setTask2Done] = useState(false);
  const [task3Done, setTask3Done] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<1 | 2 | 3>(1);

  // Fake Amazon Form
  const [fakeEmail, setFakeEmail] = useState('');
  const [fakePass, setFakePass] = useState('');

  // Modals & Feedback
  const [resultModal, setResultModal] = useState<{ isSuccess: boolean; title: string; message: string } | null>(null);

  // Comprehensive Browsing History
  const [historyLog, setHistoryLog] = useState<HistoryItem[]>([
    {
      id: 'h-1',
      title: 'Google Search Engine',
      url: 'https://www.google.com',
      type: 'google',
      timestamp: '14:20:00',
      category: 'safe',
      notes: 'Standard search engine session'
    }
  ]);
  const [historySearchFilter, setHistorySearchFilter] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'all' | 'safe' | 'threats'>('all');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Helper to append to realistic history
  const recordHistory = (title: string, url: string, type: PageType) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let category: 'safe' | 'phishing' | 'threat' | 'internal' = 'safe';
    let notes = 'Verified safe site';

    if (type === 'amazon_fake') {
      category = 'phishing';
      notes = '⚠️ Typosquatting clone domain (amazon.ti) attempting credential theft';
    } else if (type === 'party_invite') {
      category = 'threat';
      notes = '⚠️ External credential harvesting trap requesting school email password';
    } else if (type === 'history' || type === 'newtab') {
      category = 'internal';
      notes = 'Internal browser system page';
    }

    const newItem: HistoryItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      url,
      type,
      timestamp: timeStr,
      category,
      notes
    };

    setHistoryLog(prev => [newItem, ...prev]);
  };

  // Navigate current tab to a destination
  const navigateCurrentTab = (type: PageType, url: string, title?: string) => {
    sound.playClick();
    const defaultTitle = 
      type === 'google' ? 'Google' :
      type === 'tmail' ? 'Tmail - Inbox' :
      type === 'amazon_legit' ? 'Amazon.com: Online Store' :
      type === 'amazon_fake' ? 'Amazon.ti: Sign In' :
      type === 'party_invite' ? 'Confirm RSVP: Party Card' :
      type === 'download_portal' ? 'School Cloud Downloads' :
      type === 'history' ? 'History' : 'New Tab';

    const tabTitle = title || defaultTitle;

    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return { ...tab, type, url, title: tabTitle };
      }
      return tab;
    }));

    setUrlInput(url);
    setNavHistory(prev => [...prev.slice(0, historyIndex + 1), url]);
    setHistoryIndex(prev => prev + 1);

    recordHistory(tabTitle, url, type);
  };

  // Open a brand new tab
  const openNewTab = (type: PageType = 'newtab', url: string = 'chrome://newtab', title: string = 'New Tab') => {
    sound.playClick();
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title,
      url,
      type,
      canClose: true
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput(url);
    setNavHistory(prev => [...prev, url]);
    setHistoryIndex(prev => prev + 1);
    recordHistory(title, url, type);
  };

  // Close tab
  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    sound.playClick();
    if (tabs.length === 1) return; // Keep at least one tab

    const index = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const nextTab = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextTab.id);
      setUrlInput(nextTab.url);
    }
  };

  // URL Bar Enter Handler
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = urlInput.trim().toLowerCase();

    if (query.includes('google.com') || query === 'google') {
      navigateCurrentTab('google', 'https://www.google.com', 'Google');
    } else if (query.includes('tmail') || query.includes('mail')) {
      navigateCurrentTab('tmail', 'https://tmail.khaitan.org/inbox', 'Tmail - Inbox');
    } else if (query.includes('amazon.ti')) {
      navigateCurrentTab('amazon_fake', 'https://www.amazon.ti/signin', 'Amazon.ti: Sign In');
    } else if (query.includes('amazon.com') || query === 'amazon') {
      navigateCurrentTab('amazon_legit', 'https://www.amazon.com/cyber-security-book', 'Amazon.com: Online Store');
    } else if (query.includes('school-cloud') || query.includes('downloads') || query.includes('cloud')) {
      navigateCurrentTab('download_portal', 'https://school-cloud.khaitan.org/downloads', 'School Cloud Downloads');
    } else if (query.includes('history') || query === 'chrome://history') {
      navigateCurrentTab('history', 'chrome://history', 'History');
    } else if (query.includes('party-rsvp') || query.includes('rsvp')) {
      navigateCurrentTab('party_invite', 'http://party-rsvp-event-verify.com/accept', 'Party RSVP Form');
    } else {
      // Default to Google search with query
      setSearchQuery(query);
      setHasSearched(true);
      navigateCurrentTab('google', `https://www.google.com/search?q=${encodeURIComponent(query)}`, `Google: ${query}`);
    }
  };

  // Refresh current tab
  const handleRefresh = () => {
    sound.playClick();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Mission 1 Actions
  const handleFakeAmazonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playError();
    setResultModal({
      isSuccess: false,
      title: 'Credential Theft Alert!',
      message: 'You entered your credentials into "amazon.ti" instead of "amazon.com". This was an unauthorized typosquatted clone intended to steal school login credentials. Check the address bar carefully next time!'
    });
  };

  const handleLegitAmazonOrder = () => {
    sound.playSuccess();
    setTask1Done(true);
    setActiveTaskId(2);
    onPointsEarned(150, 'Safe Shopper');
    confetti({ particleCount: 60, spread: 60 });
    setResultModal({
      isSuccess: true,
      title: 'Task 1 Completed: Safe Order Placed!',
      message: 'You spotted the verified amazon.com domain and avoided the sponsored typosquat trap! Next objective: Open Tmail and inspect Kabir\'s birthday party invitation.'
    });
  };

  // Mission 2 Actions
  const handlePartyFillDetails = () => {
    sound.playError();
    setResultModal({
      isSuccess: false,
      title: 'Phishing Trap Triggered!',
      message: 'You provided your school Tmail email and password on an untrusted third-party event website! Legitimate birthday invitations will never request your email password.'
    });
  };

  const handlePartyCloseWebsite = () => {
    sound.playSuccess();
    setTask2Done(true);
    setActiveTaskId(3);
    onPointsEarned(150, 'Phish Hunter');
    confetti({ particleCount: 65, spread: 60 });

    // Close the dangerous tab and return to Tmail
    const updatedTabs = tabs.filter(t => t.type !== 'party_invite');
    if (updatedTabs.length === 0) {
      setTabs([{ id: 'tab-tmail', title: 'Tmail - Inbox', url: 'https://tmail.khaitan.org/inbox', type: 'tmail', canClose: false }]);
      setActiveTabId('tab-tmail');
      setUrlInput('https://tmail.khaitan.org/inbox');
    } else {
      setTabs(updatedTabs);
      const tmailTab = updatedTabs.find(t => t.type === 'tmail') || updatedTabs[0];
      setActiveTabId(tmailTab.id);
      setUrlInput(tmailTab.url);
    }

    setResultModal({
      isSuccess: true,
      title: 'Task 2 Completed: Phishing Thwarted!',
      message: 'Sharp cyber intuition! You recognized an external credential-harvesting trap and safely closed the tab without submitting your password. Next objective: Go to School Cloud Downloads and acquire the project guide safely.'
    });
  };

  // Mission 3 Actions
  const handleFakeDownload = () => {
    sound.playError();
    setResultModal({
      isSuccess: false,
      title: 'Malware Dropped!',
      message: 'You clicked a deceptive green "DOWNLOAD .EXE" advertisement banner! Malicious actors hide trojans behind fake high-speed download buttons on educational sites.'
    });
  };

  const handleRealDownload = () => {
    sound.playSuccess();
    setTask3Done(true);
    onPointsEarned(200, 'Master Cyber Navigator');
    confetti({ particleCount: 100, spread: 80 });
    setResultModal({
      isSuccess: true,
      title: 'Task 3 Completed: Verified Document Downloaded!',
      message: 'Outstanding navigation! You ignored deceptive malvertising ads and downloaded the genuine project PDF document. You have completed all Browser Simulator defense tasks!'
    });
  };

  // History filtering
  const filteredHistory = historyLog.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(historySearchFilter.toLowerCase()) ||
      item.url.toLowerCase().includes(historySearchFilter.toLowerCase());
    
    if (!matchesSearch) return false;
    if (historyCategoryFilter === 'threats') {
      return item.category === 'phishing' || item.category === 'threat';
    }
    if (historyCategoryFilter === 'safe') {
      return item.category === 'safe';
    }
    return true;
  });

  const clearHistoryItem = (id: string) => {
    sound.playClick();
    setHistoryLog(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    sound.playClick();
    setHistoryLog([]);
  };

  // Completed task counter
  const completedCount = (task1Done ? 1 : 0) + (task2Done ? 1 : 0) + (task3Done ? 1 : 0);

  return (
    <div className={`transition-all ${isFullscreen ? 'fixed inset-0 z-50 p-2 bg-[#09090b]' : 'w-full space-y-4 pb-12'}`}>
      
      {/* Top Banner (Only shown when not full screen) */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0c0f] border-2 border-zinc-800 rounded-none px-4 py-3 comic-shadow blocky-card-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-white shrink-0 comic-shadow-sm">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9d9e99] uppercase tracking-widest font-bold">
                [ ACT.01 // FIELD SIMULATION ]
              </div>
              <h2 className="text-sm font-black text-white tracking-wide font-mono uppercase">
                Simulated Web Sandbox & Real-World Threat Defense
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTodoSidebar(!showTodoSidebar)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                showTodoSidebar
                  ? 'bg-white border-white text-black comic-shadow-sm'
                  : 'bg-[#141418] border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>MISSION LIST ({completedCount}/3)</span>
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white hover:bg-zinc-200 text-black font-black font-mono text-xs transition-transform active:translate-y-0.5 cursor-pointer comic-shadow uppercase blocky-btn"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>FULL SCREEN</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Browser Window Container */}
      <div className={`rounded-none border-2 border-zinc-800 bg-[#0c0c0f] comic-shadow-lg overflow-hidden flex flex-col blocky-card-dark ${
        isFullscreen ? 'h-full' : 'h-[calc(100vh-140px)] min-h-[700px]'
      }`}>
        
        {/* 1. Window Frame Strip (Mac Dots, Dynamic Tabs, Controls) */}
        <div className="bg-[#18181b] border-b border-zinc-800 px-3 pt-2 pb-0 flex items-center justify-between gap-2 overflow-x-auto select-none">
          {/* Window Control Dots */}
          <div className="flex items-center gap-2 mr-2 shrink-0">
            <div 
              onClick={() => setIsFullscreen(false)} 
              className="w-3 h-3 rounded-none bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors" 
              title="Close Fullscreen"
            />
            <div 
              onClick={() => handleRefresh()} 
              className="w-3 h-3 rounded-none bg-amber-500/80 hover:bg-amber-400 cursor-pointer transition-colors" 
              title="Reload Tab"
            />
            <div 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="w-3 h-3 rounded-none bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer transition-colors" 
              title="Toggle Fullscreen"
            />
          </div>

          {/* Dynamic Tabs Bar */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTabId(tab.id);
                    setUrlInput(tab.url);
                  }}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-medium cursor-pointer transition-colors shrink-0 max-w-[200px] border-t border-x ${
                    isActive
                      ? 'bg-[#0e0e10] text-white border-zinc-700/80'
                      : 'bg-[#141417] text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
                  }`}
                >
                  {tab.type === 'google' && <Search className="w-3 h-3 text-blue-400 shrink-0" />}
                  {tab.type === 'tmail' && <Mail className="w-3 h-3 text-red-400 shrink-0" />}
                  {tab.type === 'amazon_legit' && <ShoppingBag className="w-3 h-3 text-amber-400 shrink-0" />}
                  {tab.type === 'amazon_fake' && <ShoppingBag className="w-3 h-3 text-zinc-400 shrink-0" />}
                  {tab.type === 'party_invite' && <PartyPopper className="w-3 h-3 text-amber-400 shrink-0" />}
                  {tab.type === 'download_portal' && <Download className="w-3 h-3 text-blue-400 shrink-0" />}
                  {tab.type === 'history' && <History className="w-3 h-3 text-zinc-300 shrink-0" />}
                  {tab.type === 'newtab' && <Globe className="w-3 h-3 text-zinc-400 shrink-0" />}

                  <span className="truncate flex-1">{tab.title}</span>

                  {tab.canClose && (
                    <button
                      onClick={(e) => closeTab(e, tab.id)}
                      className="p-0.5 rounded-none hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="Close tab"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* New Tab Button */}
            <button
              onClick={() => openNewTab('newtab', 'chrome://newtab', 'New Tab')}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none transition-colors cursor-pointer shrink-0"
              title="Open New Tab"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Window Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowTodoSidebar(!showTodoSidebar)}
              className={`p-1.5 rounded-none text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showTodoSidebar ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle To-Do Checklist Sidebar"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono">{completedCount}/3</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-none transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Browser'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Navigation & Omnibox Bar */}
        <div className="bg-[#121214] border-b border-zinc-800 px-3 py-2 flex items-center gap-2 text-xs">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1 text-zinc-400 shrink-0">
            <button 
              onClick={() => {
                if (historyIndex > 0) {
                  sound.playClick();
                  const prevUrl = navHistory[historyIndex - 1];
                  setHistoryIndex(historyIndex - 1);
                  setUrlInput(prevUrl);
                }
              }} 
              disabled={historyIndex <= 0}
              className={`p-1 rounded-none cursor-pointer ${historyIndex > 0 ? 'hover:text-white hover:bg-zinc-800' : 'opacity-40 cursor-not-allowed'}`}
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                if (historyIndex < navHistory.length - 1) {
                  sound.playClick();
                  const nextUrl = navHistory[historyIndex + 1];
                  setHistoryIndex(historyIndex + 1);
                  setUrlInput(nextUrl);
                }
              }} 
              disabled={historyIndex >= navHistory.length - 1}
              className={`p-1 rounded-none cursor-pointer ${historyIndex < navHistory.length - 1 ? 'hover:text-white hover:bg-zinc-800' : 'opacity-40 cursor-not-allowed'}`}
              title="Forward"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleRefresh} 
              className={`p-1 hover:text-white rounded-none hover:bg-zinc-800 cursor-pointer transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
              title="Reload Page"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => navigateCurrentTab('google', 'https://www.google.com', 'Google')} 
              className="p-1 hover:text-white rounded-none hover:bg-zinc-800 cursor-pointer"
              title="Home Page"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Omnibox URL Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2 bg-[#18181b] border border-zinc-700/80 focus-within:border-zinc-400 rounded-none px-2.5 py-1 text-zinc-300 font-mono text-xs transition-colors">
            {/* Security Certificate Indicator (Neutral Lock / Info - Click to inspect) */}
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="cursor-pointer shrink-0"
              title="Click to view site security information and SSL certificate"
            >
              {urlInput.startsWith('https://') ? (
                <Lock className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-200" />
              ) : (
                <Info className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-200" />
              )}
            </button>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter web address..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
            />

            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* History Page Button */}
          <button
            onClick={() => {
              const existing = tabs.find(t => t.type === 'history');
              if (existing) {
                setActiveTabId(existing.id);
                setUrlInput(existing.url);
              } else {
                openNewTab('history', 'chrome://history', 'History');
              }
            }}
            className={`p-1.5 rounded-none hover:bg-zinc-800 transition-colors cursor-pointer ${
              activeTab.type === 'history' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Open Browsing History"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Bookmarks Strip */}
        <div className="bg-[#0e0e10] border-b border-zinc-800/80 px-4 py-1 flex items-center gap-4 text-xs text-zinc-400 overflow-x-auto select-none no-scrollbar">
          <button
            onClick={() => navigateCurrentTab('google', 'https://www.google.com', 'Google')}
            className="hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Search className="w-3 h-3 text-blue-400" />
            <span>Google</span>
          </button>

          <button
            onClick={() => navigateCurrentTab('tmail', 'https://tmail.khaitan.org/inbox', 'Tmail - Inbox')}
            className="hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Mail className="w-3 h-3 text-red-400" />
            <span>Tmail</span>
            {!task2Done && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          </button>

          <button
            onClick={() => navigateCurrentTab('download_portal', 'https://school-cloud.khaitan.org/downloads', 'School Cloud Downloads')}
            className="hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Download className="w-3 h-3 text-blue-400" />
            <span>School Cloud</span>
          </button>

          <button
            onClick={() => navigateCurrentTab('amazon_legit', 'https://www.amazon.com/cyber-security-book', 'Amazon.com: Online Store')}
            className="hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <ShoppingBag className="w-3 h-3 text-amber-400" />
            <span>Amazon Store</span>
          </button>

          <button
            onClick={() => {
              const existing = tabs.find(t => t.type === 'history');
              if (existing) {
                setActiveTabId(existing.id);
                setUrlInput(existing.url);
              } else {
                openNewTab('history', 'chrome://history', 'History');
              }
            }}
            className="hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 ml-auto"
          >
            <History className="w-3 h-3 text-zinc-300" />
            <span>chrome://history</span>
          </button>
        </div>

        {/* 4. Split Work Area: Main Viewport + Dedicated To-Do Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Web Viewport */}
          <div className="flex-1 bg-[#09090b] text-zinc-200 overflow-y-auto p-4 sm:p-6">
            
            {/* PAGE 1: GOOGLE SEARCH */}
            {activeTab.type === 'google' && (
              <div className="max-w-2xl mx-auto space-y-6 pt-4 animate-in fade-in duration-200">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold tracking-tight">
                    <span className="text-blue-400">G</span>
                    <span className="text-red-400">o</span>
                    <span className="text-yellow-400">o</span>
                    <span className="text-blue-400">g</span>
                    <span className="text-green-400">l</span>
                    <span className="text-red-400">e</span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setHasSearched(true);
                      recordHistory(`Google: ${searchQuery}`, `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, 'google');
                    }}
                    className="flex items-center gap-3 max-w-lg mx-auto bg-[#18181b] border-2 border-zinc-700 hover:border-zinc-400 rounded-none px-4 py-2.5 shadow-lg transition-colors"
                  >
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Google or type a URL..."
                      className="flex-1 bg-transparent text-white text-xs focus:outline-none font-mono"
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery('')}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>

                {/* Search Results (Neutral, un-biased styling - student must evaluate domains) */}
                {hasSearched && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <div className="text-xs text-zinc-400 font-mono flex items-center justify-between">
                      <span>Search results for: <strong className="text-white">{searchQuery}</strong></span>
                      <span className="text-[11px] text-zinc-500">About 2 results (0.18 seconds)</span>
                    </div>

                    {/* Result 1: Fake Typosquatted Amazon.ti */}
                    <div className="p-4 rounded-none bg-[#121214] border-2 border-zinc-800 hover:border-zinc-700 transition-colors space-y-1.5 blocky-card-dark">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-zinc-400 font-semibold">https://www.amazon.ti › clearance</span>
                      </div>
                      <button
                        onClick={() => navigateCurrentTab('amazon_fake', 'https://www.amazon.ti/signin', 'Amazon.ti: Sign In')}
                        className="text-sm font-semibold text-blue-400 hover:underline text-left block cursor-pointer"
                      >
                        Amazon Online Shopping - 90% Off Mega Student Clearance Deals!
                      </button>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Sign in immediately to claim limited student vouchers and discounted computer science hardware. Clearance promotion.
                      </p>
                    </div>

                    {/* Result 2: Real Amazon.com */}
                    <div className="p-4 rounded-none bg-[#121214] border-2 border-zinc-800 hover:border-zinc-700 transition-colors space-y-1.5 blocky-card-dark">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-zinc-400 font-semibold">https://www.amazon.com › textbooks</span>
                      </div>
                      <button
                        onClick={() => navigateCurrentTab('amazon_legit', 'https://www.amazon.com/cyber-security-book', 'Amazon.com: Online Store')}
                        className="text-sm font-semibold text-blue-400 hover:underline text-left block cursor-pointer"
                      >
                        Amazon.com: Cyber Security Essentials for School Students (Official)
                      </button>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Official verified educational textbook portal. Free school book program for registered institutions including The Khaitan School.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 2: FAKE AMAZON (AMAZON.TI) - NO SPOILER WARNINGS */}
            {activeTab.type === 'amazon_fake' && (
              <div className="max-w-sm mx-auto p-6 bg-[#121214] border-2 border-zinc-800 rounded-none space-y-4 text-center animate-in fade-in duration-200 blocky-card-dark">
                <div className="text-2xl font-bold tracking-tight text-white font-mono">
                  amazon<span className="text-amber-400">.ti</span>
                </div>

                <div className="text-xs font-semibold text-zinc-200">
                  Sign in to claim 90% School Discount Voucher
                </div>

                <form onSubmit={handleFakeAmazonSubmit} className="space-y-3 text-left">
                  <div>
                    <label className="text-[11px] text-zinc-400 font-mono">School Email or Mobile number</label>
                    <input
                      type="text"
                      required
                      value={fakeEmail}
                      onChange={(e) => setFakeEmail(e.target.value)}
                      placeholder="k-6764@thekhaitanschool.org"
                      className="w-full mt-1 bg-[#18181b] border-2 border-zinc-800 focus:border-zinc-500 rounded-none p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 font-mono">Password</label>
                    <input
                      type="password"
                      required
                      value={fakePass}
                      onChange={(e) => setFakePass(e.target.value)}
                      placeholder="Enter password"
                      className="w-full mt-1 bg-[#18181b] border-2 border-zinc-800 focus:border-zinc-500 rounded-none p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-none bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs cursor-pointer transition-colors shadow-md blocky-btn font-mono uppercase"
                  >
                    Sign in to Amazon.ti
                  </button>
                </form>

                <div className="pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => navigateCurrentTab('google', 'https://www.google.com', 'Google')}
                    className="text-xs text-zinc-400 hover:text-white underline cursor-pointer font-mono"
                  >
                    Return to Google Search
                  </button>
                </div>
              </div>
            )}

            {/* PAGE 3: REAL AMAZON (AMAZON.COM) */}
            {activeTab.type === 'amazon_legit' && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="text-xl font-bold text-white tracking-tight font-mono">
                    amazon<span className="text-amber-400">.com</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-950/20 border border-green-800/50 px-2 py-0.5 rounded-none">
                    <Lock className="w-3 h-3" />
                    <span>SSL 256-bit Encrypted • Verified Merchant</span>
                  </div>
                </div>

                <div className="p-5 bg-[#121214] border-2 border-zinc-800 rounded-none flex flex-col md:flex-row items-center gap-5 shadow-lg blocky-card-dark">
                  <div className="w-32 h-36 rounded-none bg-zinc-900 border-2 border-zinc-700 flex flex-col items-center justify-center text-white shrink-0 p-3 text-center">
                    <BookOpen className="w-10 h-10 text-zinc-300 mb-2" />
                    <span className="text-[10px] font-mono text-zinc-400 leading-tight">Khaitan Cyber Edition</span>
                  </div>

                  <div className="flex-1 space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-none bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700">
                        Official Curriculum
                      </span>
                      <span className="text-xs text-green-400 font-semibold font-mono">In Stock</span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      Cyber Security Essentials for School Students (2026 Edition)
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      National Cyber Security Mission authorized guide covering defensive browsing, phishing identification, authentication protocols, and social engineering mitigation.
                    </p>

                    <div className="flex items-baseline gap-2 pt-1 font-mono">
                      <span className="text-lg font-bold text-green-400">₹0.00</span>
                      <span className="text-xs text-zinc-500 line-through">₹850.00</span>
                      <span className="text-xs text-amber-400 font-semibold">(100% School Institutional Subsidy)</span>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <button
                      onClick={handleLegitAmazonOrder}
                      className="w-full md:w-auto px-5 py-3 rounded-none bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2 blocky-btn font-mono uppercase"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{task1Done ? 'Re-Order Textbook' : 'Place School Order (Free)'}</span>
                    </button>
                    {task1Done && (
                      <div className="text-[11px] text-green-400 text-center font-mono mt-2 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Task 1 Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 4: TMAIL (WEBMAIL INBOX) */}
            {activeTab.type === 'tmail' && (
              <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-base">Tmail Khaitan Webmail</span>
                      <div className="text-[10px] text-zinc-400 font-mono">Secure School Communications</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-zinc-300">student@thekhaitanschool.org</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Khaitan SafeMail Gateway Active</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Mail Folder & List */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-zinc-400 px-2 uppercase tracking-wider font-mono">
                      Inbox Messages
                    </div>

                    {/* Email Item 1 (Phishing Trigger) - Neutral active border */}
                    <div className="p-3 rounded-none bg-[#16161a] border-2 border-zinc-700 space-y-1 cursor-pointer blocky-card-dark">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Kabir Sharma</span>
                        <span className="text-[10px] text-zinc-500 font-mono">10:14 AM</span>
                      </div>
                      <div className="text-xs text-amber-300 font-medium truncate">
                        Birthday Party this Saturday! RSVP 🎉
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        Hey bro, I made an RSVP link...
                      </div>
                    </div>

                    {/* Email Item 2 */}
                    <div className="p-3 rounded-none bg-[#101012] border-2 border-zinc-800/80 space-y-1 opacity-70">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300">Principal Office</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Yesterday</span>
                      </div>
                      <div className="text-xs text-zinc-300 truncate">
                        National Cyber Security Week Schedule
                      </div>
                    </div>

                    {/* Email Item 3 */}
                    <div className="p-3 rounded-none bg-[#101012] border-2 border-zinc-800/80 space-y-1 opacity-70">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300">Science Faculty</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Sep 22</span>
                      </div>
                      <div className="text-xs text-zinc-300 truncate">
                        Download biology project templates from cloud
                      </div>
                    </div>
                  </div>

                  {/* Right: Message Reading Pane */}
                  <div className="md:col-span-2 bg-[#121214] border-2 border-zinc-800 rounded-none p-5 space-y-4 blocky-card-dark">
                    <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          Birthday Party this Saturday! You have to come 🎉
                        </h4>
                        <div className="text-xs text-zinc-400 mt-1">
                          From: <strong className="text-zinc-200">Kabir Sharma</strong> &lt;kabir.sharma@thekhaitanschool.org&gt;
                        </div>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">10:14 AM (Today)</span>
                    </div>

                    <div className="text-xs text-zinc-300 leading-relaxed space-y-3">
                      <p>Hey bro!</p>
                      <p>
                        I am celebrating my 16th birthday this Saturday evening at 6:30 PM! All the guys from Class 10 are coming over.
                      </p>
                      <p>
                        I made a digital party card online where you can select your meal and RSVP. Click the invitation card below to confirm!
                      </p>
                    </div>

                    {/* External Link Card in Email */}
                    <div className="p-4 rounded-none bg-[#18181b] border-2 border-zinc-700 text-center space-y-2.5 blocky-card-dark">
                      <PartyPopper className="w-8 h-8 text-amber-400 mx-auto" />
                      <div className="text-xs font-bold text-white">
                        Kabir's 16th Birthday Celebration Card
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        External Site: <code className="text-zinc-300 font-mono">http://party-rsvp-event-verify.com/accept</code>
                      </p>

                      <button
                        onClick={() => openNewTab('party_invite', 'http://party-rsvp-event-verify.com/accept', 'Party RSVP Form')}
                        className="px-4 py-2 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 blocky-btn font-mono uppercase"
                      >
                        <span>Click to Open Invitation Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {task2Done && (
                      <div className="p-3 rounded-none bg-green-950/20 border-2 border-green-800/60 text-xs text-green-300 flex items-center gap-2 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        <span>You inspected this link and successfully repelled the credential harvesting attack!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 5: PARTY RSVP PHISHING SITE - DE-BIASED CHOICES */}
            {activeTab.type === 'party_invite' && (
              <div className="max-w-md mx-auto p-6 bg-[#121214] border-2 border-zinc-800 rounded-none space-y-4 text-center animate-in fade-in duration-200 blocky-card-dark">
                <PartyPopper className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white font-mono">
                  Confirm Birthday Party Attendance
                </h3>

                <div className="bg-[#18181b] border-2 border-zinc-800 rounded-none p-3.5 text-left space-y-2.5 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 font-mono">Your Tmail Address</label>
                    <input
                      type="text"
                      readOnly
                      defaultValue="student@thekhaitanschool.org"
                      className="w-full mt-1 bg-zinc-900 border border-zinc-700/80 rounded-none p-2 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 font-mono">Tmail Account Password (Mandatory)</label>
                    <input
                      type="password"
                      placeholder="Enter your Tmail password"
                      className="w-full mt-1 bg-zinc-900 border border-zinc-700/80 rounded-none p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* De-biased, identical neutral button choices */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handlePartyFillDetails}
                    className="py-2.5 px-3 rounded-none border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs transition-colors cursor-pointer blocky-btn font-mono uppercase"
                  >
                    Submit RSVP Details
                  </button>

                  <button
                    onClick={handlePartyCloseWebsite}
                    className="py-2.5 px-3 rounded-none border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs transition-colors cursor-pointer blocky-btn font-mono uppercase"
                  >
                    Close Tab & Report Phish
                  </button>
                </div>
              </div>
            )}

            {/* PAGE 6: SCHOOL CLOUD DOWNLOADS */}
            {activeTab.type === 'download_portal' && (
              <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">School Cloud Storage Hub</h3>
                    <p className="text-xs text-zinc-400 font-mono">school-cloud.khaitan.org • Official Academic File Repository</p>
                  </div>
                  <span className="text-xs font-mono text-green-400 bg-green-950/20 px-2 py-0.5 rounded-none border border-green-800/40">
                    Network: Khaitan Intranet
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Deceptive Fake Malvertising Banner - Realistic neutral ad banner */}
                  <div className="p-4 rounded-none border-2 border-zinc-800 bg-[#121215] text-center space-y-2 blocky-card-dark">
                    <div className="text-[10px] uppercase font-mono text-zinc-500">
                      Sponsored Advertisement Banner
                    </div>

                    <button
                      onClick={handleFakeDownload}
                      className="py-3 px-6 rounded-none bg-green-500 hover:bg-green-400 text-black font-black text-sm cursor-pointer transition-colors shadow-lg animate-pulse blocky-btn font-mono uppercase"
                    >
                      ⚡ DOWNLOAD HERE (FREE .EXE HIGH SPEED SETUP)
                    </button>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      File: Bio_Project_Setup_Installer_v4.2.exe (142 MB) • Publisher: Unknown
                    </p>
                  </div>

                  {/* Real Document Link */}
                  <div className="p-4 rounded-none bg-[#121214] border-2 border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between shadow-sm blocky-card-dark">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-none bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-white shrink-0">
                        <FileText className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Class10_Biology_Project_Template.pdf
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Official PDF • 240 KB • Uploaded by Science Faculty
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRealDownload}
                      className="px-4 py-2 rounded-none bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 text-white font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5 blocky-btn font-mono"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{task3Done ? 'Downloaded ✓' : 'Download Document'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 7: FULL CHROME://HISTORY PAGE */}
            {activeTab.type === 'history' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
                {/* History Header & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-none bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-white">
                      <History className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">Browsing History & Security Audit</h3>
                      <p className="text-xs text-zinc-400 font-mono">chrome://history</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={historySearchFilter}
                        onChange={(e) => setHistorySearchFilter(e.target.value)}
                        placeholder="Search browsing history..."
                        className="bg-[#18181b] border-2 border-zinc-700/80 rounded-none pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 w-52 font-mono"
                      />
                    </div>

                    <button
                      onClick={clearAllHistory}
                      className="px-3 py-1.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors border-2 border-zinc-700 font-mono"
                    >
                      Clear Data
                    </button>
                  </div>
                </div>

                {/* Security Audit Telemetry Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-none bg-[#121214] border-2 border-zinc-800 space-y-1 blocky-card-dark">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Recorded Visits</div>
                    <div className="text-xl font-bold text-white font-mono">{historyLog.length}</div>
                  </div>

                  <div className="p-3.5 rounded-none bg-[#121214] border-2 border-zinc-800 space-y-1 blocky-card-dark">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Threats / Traps Encountered</div>
                    <div className="text-xl font-bold text-amber-400 font-mono">
                      {historyLog.filter(h => h.category === 'phishing' || h.category === 'threat').length}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-none bg-[#121214] border-2 border-zinc-800 space-y-1 blocky-card-dark">
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Threat Mitigation Rate</div>
                    <div className="text-xl font-bold text-green-400 font-mono">
                      {completedCount === 3 ? '100% (Flawless)' : `${Math.round((completedCount / 3) * 100)}%`}
                    </div>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setHistoryCategoryFilter('all')}
                    className={`px-3 py-1 rounded-none border-2 transition-colors cursor-pointer ${
                      historyCategoryFilter === 'all'
                        ? 'bg-zinc-800 border-zinc-600 text-white font-semibold'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    All Entries ({historyLog.length})
                  </button>

                  <button
                    onClick={() => setHistoryCategoryFilter('threats')}
                    className={`px-3 py-1 rounded-none border-2 transition-colors cursor-pointer ${
                      historyCategoryFilter === 'threats'
                        ? 'bg-red-950/30 border-red-500/60 text-red-300 font-semibold'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Threats & Traps ({historyLog.filter(h => h.category === 'phishing' || h.category === 'threat').length})
                  </button>

                  <button
                    onClick={() => setHistoryCategoryFilter('safe')}
                    className={`px-3 py-1 rounded-none border-2 transition-colors cursor-pointer ${
                      historyCategoryFilter === 'safe'
                        ? 'bg-green-950/30 border-green-500/60 text-green-300 font-semibold'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Safe Domains ({historyLog.filter(h => h.category === 'safe').length})
                  </button>
                </div>

                {/* Chronological Table List */}
                <div className="space-y-2">
                  {filteredHistory.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-xs bg-[#121214] rounded-none border-2 border-zinc-800 font-mono">
                      No browsing history found matching criteria.
                    </div>
                  ) : (
                    filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-none bg-[#121214] border-2 border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center justify-between gap-3 text-xs blocky-card-dark"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="font-mono text-zinc-500 text-[11px] shrink-0">
                            {item.timestamp}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white truncate">{item.title}</span>
                              
                              {/* Security Tag */}
                              {item.category === 'phishing' && (
                                <span className="px-1.5 py-0.2 rounded-none bg-red-950/60 border border-red-500/50 text-red-300 text-[10px] font-mono shrink-0">
                                  Typosquat Threat
                                </span>
                              )}
                              {item.category === 'threat' && (
                                <span className="px-1.5 py-0.2 rounded-none bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[10px] font-mono shrink-0">
                                  Credential Harvest
                                </span>
                              )}
                              {item.category === 'safe' && (
                                <span className="px-1.5 py-0.2 rounded-none bg-green-950/40 border border-green-600/40 text-green-300 text-[10px] font-mono shrink-0">
                                  Verified Safe
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] font-mono text-zinc-400 truncate">
                              {item.url}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => navigateCurrentTab(item.type, item.url, item.title)}
                            className="p-1.5 text-zinc-400 hover:text-white rounded-none hover:bg-zinc-800 cursor-pointer"
                            title="Visit URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => clearHistoryItem(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 rounded-none hover:bg-zinc-800 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PAGE 8: NEW TAB PAGE */}
            {activeTab.type === 'newtab' && (
              <div className="max-w-2xl mx-auto space-y-6 pt-8 text-center animate-in fade-in duration-200">
                <div className="text-3xl font-bold tracking-tight text-white font-mono uppercase">
                  Khaitan SafeBrowser
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Protected Sandbox Environment with Active Typosquat & Phishing Defense
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!searchQuery.trim()) return;
                    navigateCurrentTab('google', `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, `Google: ${searchQuery}`);
                  }}
                  className="flex items-center gap-3 max-w-lg mx-auto bg-[#18181b] border-2 border-zinc-700 rounded-none px-4 py-2.5 shadow-lg"
                >
                  <Search className="w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search with Google..."
                    className="flex-1 bg-transparent text-white text-xs focus:outline-none font-mono"
                  />
                </form>

                {/* Speed Dial Shortcuts */}
                <div className="pt-4">
                  <div className="text-xs font-semibold text-zinc-400 mb-3 font-mono uppercase">Quick Navigation Shortcuts</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                    <button
                      onClick={() => navigateCurrentTab('google', 'https://www.google.com', 'Google')}
                      className="p-3 bg-[#121214] border-2 border-zinc-800 hover:border-zinc-600 rounded-none space-y-1.5 transition-colors cursor-pointer text-center blocky-card-dark"
                    >
                      <Search className="w-5 h-5 text-blue-400 mx-auto" />
                      <div className="text-xs font-semibold text-white font-mono">Google</div>
                    </button>

                    <button
                      onClick={() => navigateCurrentTab('tmail', 'https://tmail.khaitan.org/inbox', 'Tmail - Inbox')}
                      className="p-3 bg-[#121214] border-2 border-zinc-800 hover:border-zinc-600 rounded-none space-y-1.5 transition-colors cursor-pointer text-center blocky-card-dark"
                    >
                      <Mail className="w-5 h-5 text-red-400 mx-auto" />
                      <div className="text-xs font-semibold text-white font-mono">Tmail</div>
                    </button>

                    <button
                      onClick={() => navigateCurrentTab('download_portal', 'https://school-cloud.khaitan.org/downloads', 'School Cloud Downloads')}
                      className="p-3 bg-[#121214] border-2 border-zinc-800 hover:border-zinc-600 rounded-none space-y-1.5 transition-colors cursor-pointer text-center blocky-card-dark"
                    >
                      <Download className="w-5 h-5 text-blue-400 mx-auto" />
                      <div className="text-xs font-semibold text-white font-mono">Cloud Files</div>
                    </button>

                    <button
                      onClick={() => openNewTab('history', 'chrome://history', 'History')}
                      className="p-3 bg-[#121214] border-2 border-zinc-800 hover:border-zinc-600 rounded-none space-y-1.5 transition-colors cursor-pointer text-center blocky-card-dark"
                    >
                      <History className="w-5 h-5 text-zinc-300 mx-auto" />
                      <div className="text-xs font-semibold text-white font-mono">History</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Mission To-Do Sidebar */}
          {showTodoSidebar && (
            <div className="w-80 border-l-2 border-zinc-800 bg-[#101013] flex flex-col shrink-0 select-none overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                    Mission Operations
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                    <ListTodo className="w-4 h-4 text-white" />
                    <span>To-Do Checklist</span>
                  </h4>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-green-400">
                    {completedCount}/3 Done
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {completedCount * 150 + (task3Done ? 50 : 0)} pts earned
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 h-1.5">
                <div 
                  className="bg-green-500 h-1.5 transition-all duration-300"
                  style={{ width: `${(completedCount / 3) * 100}%` }}
                />
              </div>

              {/* Tasks List */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {/* Task 1 */}
                <div className={`p-3.5 rounded-none border-2 transition-all blocky-card-dark ${
                  task1Done
                    ? 'bg-zinc-900/60 border-green-500/60'
                    : activeTaskId === 1
                    ? 'bg-zinc-900 border-zinc-600 shadow-md'
                    : 'bg-[#141416] border-zinc-800 opacity-60'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {task1Done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-none border border-zinc-500 flex items-center justify-center text-[10px] font-mono text-zinc-300">
                          1
                        </div>
                      )}
                      <span className="text-xs font-bold text-white font-mono">Safe Amazon Order</span>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-zinc-800 text-zinc-300 border border-zinc-700">
                      +150 pts
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    Search for "amazon" on Google. Spot and avoid typosquatted <code className="text-zinc-300">amazon.ti</code> ad, then order textbook on verified <code className="text-green-300">amazon.com</code>.
                  </p>

                  {!task1Done && (
                    <button
                      onClick={() => navigateCurrentTab('google', 'https://www.google.com/search?q=amazon', 'Google: amazon')}
                      className="mt-2.5 w-full py-1.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors blocky-btn font-mono"
                    >
                      <span>Jump to Task</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Task 2 */}
                <div className={`p-3.5 rounded-none border-2 transition-all blocky-card-dark ${
                  task2Done
                    ? 'bg-zinc-900/60 border-green-500/60'
                    : activeTaskId === 2
                    ? 'bg-zinc-900 border-zinc-600 shadow-md'
                    : 'bg-[#141416] border-zinc-800 opacity-60'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {task2Done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-none border border-zinc-500 flex items-center justify-center text-[10px] font-mono text-zinc-300">
                          2
                        </div>
                      )}
                      <span className="text-xs font-bold text-white font-mono">Inspect Party RSVP</span>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-zinc-800 text-zinc-300 border border-zinc-700">
                      +150 pts
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    Open Tmail inbox. Read Kabir's birthday invite. Recognize the credential-stealing RSVP form and safely choose <strong>Close Website</strong>.
                  </p>

                  {!task2Done && (
                    <button
                      onClick={() => navigateCurrentTab('tmail', 'https://tmail.khaitan.org/inbox', 'Tmail - Inbox')}
                      className="mt-2.5 w-full py-1.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors blocky-btn font-mono"
                    >
                      <span>Open Tmail Inbox</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Task 3 */}
                <div className={`p-3.5 rounded-none border-2 transition-all blocky-card-dark ${
                  task3Done
                    ? 'bg-zinc-900/60 border-green-500/60'
                    : activeTaskId === 3
                    ? 'bg-zinc-900 border-zinc-600 shadow-md'
                    : 'bg-[#141416] border-zinc-800 opacity-60'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {task3Done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-none border border-zinc-500 flex items-center justify-center text-[10px] font-mono text-zinc-300">
                          3
                        </div>
                      )}
                      <span className="text-xs font-bold text-white font-mono">Download Project PDF</span>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-none bg-zinc-800 text-zinc-300 border border-zinc-700">
                      +200 pts
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    Open School Cloud. Dodge deceptive green high-speed setup ad banners and acquire genuine biology template PDF.
                  </p>

                  {!task3Done && (
                    <button
                      onClick={() => navigateCurrentTab('download_portal', 'https://school-cloud.khaitan.org/downloads', 'School Cloud Downloads')}
                      className="mt-2.5 w-full py-1.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors blocky-btn font-mono"
                    >
                      <span>Go to School Cloud</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Completed Celebration Card */}
                {completedCount === 3 && (
                  <div className="p-4 rounded-none bg-green-950/30 border-2 border-green-500/60 text-center space-y-2 blocky-card-dark">
                    <ShieldCheck className="w-8 h-8 text-green-400 mx-auto" />
                    <div className="text-xs font-bold text-white font-mono uppercase">
                      All Objectives Completed!
                    </div>
                    <p className="text-[11px] text-green-300">
                      You earned +500 points and unlocked the Master Cyber Navigator Badge.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Certificate Inspector Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-sm w-full bg-[#141417] border-2 border-zinc-700 rounded-none p-5 text-left space-y-4 shadow-2xl blocky-card-dark">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span className="text-sm font-bold text-white font-mono">Site Security Information</span>
              </div>
              <button 
                onClick={() => setShowCertModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Current Host</div>
                <div className="text-white font-mono font-semibold mt-0.5">{urlInput}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Security Status</div>
                {activeTab.type === 'amazon_fake' || activeTab.type === 'party_invite' ? (
                  <div className="text-red-400 font-bold mt-0.5 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Untrusted / Malicious Phishing Indicator</span>
                  </div>
                ) : (
                  <div className="text-green-400 font-bold mt-0.5 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid TLS 1.3 Certificate (DigiCert Verified)</span>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Cookies & Data</div>
                <div className="text-zinc-300 mt-0.5 font-mono text-[11px]">Encrypted sandbox storage only.</div>
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(false)}
              className="w-full py-2 rounded-none bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs cursor-pointer transition-colors blocky-btn font-mono uppercase"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Outcome Result Modal */}
      {resultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[#121214] border-2 border-zinc-800 rounded-none p-6 text-center space-y-4 shadow-2xl blocky-card-dark">
            <div className={`w-12 h-12 mx-auto rounded-none flex items-center justify-center ${
              resultModal.isSuccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {resultModal.isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-mono">{resultModal.title}</h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-sans">
                {resultModal.message}
              </p>
            </div>

            <button
              onClick={() => setResultModal(null)}
              className="w-full py-2.5 rounded-none bg-white hover:bg-zinc-200 text-black font-semibold text-xs cursor-pointer transition-colors blocky-btn font-mono uppercase"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
