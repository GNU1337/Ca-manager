import { Player, PlayerRole, PlayerSkills } from '../types/game';

const FIRST_NAMES = [
  'Ivan', 'Oleksandr', 'Nikola', 'Gabriel', 'Mathieu', 'Denis', 'Robin', 'Jan', 'Tarik',
  'Finn', 'Lucas', 'Dmitry', 'Jack', 'Elias', 'Szymon', 'Helvijs', 'Ludvig', 'Aleksi',
  'Martin', 'Jere', 'Ilya', 'Valdemar', 'Danyyl', 'Johannes', 'Guy', 'Rasmus', 'Pawel'
];

const LAST_NAMES = [
  'Petrov', 'Kovac', 'Toledo', 'Herbaut', 'Kostyliev', 'Kool', 'Kjaerbye', 'Muller',
  'Schmidt', 'Lind', 'Rossi', 'Mendoza', 'Nowak', 'Sauka', 'Brolin', 'Siren', 'Staer',
  'Salo', 'Zalutskiy', 'Vang', 'Head', 'Azinovic', 'Celik', 'Rautiainen', 'Rysila'
];

const NICKNAMES = [
  's1mple-jr', 'm0NESY', 'ZywOo', 'NiKo', 'roptz', 'b1t', 'twistzz', 'frozen', 'donk',
  'Sh1ro', 'device', 'blameF', 'rain', 'Hunter', 'cadian', 'Karrigan', 'electronic',
  'Apex', 'broky', 'Spinx', 'Xantares', 'SunPayus', 'Wicadia', 'flameZ', 'magisk',
  'skullz', 'kyosuke', 'zyphon', 'senzu', 'xertioN', 'torzsi', 'siuhy', 'nawwk', 'stewie'
];

const COUNTRIES = [
  { code: 'UA', flag: '🇺🇦' },
  { code: 'FR', flag: '🇫🇷' },
  { code: 'BA', flag: '🇧🇦' },
  { code: 'DK', flag: '🇩🇰' },
  { code: 'SE', flag: '🇸🇪' },
  { code: 'FI', flag: '🇫🇮' },
  { code: 'NO', flag: '🇳🇴' },
  { code: 'PL', flag: '🇵🇱' },
  { code: 'RU', flag: '🇷🇺' },
  { code: 'DE', flag: '🇩🇪' },
  { code: 'BR', flag: '🇧🇷' },
  { code: 'US', flag: '🇺🇸' },
  { code: 'CA', flag: '🇨🇦' },
  { code: 'TR', flag: '🇹🇷' },
  { code: 'IL', flag: '🇮🇱' }
];

const ROLES: PlayerRole[] = ['Entry Fragger', 'AWP Sniper', 'IGL', 'Support', 'Lurker', 'Flex'];

export function calculateOverallRating(skills: PlayerSkills, role: PlayerRole): number {
  const { accuracy, reflexes, quickness, gameIQ, utility, clutch, stamina, sprayControl } = skills;
  
  let weights = {
    accuracy: 0.15,
    reflexes: 0.15,
    quickness: 0.12,
    gameIQ: 0.15,
    utility: 0.1,
    clutch: 0.1,
    stamina: 0.08,
    sprayControl: 0.15
  };

  if (role === 'AWP Sniper') {
    weights = { accuracy: 0.25, reflexes: 0.25, quickness: 0.1, gameIQ: 0.1, utility: 0.05, clutch: 0.1, stamina: 0.05, sprayControl: 0.05 };
  } else if (role === 'Entry Fragger') {
    weights = { accuracy: 0.20, reflexes: 0.20, quickness: 0.20, gameIQ: 0.05, utility: 0.05, clutch: 0.1, stamina: 0.05, sprayControl: 0.15 };
  } else if (role === 'IGL') {
    weights = { accuracy: 0.10, reflexes: 0.10, quickness: 0.05, gameIQ: 0.30, utility: 0.20, clutch: 0.1, stamina: 0.05, sprayControl: 0.10 };
  } else if (role === 'Support') {
    weights = { accuracy: 0.12, reflexes: 0.10, quickness: 0.10, gameIQ: 0.20, utility: 0.28, clutch: 0.05, stamina: 0.05, sprayControl: 0.10 };
  } else if (role === 'Lurker') {
    weights = { accuracy: 0.15, reflexes: 0.15, quickness: 0.15, gameIQ: 0.20, utility: 0.05, clutch: 0.20, stamina: 0.05, sprayControl: 0.05 };
  }

  const sum = 
    accuracy * weights.accuracy +
    reflexes * weights.reflexes +
    quickness * weights.quickness +
    gameIQ * weights.gameIQ +
    utility * weights.utility +
    clutch * weights.clutch +
    stamina * weights.stamina +
    sprayControl * weights.sprayControl;

  return Math.round(sum);
}

