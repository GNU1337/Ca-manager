import React from 'react';
import { Palette, Check, Sparkles, Monitor, Shield, Trophy } from 'lucide-react';
import { soundFx } from '../utils/audio';

export type GUITheme = 'hltv' | 'cs16' | 'synthwave' | 'stadium';

interface ThemeSelectorModalProps {
  currentTheme: GUITheme;
  onSelectTheme: (theme: GUITheme) => void;
  onClose: () => void;
}

export const THEME_OPTIONS: {
  id: GUITheme;
  name: string;
  tagline: string;
  previewBg: string;
  previewHeader: string;
  previewCard: string;
  accentColor: string;
  textColor: string;
  description: string;
  features: string[];
}[] = [
  {
    id: 'hltv',
    name: 'HLTV Pro Dark',
    tagline: 'Modern Broadcast & Tournament Slate',
    previewBg: 'bg-[#0d1117]',
    previewHeader: 'bg-[#161b22]',
    previewCard: 'bg-[#21262d]',
    accentColor: 'bg-[#238636] border-[#3fb950]',
    textColor: 'text-[#e6edf3]',
    description: 'Crisp dark esports interface modeled after major CS broadcasts, HLTV ratings, and IEM tournaments.',
    features: ['Dark Charcoal Canvas', 'Emerald Green Accents', 'Gold Economy Highlights', 'Pro Broadcast Vibe']
  },
  {
    id: 'cs16',
    name: 'CS 1.6 Tactical Green',
    tagline: 'Classic Counter-Strike HUD Vibe',
    previewBg: 'bg-[#09100a]',
    previewHeader: 'bg-[#112015]',
    previewCard: 'bg-[#192b1d]',
    accentColor: 'bg-[#39d353] border-[#4ade80]',
    textColor: 'text-[#86efac]',
    description: 'Nostalgic tactical green HUD inspired by classic CS 1.6 and Source LAN tournaments with beveled borders.',
    features: ['Military Olive Canvas', 'Radar Green Accents', 'Classic Beveled HUD Cards', 'Vintage CS Sound & Feel']
  },
  {
    id: 'synthwave',
    name: 'Neon Cyberpunk',
    tagline: 'Futuristic Arcade Synthwave',
    previewBg: 'bg-[#0b0318]',
    previewHeader: 'bg-[#160a33]',
    previewCard: 'bg-[#210f47]',
    accentColor: 'bg-[#00f0ff] border-[#ff007f]',
    textColor: 'text-[#f472b6]',
    description: 'High-energy glowing neon aesthetic with vibrant magenta/cyan contrasts and synthwave scanlines.',
    features: ['Deep Cosmic Violet', 'Hot Pink & Cyan Outlines', 'Glowing Neon Stats', 'Retro Arcade Energy']
  },
  {
    id: 'stadium',
    name: 'Pro Stadium Light',
    tagline: 'Clean High-Contrast Mobile GUI',
    previewBg: 'bg-[#f3f4f6]',
    previewHeader: 'bg-[#0f172a]',
    previewCard: 'bg-[#ffffff]',
    accentColor: 'bg-[#2563eb] border-[#3b82f6]',
    textColor: 'text-[#0f172a]',
    description: 'Ultra-bright, high legibility stadium white & electric blue manager interface optimized for daylight & mobile viewing.',
    features: ['Bright Silver Canvas', 'Electric Blue Highlights', 'Maximum Text Legibility', 'Clean Mobile Contrast']
  }
];

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in select-none">
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-xl max-w-3xl w-full p-4 sm:p-6 text-[#e6edf3] shadow-2xl relative">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Palette className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                Choose GUI Theme & Design
              </h2>
              <p className="text-xs text-[#8b949e]">
                Select your preferred visual style for the entire CS Manager interface.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-red-900/40 text-[#8b949e] hover:text-red-400 border border-[#30363d] hover:border-red-500/50 rounded-md text-xs font-bold cursor-pointer transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Theme Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {THEME_OPTIONS.map(theme => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  soundFx.playCash();
                  onSelectTheme(theme.id);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-500 bg-[#21262d] shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-[1.01]'
                    : 'border-[#30363d] bg-[#0d1117]/80 hover:border-[#8b949e] hover:bg-[#21262d]/60'
                }`}
              >
                {/* Active Badge */}
                {isSelected && (
                  <div className="absolute -top-3 right-4 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" /> Active Theme
                  </div>
                )}

                <div>
                  {/* Theme Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-base text-white tracking-wide flex items-center gap-2">
                      {theme.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 mb-3">{theme.tagline}</p>

                  {/* Mini Preview Card */}
                  <div className={`p-3 rounded-lg border border-white/10 ${theme.previewBg} mb-3 shadow-inner`}>
                    <div className={`h-6 rounded px-2 flex items-center justify-between text-[10px] font-bold ${theme.previewHeader} text-white mb-2`}>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Vortex Gaming
                      </span>
                      <span className="text-amber-400 font-mono">$142,500</span>
                    </div>

                    <div className={`p-2 rounded border border-white/10 ${theme.previewCard} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${theme.accentColor}`} />
                        <span className={`text-xs font-bold ${theme.textColor}`}>s1mple-jr (AWP)</span>
                      </div>
                      <span className="text-[10px] font-black px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                        OVR 94
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                    {theme.description}
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#30363d]/60">
                  {theme.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#161b22] text-[#8b949e] border border-[#30363d] rounded"
                    >
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-[#30363d] flex flex-wrap items-center justify-between text-xs text-[#8b949e] gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Themes adapt dynamically across all tabs, main roster, market, & 2D match engine.</span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-md cursor-pointer transition-all shadow-md text-center"
          >
            Apply & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
