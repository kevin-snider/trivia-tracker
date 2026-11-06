import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Users, Calendar, Award, Star, Trophy, Smile } from 'lucide-react';
import { TriviaStats } from '../types';
import { formatMonth } from '../utils/stats';

interface TriviaWrappedProps {
  stats: TriviaStats;
}

const TriviaWrapped: React.FC<TriviaWrappedProps> = ({ stats }) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Wrapped Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white uppercase italic">
              WRAPPED<span className="text-blue-600 dark:text-blue-400 font-black ml-1">2026</span>
            </h2>
            <p className="text-slate-450 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-1">
              Your Trivia Season Summary
            </p>
          </div>
        </div>
        <div className="bg-blue-500/10 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 px-5 py-2.5 rounded-2xl flex items-center gap-3">
          <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-850 dark:text-slate-200 font-black text-lg tracking-tight">
            {stats.totalGames} Games Played
          </span>
        </div>
      </div>

      {/* Hero Metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Golden Era card */}
        <div className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
          <TrendingUp className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Golden Era</h4>
          <span className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight uppercase">
            {formatMonth(stats.bestMonth)}
          </span>
          <p className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-4 tracking-wide bg-blue-500/10 dark:bg-blue-950/30 px-2.5 py-1 rounded-lg inline-block">
            AVG Score: {stats.averageScore.toFixed(1)}
          </p>
        </div>

        {/* Social Peak card */}
        <div className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
          <Calendar className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Social Peak</h4>
          <span className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight uppercase">
            {formatMonth(stats.mostAttendedMonth)}
          </span>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-4 tracking-wide bg-emerald-500/10 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg inline-block">
            Maximum Hype
          </p>
        </div>

        {/* Personal Best card */}
        <div className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
          <Award className="w-10 h-10 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Personal Best</h4>
          <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 leading-none italic">
            {stats.highestScore.toFixed(1)}
          </span>
          <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold mt-4 tracking-wide bg-indigo-500/10 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg inline-block">
            Score of Legends
          </p>
        </div>

      </div>

      {/* Rapid Fire Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatBox icon={<TrendingDown className="text-red-500" />} label="Toughest Month" value={formatMonth(stats.worstMonth)} />
        <StatBox icon={<Smile className="text-blue-500" />} label="Top Vibe" value={stats.mostFrequentEmoji} isEmoji />
        <StatBox icon={<Users className="text-blue-500" />} label="MVP Guest" value={stats.mostFrequentGuest} />
        <StatBox icon={<Star className="text-yellow-500" />} label="Floor" value={stats.lowestScore.toFixed(1)} />
      </div>

      {/* The Verdict Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded-3xl shadow-xl overflow-hidden group">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 md:p-10 rounded-[1.4rem] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
             <h3 className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter flex items-center gap-3">
               <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
               The Team DNA
             </h3>
             <p className="text-slate-650 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                Your team averages <span className="text-blue-600 dark:text-blue-400 font-extrabold px-2 py-1 bg-blue-500/10 rounded-lg">{stats.averagePlace.toFixed(1)}th</span> place. 
                {stats.averageScore > 48 
                  ? " Your collective brainpower is terrifying. Mensa is calling, but you're probably busy at the pub winning another trophy." 
                  : " You're in it for the vibes, the drinks, and the occasional correct answer about 80s pop music. Pure excellence."}
             </p>
          </div>
          <div className="text-center md:text-right flex-shrink-0 relative">
             <div className="text-6xl md:text-8xl font-black text-blue-100/30 dark:text-blue-950/40 italic select-none absolute -right-4 -bottom-4 md:right-0 md:bottom-0 transition-colors">TRIVIA</div>
             <div className="relative">
               <div className="text-blue-600 dark:text-blue-400 font-black text-5xl md:text-7xl italic leading-none drop-shadow-sm">2026</div>
               <div className="text-indigo-500 dark:text-indigo-400 font-black text-lg md:text-2xl uppercase tracking-[0.2em] mt-2 drop-shadow-sm">Status: Elite</div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const StatBox = ({ icon, label, value, isEmoji }: { icon: React.ReactNode, label: string, value: string, isEmoji?: boolean }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
    <div className="flex items-center gap-3 mb-2">
      <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400">{icon}</div>
      <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
    <div className={`mt-2 ${isEmoji ? 'text-4xl' : 'text-xl font-bold text-slate-850 dark:text-slate-100 tracking-tight'}`}>
      {value || (isEmoji ? '🤷‍♂️' : 'N/A')}
    </div>
  </div>
);

export default TriviaWrapped;
