
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, color = 'bg-slate-900/50' }) => {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-lg border border-blue-900/20 hover:border-yellow-500/30 transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
        {icon && <div className="text-blue-500 group-hover:text-yellow-400 transition-colors">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-white">{value}</h3>
        {trend && <span className="text-emerald-400 text-sm font-medium">{trend}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
