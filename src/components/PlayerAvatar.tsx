import React from 'react';
import { Player } from '../types/game';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, size = 'md' }) => {
  // Deterministic colors based on avatarSeed
  const seed = player.avatarSeed || 123;
  const hairColors = ['#1e293b', '#451a03', '#78350f', '#0f172a', '#d97706', '#0284c7'];
  const bgGradients = [
    'from-[#0d1117] to-[#1e293b]',
    'from-[#0d1117] to-[#1e3a8a]',
    'from-[#0d1117] to-[#312e81]',
    'from-[#0d1117] to-[#14532d]',
    'from-[#0d1117] to-[#701a75]'
  ];

  const hairColor = hairColors[seed % hairColors.length];
  const bgGrad = bgGradients[seed % bgGradients.length];

  const sizeClasses = {
    sm: 'w-10 h-12 text-[9px]',
    md: 'w-full aspect-[3/4] text-[10px]',
    lg: 'w-32 h-40 text-xs'
  }[size];

  return (
    <div className={`relative bg-gradient-to-t ${bgGrad} rounded overflow-hidden border border-[#30363d] flex flex-col items-center justify-end ${sizeClasses}`}>
      {/* Retro Vector Avatar Face */}
      <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 100 100" fill="none">
        {/* Hair */}
        <path d="M 25 45 C 25 15, 75 15, 75 45 L 80 50 L 20 50 Z" fill={hairColor} />
        {/* Head Skin */}
        <rect x="30" y="35" width="40" height="42" rx="16" fill="#f87171" opacity="0.85" />
        {/* Eyes / Glasses */}
        <circle cx="42" cy="50" r="4" fill="#0f172a" />
        <circle cx="58" cy="50" r="4" fill="#0f172a" />
        <path d="M 40 64 Q 50 72 60 64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        {/* Jersey / Collar */}
        <path d="M 15 80 Q 50 68 85 80 L 90 100 L 10 100 Z" fill="#238636" />
        <path d="M 40 80 L 50 90 L 60 80 Z" fill="#161b22" />
      </svg>

      {/* Flag & Nickname Label */}
      <div className="absolute bottom-1 left-1 right-1 font-mono text-[9px] bg-black/80 text-white px-1 py-0.5 rounded flex items-center justify-between border border-white/10">
        <span className="truncate">{player.nickname}</span>
        <span>{player.flagEmoji}</span>
      </div>

      {/* Overall Badge */}
      <div className="absolute top-1 right-1 font-mono font-bold text-[10px] bg-[#238636] text-white px-1.5 py-0.5 rounded shadow">
        {player.overallRating}
      </div>
    </div>
  );
};
