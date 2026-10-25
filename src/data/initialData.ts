import { Facility, Player, Staff, Team, Tournament } from '../types/game';
import { generateRandomPlayer } from '../utils/playerGen';

export const INITIAL_USER_ROSTER: Player[] = [
  {
    id: 'user_p1',
    name: 'Ivan Petrov',
    nickname: "'s1mple-jr'",
    age: 21,
    country: 'UA',
    flagEmoji: '🇺🇦',
    role: 'AWP Sniper',
    skills: {
      accuracy: 92,
      reflexes: 90,
      quickness: 82,
      gameIQ: 85,
      utility: 78,
      clutch: 88,
      stamina: 95,
      sprayControl: 84
    },
    overallRating: 88,
    staminaCurrent: 100,
    morale: 92,
    salary: 3200,
    marketValue: 85000,
    contractMonths: 24,
    stats: { matchesPlayed: 42, kills: 780, deaths: 510, assists: 190, headshots: 340, mvps: 28, rating: 1.28 },
    avatarSeed: 101,
    level: 28,
    xp: 450
  },
  {
    id: 'user_p2',
    name: 'Klaus Schmidt',
    nickname: "'Karrigan-V2'",
    age: 26,
    country: 'DE',
    flagEmoji: '🇩🇪',
    role: 'IGL',
    skills: {
      accuracy: 78,
      reflexes: 76,
      quickness: 72,
      gameIQ: 95,
      utility: 92,
      clutch: 85,
      stamina: 90,
      sprayControl: 79
    },
    overallRating: 84,
    staminaCurrent: 100,
    morale: 88,
    salary: 2800,
    marketValue: 52000,
    contractMonths: 18,
    stats: { matchesPlayed: 65, kills: 820, deaths: 890, assists: 450, headshots: 280, mvps: 15, rating: 1.05 },
    avatarSeed: 202,
    level: 31,
    xp: 210
  },
  {
    id: 'user_p3',
    name: 'Oliver Rossi',
    nickname: "'EntryGod'",
    age: 19,
    country: 'SE',
    flagEmoji: '🇸🇪',
    role: 'Entry Fragger',
    skills: {
      accuracy: 94,
      reflexes: 91,
      quickness: 90,
      gameIQ: 76,
      utility: 72,
      clutch: 80,
      stamina: 98,
      sprayControl: 89
    },
    overallRating: 86,
    staminaCurrent: 100,
    morale: 95,
    salary: 2500,
    marketValue: 68000,
    contractMonths: 12,
    stats: { matchesPlayed: 30, kills: 560, deaths: 480, assists: 110, headshots: 320, mvps: 19, rating: 1.18 },
    avatarSeed: 303,
    level: 24,
    xp: 620
  },
  {
    id: 'user_p4',
    name: 'John Doe',
    nickname: "'SilentClutch'",
    age: 22,
    country: 'US',
    flagEmoji: '🇺🇸',
    role: 'Lurker',
    skills: {
      accuracy: 85,
      reflexes: 83,
      quickness: 80,
      gameIQ: 88,
      utility: 82,
      clutch: 94,
      stamina: 92,
      sprayControl: 84
    },
    overallRating: 85,
    staminaCurrent: 100,
    morale: 90,
    salary: 2400,
    marketValue: 58000,
    contractMonths: 20,
    stats: { matchesPlayed: 38, kills: 610, deaths: 520, assists: 210, headshots: 260, mvps: 21, rating: 1.14 },
    avatarSeed: 404,
    level: 22,
    xp: 380
  },
  {
    id: 'user_p5',
    name: 'Tore Lind',
    nickname: "'SmokeMaster'",
    age: 23,
    country: 'NO',
    flagEmoji: '🇳🇴',
    role: 'Support',
    skills: {
      accuracy: 82,
      reflexes: 80,
      quickness: 78,
      gameIQ: 89,
      utility: 93,
      clutch: 82,
      stamina: 91,
      sprayControl: 81
    },
    overallRating: 83,
    staminaCurrent: 100,
    morale: 86,
    salary: 2100,
    marketValue: 46000,
    contractMonths: 15,
    stats: { matchesPlayed: 44, kills: 540, deaths: 560, assists: 390, headshots: 220, mvps: 12, rating: 1.08 },
    avatarSeed: 505,
    level: 20,
    xp: 150
  }
];

