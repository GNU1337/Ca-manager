import React, { useState } from 'react';
import { Player } from '../types/game';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerDetailModal } from './PlayerDetailModal';
import { Search, RefreshCw, ShoppingCart, Eye, Sparkles, Filter, Zap, Target } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TransferMarketProps {
  marketPlayers: Player[];
  userCash: number;
  onBuyPlayer: (player: Player) => void;
  onRefreshMarket: () => void;
  onScoutPlayer?: (playerId: string) => void;
  onScoutAllMarket?: () => void;
}

export const TransferMarket: React.FC<TransferMarketProps> = ({
  marketPlayers,
  userCash,
  onBuyPlayer,
  onRefreshMarket,
  onScoutPlayer,
  onScoutAllMarket
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [scoutAttributeFilter, setScoutAttributeFilter] = useState<string>('all');

  const INDIVIDUAL_SCOUT_COST = 1000;
  const GLOBAL_SCOUT_COST = 3500;

  const filteredPlayers = marketPlayers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;

    let matchesScoutFilter = true;
    if (scoutAttributeFilter === 'wonderkids') {
      matchesScoutFilter = (p.isScouted && p.potential >= 88) || p.overallRating >= 84;
    } else if (scoutAttributeFilter === 'aim') {
      matchesScoutFilter = p.skills.accuracy >= 85;
    } else if (scoutAttributeFilter === 'reflex') {
      matchesScoutFilter = p.skills.reflexes >= 85;
    } else if (scoutAttributeFilter === 'gameIQ') {
      matchesScoutFilter = p.skills.gameIQ >= 85;
    }

    return matchesSearch && matchesRole && matchesScoutFilter;
  });

  const handleInspect = (player: Player) => {
    soundFx.playClick();
    setSelectedPlayer(player);
  };

  const handleScoutSingle = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userCash < INDIVIDUAL_SCOUT_COST) return;
    soundFx.playCash();
    if (onScoutPlayer) {
      onScoutPlayer(player.id);
    }
  };

  const handleScoutAll = () => {
    if (userCash < GLOBAL_SCOUT_COST) return;
    soundFx.playCash();
    if (onScoutAllMarket) {
      onScoutAllMarket();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none font-mono">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#30363d] pb-4 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
            Global Transfer Market <ShoppingCart className="w-5 h-5 text-[#238636]" />
          </h2>
          <p className="text-[10px] md:text-xs text-[#8b949e]">
            Scout wonderkids, sign free agents, and reveal hidden potential
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Scouting Campaign Blitz Button */}
          {onScoutAllMarket && (
            <button
              disabled={userCash < GLOBAL_SCOUT_COST}
              onClick={handleScoutAll}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded border flex items-center gap-1.5 cursor-pointer transition-all ${
                userCash >= GLOBAL_SCOUT_COST
                  ? 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Eye className="w-4 h-4 text-purple-400" /> Scout All Market (${GLOBAL_SCOUT_COST.toLocaleString()})
            </button>
          )}

          {/* Refresh Market Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onRefreshMarket();
            }}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold uppercase rounded border border-[#30363d] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#238636]" /> New List
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#161b22] p-2.5 rounded-lg border border-[#30363d]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search player or nickname..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] text-white text-xs pl-8 pr-3 py-1.5 rounded focus:outline-hidden"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#30363d] text-white text-xs px-3 py-1.5 rounded focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="AWP Sniper">AWP Sniper</option>
          <option value="Entry Fragger">Entry Fragger</option>
          <option value="IGL">IGL</option>
          <option value="Support">Support</option>
          <option value="Lurker">Lurker</option>
          <option value="Flex">Flex</option>
        </select>

        {/* Attribute Scouting Filter */}
        <select
          value={scoutAttributeFilter}
          onChange={e => setScoutAttributeFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#30363d] text-purple-300 font-bold text-xs px-3 py-1.5 rounded focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Attribute Tiers</option>
          <option value="wonderkids">⭐ Wonderkids (Potential ≥ 88)</option>
          <option value="aim">🎯 Aim Elite (Accuracy ≥ 85)</option>
          <option value="reflex">⚡ Fast Reflexes (Reflexes ≥ 85)</option>
          <option value="gameIQ">🧠 High Game IQ (IQ ≥ 85)</option>
        </select>
      </div>

      {/* Market Players List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredPlayers.map(player => {
          const canAfford = userCash >= player.marketValue;
          const canAffordScout = userCash >= INDIVIDUAL_SCOUT_COST;

          return (
            <div
              key={player.id}
              className="bg-[#161b22] border border-[#30363d] hover:border-[#238636]/60 p-3 md:p-4 rounded-md flex flex-col gap-3 group transition-all relative"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 shrink-0">
                  <PlayerAvatar player={player} size="sm" />
                </div>
                <div className="flex-1 min-w-0 font-mono">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {player.name} <span>{player.flagEmoji}</span>
                  </div>
                  <div className="text-[10px] text-[#238636] font-bold truncate">{player.nickname}</div>
                  <div className="text-[9px] text-[#8b949e] uppercase font-bold mt-1">
                    {player.role} • Age {player.age}
                  </div>
                  <div className="text-[10px] text-[#d29922] font-bold mt-0.5">${player.marketValue.toLocaleString()}</div>
                </div>
              </div>

              {/* Requirement 4: Hidden Potential / Scouting Status */}
              <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-[#8b949e] font-bold uppercase">Potential Rating</div>
                  {player.isScouted ? (
                    <div className="text-xs font-black text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> {player.potential} Potential OVR
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-gray-400 italic">❓ Hidden Potential</div>
                  )}
                </div>

                {!player.isScouted && onScoutPlayer && (
                  <button
                    disabled={!canAffordScout}
                    onClick={e => handleScoutSingle(player, e)}
                    className={`px-2 py-1 text-[9px] font-bold uppercase rounded border transition-all cursor-pointer ${
                      canAffordScout
                        ? 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/50 text-purple-300'
                        : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Scout (${INDIVIDUAL_SCOUT_COST.toLocaleString()})
                  </button>
                )}
              </div>

              {/* Skills summary */}
              <div className="grid grid-cols-3 gap-1 bg-[#0d1117] p-2 rounded text-center font-mono text-[9px] border border-[#30363d]">
                <div>
                  <span className="text-[#8b949e] block">AIM</span>
                  <span className="text-white font-bold">{player.skills.accuracy}</span>
                </div>
                <div>
                  <span className="text-[#8b949e] block">REF</span>
                  <span className="text-white font-bold">{player.skills.reflexes}</span>
                </div>
                <div>
                  <span className="text-[#8b949e] block">IQ</span>
                  <span className="text-white font-bold">{player.skills.gameIQ}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleInspect(player)}
                  className="flex-1 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[10px] font-mono text-white rounded border border-[#30363d] cursor-pointer"
                >
                  Full Profile
                </button>

                <button
                  disabled={!canAfford}
                  onClick={() => {
                    soundFx.playCash();
                    onBuyPlayer(player);
                  }}
                  className={`flex-1 py-1.5 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-colors ${
                    canAfford
                      ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-[0_0_10px_rgba(35,134,54,0.3)]'
                      : 'bg-gray-700 opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Sign Player' : 'Low Cash'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};
