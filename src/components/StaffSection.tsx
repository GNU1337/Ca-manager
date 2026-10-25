import React from 'react';
import { Staff } from '../types/game';
import { UserCheck, Shield, Award, DollarSign } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StaffSectionProps {
  staffList: Staff[];
  userCash: number;
  onHireStaff: (staffId: string) => void;
  onFireStaff: (staffId: string) => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({
  staffList,
  userCash,
  onHireStaff,
  onFireStaff
}) => {
  return (
    <div className="flex-1 flex flex-col p-3 md:p-6 gap-4 md:gap-6 bg-[#0d1117] overflow-y-auto select-none">
      <div className="border-b border-[#30363d] pb-4">
        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          Coaching Staff & Talent Agents <UserCheck className="w-5 h-5 text-[#238636]" />
        </h2>
        <p className="text-[10px] md:text-xs text-[#8b949e] font-mono">
          Recruit expert coaches, psychologists, and agents to give your squad a competitive edge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map(st => {
          const canAfford = userCash >= st.hireCost;

          return (
            <div
              key={st.id}
              className={`bg-[#161b22] border ${
                st.isHired ? 'border-[#238636] shadow-[0_0_15px_rgba(35,134,54,0.15)]' : 'border-[#30363d]'
              } p-4 rounded-md flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {st.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{st.name}</h3>
                  <div className="text-[10px] text-[#d29922] font-mono font-bold uppercase">{st.type} • Level {st.level}</div>
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <p className="text-[#8b949e] text-[11px]">{st.description}</p>
                <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-[10px] text-emerald-400 font-semibold">
                  ⚡ {st.effectText}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#30363d] pt-2 text-[#8b949e]">
                <span>Hire Fee: <strong className="text-white">${st.hireCost.toLocaleString()}</strong></span>
                <span>Salary: <strong className="text-[#d29922]">${st.monthlySalary.toLocaleString()}/mo</strong></span>
              </div>

              {st.isHired ? (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onFireStaff(st.id);
                  }}
                  className="w-full py-2 bg-[#21262d] hover:bg-red-900/40 text-red-400 hover:text-red-200 text-xs font-mono font-bold uppercase rounded border border-red-500/30 cursor-pointer transition-colors"
                >
                  Release Staff
                </button>
              ) : (
                <button
                  disabled={!canAfford}
                  onClick={() => {
                    soundFx.playCash();
                    onHireStaff(st.id);
                  }}
                  className={`w-full py-2 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors ${
                    canAfford
                      ? 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-[0_0_10px_rgba(35,134,54,0.3)]'
                      : 'bg-gray-800 opacity-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? `Hire Staff ($${st.hireCost.toLocaleString()})` : `Low Funds`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
