export type PlayerRole = 'Entry Fragger' | 'AWP Sniper' | 'IGL' | 'Support' | 'Lurker' | 'Flex';
export type PlayerMentality = 'Aggressive' | 'Balanced' | 'Defensive';

export interface SkillHistoryPoint {
  level: number;
  accuracy: number;
  reflexes: number;
  quickness: number;
  gameIQ: number;
  overallRating: number;
  timestamp?: string;
}

export interface PlayerSkills {
  accuracy: number;        // First bullet & precision (1-99)
  reflexes: number;        // Reaction time (1-99)
  quickness: number;       // Movement speed & positioning (1-99)
  gameIQ: number;          // Tactical awareness & decision making (1-99)
  utility: number;         // Smoke & Flash grenade effectiveness (1-99)
  clutch: number;          // Composure under pressure (1-99)
  stamina: number;         // Physical health & fatigue resistance (1-99)
  sprayControl: number;    // Recoil control in sustained fights (1-99)
}

export interface PlayerStats {
  matchesPlayed: number;
  wins?: number;
  losses?: number;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  mvps: number;
  rating: number; // e.g. 1.15
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  age: number;
  country: string; // e.g. 'SE', 'DK', 'UA', 'US', 'DE', 'FR'
  flagEmoji: string;
  role: PlayerRole;
  mentality?: PlayerMentality;
  potential?: number; // 70-99 potential rating
  isScouted?: boolean;
  skills: PlayerSkills;
  overallRating: number; // Calculated average
  staminaCurrent: number; // 0-100 current match readiness
  morale: number; // 0-100
  salary: number; // Monthly salary
  marketValue: number; // Buyout price
  contractMonths: number;
  stats: PlayerStats;
  avatarSeed: number; // For retro avatar rendering
  isListedForSale?: boolean;
  trainingFocus?: keyof PlayerSkills | 'balanced';
  level: number;
  xp: number;
  skillHistory?: SkillHistoryPoint[];
}

export type StaffType = 'Head Coach' | 'Aim Trainer' | 'Mental Coach' | 'Talent Scout' | 'Physical Trainer';

export interface Staff {
  id: string;
  name: string;
  type: StaffType;
  level: number; // 1-5
  hireCost: number;
  monthlySalary: number;
  description: string;
  effectText: string;
  avatarSeed: number;
  isHired: boolean;
}

export interface Facility {
  id: string;
  name: string;
  level: number; // 0-5
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  description: string;
  effectDescription: string;
  iconName: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  color: string;
  logoBg: string;
  roster: Player[];
  benched: Player[];
  isUser: boolean;
  rank: number;
  points: number;
  wins: number;
  losses: number;
  trophies: number;
}

export type MapName = 'de_dust';

export type BuyStrategy = 'Auto' | 'Eco' | 'Force Buy' | 'Full Buy';
export type TacticStrategy = 'Default' | 'Rush A' | 'Split B' | 'Mid Control' | 'Slow Execute';

export interface MatchRoundLog {
  roundNumber: number;
  winner: 'CT' | 'T';
  winReason: 'Elimination' | 'Bomb Exploded' | 'Bomb Defused' | 'Time Expired';
  scoreCT: number;
  scoreT: number;
  mvpPlayerId: string;
  mvpPlayerName: string;
  description: string;
}

export interface PlayerMatchPerf {
  playerId: string;
  name: string;
  nickname: string;
  teamId: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  mvps: number;
  health: number; // 0-100 in round
  currentWeapon: 'Pistol' | 'SMG' | 'Rifle' | 'AWP';
  hasArmor: boolean;
  hasDefuseKit: boolean;
}

export interface MatchState {
  id: string;
  tournamentId: string;
  teamA: Team; // Usually CT first half
  teamB: Team; // Usually T first half
  scoreA: number;
  scoreB: number;
  currentRound: number;
  maxRounds: number; // 24 (First to 13)
  halfTimeSwapped: boolean;
  map: MapName;
  isFinished: boolean;
  winnerTeamId?: string;
  prizeMoney: number;
  logs: MatchRoundLog[];
  killfeed: { id: string; text: string; time: string; isHeadshot?: boolean }[];
  currentRoundTime: number; // seconds remaining in round (e.g. 115s)
  bombState: 'not_planted' | 'planting' | 'planted' | 'defusing' | 'exploded' | 'defused';
  bombTimer: number; // seconds remaining (40s)
  bombSite?: 'A' | 'B';
  teamAMoney: number;
  teamBMoney: number;
}

export interface Tournament {
  id: string;
  name: string;
  tier: 'Amateur Regional' | 'Challenger Cup' | 'IEM Masters' | 'Global Major';
  prizePool: number;
  minTeamLevel: number;
  teams: Team[];
  userQualified: boolean;
  userJoined: boolean;
  entryFee: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  currentRoundName: 'Quarter Finals' | 'Semi Finals' | 'Grand Finals' | 'League Stage';
}

export interface NewsFeedItem {
  id: string;
  title: string;
  detail: string;
  type: 'transfer' | 'agent' | 'skill' | 'tournament' | 'system';
  timestamp: string;
  borderAccent: string;
}

export interface LeagueStanding {
  position: number;
  teamId: string;
  teamName: string;
  teamTag: string;
  color: string;
  isUser: boolean;
  played: number;
  won: number;
  lost: number;
  otWins: number;
  roundsWon: number;
  roundsLost: number;
  roundDiff: number;
  points: number;
  form: ('W' | 'L' | 'OTW')[];
  streak: string;
}

export interface LeagueFixture {
  id: string;
  week: number;
  homeTeam: string;
  homeTag: string;
  awayTeam: string;
  awayTag: string;
  status: 'Upcoming' | 'Completed' | 'Live';
  homeScore?: number;
  awayScore?: number;
  winner?: string;
  isUserMatch?: boolean;
}

export interface PlayerLeaderboardEntry {
  playerId: string;
  name: string;
  nickname: string;
  teamTag: string;
  role: string;
  rating: number;
  kdRatio: number;
  headshotPct: number;
  adr: number;
  mvps: number;
  isUserPlayer?: boolean;
}

export interface GameState {
  teamName: string;
  teamTag: string;
  cash: number;
  fans: number;
  morale: number;
  winStreak: number;
  season: number;
  month: number;
  roster: Player[];
  bench: Player[];
  transferMarket: Player[];
  hiredStaff: Staff[];
  facilities: Facility[];
  tournaments: Tournament[];
  activeTournamentId: string | null;
  newsFeed: NewsFeedItem[];
  audioEnabled: boolean;
  activeTab: 'roster' | 'league' | 'tournaments' | 'market' | 'facilities' | 'staff' | 'match';
  theme?: 'hltv' | 'cs16' | 'synthwave' | 'stadium';
}
