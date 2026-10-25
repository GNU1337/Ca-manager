import React, { useState, useEffect } from 'react';
import { GameState, Player, PlayerMentality, PlayerSkills, Tournament } from './types/game';
import { loadGameState, saveGameState, getDefaultGameState, clearGameState } from './utils/storage';
import { soundFx } from './utils/audio';
import { generateRandomPlayer, calculateOverallRating } from './utils/playerGen';
import { getThemeStyles } from './utils/theme';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { MarketFeed } from './components/MarketFeed';
import { MainRoster } from './components/MainRoster';
import { TransferMarket } from './components/TransferMarket';
import { FacilitiesAndTraining } from './components/FacilitiesAndTraining';
import { StaffSection } from './components/StaffSection';
import { TournamentsSection } from './components/TournamentsSection';
import { LeagueView } from './components/LeagueView';
import { MatchEngine2D } from './components/MatchEngine2D';
import { MatchResultModal } from './components/MatchResultModal';
import { ThemeSelectorModal, GUITheme } from './components/ThemeSelectorModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState<{
    tournamentId: string;
    opponentTeam: Player[];
    opponentName: string;
    opponentTag: string;
    prizeMoney: number;
  } | null>(null);

  const themeStyles = getThemeStyles(gameState.theme);

  const handleSelectTheme = (theme: GUITheme) => {
    setGameState(prev => ({ ...prev, theme }));
  };

  const [matchResult, setMatchResult] = useState<{
    winnerIsUser: boolean;
    scoreUser: number;
    scoreOpponent: number;
    earnings: number;
  } | null>(null);

  // Auto-save state
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Handle Tab Switch
  const handleSelectTab = (tab: GameState['activeTab']) => {
    setGameState(prev => ({ ...prev, activeTab: tab }));
  };

  // Requirement 1: Set Player Mentality (Aggressive, Balanced, Defensive)
  const handleUpdateMentality = (playerId: string, mentality: PlayerMentality) => {
    setGameState(prev => {
      const updateP = (p: Player) => (p.id === playerId ? { ...p, mentality } : p);
      return {
        ...prev,
        roster: prev.roster.map(updateP),
        bench: prev.bench.map(updateP)
      };
    });
  };

  // Requirement 1: Batch Set Starting Roster Mentality
  const handleBatchSetMentality = (mentality: PlayerMentality) => {
    setGameState(prev => ({
      ...prev,
      roster: prev.roster.map(p => ({ ...p, mentality }))
    }));
  };

  // Requirement 4: Scout Individual Market Player ($1,000)
  const handleScoutPlayer = (playerId: string) => {
    if (gameState.cash < 1000) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - 1000,
      transferMarket: prev.transferMarket.map(p => (p.id === playerId ? { ...p, isScouted: true } : p))
    }));
  };

  // Requirement 4: Scout All Market Players ($3,500)
  const handleScoutAllMarket = () => {
    if (gameState.cash < 3500) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - 3500,
      transferMarket: prev.transferMarket.map(p => ({ ...p, isScouted: true }))
    }));
  };

  // Roster Swap with Bench
  const handleSwapWithBench = (mainId: string, benchId: string) => {
    setGameState(prev => {
      const rosterIdx = prev.roster.findIndex(p => p.id === mainId);
      const benchIdx = prev.bench.findIndex(p => p.id === benchId);

      if (rosterIdx !== -1 && benchIdx !== -1) {
        const newRoster = [...prev.roster];
        const newBench = [...prev.bench];
        const temp = newRoster[rosterIdx];
        newRoster[rosterIdx] = newBench[benchIdx];
        newBench[benchIdx] = temp;
        return { ...prev, roster: newRoster, bench: newBench };
      }

      // If both are in roster
      if (rosterIdx !== -1) {
        const otherRosterIdx = prev.roster.findIndex(p => p.id === benchId);
        if (otherRosterIdx !== -1) {
          const newRoster = [...prev.roster];
          const temp = newRoster[rosterIdx];
          newRoster[rosterIdx] = newRoster[otherRosterIdx];
          newRoster[otherRosterIdx] = temp;
          return { ...prev, roster: newRoster };
        }
      }

      return prev;
    });
  };

  // Set Player Training Focus
  const handleSetTraining = (playerId: string, focus: keyof PlayerSkills | 'balanced') => {
    setGameState(prev => {
      const updateP = (p: Player) => (p.id === playerId ? { ...p, trainingFocus: focus } : p);
      return {
        ...prev,
        roster: prev.roster.map(updateP),
        bench: prev.bench.map(updateP)
      };
    });
  };

  // Sell Player to Market
  const handleSellPlayer = (player: Player) => {
    setGameState(prev => {
      const isMain = prev.roster.some(p => p.id === player.id);
      const newRoster = prev.roster.filter(p => p.id !== player.id);
      const newBench = prev.bench.filter(p => p.id !== player.id);

      // Add news feed
      const newNews = [
        {
          id: 'news_' + Date.now(),
          title: 'PLAYER SOLD',
          detail: `${player.name} transferred for $${player.marketValue.toLocaleString()}`,
          type: 'transfer' as const,
          timestamp: 'Just now',
          borderAccent: 'border-red-500'
        },
        ...prev.newsFeed.slice(0, 5)
      ];

      return {
        ...prev,
        cash: prev.cash + player.marketValue,
        roster: newRoster,
        bench: newBench,
        newsFeed: newNews
      };
    });
  };

  // Buy Player from Market
  const handleBuyPlayer = (player: Player) => {
    if (gameState.cash < player.marketValue) return;

    setGameState(prev => {
      const updatedMarket = prev.transferMarket.filter(p => p.id !== player.id);
      const targetList = prev.roster.length < 5 ? 'roster' : 'bench';
      const updatedRoster = targetList === 'roster' ? [...prev.roster, player] : prev.roster;
      const updatedBench = targetList === 'bench' ? [...prev.bench, player] : prev.bench;

      const newNews = [
        {
          id: 'news_' + Date.now(),
          title: 'NEW SIGNING',
          detail: `Signed ${player.name} for $${player.marketValue.toLocaleString()}`,
          type: 'transfer' as const,
          timestamp: 'Just now',
          borderAccent: 'border-green-500'
        },
        ...prev.newsFeed.slice(0, 5)
      ];

      return {
        ...prev,
        cash: prev.cash - player.marketValue,
        roster: updatedRoster,
        bench: updatedBench,
        transferMarket: updatedMarket,
        newsFeed: newNews
      };
    });
  };

  // Refresh Transfer Market
  const handleRefreshMarket = () => {
    const newMarket: Player[] = [];
    for (let i = 0; i < 8; i++) {
      newMarket.push(generateRandomPlayer(65, 94));
    }
    setGameState(prev => ({
      ...prev,
      transferMarket: newMarket
    }));
  };

  // Upgrade Facility
  const handleUpgradeFacility = (facilityId: string) => {
    setGameState(prev => {
      const updated = prev.facilities.map(fac => {
        if (fac.id === facilityId) {
          const cost = Math.round(fac.baseCost * Math.pow(fac.costMultiplier, fac.level));
          if (prev.cash >= cost && fac.level < fac.maxLevel) {
            return { ...fac, level: fac.level + 1 };
          }
        }
        return fac;
      });

      const targetFac = prev.facilities.find(f => f.id === facilityId);
      const cost = targetFac ? Math.round(targetFac.baseCost * Math.pow(targetFac.costMultiplier, targetFac.level)) : 0;

      return {
        ...prev,
        cash: prev.cash - cost,
        facilities: updated
      };
    });
  };

  // Staff Recruitment
  const handleHireStaff = (staffId: string) => {
    setGameState(prev => {
      const target = prev.hiredStaff.find(s => s.id === staffId);
      if (!target || prev.cash < target.hireCost) return prev;

      return {
        ...prev,
        cash: prev.cash - target.hireCost,
        hiredStaff: prev.hiredStaff.map(s => (s.id === staffId ? { ...s, isHired: true } : s))
      };
    });
  };

  const handleFireStaff = (staffId: string) => {
    setGameState(prev => ({
      ...prev,
      hiredStaff: prev.hiredStaff.map(s => (s.id === staffId ? { ...s, isHired: false } : s))
    }));
  };

  // Join Tournament
  const handleJoinTournament = (tournamentId: string) => {
    setGameState(prev => {
      const tourn = prev.tournaments.find(t => t.id === tournamentId);
      if (!tourn || prev.cash < tourn.entryFee) return prev;

      return {
        ...prev,
        cash: prev.cash - tourn.entryFee,
        activeTournamentId: tournamentId,
        tournaments: prev.tournaments.map(t => (t.id === tournamentId ? { ...t, userJoined: true } : t))
      };
    });
  };

  // Launch Match Engine
  const handleStartMatch = (tournamentId: string) => {
    const tourn = gameState.tournaments.find(t => t.id === tournamentId) || gameState.tournaments[0];
    const rivals = ['NaVi', 'FaZe', 'Vitality', 'G2', 'Astralis', 'Liquid', 'Heroic'];
    const oppName = rivals[Math.floor(Math.random() * rivals.length)];
    const oppTeam: Player[] = [];
    for (let i = 0; i < 5; i++) {
      oppTeam.push(generateRandomPlayer(75, 92));
    }

    setActiveMatch({
      tournamentId,
      opponentTeam: oppTeam,
      opponentName: oppName,
      opponentTag: oppName.substring(0, 3).toUpperCase(),
      prizeMoney: tourn ? tourn.prizePool : 50000
    });
  };

  // Match Completed Handler
  const handleMatchComplete = (
    winnerIsUser: boolean,
    scoreUser: number,
    scoreOpponent: number,
    earnings: number
  ) => {
    setActiveMatch(null);

    // Apply Player Experience & Leveling & Track Lifetime Stats
    setGameState(prev => {
      const upgradePlayerXP = (p: Player) => {
        const xpGain = winnerIsUser ? 150 : 50;
        const newXP = p.xp + xpGain;
        let newLvl = p.level;
        let newSkills = { ...p.skills };

        const leveledUp = newXP >= 300;
        if (leveledUp) {
          newLvl += 1;
          // Boost focused skill or random skill
          const focusKey = p.trainingFocus && p.trainingFocus !== 'balanced' ? p.trainingFocus : 'accuracy';
          newSkills[focusKey] = Math.min(99, newSkills[focusKey] + 1);
        }

        const newOvr = calculateOverallRating(newSkills, p.role);

        // Update skill history for Recharts line chart visualization
        const currentHistory = p.skillHistory || [];
        const newHistory = leveledUp
          ? [
              ...currentHistory,
              {
                level: newLvl,
                accuracy: newSkills.accuracy,
                reflexes: newSkills.reflexes,
                quickness: newSkills.quickness,
                gameIQ: newSkills.gameIQ,
                overallRating: newOvr,
                timestamp: `Lvl ${newLvl}`
              }
            ]
          : currentHistory;

        // Lifetime stats tracking
        const pKills = Math.floor(Math.random() * 15) + 10;
        const pDeaths = Math.floor(Math.random() * 14) + 8;
        const pAssists = Math.floor(Math.random() * 6) + 2;
        const pHeadshots = Math.floor(Math.random() * 8) + 2;
        const pMvps = winnerIsUser && Math.random() > 0.6 ? 1 : 0;

        const updatedStats = {
          matchesPlayed: (p.stats?.matchesPlayed || 0) + 1,
          wins: (p.stats?.wins || 0) + (winnerIsUser ? 1 : 0),
          losses: (p.stats?.losses || 0) + (winnerIsUser ? 0 : 1),
          kills: (p.stats?.kills || 0) + pKills,
          deaths: (p.stats?.deaths || 0) + pDeaths,
          assists: (p.stats?.assists || 0) + pAssists,
          headshots: (p.stats?.headshots || 0) + pHeadshots,
          mvps: (p.stats?.mvps || 0) + pMvps,
          rating: Number((1.0 + (pKills / Math.max(1, pDeaths) - 1.0) * 0.4).toFixed(2))
        };

        return {
          ...p,
          level: newLvl,
          xp: newXP % 300,
          skills: newSkills,
          overallRating: newOvr,
          skillHistory: newHistory,
          stats: updatedStats
        };
      };

      return {
        ...prev,
        cash: prev.cash + earnings,
        winStreak: winnerIsUser ? prev.winStreak + 1 : 0,
        morale: Math.min(100, Math.max(50, winnerIsUser ? prev.morale + 5 : prev.morale - 8)),
        roster: prev.roster.map(upgradePlayerXP),
        bench: prev.bench.map(upgradePlayerXP)
      };
    });

    setMatchResult({
      winnerIsUser,
      scoreUser,
      scoreOpponent,
      earnings
    });
  };

  return (
    <div className={`w-full h-screen ${themeStyles.appBg} ${themeStyles.textPrimary} font-sans flex flex-col overflow-hidden relative select-none transition-colors duration-300`}>
      {/* CRT Scanline Retro Visual Overlay (conditionally rendered per theme) */}
      {themeStyles.scanlines && (
        <div
          className="absolute inset-0 pointer-events-none z-40 opacity-15"
          style={{
            background:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 4px, 3px 100%'
          }}
        ></div>
      )}

      {/* Header Bar */}
      <Header
        state={gameState}
        onUpdateState={setGameState}
        onSave={() => {
          soundFx.playCash();
          saveGameState(gameState);
        }}
        onReset={() => {
          soundFx.playClick();
          if (window.confirm('Reset and start a fresh CS Manager campaign?')) {
            clearGameState();
            setGameState(getDefaultGameState());
          }
        }}
        onStartNextMatch={() => handleStartMatch(gameState.activeTournamentId || 'tourn_open')}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex flex-1 overflow-hidden relative pb-14 md:pb-0">
        {/* Sidebar Nav (Desktop) */}
        <Sidebar
          activeTab={gameState.activeTab}
          onSelectTab={handleSelectTab}
          staffCount={gameState.hiredStaff.filter(s => s.isHired).length}
        />

        {/* Dynamic Tab Content */}
        <main className={`flex-1 flex flex-col overflow-hidden ${themeStyles.appBg}`}>
          {gameState.activeTab === 'roster' && (
            <MainRoster
              roster={gameState.roster}
              bench={gameState.bench}
              onSwapWithBench={handleSwapWithBench}
              onSetTraining={handleSetTraining}
              onSellPlayer={handleSellPlayer}
              onUpdateMentality={handleUpdateMentality}
              onBatchSetMentality={handleBatchSetMentality}
            />
          )}

          {gameState.activeTab === 'market' && (
            <TransferMarket
              marketPlayers={gameState.transferMarket}
              userCash={gameState.cash}
              onBuyPlayer={handleBuyPlayer}
              onRefreshMarket={handleRefreshMarket}
              onScoutPlayer={handleScoutPlayer}
              onScoutAllMarket={handleScoutAllMarket}
            />
          )}

          {gameState.activeTab === 'facilities' && (
            <FacilitiesAndTraining
              facilities={gameState.facilities}
              userCash={gameState.cash}
              onUpgradeFacility={handleUpgradeFacility}
            />
          )}

          {gameState.activeTab === 'staff' && (
            <StaffSection
              staffList={gameState.hiredStaff}
              userCash={gameState.cash}
              onHireStaff={handleHireStaff}
              onFireStaff={handleFireStaff}
            />
          )}

          {gameState.activeTab === 'league' && (
            <LeagueView
              state={gameState}
              onStartMatch={handleStartMatch}
            />
          )}

          {gameState.activeTab === 'tournaments' && (
            <TournamentsSection
              tournaments={gameState.tournaments}
              activeTournamentId={gameState.activeTournamentId}
              userCash={gameState.cash}
              onJoinTournament={handleJoinTournament}
              onStartMatch={handleStartMatch}
            />
          )}
        </main>

        {/* Right Feed Panel (Desktop) */}
        <MarketFeed
          newsFeed={gameState.newsFeed}
          winStreak={gameState.winStreak}
          morale={gameState.morale}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={gameState.activeTab} onSelectTab={handleSelectTab} />

      {/* Active 2D Tactical Match Overlay */}
      {activeMatch && (
        <MatchEngine2D
          userTeam={gameState.roster}
          opponentTeam={activeMatch.opponentTeam}
          opponentName={activeMatch.opponentName}
          opponentTag={activeMatch.opponentTag}
          mapName="de_dust"
          prizeMoney={activeMatch.prizeMoney}
          onMatchComplete={handleMatchComplete}
          onExit={() => setActiveMatch(null)}
        />
      )}

      {/* End of Match Wrap-up Modal */}
      {matchResult && (
        <MatchResultModal
          winnerIsUser={matchResult.winnerIsUser}
          scoreUser={matchResult.scoreUser}
          scoreOpponent={matchResult.scoreOpponent}
          earnings={matchResult.earnings}
          onClose={() => setMatchResult(null)}
        />
      )}

      {/* GUI Theme Switcher Modal */}
      {isThemeModalOpen && (
        <ThemeSelectorModal
          currentTheme={gameState.theme || 'hltv'}
          onSelectTheme={handleSelectTheme}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}
    </div>
  );
}
