import React, { useState } from 'react';
import { Player, PlayerMentality } from '../types/game';
import { soundFx } from '../utils/audio';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Trophy, Flame, Target, Shield, Zap, Brain, Crosshair, Award, TrendingUp, X } from 'lucide-react';

interface PlayerDetailModalProps {
  player: Player;
  onUpdateMentality?: (playerId: string, mentality: PlayerMentality) => void;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  onUpdateMentality,
  onClose
}) => {
  const [selectedMentality, setSelectedMentality] = useState<PlayerMentality>(
    player.mentality || 'Balanced'
  );

  const stats = player.stats;
  const kdRatio = (stats.kills / Math.max(1, stats.deaths)).toFixed(2);
  const winCount = stats.wins || Math.round(stats.matchesPlayed * 0.55);
  const lossCount = stats.losses || (stats.matchesPlayed - winCount);
  const winRate = ((winCount / Math.max(1, stats.matchesPlayed)) * 100).toFixed(1);
  const headshotPct = ((stats.headshots / Math.max(1, stats.kills)) * 100).toFixed(1);

  // Skill History for Recharts Line Chart
  const chartData = (player.skillHistory && player.skillHistory.length > 0)
    ? player.skillHistory.map(item => ({
        name: `Lvl ${item.level}`,
        Accuracy: item.accuracy,
        Reflexes: item.reflexes,
        Quickness: item.quickness,
        'Game IQ': item.gameIQ,
        Overall: item.overallRating
      }))
    : [
        { name: 'Lvl 1', Accuracy: Math.max(40, player.skills.accuracy - 15), Reflexes: Math.max(40, player.skills.reflexes - 15), Quickness: Math.max(40, player.skills.quickness - 15), 'Game IQ': Math.max(40, player.skills.gameIQ - 15), Overall: Math.max(40, player.overallRating - 15) },
        { name: `Lvl ${player.level}`, Accuracy: player.skills.accuracy, Reflexes: player.skills.reflexes, Quickness: player.skills.quickness, 'Game IQ': player.skills.gameIQ, Overall: player.overallRating }
      ];

  const handleMentalitySelect = (ment: PlayerMentality) => {
    soundFx.playClick();
    setSelectedMentality(ment);
    if (onUpdateMentality) {
      onUpdateMentality(player.id, ment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans select-none animate-fade-in">
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-2xl max-w-4xl w-full p-4 sm:p-6 text-[#e6edf3] shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header Title & Basic Info */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Retro Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#21262d] to-[#0d1117] border-2 border-amber-500/50 flex items-center justify-center text-2xl font-black text-amber-400 shadow-lg relative">
              {player.flagEmoji}
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-emerald-500 text-black font-black text-[10px] rounded-full shadow">
                Lvl {player.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  {player.name} <span className="text-amber-400">{player.nickname}</span>
                </h2>
                <span className="px-2.5 py-0.5 bg-[#21262d] border border-[#30363d] text-amber-300 font-bold text-xs rounded">
                  {player.role}
                </span>
                {player.potential && (
                  <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs rounded flex items-center gap-1">
                    ⚡ Potential: {player.potential} OVR
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8b949e] mt-1 flex items-center gap-3">
                <span>Age: {player.age} yrs</span>
                <span>•</span>
                <span>Country: {player.country}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Salary: ${player.salary.toLocaleString()}/mo</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 bg-[#21262d] hover:bg-red-900/40 text-[#8b949e] hover:text-red-400 border border-[#30363d] hover:border-red-500/50 rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Tactical Mentality Editor */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" /> Tactical Playstyle Mentality
            </h3>
            <span className="text-[10px] text-[#8b949e] font-mono">Impacts 2D Match Engine Behavior</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Aggressive' as PlayerMentality,
                label: 'Aggressive',
                desc: 'Pushes angles fast, +25% entry movement, seeks earlier firefights',
                color: 'border-red-500 bg-red-950/20 text-red-400'
              },
              {
                id: 'Balanced' as PlayerMentality,
                label: 'Balanced',
                desc: 'Standard tactical positioning, adapts to site callouts dynamically',
                color: 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
              },
              {
                id: 'Defensive' as PlayerMentality,
                label: 'Defensive',
                desc: 'Holds site cover, +15% recoil precision when stationary, escorts bomb',
                color: 'border-blue-500 bg-blue-950/20 text-blue-400'
              }
            ].map(ment => (
              <button
                key={ment.id}
                onClick={() => handleMentalitySelect(ment.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer active:scale-95 ${
                  selectedMentality === ment.id
                    ? `${ment.color} shadow-md`
                    : 'border-[#30363d] bg-[#161b22] text-[#8b949e] hover:border-[#8b949e]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs mb-1">
                  <span>{ment.label}</span>
                  {selectedMentality === ment.id && <span className="text-xs">✓ Active</span>}
                </div>
                <p className="text-[10px] leading-snug opacity-90">{ment.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Recharts Skill Development Line Chart */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Skill Development & Level Progression
            </h3>
            <span className="text-[10px] font-mono text-[#8b949e]">Level-by-Level Growth Trajectory</span>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="name" stroke="#8b949e" tick={{ fontSize: 11, fill: '#8b949e' }} />
                <YAxis domain={[30, 100]} stroke="#8b949e" tick={{ fontSize: 11, fill: '#8b949e' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="Overall" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Accuracy" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Reflexes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Quickness" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Game IQ" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 3: Lifetime Career Statistics */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 sm:p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-400" /> Lifetime Career Statistics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase block mb-1">Matches Played</span>
              <span className="text-lg sm:text-xl font-black text-white">{stats.matchesPlayed}</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase block mb-1">Win Rate</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{winRate}%</span>
              <span className="text-[10px] text-[#8b949e] block">{winCount}W - {lossCount}L</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase block mb-1">K / D Ratio</span>
              <span className="text-lg sm:text-xl font-black text-amber-400">{kdRatio}</span>
              <span className="text-[10px] text-[#8b949e] block">{stats.kills} K / {stats.deaths} D</span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg text-center">
              <span className="text-[10px] text-[#8b949e] font-bold uppercase block mb-1">Headshot %</span>
              <span className="text-lg sm:text-xl font-black text-red-400">{headshotPct}%</span>
              <span className="text-[10px] text-[#8b949e] block">{stats.headshots} HS Kills</span>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-[#30363d]">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
