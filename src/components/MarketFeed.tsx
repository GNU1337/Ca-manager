import React from 'react';
import { GameState } from '../types/game';

interface MarketFeedProps {
  newsFeed: GameState['newsFeed'];
  winStreak: number;
  morale: number;
}

export const MarketFeed: React.FC<MarketFeedProps> = ({ newsFeed, winStreak, morale }) => {
  return (
    <aside className="w-64 bg-[#0d1117] border-l border-[#30363d] p-4 shrink-0 hidden lg:flex flex-col gap-4 select-none">
      <div className="text-xs font-black uppercase text-[#8b949e] border-b border-[#30363d] pb-2 tracking-widest flex justify-between items-center">
        <span>Market & HQ Feed</span>
        <span className="w-2 h-2 rounded-full bg-[#238636] animate-ping"></span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {newsFeed.map(item => (
          <div
            key={item.id}
            className={`p-2.5 bg-[#161b22] border-l-2 ${item.borderAccent || 'border-blue-500'} rounded-r-md border-t border-b border-r border-[#30363d]/50 hover:bg-[#1c2128] transition-colors`}
          >
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] text-white font-bold tracking-wide">{item.title}</span>
              <span className="text-[8px] text-[#8b949e] font-mono">{item.timestamp}</span>
            </div>
            <div className="text-[10px] text-[#8b949e] leading-tight">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Team Morale & Streak Widget */}
      <div className="bg-[#161b22] p-3 border border-[#30363d] rounded-md shadow-inner">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-white font-bold uppercase tracking-wider">Team Morale</span>
          <span className="text-[10px] font-mono font-bold text-blue-400">{morale}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#30363d] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all duration-500"
            style={{ width: `${morale}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[9px] text-[#8b949e] font-mono uppercase">
          <span>WIN STREAK: <strong className="text-[#238636] font-bold">{winStreak} MATCHES</strong></span>
        </div>
      </div>
    </aside>
  );
};
