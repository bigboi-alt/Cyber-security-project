import React from 'react';
import { Sparkles, Radio, Check, X, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../../utils/sound';

interface EasterEggModalProps {
  eggType: 'blue-comet' | 'red-star' | null;
  onClose: () => void;
  onClaimReward: (type: 'blue-comet' | 'red-star', points: number, badge: string) => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ eggType, onClose, onClaimReward }) => {
  if (!eggType) return null;

  const isComet = eggType === 'blue-comet';

  const title = isComet ? 'COSMIC PACKET INTERCEPTED!' : 'CLASSIFIED RED TEAM SATELLITE LOCATED!';
  const subtitle = isComet 
    ? 'You spotted the rare Blue Comet traversing the school orbital network.'
    : 'You locked onto the clandestine deep-space Red Team surveillance beacon.';
  const points = isComet ? 150 : 200;
  const badgeName = isComet ? 'Starlight Explorer' : 'Red Team Scout';

  const handleClaim = () => {
    sound.playSuccess();
    onClaimReward(eggType, points, badgeName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative max-w-md w-full rounded-2xl p-6 border shadow-2xl ${
        isComet 
          ? 'bg-gradient-to-b from-gray-900 to-sky-950/80 border-sky-500/50 shadow-sky-500/20' 
          : 'bg-gradient-to-b from-gray-900 to-rose-950/80 border-rose-500/50 shadow-rose-500/20'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
            isComet 
              ? 'bg-sky-500/20 border-sky-400/40 text-sky-400' 
              : 'bg-rose-500/20 border-rose-400/40 text-rose-400 animate-pulse'
          }`}>
            {isComet ? <Sparkles className="w-8 h-8" /> : <Radio className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase">
              <span className={`w-2 h-2 rounded-full ${isComet ? 'bg-sky-400' : 'bg-rose-500'}`} />
              <span className={isComet ? 'text-sky-300' : 'text-rose-300'}>Easter Egg Discovered</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          {subtitle} Your keen observation has provided classified telemetry for the Khaitan School Cyber Cell!
        </p>

        <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800/80 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Points for your Class:
            </span>
            <span className="font-mono font-bold text-emerald-400">+{points} PTS</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Exclusive Badge:
            </span>
            <span className="font-mono text-cyan-300 font-semibold">{badgeName}</span>
          </div>
        </div>

        <button
          onClick={handleClaim}
          className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isComet
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25'
              : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-500/25'
          }`}
        >
          <Check className="w-5 h-5" /> Claim Reward & Log to Class Squad
        </button>
      </div>
    </div>
  );
};
