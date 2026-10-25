import React from 'react';
import { Trophy, Award, DollarSign, Users, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MatchResultModalProps {
  winnerIsUser: boolean;
  scoreUser: number;
  scoreOpponent: number;
  earnings: number;
  onClose: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  winnerIsUser,
  scoreUser,
  scoreOpponent,
  earnings,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-lg max-w-md w-full p-6 text-center shadow-2xl relative">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center">
          <Trophy className={`w-8 h-8 ${winnerIsUser ? 'text-[#d29922]' : 'text-gray-500'}`} />
        </div>

        <h2 className={`text-2xl font-black italic uppercase tracking-wider mb-1 ${winnerIsUser ? 'text-[#238636]' : 'text-[#f85149]'}`}>
          {winnerIsUser ? 'MATCH VICTORY!' : 'MATCH DEFEAT'}
        </h2>
        <p className="text-xs text-[#8b949e] mb-4">Official Esports Tournament Series Result</p>

        <div className="bg-[#0d1117] p-4 rounded border border-[#30363d] mb-6">
          <div className="text-3xl font-black text-white tracking-widest mb-3">
            {scoreUser} - {scoreOpponent}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#30363d] pt-3">
            <div>
              <span className="text-[10px] text-[#8b949e] block">Prize Reward</span>
              <span className="text-sm font-bold text-[#d29922]">+${earnings.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8b949e] block">New Fans</span>
              <span className="text-sm font-bold text-blue-400">+{winnerIsUser ? '1,500' : '200'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playCash();
            onClose();
          }}
          className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase tracking-wider rounded shadow-[0_0_15px_rgba(35,134,54,0.4)] cursor-pointer"
        >
          Return to HQ Dashboard
        </button>
      </div>
    </div>
  );
};
