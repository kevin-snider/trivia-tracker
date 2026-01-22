
import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Users, Calendar, Award, Star, Trophy } from 'lucide-react';
import { TriviaStats } from '../types';
import { formatMonth } from '../utils/stats';

interface TriviaWrappedProps {
  stats: TriviaStats;
}

const TriviaWrapped: React.FC<TriviaWrappedProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-slate-950 rounded-3xl p-8 shadow-2xl border border-yellow-500/20 relative overflow-hidden mb-12">
      {/* Brand Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-3xl -z-0 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl -z-0 rounded-full"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-yellow-400 p-2.5 rounded-2xl shadow-lg shadow-yellow-400/20">
            <Sparkles className="w-8 h-8 text-blue-950" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Quizspicalble <span className="text-yellow-400">Wrapped</span>
            </h2>
            <p className="text-blue-200/50 font-bold text-xs uppercase tracking-[0.3em] mt-1">2024 Season Highs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <TrendingUp className="w-10 h-10 text-yellow-400 mb-3" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Elite Performance</h4>
            <span className="text-2xl font-black text-white leading-tight">{formatMonth(stats.bestMonth)}</span>
            <p className="text-yellow-400/70 text-[10px] font-bold mt-2 uppercase">AVG SCORE: {stats.averageScore.toFixed(1)}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <Calendar className="w-10 h-10 text-blue-400 mb-3" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Most Dedicated</h4>
            <span className="text-2xl font-black text-white leading-tight">{formatMonth(stats.mostAttendedMonth)}</span>
            <p className="text-blue-300/70 text-[10px] font-bold mt-2 uppercase">Max Attendance</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <Award className="w-10 h-10 text-yellow-400 mb-3" />
            <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Hall of Fame</h4>
            <span className="text-2xl font-black text-white leading-tight">{stats.highestScore.toFixed(1)}/60</span>
            <p className="text-yellow-400/70 text-[10px] font-bold mt-2 uppercase">All-Time Legend</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-wider">Toughest Month</span>
            </div>
            <p className="text-white font-bold">{formatMonth(stats.worstMonth)}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-wider">Top Vibe</span>
            </div>
            <p className="text-2xl">{stats.mostFrequentEmoji}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-wider">MVP Guest</span>
            </div>
            <p className="text-white font-bold truncate">{stats.mostFrequentGuest}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-wider">Lowest Point</span>
            </div>
            <p className="text-white font-bold">{stats.lowestScore.toFixed(1)}</p>
          </div>
        </div>

        <div className="mt-12 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
             <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-yellow-400" />
               Team Insight
             </h3>
             <p className="text-blue-200/70 text-sm leading-relaxed max-w-lg">
                Quizspicalble Me! averages <span className="text-yellow-400 font-black">{stats.averagePlace.toFixed(1)}th</span> place. 
                {stats.averageScore > 45 ? " That's some high-IQ business right there." : " Time for another study session at the pub!"}
             </p>
          </div>
          <div className="text-right">
             <div className="text-6xl font-black text-yellow-400/10 select-none">EST. 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaWrapped;