export const INITIAL_USER_BENCH: Player[] = [
  {
    id: 'user_p6',
    name: 'Gabriel Silva',
    nickname: "'Rookie'",
    age: 18,
    country: 'BR',
    flagEmoji: '🇧🇷',
    role: 'Flex',
    skills: {
      accuracy: 76,
      reflexes: 78,
      quickness: 80,
      gameIQ: 70,
      utility: 68,
      clutch: 72,
      stamina: 96,
      sprayControl: 74
    },
    overallRating: 75,
    staminaCurrent: 100,
    morale: 80,
    salary: 1200,
    marketValue: 22000,
    contractMonths: 12,
    stats: { matchesPlayed: 12, kills: 140, deaths: 150, assists: 60, headshots: 70, mvps: 3, rating: 0.98 },
    avatarSeed: 606,
    level: 12,
    xp: 80
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'staff_1',
    name: "Coach 'Yez'",
    type: 'Head Coach',
    level: 2,
    hireCost: 15000,
    monthlySalary: 1800,
    description: 'Experienced veteran coach known for mid-game tactical adjustments.',
    effectText: '+12% Round Comeback Rate & +10% Team Chemistry',
    avatarSeed: 701,
    isHired: true
  },
  {
    id: 'staff_2',
    name: 'Dr. Marcus Vance',
    type: 'Aim Trainer',
    level: 3,
    hireCost: 22000,
    monthlySalary: 2400,
    description: 'Former pro quake player specializing in micro-adjustment tracking.',
    effectText: '+25% Faster Accuracy & Reflexes XP Growth',
    avatarSeed: 702,
    isHired: false
  },
  {
    id: 'staff_3',
    name: 'Elena Rostova',
    type: 'Mental Coach',
    level: 2,
    hireCost: 12000,
    monthlySalary: 1500,
    description: 'Sports psychologist focusing on tilt control and clutch composure.',
    effectText: '+15% Morale & +10% Clutch Rating in 1v2 situations',
    avatarSeed: 703,
    isHired: false
  },
  {
    id: 'staff_4',
    name: "Agent 'B. Moss'",
    type: 'Talent Scout',
    level: 2,
    hireCost: 18000,
    monthlySalary: 2000,
    description: 'Global scout with deep connections in EU & CIS youth academies.',
    effectText: 'Unlocks 3 hidden prodigy listings in Transfer Market every month',
    avatarSeed: 704,
    isHired: false
  },
  {
    id: 'staff_5',
    name: 'Jonas Borg',
    type: 'Physical Trainer',
    level: 1,
    hireCost: 8000,
    monthlySalary: 1000,
    description: 'Personal trainer ensuring optimal ergonomics & stamina management.',
    effectText: '-30% Stamina Loss during long tournament matches',
    avatarSeed: 705,
    isHired: false
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'bootcamp',
    name: 'Bootcamp HQ & House',
    level: 1,
    maxLevel: 5,
    baseCost: 25000,
    costMultiplier: 1.8,
    description: 'Dedicated team facility for living, practicing and bonding.',
    effectDescription: 'Increases all experience gains by +15% per level.',
    iconName: 'Home'
  },
  {
    id: 'gaming_pcs',
    name: 'High-Spec Gaming Rig Suite',
    level: 1,
    maxLevel: 5,
    baseCost: 20000,
    costMultiplier: 1.6,
    description: '360Hz monitors and ultra-low latency mechanical setups.',
    effectDescription: 'Boosts Reflexes and Spray Control training efficiency.',
    iconName: 'Cpu'
  },
  {
    id: 'tactics_lab',
    name: 'Tactics & Demo Analysis Room',
    level: 1,
    maxLevel: 5,
    baseCost: 18000,
    costMultiplier: 1.7,
    description: 'Interactive map projectors and opponent vod review tools.',
    effectDescription: 'Boosts Game IQ and Utility efficiency during matches.',
    iconName: 'Monitor'
  },
  {
    id: 'gym',
    name: 'Athletic Gym & Recovery Spa',
    level: 0,
    maxLevel: 5,
    baseCost: 15000,
    costMultiplier: 1.5,
    description: 'Physical training and massage recovery to prevent burnout.',
    effectDescription: 'Restores player stamina +10% faster after matches.',
    iconName: 'Dumbbell'
  },
  {
    id: 'youth_academy',
    name: 'Youth Esports Academy',
    level: 0,
    maxLevel: 5,
    baseCost: 35000,
    costMultiplier: 2.0,
    description: 'Scouts and trains 15-18 year old wonderkids.',
    effectDescription: 'Generates 1 high potential rookie player every month.',
    iconName: 'GraduationCap'
  },
  {
    id: 'sponsorship_lounge',
    name: 'Media Studio & Sponsor Lounge',
    level: 1,
    maxLevel: 5,
    baseCost: 30000,
    costMultiplier: 1.9,
    description: 'High-end media center for creator streams & sponsor shoots.',
    effectDescription: '+20% Extra sponsor payout per match win.',
    iconName: 'DollarSign'
  }
];

