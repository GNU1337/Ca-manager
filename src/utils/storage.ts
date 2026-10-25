import { GameState } from '../types/game';
import { INITIAL_FACILITIES, INITIAL_STAFF, INITIAL_USER_BENCH, INITIAL_USER_ROSTER, createInitialTournaments, createRivalTeams } from '../data/initialData';
import { generateRandomPlayer } from './playerGen';

const STORAGE_KEY = 'cs_manager_2d_save_v1';

export function getDefaultGameState(): GameState {
  const rivals = createRivalTeams();
  const market: typeof INITIAL_USER_ROSTER = [];
  for (let i = 0; i < 8; i++) {
    market.push(generateRandomPlayer(68, 92));
  }

  const tournaments = createInitialTournaments(rivals);

  return {
    teamName: 'Vortex Gaming',
    teamTag: 'VG',
    cash: 142500,
    fans: 12500,
    morale: 88,
    winStreak: 4,
    season: 1,
    month: 1,
    roster: INITIAL_USER_ROSTER,
    bench: INITIAL_USER_BENCH,
    transferMarket: market,
    hiredStaff: INITIAL_STAFF,
    facilities: INITIAL_FACILITIES,
    tournaments,
    activeTournamentId: 'tourn_open',
    newsFeed: [
      {
        id: 'news_1',
        title: 'PRODIGY LISTED',
        detail: "'s1mple-jr' listed on transfer market for $85k",
        type: 'transfer',
        timestamp: '10 mins ago',
        borderAccent: 'border-blue-500'
      },
      {
        id: 'news_2',
        title: 'STAFF ALERT',
        detail: "Veteran Scout 'B. Moss' Available for hire",
        type: 'agent',
        timestamp: '25 mins ago',
        borderAccent: 'border-amber-500'
      },
      {
        id: 'news_3',
        title: 'SKILL UPGRADE',
        detail: 'K. Schmidt reached Game IQ 95',
        type: 'skill',
        timestamp: '1 hr ago',
        borderAccent: 'border-green-500'
      }
    ],
    audioEnabled: true,
    activeTab: 'roster',
    theme: 'hltv'
  };
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getDefaultGameState(), ...parsed };
    }
  } catch (err) {
    console.error('Failed to load save state:', err);
  }
  return getDefaultGameState();
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
