import React from 'react';
import { Tournament, Team } from '../types/game';
import { Trophy, Award, Users, Play, Shield } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TournamentsSectionProps {
  tournaments: Tournament[];
  activeTournamentId: string | null;
  userCash: number;
  onJoinTournament: (tournamentId: string) => void;
  onStartMatch: (tournamentId: string) => void;
}

export const TournamentsSection: React.FC<TournamentsSectionProps> = ({
  tournaments,
  activeTournamentId,
  userCash,
  onJoinTournament,
  onStartMatch
}) => {
  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none">
      <div className="border-b border-[#30363d] pb-4">
        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          Leagues & Global Tournaments <Trophy className="w-5 h-5 text-[#d29922]" />
        </h2>
        <p className="text-[10px] md:text-xs text-[#8b949e] font-mono">
          Compete in ESL Open, IEM Masters & Valve Major Championships for ultimate glory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tournaments.map(t => {
          const isActive = t.id === activeTournamentId;
          const canAffordFee = userCash >= t.entryFee;

          return (
            <div
              key={t.id}
              className={`bg-[#161b22] border ${
                isActive ? 'border-[#238636] shadow-[0_0_15px_rgba(35,134,54,0.2)]' : 'border-[#30363d]'
              } p-4 rounded-md flex flex-col justify-between gap-4`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-mono font-bold uppercase bg-[#21262d] text-[#d29922] border border-[#30363d] px-2 py-0.5 rounded">
                    {t.tier}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase ${t.userJoined ? 'text-[#238636]' : 'text-[#8b949e]'}`}>
                    {t.userJoined ? 'REGISTERED' : t.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{t.name}</h3>

                <div className="mt-3 p-3 bg-[#0d1117] rounded border border-[#30363d] flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[9px] text-[#8b949e] uppercase block">Prize Pool</span>
                    <span className="text-base font-bold text-[#d29922]">${t.prizePool.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#8b949e] uppercase block">Entry Fee</span>
                    <span className="text-sm font-bold text-white">${t.entryFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Roster & Stage details */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#8b949e] text-[11px]">
                  <span>Teams Competing:</span>
                  <span className="text-white font-bold">{t.teams.length} World Teams</span>
                </div>
                <div className="flex justify-between text-[#8b949e] text-[11px]">
                  <span>Current Phase:</span>
                  <span className="text-emerald-400 font-bold">{t.currentRoundName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {t.userJoined ? (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onStartMatch(t.id);
                  }}
                  className="w-full py-3 bg-[#f85149] hover:bg-[#da3633] text-white text-xs font-mono font-black uppercase tracking-wider rounded shadow-[0_0_12px_rgba(248,81,73,0.3)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Enter Tactical Match Engine
                </button>
              ) : (
                <button
                  disabled={!canAffordFee}
                  onClick={() => {
                    soundFx.playCash();
                    onJoinTournament(t.id);
                  }}
                  className={`w-full py-2.5 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors ${
                    canAffordFee
                      ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-[0_0_12px_rgba(35,134,54,0.3)]'
                      : 'bg-gray-800 opacity-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAffordFee ? `Register Team ($${t.entryFee.toLocaleString()})` : 'Low Funds'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
