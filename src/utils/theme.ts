import { GUITheme } from '../components/ThemeSelectorModal';

export interface ThemeStyles {
  id: GUITheme;
  appBg: string;
  headerBg: string;
  headerBorder: string;
  sidebarBg: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentBorder: string;
  accentText: string;
  economyText: string;
  scanlines: boolean;
  pillBg: string;
}

export const THEME_STYLES: Record<GUITheme, ThemeStyles> = {
  hltv: {
    id: 'hltv',
    appBg: 'bg-[#0d1117]',
    headerBg: 'bg-[#161b22]',
    headerBorder: 'border-[#30363d]',
    sidebarBg: 'bg-[#161b22]',
    cardBg: 'bg-[#161b22]',
    cardBorder: 'border-[#30363d]',
    cardHover: 'hover:border-[#8b949e]',
    textPrimary: 'text-[#e6edf3]',
    textSecondary: 'text-[#8b949e]',
    accentPrimary: 'bg-[#238636]',
    accentBorder: 'border-[#3fb950]/40',
    accentText: 'text-[#3fb950]',
    economyText: 'text-[#d29922]',
    scanlines: false,
    pillBg: 'bg-[#21262d]'
  },
  cs16: {
    id: 'cs16',
    appBg: 'bg-[#08100a]',
    headerBg: 'bg-[#0f1f14]',
    headerBorder: 'border-[#23422a]',
    sidebarBg: 'bg-[#0f1f14]',
    cardBg: 'bg-[#122618]',
    cardBorder: 'border-[#2d5234]',
    cardHover: 'hover:border-[#4ade80]',
    textPrimary: 'text-[#dcfce7]',
    textSecondary: 'text-[#86efac]/70',
    accentPrimary: 'bg-[#15803d]',
    accentBorder: 'border-[#4ade80]/60',
    accentText: 'text-[#4ade80]',
    economyText: 'text-[#eab308]',
    scanlines: true,
    pillBg: 'bg-[#1b3823]'
  },
  synthwave: {
    id: 'synthwave',
    appBg: 'bg-[#090414]',
    headerBg: 'bg-[#150a2b]',
    headerBorder: 'border-[#3b1261]',
    sidebarBg: 'bg-[#150a2b]',
    cardBg: 'bg-[#1b0c38]',
    cardBorder: 'border-[#ff007f]/40',
    cardHover: 'hover:border-[#00f0ff]',
    textPrimary: 'text-[#f472b6]',
    textSecondary: 'text-[#c084fc]',
    accentPrimary: 'bg-[#00f0ff]',
    accentBorder: 'border-[#00f0ff]',
    accentText: 'text-[#00f0ff]',
    economyText: 'text-[#facc15]',
    scanlines: true,
    pillBg: 'bg-[#2a1354]'
  },
  stadium: {
    id: 'stadium',
    appBg: 'bg-[#f3f4f6]',
    headerBg: 'bg-[#0f172a]',
    headerBorder: 'border-[#1e293b]',
    sidebarBg: 'bg-[#ffffff]',
    cardBg: 'bg-[#ffffff]',
    cardBorder: 'border-[#e2e8f0]',
    cardHover: 'hover:border-[#3b82f6]',
    textPrimary: 'text-[#0f172a]',
    textSecondary: 'text-[#64748b]',
    accentPrimary: 'bg-[#2563eb]',
    accentBorder: 'border-[#3b82f6]',
    accentText: 'text-[#2563eb]',
    economyText: 'text-[#d97706]',
    scanlines: false,
    pillBg: 'bg-[#f1f5f9]'
  }
};

export function getThemeStyles(theme?: GUITheme): ThemeStyles {
  return THEME_STYLES[theme || 'hltv'] || THEME_STYLES.hltv;
}