export function createRivalTeams(): Team[] {
  const createRival = (id: string, name: string, tag: string, color: string, logoBg: string, minR: number, maxR: number): Team => ({
    id,
    name,
    tag,
    color,
    logoBg,
    isUser: false,
    rank: Math.floor(Math.random() * 10) + 2,
    points: Math.floor(Math.random() * 500) + 200,
    wins: Math.floor(Math.random() * 20) + 10,
    losses: Math.floor(Math.random() * 10) + 2,
    trophies: Math.floor(Math.random() * 5),
    roster: [
      generateRandomPlayer(minR, maxR, 'AWP Sniper'),
      generateRandomPlayer(minR, maxR, 'IGL'),
      generateRandomPlayer(minR, maxR, 'Entry Fragger'),
      generateRandomPlayer(minR, maxR, 'Lurker'),
      generateRandomPlayer(minR, maxR, 'Support')
    ],
    benched: [generateRandomPlayer(minR - 5, maxR - 5, 'Flex')]
  });

  return [
    createRival('team_navi', 'Natus Vincere', 'NaVi', '#facc15', '#27272a', 88, 96),
    createRival('team_faze', 'FaZe Clan', 'FaZe', '#ef4444', '#18181b', 87, 95),
    createRival('team_vitality', 'Team Vitality', 'VIT', '#eab308', '#27272a', 88, 95),
    createRival('team_g2', 'G2 Esports', 'G2', '#ffffff', '#09090b', 86, 94),
    createRival('team_astralis', 'Astralis', 'AST', '#dc2626', '#1f2937', 83, 91),
    createRival('team_liquid', 'Team Liquid', 'TL', '#3b82f6', '#172554', 82, 90),
    createRival('team_heroic', 'Heroic', 'HRC', '#f97316', '#292524', 80, 88)
  ];
}

export function createInitialTournaments(teams: Team[]): Tournament[] {
  return [
    {
      id: 'tourn_open',
      name: 'EPL Open Regional Season XV',
      tier: 'Amateur Regional',
      prizePool: 50000,
      minTeamLevel: 1,
      teams: teams.slice(0, 4),
      userQualified: true,
      userJoined: true,
      entryFee: 0,
      status: 'In Progress',
      currentRoundName: 'League Stage'
    },
    {
      id: 'tourn_iem',
      name: 'IEM Katowice Championship',
      tier: 'IEM Masters',
      prizePool: 250000,
      minTeamLevel: 15,
      teams: teams,
      userQualified: true,
      userJoined: false,
      entryFee: 10000,
      status: 'Upcoming',
      currentRoundName: 'Quarter Finals'
    },
    {
      id: 'tourn_major',
      name: 'PGL Global CS Major',
      tier: 'Global Major',
      prizePool: 1000000,
      minTeamLevel: 25,
      teams: teams,
      userQualified: false,
      userJoined: false,
      entryFee: 25000,
      status: 'Upcoming',
      currentRoundName: 'Grand Finals'
    }
  ];
}
