
import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Users, Calendar, Award, Star, Trophy, Smile } from 'lucide-react';
import { TriviaStats } from '../types';
import { formatMonth } from '../utils/stats';

interface TriviaWrappedProps {
  stats: TriviaStats;
}

const TriviaWrapped: React.FC<TriviaWrappedProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-slate-950 to-slate-950 rounded-[2.5rem] p-6 md:p-12 shadow-[0_0_100px_rgba(30,58,138,0.3)] border border-yellow-500/20 relative overflow-hidden mb-12 animate-in fade-in zoom-in duration-700">
      {/* Decorative Brand Circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/5 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-blue-600/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-yellow-400 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-[0_0_30px_rgba(250,204,21,0.4)]">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-blue-950" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                WRAPPED<span className="text-yellow-400">2026</span>
              </h2>
              <p className="text-blue-300/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1 md:mt-2">Quizspicalble Me! Exclusive</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 backdrop-blur-md w-full md:w-auto justify-center md:justify-start">
             <Trophy className="w-5 h-5 text-yellow-500" />
             <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase">{stats.totalGames} Games Played</span>
          </div>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="group bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center transition-all hover:border-yellow-500/30 hover:scale-105">
            <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:animate-bounce" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Golden Era</h4>
            <span className="text-2xl md:text-3xl font-black text-white leading-tight uppercase">{formatMonth(stats.bestMonth)}</span>
            <p className="text-yellow-400/70 text-[10px] font-black mt-3 uppercase tracking-widest">AVG: {stats.averageScore.toFixed(1)}</p>
          </div>

          <div className="group bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center transition-all hover:border-blue-500/30 hover:scale-105">
            <Calendar className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mb-4 group-hover:animate-pulse" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Social Peak</h4>
            <span className="text-2xl md:text-3xl font-black text-white leading-tight uppercase">{formatMonth(stats.mostAttendedMonth)}</span>
            <p className="text-blue-400/70 text-[10px] font-black mt-3 uppercase tracking-widest">Maximum Hype</p>
          </div>

          <div className="group bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center transition-all hover:border-yellow-500/30 hover:scale-105">
            <Award className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:rotate-12 transition-transform" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Personal Best</h4>
            <span className="text-4xl md:text-5xl font-black text-white leading-tight italic">{stats.highestScore.toFixed(1)}</span>
            <p className="text-yellow-400/70 text-[10px] font-black mt-3 uppercase tracking-widest">Score of legends</p>
          </div>
        </div>

        {/* Rapid Fire Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatBox icon={<TrendingDown className="text-red-400" />} label="Toughest Month" value={formatMonth(stats.worstMonth)} />
          <StatBox icon={<Smile className="text-yellow-400" />} label="Top Vibe" value={stats.mostFrequentEmoji} isEmoji />
          <StatBox icon={<Users className="text-blue-400" />} label="MVP Guest" value={stats.mostFrequentGuest} />
          <StatBox icon={<Star className="text-amber-500" />} label="Floor" value={stats.lowestScore.toFixed(1)} />
        </div>

        {/* The Verdict Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-1 rounded-[2rem] shadow-2xl overflow-hidden group">
          <div className="bg-slate-950 p-6 md:p-10 rounded-[1.9rem] flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4">
               <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                 <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                 The Team DNA
               </h3>
               <p className="text-blue-100/60 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                  Quizspicalble Me! averages <span className="text-yellow-400 font-black px-2 py-1 bg-yellow-400/10 rounded-lg">{stats.averagePlace.toFixed(1)}th</span> place. 
                  {stats.averageScore > 48 
                    ? " Your collective brainpower is terrifying. Mensa is calling, but you're probably busy at the pub winning another trophy." 
                    : " You're in it for the vibes, the drinks, and the occasional correct answer about 80s pop music. Pure excellence."}
               </p>
            </div>
            <div className="text-center md:text-right flex-shrink-0 relative">
               <div className="text-6xl md:text-8xl font-black text-white/5 italic select-none absolute -right-4 -bottom-4 md:right-0 md:bottom-0 group-hover:text-white/10 transition-colors">QUIZ</div>
               <div className="relative">
                 <div className="text-blue-600 font-black text-5xl md:text-7xl italic leading-none">2026</div>
                 <div className="text-yellow-400 font-black text-lg md:text-2xl uppercase tracking-[0.5em] mt-2">Status: Elite</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, isEmoji }: { icon: React.ReactNode, label: string, value: string, isEmoji?: boolean }) => (
  <div className="bg-slate-900/30 border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-slate-900/60 transition-colors">
    <div className="flex items-center gap-2 md:gap-3 mb-2">
      <div className="w-4 h-4 md:w-5 md:h-5">{icon}</div>
      <span className="text-blue-300 text-[9px] md:text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-white font-bold truncate ${isEmoji ? 'text-2xl md:text-3xl' : 'text-sm md:text-lg'}`}>{value}</p>
  </div>
);

export default TriviaWrapped;
