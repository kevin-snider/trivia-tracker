import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  subValue?: string;
  badge?: string;
  highlight?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  subValue,
  badge,
  highlight 
}) => {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-150 ${
      highlight 
        ? 'bg-zinc-900/90 border-indigo-500/40 shadow-sm shadow-indigo-500/5' 
        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider truncate">
          {label}
        </span>
        {icon && (
          <div className="p-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-100 font-mono tracking-tight tabular-nums">
          {value}
        </h3>
        {badge && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <p className="text-[11px] text-zinc-400 mt-1 truncate">
          {subValue}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
