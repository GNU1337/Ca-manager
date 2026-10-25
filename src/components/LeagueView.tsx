import React, { useState } from 'react';
import { GameState, LeagueStanding, LeagueFixture, PlayerLeaderboardEntry } from '../types/game';
import { Trophy, Shield, Award, Users, Target, Flame, TrendingUp, ChevronRight, Play, Calendar, Zap, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LeagueViewProps {
  state: GameState;
  onStartMatch: (tournamentId: string) => void;
}

export const LeagueView: React.FC<LeagueViewProps> = ({ state, onStartMatch }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'leaderboards' | 'fixtures' | 'prizes'>('standings');
  const [selectedDivision, setSelectedDivision] = useState<'premier' | 'challenger' | 'open'>('premier');
  const [selectedWeek, setSelectedWeek] = useState<number>(8);

  // Derive or construct the 10-team Global Pro League table
  // Incorporating user's real team performance (wins, losses, winStreak)
  const userTeamWins = Math.max(state.winStreak > 0 ? state.winStreak + 3 : 5, 5);
  const userTeamLosses = Math.max(2, 8 - userTeamWins);
  const userRoundsWon = userTeamWins * 13 + userTeamLosses * 8;
  const userRoundsLost = userTeamWins * 7 + userTeamLosses * 13;
  const userRoundDiff = userRoundsWon - userRoundsLost;
  const userPoints = userTeamWins * 3;

  const rawStandings: LeagueStanding[] = [
    {
      position: 1,
      teamId: 'team_navi',
      teamName: 'Natus Vincere',
      teamTag: 'NaVi',
      color: '#facc15',
      isUser: false,
      played: 8,
      won: 7,
      lost: 1,
      otWins: 1,
      roundsWon: 104,
      roundsLost: 62,
      roundDiff: +42,
      points: 21,
      form: ['W', 'W', 'W', 'L', 'W'],
      streak: 'W1'
    },
    {
      position: 2,
      teamId: 'team_faze',
      teamName: 'FaZe Clan',
      teamTag: 'FaZe',
      color: '#ef4444',
      isUser: false,
      played: 8,
      won: 6,
      lost: 2,
      otWins: 0,
      roundsWon: 98,
      roundsLost: 70,
      roundDiff: +28,
      points: 18,
      form: ['W', 'L', 'W', 'W', 'W'],
      streak: 'W3'
    },
    {
      position: 3,
      teamId: 'user_team',
      teamName: state.teamName || 'Vortex Gaming',
      teamTag: state.teamTag || 'VG',
      color: '#238636',
      isUser: true,
      played: 8,
      won: userTeamWins,
      lost: userTeamLosses,
      otWins: 1,
      roundsWon: userRoundsWon,
      roundsLost: userRoundsLost,
      roundDiff: userRoundDiff,
      points: userPoints,
      form: state.winStreak >= 3 ? ['W', 'W', 'W', 'W', 'W'] : ['W', 'L', 'W', 'W', 'W'],
      streak: `W${state.winStreak || 1}`
    },
    {
      position: 4,
      teamId: 'team_vitality',
      teamName: 'Team Vitality',
      teamTag: 'VIT',
      color: '#eab308',
      isUser: false,
      played: 8,
      won: 5,
      lost: 3,
      otWins: 0,
      roundsWon: 92,
      roundsLost: 78,
      roundDiff: +14,
      points: 15,
      form: ['L', 'W', 'W', 'L', 'W'],
      streak: 'W1'
    },
    {
      position: 5,
      teamId: 'team_g2',
      teamName: 'G2 Esports',
      teamTag: 'G2',
      color: '#ffffff',
      isUser: false,
      played: 8,
      won: 4,
      lost: 4,
      otWins: 1,
      roundsWon: 85,
      roundsLost: 88,
      roundDiff: -3,
      points: 12,
      form: ['W', 'L', 'L', 'W', 'L'],
      streak: 'L1'
    },
    {
      position: 6,
      teamId: 'team_astralis',
      teamName: 'Astralis',
      teamTag: 'AST',
      color: '#dc2626',
      isUser: false,
      played: 8,
      won: 4,
      lost: 4,
      otWins: 0,
      roundsWon: 81,
      roundsLost: 86,
      roundDiff: -5,
      points: 12,
      form: ['L', 'W', 'L', 'L', 'W'],
      streak: 'W1'
    },
    {
      position: 7,
      teamId: 'team_liquid',
      teamName: 'Team Liquid',
      teamTag: 'TL',
      color: '#3b82f6',
      isUser: false,
      played: 8,
      won: 3,
      lost: 5,
      otWins: 0,
      roundsWon: 74,
      roundsLost: 91,
      roundDiff: -17,
      points: 9,
      form: ['W', 'L', 'L', 'W', 'L'],
      streak: 'L1'
    },
    {
      position: 8,
      teamId: 'team_heroic',
      teamName: 'Heroic',
      teamTag: 'HRC',
      color: '#f97316',
      isUser: false,
      played: 8,
      won: 3,
      lost: 5,
      otWins: 0,
      roundsWon: 70,
      roundsLost: 93,
      roundDiff: -23,
      points: 9,
      form: ['L', 'L', 'W', 'L', 'L'],
      streak: 'L2'
    },
    {
      position: 9,
      teamId: 'team_mouz',
      teamName: 'MOUZ Esports',
      teamTag: 'MOUZ',
      color: '#e11d48',
      isUser: false,
      played: 8,
      won: 2,
      lost: 6,
      otWins: 0,
      roundsWon: 65,
      roundsLost: 96,
      roundDiff: -31,
      points: 6,
      form: ['L', 'L', 'L', 'W', 'L'],
      streak: 'L1'
    },
    {
      position: 10,
      teamId: 'team_nip',
      teamName: 'Ninjas in Pyjamas',
      teamTag: 'NIP',
      color: '#10b981',
      isUser: false,
      played: 8,
      won: 1,
      lost: 7,
      otWins: 0,
      roundsWon: 58,
      roundsLost: 102,
      roundDiff: -44,
      points: 3,
      form: ['L', 'L', 'L', 'L', 'L'],
      streak: 'L5'
    }
  ];

  // Sort standings strictly by points then roundDiff
  const sortedStandings = [...rawStandings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.roundDiff - a.roundDiff;
  }).map((item, index) => ({
    ...item,
    position: index + 1
  }));

  const userPosition = sortedStandings.find(s => s.isUser)?.position || 3;

  // Player MVP Leaderboards
  const userStarPlayer = state.roster[0] || { name: 'Ivan Petrov', nickname: "'s1mple-jr'", role: 'AWP Sniper' };
  const userSecondPlayer = state.roster[2] || { name: 'Oliver Rossi', nickname: "'EntryGod'", role: 'Entry Fragger' };

  const playerLeaderboard: PlayerLeaderboardEntry[] = [
    {
      playerId: 'star_1',
      name: userStarPlayer.name,
      nickname: userStarPlayer.nickname,
      teamTag: state.teamTag || 'VG',
      role: userStarPlayer.role,
      rating: 1.34,
      kdRatio: 1.48,
      headshotPct: 58.4,
      adr: 94.2,
      mvps: 18,
      isUserPlayer: true
    },
    {
      playerId: 'zywoo',
      name: 'Mathieu Herbaut',
      nickname: "'ZywOo'",
      teamTag: 'VIT',
      role: 'AWP Sniper',
      rating: 1.31,
      kdRatio: 1.42,
      headshotPct: 44.8,
      adr: 91.5,
      mvps: 16
    },
    {
      playerId: 'simple',
      name: 'Oleksandr Kostyliev',
      nickname: "'s1mple'",
      teamTag: 'NaVi',
      role: 'AWP Sniper',
      rating: 1.29,
      kdRatio: 1.39,
      headshotPct: 42.1,
      adr: 88.7,
      mvps: 15
    },
    {
      playerId: 'monesy',
      name: 'Ilya Osipov',
      nickname: "'m0NESY'",
      teamTag: 'G2',
      role: 'AWP Sniper',
      rating: 1.25,
      kdRatio: 1.32,
      headshotPct: 41.5,
      adr: 85.0,
      mvps: 13
    },
    {
      playerId: 'star_2',
      name: userSecondPlayer.name,
      nickname: userSecondPlayer.nickname,
      teamTag: state.teamTag || 'VG',
      role: userSecondPlayer.role,
      rating: 1.22,
      kdRatio: 1.26,
      headshotPct: 64.2,
      adr: 86.4,
      mvps: 11,
      isUserPlayer: true
    },
    {
      playerId: 'frozen',
      name: 'David Čerňanský',
      nickname: "'frozen'",
      teamTag: 'FaZe',
      role: 'Rifler',
      rating: 1.19,
      kdRatio: 1.21,
      headshotPct: 56.1,
      adr: 82.3,
      mvps: 9
    },
    {
      playerId: 'brollan',
      name: 'Ludvig Brolin',
      nickname: "'Brollan'",
      teamTag: 'MOUZ',
      role: 'Entry Fragger',
      rating: 1.16,
      kdRatio: 1.15,
      headshotPct: 59.8,
      adr: 80.1,
      mvps: 8
    }
  ];

  // Schedule & Fixtures for Week 8
  const fixturesWeek8: LeagueFixture[] = [
    {
      id: 'fix_1',
      week: 8,
      homeTeam: state.teamName || 'Vortex Gaming',
      homeTag: state.teamTag || 'VG',
      awayTeam: 'FaZe Clan',
      awayTag: 'FaZe',
      status: 'Upcoming',
      isUserMatch: true
    },
    {
      id: 'fix_2',
      week: 8,
      homeTeam: 'Natus Vincere',
      homeTag: 'NaVi',
      awayTeam: 'Team Vitality',
      awayTag: 'VIT',
      status: 'Completed',
      homeScore: 13,
      awayScore: 9,
      winner: 'Natus Vincere'
    },
    {
      id: 'fix_3',
      week: 8,
      homeTeam: 'G2 Esports',
      homeTag: 'G2',
      awayTeam: 'Astralis',
      awayTag: 'AST',
      status: 'Completed',
      homeScore: 11,
      awayScore: 13,
      winner: 'Astralis'
    },
    {
      id: 'fix_4',
      week: 8,
      homeTeam: 'Team Liquid',
      homeTag: 'TL',
      awayTeam: 'Heroic',
      awayTag: 'HRC',
      status: 'Completed',
      homeScore: 13,
      awayScore: 7,
      winner: 'Team Liquid'
    },
    {
      id: 'fix_5',
      week: 8,
      homeTeam: 'MOUZ Esports',
      homeTag: 'MOUZ',
      awayTeam: 'Ninjas in Pyjamas',
      awayTag: 'NIP',
      status: 'Completed',
      homeScore: 13,
      awayScore: 6,
      winner: 'MOUZ Esports'
    }
  ];

  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none font-mono">
      {/* Top Pro League Title & Season Status Card */}
      <div className="bg-[#161b22] border border-[#30363d] p-4 md:p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" /> Global Pro Circuit • Season {state.season || 1}
            </span>
            <span className="text-[10px] text-[#8b949e] font-bold">Week {selectedWeek} / 14</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white flex items-center gap-2">
            ESL Premier Championship League
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            10 World-Class Squads battling for the $150,000 Prize Pool & Major Championship Seeds.
          </p>
        </div>

        {/* User Team Quick Standing Widget */}
        <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] p-3 rounded-md w-full md:w-auto justify-between md:justify-start">
          <div className="text-center md:text-left">
            <span className="text-[9px] uppercase text-[#8b949e] font-bold block">Your Standing</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${userPosition <= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                #{userPosition}
              </span>
              <span className="text-xs font-bold text-white uppercase">{state.teamName}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#30363d]" />

          <div className="text-right">
            <span className="text-[9px] uppercase text-[#8b949e] font-bold block">Playoff Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <Shield className="w-3.5 h-3.5" />
              {userPosition <= 4 ? 'Major Seed (Top 4)' : 'Challenger Zone'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Division Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-[#30363d] pb-3">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'standings', label: 'Standings Table', icon: Trophy },
            { id: 'leaderboards', label: 'MVP Leaderboards', icon: Award },
            { id: 'fixtures', label: 'Schedule & Fixtures', icon: Calendar },
            { id: 'prizes', label: 'Prizes & Seeds', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`min-h-[40px] px-3 py-2 text-xs font-bold uppercase rounded-md border cursor-pointer active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#238636] border-[#3fb950] text-white shadow-[0_0_12px_rgba(35,134,54,0.4)]'
                    : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Division Selector */}
        <div className="flex items-center gap-1 bg-[#161b22] p-1 border border-[#30363d] rounded-md shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedDivision('premier');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded cursor-pointer ${
              selectedDivision === 'premier' ? 'bg-[#238636] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Premier (Div 1)
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedDivision('challenger');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded cursor-pointer ${
              selectedDivision === 'challenger' ? 'bg-[#238636] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Challenger (Div 2)
          </button>
        </div>
      </div>

      {/* TAB 1: STANDINGS TABLE */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          {/* Next Match Callout Banner */}
          <div className="bg-gradient-to-r from-[#161b22] via-[#21262d] to-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg italic shadow-md">
                VS
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Next League Match • Week 8</span>
                <h4 className="text-sm font-bold text-white uppercase">
                  {state.teamName} <span className="text-[#8b949e]">vs</span> FaZe Clan (#2)
                </h4>
                <span className="text-[11px] text-[#8b949e]">Crucial top-3 seeding battle on de_dust!</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onStartMatch(state.activeTournamentId || 'tourn_open');
              }}
              className="w-full md:w-auto min-h-[44px] px-6 py-2.5 bg-[#f85149] hover:bg-[#da3633] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(248,81,73,0.4)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Play Next League Match
            </button>
          </div>

          {/* Standings Table Container */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase text-[10px] border-b border-[#30363d]">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">Pos</th>
                    <th className="py-3 px-3">Team</th>
                    <th className="py-3 px-2 text-center">MP</th>
                    <th className="py-3 px-2 text-center">W</th>
                    <th className="py-3 px-2 text-center">L</th>
                    <th className="py-3 px-2 text-center">OTW</th>
                    <th className="py-3 px-2 text-center">RW-RL</th>
                    <th className="py-3 px-2 text-center">RD</th>
                    <th className="py-3 px-3 text-center font-bold text-white">PTS</th>
                    <th className="py-3 px-3 text-center hidden sm:table-cell">Form</th>
                    <th className="py-3 px-3 text-center hidden md:table-cell">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/50">
                  {sortedStandings.map(row => {
                    const isPlayoffZone = row.position <= 4;
                    const isRelegationZone = row.position >= 9;

                    return (
                      <tr
                        key={row.teamId}
                        className={`transition-colors ${
                          row.isUser
                            ? 'bg-[#238636]/15 hover:bg-[#238636]/25 border-l-4 border-l-[#238636]'
                            : 'hover:bg-[#21262d]'
                        }`}
                      >
                        {/* Position with qualification badge indicator */}
                        <td className="py-3 px-3 text-center font-bold">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${
                              isPlayoffZone
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black'
                                : isRelegationZone
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-[#21262d] text-[#8b949e]'
                            }`}
                          >
                            {row.position}
                          </span>
                        </td>

                        {/* Team Info */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-black text-black shadow-sm shrink-0"
                              style={{ backgroundColor: row.color }}
                            >
                              {row.teamTag}
                            </div>
                            <div className="flex flex-col">
                              <span className={`font-bold uppercase ${row.isUser ? 'text-emerald-300 font-black' : 'text-white'}`}>
                                {row.teamName}
                                {row.isUser && (
                                  <span className="ml-2 text-[9px] bg-[#238636] text-white px-1.5 py-0.5 rounded font-mono">
                                    YOU
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-[#8b949e]">
                                {isPlayoffZone ? '🏆 Major Seed' : isRelegationZone ? '⚠️ Relegation Risk' : 'Mid Table'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Matches Played */}
                        <td className="py-3 px-2 text-center text-[#8b949e]">{row.played}</td>
                        {/* Wins */}
                        <td className="py-3 px-2 text-center text-emerald-400 font-bold">{row.won}</td>
                        {/* Losses */}
                        <td className="py-3 px-2 text-center text-[#f85149]">{row.lost}</td>
                        {/* Overtime Wins */}
                        <td className="py-3 px-2 text-center text-amber-400">{row.otWins}</td>
                        {/* Rounds Won - Lost */}
                        <td className="py-3 px-2 text-center text-[#8b949e]">
                          {row.roundsWon}-{row.roundsLost}
                        </td>
                        {/* Round Diff */}
                        <td
                          className={`py-3 px-2 text-center font-bold ${
                            row.roundDiff > 0 ? 'text-emerald-400' : row.roundDiff < 0 ? 'text-red-400' : 'text-[#8b949e]'
                          }`}
                        >
                          {row.roundDiff > 0 ? `+${row.roundDiff}` : row.roundDiff}
                        </td>
                        {/* Points */}
                        <td className="py-3 px-3 text-center text-base font-black text-white bg-black/20">
                          {row.points}
                        </td>
                        {/* Form Badges */}
                        <td className="py-3 px-3 text-center hidden sm:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {row.form.map((f, i) => (
                              <span
                                key={i}
                                className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                                  f === 'W'
                                    ? 'bg-[#238636] text-white'
                                    : f === 'OTW'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-red-900/80 text-red-300'
                                }`}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        {/* Streak */}
                        <td className="py-3 px-3 text-center text-[#8b949e] font-bold hidden md:table-cell">{row.streak}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Zone Legend */}
            <div className="p-3 bg-[#0d1117] border-t border-[#30363d] flex flex-wrap items-center justify-between text-[10px] text-[#8b949e] gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Top 1-4: Major Championship Playoffs ($100k)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#30363d]" /> 5-8: Mid-Table Safety
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-red-500" /> 9-10: Relegation Playoff
                </span>
              </div>

              <span>Standard CS Scoring: 3 Pts per Win • 0 Pts Loss</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MVP & FRAGGER LEADERBOARDS */}
      {activeTab === 'leaderboards' && (
        <div className="space-y-4">
          <div className="border-b border-[#30363d] pb-2">
            <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> League Rating 2.0 Leaderboard
            </h3>
            <p className="text-xs text-[#8b949e]">Top performing CS players across all 10 tournament franchises</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase text-[10px] border-b border-[#30363d]">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">Rank</th>
                    <th className="py-3 px-3">Player</th>
                    <th className="py-3 px-2 text-center">Role</th>
                    <th className="py-3 px-3 text-center font-bold text-white">Rating 2.0</th>
                    <th className="py-3 px-2 text-center">K/D</th>
                    <th className="py-3 px-2 text-center">HS %</th>
                    <th className="py-3 px-2 text-center">ADR</th>
                    <th className="py-3 px-3 text-center">MVPs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/50">
                  {playerLeaderboard.map((player, idx) => (
                    <tr
                      key={player.playerId}
                      className={`transition-colors ${
                        player.isUserPlayer ? 'bg-[#238636]/15 hover:bg-[#238636]/25 font-bold' : 'hover:bg-[#21262d]'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${
                            idx === 0
                              ? 'bg-amber-400 text-black'
                              : idx === 1
                              ? 'bg-gray-300 text-black'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'text-[#8b949e]'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] font-bold">
                            {player.teamTag}
                          </span>
                          <div>
                            <span className={`text-white uppercase ${player.isUserPlayer ? 'text-emerald-300 font-bold' : ''}`}>
                              {player.nickname}
                            </span>
                            <span className="text-[10px] text-[#8b949e] block">{player.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center text-[#8b949e]">{player.role}</td>
                      <td className="py-3 px-3 text-center text-sm font-black text-amber-400 bg-black/20">
                        {player.rating.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-center text-emerald-400 font-bold">{player.kdRatio.toFixed(2)}</td>
                      <td className="py-3 px-2 text-center text-[#8b949e]">{player.headshotPct.toFixed(1)}%</td>
                      <td className="py-3 px-2 text-center text-white">{player.adr.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center text-amber-400 font-bold">{player.mvps} ⭐️</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE & FIXTURES */}
      {activeTab === 'fixtures' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
            <div>
              <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Week {selectedWeek} Match Fixtures
              </h3>
              <p className="text-xs text-[#8b949e]">Regular Season schedule & round results</p>
            </div>

            {/* Week Selector */}
            <div className="flex items-center gap-1">
              {[7, 8, 9].map(w => (
                <button
                  key={w}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedWeek(w);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                    selectedWeek === w ? 'bg-[#238636] text-white' : 'bg-[#161b22] text-[#8b949e] border border-[#30363d]'
                  }`}
                >
                  Week {w}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fixturesWeek8.map(fix => (
              <div
                key={fix.id}
                className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${
                  fix.isUserMatch
                    ? 'bg-[#161b22] border-[#238636] shadow-[0_0_15px_rgba(35,134,54,0.3)]'
                    : 'bg-[#161b22] border-[#30363d]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                  <span>WEEK {fix.week} • MATCHDAY</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase ${
                      fix.status === 'Completed' ? 'bg-[#21262d] text-[#8b949e]' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {fix.status}
                  </span>
                </div>

                <div className="flex items-center justify-between font-bold text-sm">
                  {/* Home Team */}
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white uppercase">{fix.homeTeam}</span>
                    <span className="text-[10px] text-[#8b949e]">({fix.homeTag})</span>
                  </div>

                  {/* Score or VS */}
                  <div className="px-3 py-1 bg-[#0d1117] rounded border border-[#30363d] text-center font-black">
                    {fix.status === 'Completed' ? (
                      <span className="text-white text-xs">
                        {fix.homeScore} : {fix.awayScore}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs">VS</span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-[10px] text-[#8b949e]">({fix.awayTag})</span>
                    <span className="text-white uppercase">{fix.awayTeam}</span>
                  </div>
                </div>

                {fix.isUserMatch && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onStartMatch(state.activeTournamentId || 'tourn_open');
                    }}
                    className="w-full min-h-[40px] py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase rounded cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Launch Live Fixture
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRIZES & SEEDS */}
      {activeTab === 'prizes' && (
        <div className="space-y-4">
          <div className="border-b border-[#30363d] pb-2">
            <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#d29922]" /> Season 1 Prize Pool & Qualification Seeds
            </h3>
            <p className="text-xs text-[#8b949e]">Rewards distributed to organizations at end of Season 1</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                place: '1st Place (Champion)',
                cash: '$60,000',
                rewards: 'Major Championship Trophy + Direct Tier 1 Major Invite + 500 Global ELO',
                accent: 'border-amber-400 bg-amber-500/10 text-amber-300'
              },
              {
                place: '2nd Place (Runner-Up)',
                cash: '$35,000',
                rewards: 'Challenger Cup Trophy + Tier 1 Major Closed Qualifier Seed + 300 ELO',
                accent: 'border-gray-400 bg-gray-500/10 text-gray-200'
              },
              {
                place: '3rd - 4th Place',
                cash: '$18,000 each',
                rewards: 'Major Closed Qualifier Seed + 180 Global ELO',
                accent: 'border-amber-700 bg-amber-700/10 text-amber-500'
              },
              {
                place: '5th - 8th Place',
                cash: '$6,000 each',
                rewards: 'Retains Premier League Franchise Spot for Season 2',
                accent: 'border-[#30363d] bg-[#161b22] text-[#8b949e]'
              },
              {
                place: '9th - 10th Place',
                cash: '$1,500',
                rewards: 'Relegation Playoff vs Challenger League Top Contenders',
                accent: 'border-red-500/40 bg-red-950/20 text-red-400'
              }
            ].map((p, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${p.accent} flex flex-col justify-between gap-3 shadow-md`}>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">{p.place}</span>
                  <span className="text-2xl font-black text-white mt-1 block">{p.cash}</span>
                </div>
                <p className="text-[11px] text-[#8b949e] font-mono">{p.rewards}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
