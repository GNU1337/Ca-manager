import React, { useState } from 'react';
import { Player, PlayerMentality, PlayerSkills } from '../types/game';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerDetailModal } from './PlayerDetailModal';
import { Shield, ArrowRightLeft, Users, Zap, Award, Flame, Crosshair, BarChart2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MainRosterProps {
  roster: Player[];
  bench: Player[];
  onSwapWithBench: (mainId: string, benchId: string) => void;
  onSetTraining: (playerId: string, focus: keyof PlayerSkills | 'balanced') => void;
  onSellPlayer: (player: Player) => void;
  onUpdateMentality?: (playerId: string, mentality: PlayerMentality) => void;
  onBatchSetMentality?: (mentality: PlayerMentality) => void;
}

export const MainRoster: React.FC<MainRosterProps> = ({
  roster,
  bench,
  onSwapWithBench,
  onSetTraining,
  onSellPlayer,
  onUpdateMentality,
  onBatchSetMentality
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);

  const avgAccuracy = Math.round(
    roster.reduce((acc, p) => acc + p.skills.accuracy, 0) / (roster.length || 1)
  );

  const teamChemistry = Math.round(
    roster.reduce((acc, p) => acc + (p.skills.gameIQ + p.skills.utility + p.morale) / 3, 0) / (roster.length || 1)
  );

  // Mentality Breakdown
  const aggressiveCount = roster.filter(p => p.mentality === 'Aggressive').length;
  const defensiveCount = roster.filter(p => p.mentality === 'Defensive').length;
  const balancedCount = roster.filter(p => (!p.mentality || p.mentality === 'Balanced')).length;

  const handleCardClick = (player: Player) => {
    soundFx.playClick();
    setSelectedPlayer(player);
  };

  const handleSwapClick = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    if (!swapSourceId) {
      setSwapSourceId(playerId);
    } else {
      if (swapSourceId !== playerId) {
        onSwapWithBench(swapSourceId, playerId);
      }
      setSwapSourceId(null);
    }
  };

  const handleQuickMentalityChange = (playerId: string, mentality: PlayerMentality, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    if (onUpdateMentality) {
      onUpdateMentality(playerId, mentality);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none">
      {/* Roster Header Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#30363d] pb-3 gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
            Active Squad <span className="text-[#238636]">[{roster.length}/5]</span>
          </h2>
          <p className="text-[10px] md:text-xs text-[#8b949e] font-mono">
            Main 5-Man Lineup & Tactical Playstyle Mentality Controls
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="bg-[#21262d] px-2.5 py-1 rounded border border-[#30363d] text-white">
            AVG ACCURACY: <strong className="text-[#238636]">{avgAccuracy}%</strong>
          </span>
          <span className="bg-[#21262d] px-2.5 py-1 rounded border border-[#30363d] text-white">
            TEAM CHEMISTRY: <strong className="text-blue-400">{teamChemistry}%</strong>
          </span>
        </div>
      </div>

      {/* Requirement 1: Tactical Formation Editor Banner */}
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="text-xs font-black uppercase text-amber-400 flex items-center gap-2 tracking-wider">
            <Crosshair className="w-4 h-4 text-amber-400" /> Tactical Squad Mentality Formation
          </h3>
          <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">
            Assign Aggressive, Balanced, or Defensive playstyles to alter 2D match engine movement & aim.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 bg-red-950/40 border border-red-500/30 text-red-400 rounded">
              🔥 Aggressive: {aggressiveCount}
            </span>
            <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded">
              ⚖️ Balanced: {balancedCount}
            </span>
            <span className="px-2 py-0.5 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded">
              🛡️ Defensive: {defensiveCount}
            </span>
          </div>
        </div>

        {/* Quick Batch Directives */}
        {onBatchSetMentality && (
          <div className="flex items-center gap-1.5 self-stretch md:self-auto">
            <span className="text-[10px] text-[#8b949e] uppercase font-bold hidden sm:inline">Set All:</span>
            <button
              onClick={() => {
                soundFx.playClick();
                onBatchSetMentality('Aggressive');
              }}
              className="flex-1 md:flex-none px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all active:scale-95"
            >
              🔥 All Aggressive
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onBatchSetMentality('Balanced');
              }}
              className="flex-1 md:flex-none px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all active:scale-95"
            >
              ⚖️ All Balanced
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onBatchSetMentality('Defensive');
              }}
              className="flex-1 md:flex-none px-2.5 py-1.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all active:scale-95"
            >
              🛡️ All Defensive
            </button>
          </div>
        )}
      </div>

      {swapSourceId && (
        <div className="bg-[#238636]/20 border border-[#238636] p-2.5 rounded-md text-xs font-mono text-emerald-300 flex justify-between items-center animate-pulse">
          <span>Select another player from Main or Bench to swap positions!</span>
          <button
            onClick={() => setSwapSourceId(null)}
            className="px-2 py-0.5 bg-black/40 hover:bg-black rounded text-[10px] uppercase font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 5 Card Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {roster.map(player => {
          const ment = player.mentality || 'Balanced';
          return (
            <div
              key={player.id}
              onClick={() => handleCardClick(player)}
              className={`bg-[#161b22] border-t-4 ${
                swapSourceId === player.id ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-[#238636]'
              } border-x border-b border-[#30363d] p-3 md:p-4 flex flex-col gap-2.5 group hover:bg-[#1c2128] transition-all cursor-pointer rounded-b-md relative`}
            >
              {/* Player Avatar */}
              <PlayerAvatar player={player} size="md" />

              {/* Mentality Selector Badge */}
              <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase text-[#8b949e]">Mentality</span>
                <div className="flex gap-1">
                  {(['Aggressive', 'Balanced', 'Defensive'] as PlayerMentality[]).map(m => (
                    <button
                      key={m}
                      onClick={e => handleQuickMentalityChange(player.id, m, e)}
                      title={`${m} Mentality`}
                      className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded cursor-pointer ${
                        ment === m
                          ? m === 'Aggressive'
                            ? 'bg-red-600 text-white'
                            : m === 'Defensive'
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                          : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                      }`}
                    >
                      {m === 'Aggressive' ? 'AGG' : m === 'Defensive' ? 'DEF' : 'BAL'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Skill Bars */}
              <div className="space-y-1.5 font-mono">
                <div>
                  <div className="flex justify-between items-center text-[9px] text-[#8b949e] uppercase font-bold tracking-wider mb-0.5">
                    <span>Accuracy</span>
                    <span className="text-[#238636]">{player.skills.accuracy}</span>
                  </div>
                  <div className="h-1 bg-[#30363d] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#238636]" style={{ width: `${player.skills.accuracy}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[9px] text-[#8b949e] uppercase font-bold tracking-wider mb-0.5">
                    <span>Reflexes</span>
                    <span className="text-[#238636]">{player.skills.reflexes}</span>
                  </div>
                  <div className="h-1 bg-[#30363d] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#238636]" style={{ width: `${player.skills.reflexes}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[9px] text-[#8b949e] uppercase font-bold tracking-wider mb-0.5">
                    <span>Game IQ</span>
                    <span className="text-blue-400">{player.skills.gameIQ}</span>
                  </div>
                  <div className="h-1 bg-[#30363d] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${player.skills.gameIQ}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Stats & Growth Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(player);
                }}
                className="w-full py-1 bg-[#21262d] hover:bg-[#30363d] text-[9px] font-mono text-amber-400 rounded border border-[#30363d] flex items-center justify-center gap-1 cursor-pointer"
              >
                <BarChart2 className="w-3 h-3 text-amber-400" /> Lifetime Stats & Skill Growth
              </button>

              {/* Footer Role & Level */}
              <div className="mt-auto pt-2 border-t border-[#30363d] flex items-center justify-between font-mono text-[9px]">
                <span className="uppercase text-[#8b949e] font-bold truncate max-w-[90px]">{player.role}</span>
                <span className="uppercase text-[#d29922] font-bold">Lvl {player.level}</span>
              </div>

              {/* Swap Button */}
              <button
                onClick={(e) => handleSwapClick(player.id, e)}
                title="Swap Player"
                className="w-full py-1 bg-[#21262d] hover:bg-[#30363d] text-[10px] font-mono text-white rounded border border-[#30363d] flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowRightLeft className="w-3 h-3 text-[#238636]" /> Swap
              </button>
            </div>
          );
        })}
      </div>

      {/* Bench / Reserves Section */}
      <div className="mt-4 border-t border-[#30363d] pt-4">
        <h3 className="text-sm font-black uppercase text-[#8b949e] mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#238636]" /> Bench & Reserves ({bench.length})
        </h3>

        {bench.length === 0 ? (
          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded text-center text-xs text-[#8b949e] font-mono">
            No bench players. Visit the Transfer Market to sign backup talent!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {bench.map(player => (
              <div
                key={player.id}
                onClick={() => handleCardClick(player)}
                className={`bg-[#161b22] border ${
                  swapSourceId === player.id ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'border-[#30363d]'
                } p-3 rounded flex items-center gap-3 hover:bg-[#1c2128] cursor-pointer transition-colors`}
              >
                <div className="w-12 h-16 shrink-0">
                  <PlayerAvatar player={player} size="sm" />
                </div>
                <div className="flex-1 min-w-0 font-mono">
                  <div className="text-xs font-bold text-white truncate">{player.name}</div>
                  <div className="text-[10px] text-[#238636] truncate">{player.nickname} • {player.role}</div>
                  <div className="text-[9px] text-[#8b949e]">OVR: {player.overallRating} • Lvl {player.level}</div>
                </div>
                <button
                  onClick={(e) => handleSwapClick(player.id, e)}
                  className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[10px] font-mono text-white rounded border border-[#30363d] shrink-0"
                >
                  Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onUpdateMentality={onUpdateMentality}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

