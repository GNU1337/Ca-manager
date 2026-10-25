import React from 'react';
import { Users, ShoppingCart, Wrench, Trophy, Award } from 'lucide-react';
import { GameState } from '../types/game';
import { soundFx } from '../utils/audio';

interface MobileNavProps {
  activeTab: GameState['activeTab'];
  onSelectTab: (tab: GameState['activeTab']) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'roster', label: 'Squad', icon: Users },
    { id: 'league', label: 'League', icon: Trophy },
    { id: 'market', label: 'Market', icon: ShoppingCart },
    { id: 'facilities', label: 'Camp', icon: Wrench },
    { id: 'tournaments', label: 'Tourns', icon: Award }
  ] as const;

  const handleTabClick = (tab: GameState['activeTab']) => {
    soundFx.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#161b22] border-t border-[#30363d] flex items-center justify-around px-2 z-40 md:hidden select-none shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded transition-all cursor-pointer ${
              isActive ? 'text-[#238636] font-bold scale-105' : 'text-[#8b949e]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#238636]' : 'text-[#8b949e]'}`} />
            <span className="text-[10px] font-mono uppercase mt-0.5 tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
