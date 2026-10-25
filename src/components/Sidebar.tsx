import React from 'react';
import { Users, ShoppingCart, Award, Wrench, UserCheck, Trophy, Play } from 'lucide-react';
import { GameState } from '../types/game';
import { soundFx } from '../utils/audio';

interface SidebarProps {
  activeTab: GameState['activeTab'];
  onSelectTab: (tab: GameState['activeTab']) => void;
  staffCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, staffCount }) => {
  interface NavItem {
    id: GameState['activeTab'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'roster', label: 'Main Roster', icon: Users },
    { id: 'league', label: 'Pro League', icon: Trophy, badge: '#3' },
    { id: 'tournaments', label: 'Tournaments', icon: Award, badge: 'LVL 1+' },
    { id: 'market', label: 'Transfer Market', icon: ShoppingCart },
    { id: 'facilities', label: 'Training Camp', icon: Wrench },
    { id: 'staff', label: 'Staff & Agents', icon: UserCheck },
  ];

  const handleTabClick = (tab: GameState['activeTab']) => {
    soundFx.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="w-48 bg-[#0d1117] border-r border-[#30363d] flex-col p-4 gap-2 shrink-0 hidden md:flex select-none">
      <div className="text-[10px] text-[#8b949e] font-mono font-bold uppercase tracking-widest px-2 mb-1">
        HQ Navigation
      </div>

      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full py-3 px-3.5 text-xs font-bold uppercase tracking-widest text-left rounded-md transition-all flex items-center justify-between cursor-pointer border ${
              isActive
                ? 'bg-[#238636] text-white border-[#3fb950]/50 shadow-[0_0_12px_rgba(35,134,54,0.3)]'
                : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border-[#30363d]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8b949e]'}`} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-[#21262d] text-[#d29922]'}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Staff Quick Widget */}
      <div className="mt-auto border-t border-[#30363d] pt-4">
        <div className="text-[10px] text-[#484f58] uppercase mb-2 font-mono font-bold">Staff Recruits</div>
        <div className="flex items-center justify-between p-2.5 bg-[#161b22] border border-[#30363d] rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              HQ
            </div>
            <div className="text-[10px] uppercase font-bold text-white">Staff Hired</div>
          </div>
          <span className="text-xs font-mono font-bold text-[#238636]">{staffCount}/5</span>
        </div>
      </div>
    </nav>
  );
};
