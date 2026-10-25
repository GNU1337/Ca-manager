import React from 'react';
import { Volume2, VolumeX, Save, RotateCcw, Shield, Palette } from 'lucide-react';
import { GameState } from '../types/game';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  state: GameState;
  onUpdateState: (fn: (prev: GameState) => GameState) => void;
  onSave: () => void;
  onReset: () => void;
  onStartNextMatch: () => void;
  onOpenThemeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onUpdateState,
  onSave,
  onReset,
  onStartNextMatch,
  onOpenThemeModal
}) => {
  const toggleAudio = () => {
    soundFx.playClick();
    onUpdateState(prev => {
      const nextAudio = !prev.audioEnabled;
      soundFx.enabled = nextAudio;
      return { ...prev, audioEnabled: nextAudio };
    });
  };

  const activeTourn = state.tournaments.find(t => t.id === state.activeTournamentId);

  return (
    <header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3 md:px-6 shrink-0 relative z-30 select-none">
      {/* Team Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#238636] flex items-center justify-center rounded-sm font-black text-xl italic tracking-tighter text-white shadow-[0_0_15px_rgba(35,134,54,0.4)] border border-[#3fb950]/30">
          {state.teamTag || 'VG'}
        </div>
        <div>
          <h1 className="text-xs md:text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            {state.teamName}
            <span className="text-[10px] bg-[#21262d] text-[#238636] border border-[#30363d] px-1.5 py-0.5 rounded font-mono">
              S{state.season}-M{state.month}
            </span>
          </h1>
          <p className="text-[10px] md:text-xs text-[#238636] font-mono uppercase flex items-center gap-1 font-semibold">
            <Shield className="w-3 h-3 inline" /> Rank: Legend #{1}
          </p>
        </div>
      </div>

      {/* Global Economy & Next Match */}
      <div className="hidden sm:flex items-center gap-6 md:gap-10 font-mono">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Economy</span>
          <span className="text-lg md:text-xl text-[#d29922] font-bold tracking-tight">
            ${state.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Next Match</span>
          <span className="text-sm md:text-base text-white font-bold tracking-tight">
            {activeTourn ? activeTourn.name.substring(0, 18) + '...' : 'Practice Scrim'}
          </span>
        </div>
      </div>

      {/* Control Buttons & Sound */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenThemeModal();
          }}
          title="Change GUI Theme & Design"
          className="px-2.5 sm:px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider rounded border border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden md:inline">GUI Theme</span>
        </button>

        <button
          onClick={onStartNextMatch}
          className="px-3 md:px-5 py-2 bg-[#f85149] hover:bg-[#da3633] text-white font-black text-xs uppercase tracking-wider rounded-md active:scale-95 transition-all shadow-[0_0_12px_rgba(248,81,73,0.3)] flex items-center gap-1.5 cursor-pointer"
        >
          <span className="animate-pulse">●</span> MATCH DAY
        </button>

        <button
          onClick={toggleAudio}
          title={state.audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="p-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded border border-[#30363d] cursor-pointer transition-colors"
        >
          {state.audioEnabled ? <Volume2 className="w-4 h-4 text-[#238636]" /> : <VolumeX className="w-4 h-4 text-red-400" />}
        </button>

        <button
          onClick={onSave}
          title="Save Game"
          className="p-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded border border-[#30363d] cursor-pointer transition-colors"
        >
          <Save className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          title="Reset New Game"
          className="p-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-red-400 rounded border border-[#30363d] cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
