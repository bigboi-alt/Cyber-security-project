import React from 'react';
import { X, ExternalLink, Code, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface MetallicCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetallicCreditsModal: React.FC<MetallicCreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Brushed Titanium Metallic Card Container */}
      <div 
        className="relative max-w-md w-full rounded-2xl p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-[#9d9e99]/40 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #222225 0%, #161618 45%, #0d0d0f 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.8)'
        }}
      >
        {/* Subtle brushed metal sheen lines */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#9d9e99] to-transparent" />
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-zinc-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-5">
          {/* Header Badge */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600/80 flex items-center justify-center text-white shadow-inner mb-1">
              <Code className="w-5 h-5 text-[#9d9e99]" />
            </div>
            <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9d9e99]">
              Project Architects & Developers
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>Built by Arya & Akshaj</span>
              <Sparkles className="w-4 h-4 text-[#9d9e99]" />
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed pt-1">
              Engineered for The Khaitan School National Cyber Security Initiative.
            </p>
          </div>

          {/* GitHub Links Grid */}
          <div className="space-y-2.5 pt-2">
            {/* Arya */}
            <a
              href="https://github.com/bigboi-alt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181b]/90 border border-zinc-700/80 hover:border-[#9d9e99] hover:bg-zinc-800/80 transition-all text-xs group cursor-pointer shadow-md text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 group-hover:border-[#9d9e99] transition-colors">
                  <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-white flex items-center gap-1.5">
                    <span>Arya</span>
                    <span className="text-[10px] font-mono text-[#9d9e99]">@bigboi-alt</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    github.com/bigboi-alt
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* Akshaj */}
            <a
              href="https://github.com/01Akshaj-Maker"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181b]/90 border border-zinc-700/80 hover:border-[#9d9e99] hover:bg-zinc-800/80 transition-all text-xs group cursor-pointer shadow-md text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 group-hover:border-[#9d9e99] transition-colors">
                  <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-white flex items-center gap-1.5">
                    <span>Akshaj</span>
                    <span className="text-[10px] font-mono text-[#9d9e99]">@01Akshaj-Maker</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    github.com/01Akshaj-Maker
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </a>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/80 text-zinc-200 font-semibold text-xs transition-colors cursor-pointer shadow-inner"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
};

