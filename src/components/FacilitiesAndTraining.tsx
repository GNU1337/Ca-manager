import React from 'react';
import { Facility } from '../types/game';
import { Wrench, Home, Cpu, Monitor, Dumbbell, GraduationCap, DollarSign, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FacilitiesAndTrainingProps {
  facilities: Facility[];
  userCash: number;
  onUpgradeFacility: (facilityId: string) => void;
}

export const FacilitiesAndTraining: React.FC<FacilitiesAndTrainingProps> = ({
  facilities,
  userCash,
  onUpgradeFacility
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return Home;
      case 'Cpu': return Cpu;
      case 'Monitor': return Monitor;
      case 'Dumbbell': return Dumbbell;
      case 'GraduationCap': return GraduationCap;
      case 'DollarSign': return DollarSign;
      default: return Wrench;
    }
  };

  const handleUpgrade = (facility: Facility) => {
    soundFx.playCash();
    onUpgradeFacility(facility.id);
  };

  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none">
      <div className="border-b border-[#30363d] pb-4">
        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          Training Camp & Facility Upgrades <Wrench className="w-5 h-5 text-[#238636]" />
        </h2>
        <p className="text-[10px] md:text-xs text-[#8b949e] font-mono">
          Invest in gaming rigs, tactics labs, and physical fitness to maximize player growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(fac => {
          const IconComponent = getIcon(fac.iconName);
          const currentCost = Math.round(fac.baseCost * Math.pow(fac.costMultiplier, fac.level));
          const isMax = fac.level >= fac.maxLevel;
          const canAfford = userCash >= currentCost && !isMax;

          return (
            <div
              key={fac.id}
              className="bg-[#161b22] border border-[#30363d] p-4 rounded-md flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-[#238636]/60 transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5 text-[#238636]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono">{fac.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-[#d29922]">Level {fac.level}/{fac.maxLevel}</span>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2 font-mono text-xs">
                <p className="text-[#8b949e] text-[11px]">{fac.description}</p>
                <div className="bg-[#0d1117] p-2.5 rounded border border-[#30363d] text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 shrink-0 text-[#238636]" />
                  <span>{fac.effectDescription}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#8b949e]">
                  <span>Tier Progress</span>
                  <span>{fac.level * 20}%</span>
                </div>
                <div className="h-1.5 bg-[#21262d] w-full rounded-full overflow-hidden">
                  <div className="h-full bg-[#238636]" style={{ width: `${(fac.level / fac.maxLevel) * 100}%` }}></div>
                </div>
              </div>

              {/* Upgrade Button */}
              <button
                disabled={!canAfford || isMax}
                onClick={() => handleUpgrade(fac)}
                className={`w-full py-2 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors ${
                  isMax
                    ? 'bg-gray-700 opacity-50 text-gray-300 cursor-default'
                    : canAfford
                    ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-[0_0_12px_rgba(35,134,54,0.3)]'
                    : 'bg-gray-800 opacity-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isMax
                  ? 'Max Tier Reached'
                  : canAfford
                  ? `Upgrade Facility ($${currentCost.toLocaleString()})`
                  : `Need $${currentCost.toLocaleString()}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