export function generateRandomPlayer(minRating = 60, maxRating = 90, forceRole?: PlayerRole): Player {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const nickname = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)] + (Math.random() > 0.6 ? Math.floor(Math.random() * 99) : '');
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const role = forceRole || ROLES[Math.floor(Math.random() * ROLES.length)];
  const age = Math.floor(Math.random() * 12) + 16; // 16 to 27

  // Generate target overall
  const targetRating = Math.floor(Math.random() * (maxRating - minRating + 1)) + minRating;
  
  // Random variation around target
  const genStat = () => Math.min(99, Math.max(40, targetRating + Math.floor((Math.random() - 0.5) * 16)));

  const skills: PlayerSkills = {
    accuracy: genStat(),
    reflexes: genStat(),
    quickness: genStat(),
    gameIQ: genStat(),
    utility: genStat(),
    clutch: genStat(),
    stamina: Math.floor(Math.random() * 20) + 80,
    sprayControl: genStat()
  };

  const overallRating = calculateOverallRating(skills, role);
  const potential = Math.min(99, Math.max(overallRating + 2, overallRating + Math.floor(Math.random() * 10)));
  const mentalities: ('Aggressive' | 'Balanced' | 'Defensive')[] = ['Aggressive', 'Balanced', 'Defensive'];
  const mentality = mentalities[Math.floor(Math.random() * mentalities.length)];

  // Calculate market value based on overall & age
  const ageMultiplier = age <= 19 ? 1.4 : age <= 23 ? 1.2 : age <= 27 ? 1.0 : 0.7;
  const baseVal = Math.pow(overallRating / 10, 3.8) * 120;
  const marketValue = Math.round((baseVal * ageMultiplier) / 500) * 500;
  const salary = Math.round((marketValue * 0.02) / 50) * 50;

  const matchesPlayed = Math.floor(Math.random() * 50) + 10;
  const wins = Math.floor(matchesPlayed * (0.45 + Math.random() * 0.25));
  const losses = matchesPlayed - wins;

  // Build skill history trajectory for recharts visualization
  const playerLevel = Math.max(1, Math.floor(overallRating / 3));
  const skillHistory = [];
  const startLevel = Math.max(1, playerLevel - 5);
  for (let lvl = startLevel; lvl <= playerLevel; lvl++) {
    const factor = (lvl / playerLevel);
    skillHistory.push({
      level: lvl,
      accuracy: Math.max(40, Math.round(skills.accuracy * (0.8 + 0.2 * factor))),
      reflexes: Math.max(40, Math.round(skills.reflexes * (0.8 + 0.2 * factor))),
      quickness: Math.max(40, Math.round(skills.quickness * (0.8 + 0.2 * factor))),
      gameIQ: Math.max(40, Math.round(skills.gameIQ * (0.85 + 0.15 * factor))),
      overallRating: Math.max(40, Math.round(overallRating * (0.8 + 0.2 * factor)))
    });
  }

  return {
    id: 'player_' + Math.random().toString(36).substring(2, 9),
    name: `${firstName} ${lastName}`,
    nickname: `'${nickname}'`,
    age,
    country: country.code,
    flagEmoji: country.flag,
    role,
    mentality,
    potential,
    isScouted: false,
    skills,
    overallRating,
    staminaCurrent: 100,
    morale: Math.floor(Math.random() * 20) + 80,
    salary,
    marketValue,
    contractMonths: Math.floor(Math.random() * 18) + 6,
    stats: {
      matchesPlayed,
      wins,
      losses,
      kills: Math.floor(matchesPlayed * (14 + Math.random() * 10)),
      deaths: Math.floor(matchesPlayed * (12 + Math.random() * 8)),
      assists: Math.floor(matchesPlayed * (4 + Math.random() * 5)),
      headshots: Math.floor(matchesPlayed * (6 + Math.random() * 6)),
      mvps: Math.floor(matchesPlayed * (1.5 + Math.random() * 2)),
      rating: parseFloat((1.0 + (overallRating - 75) * 0.015 + (Math.random() - 0.5) * 0.1).toFixed(2))
    },
    avatarSeed: Math.floor(Math.random() * 10000),
    level: playerLevel,
    xp: 0,
    skillHistory
  };
}
