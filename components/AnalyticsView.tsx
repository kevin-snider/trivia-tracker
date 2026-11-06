import React from 'react';
import { 
  Trophy, 
  Swords, 
  Award, 
  Flame, 
  Crown, 
  Sparkles, 
  Film, 
  Clock,
  Calendar,
  Smile,
  Users,
  Target,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { TriviaStats, TriviaGame } from '../types';
import StatsCard from './StatsCard';
import { Button } from './ui/button';
import { formatMonth } from '../utils/stats';

interface AnalyticsViewProps {
  stats: TriviaStats;
  games: TriviaGame[];
  wrappedActive: boolean;
  wrappedYear: number;
  onOpenWrapped: () => void;
  onNavigateToHistory: () => void;
  onOpenLogGame?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  games,
  wrappedActive,
  wrappedYear,
  onOpenWrapped,
  onNavigateToHistory,
  onOpenLogGame
}) => {
  const { league } = stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* SEASONAL TRIVIA WRAPPED BANNER (Active Dec 1st Wed -> Jan 1st Wed) */}
      {wrappedActive && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 border border-amber-500/40 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 shrink-0 mt-0.5">
                <Film className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Seasonal Special
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Dec – Jan</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-100 tracking-tight">
                  {wrappedYear} Trivia Wrapped is Ready!
                </h3>
                <p className="text-xs text-zinc-300">
                  Your team's year in review animated video is available to watch and share.
                </p>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={onOpenWrapped}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs px-4 h-9 rounded-xl shadow-lg shadow-amber-500/20 shrink-0 gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Watch Wrapped Video
            </Button>
          </div>
        </div>
      )}

      {/* Pending Games Prompt if any */}
      {stats.pendingGamesCount > 0 && (
        <div 
          onClick={onNavigateToHistory}
          className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="text-zinc-200">
              You have <strong className="text-amber-400 font-bold">{stats.pendingGamesCount}</strong> pending {stats.pendingGamesCount === 1 ? 'game' : 'games'} waiting for final placement.
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-400 shrink-0">
            Resolve Now &rarr;
          </span>
        </div>
      )}

      {/* 6-GAME OFFICIAL LEAGUE TRACKER & STATS */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-100 tracking-tight flex items-center gap-1.5">
                Official League Season
              </h2>
              <p className="text-[11px] text-zinc-400">Current 6-game championship session · Oct 7 to Nov 4</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              league.isComplete
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
            }`}>
              {league.isComplete 
                ? 'League Completed 🏆' 
                : `Round ${league.leagueGamesPlayed} of 6 Completed`}
            </span>
          </div>
        </div>

        {/* 6-Game Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
            <span>Current League Progress</span>
            <span className="font-mono text-zinc-200">{Math.round((league.leagueGamesPlayed / 6) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${(league.leagueGamesPlayed / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* 6 Game Slots Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {league.gameSlots.map((slot) => {
            const played = Boolean(slot.game);
            const isWin = slot.game?.place === 1;

            return (
              <div
                key={slot.gameNumber}
                className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                  played
                    ? isWin
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-200'
                    : slot.gameNumber === league.leagueGamesPlayed + 1
                      ? 'bg-indigo-500/10 border-indigo-500/40 border-dashed text-zinc-400'
                      : 'bg-zinc-950/40 border-zinc-800/60 border-dashed text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    G{slot.gameNumber}
                  </span>
                  {slot.dateLabel && (
                    <span className="text-[9px] font-semibold text-zinc-400 truncate">
                      {slot.dateLabel}
                    </span>
                  )}
                </div>
                
                {played && slot.game ? (
                  <div className="space-y-0.5">
                    <span className="text-sm font-black font-mono block text-zinc-100">
                      {slot.game.score.toFixed(1)}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${
                      isWin 
                        ? 'bg-amber-500 text-zinc-950 font-black' 
                        : 'text-zinc-400 bg-zinc-700/50'
                    }`}>
                      {slot.game.place ? `${slot.game.place === 1 ? '1st 🥇' : slot.game.place === 2 ? '2nd 🥈' : slot.game.place === 3 ? '3rd 🥉' : slot.game.place + 'th'}` : 'TBD'}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1">
                    {slot.gameNumber === league.leagueGamesPlayed + 1 && onOpenLogGame ? (
                      <button
                        type="button"
                        onClick={onOpenLogGame}
                        className="text-[10px] font-bold px-1.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 w-full transition-colors flex items-center justify-center gap-0.5"
                      >
                        + Log
                      </button>
                    ) : (
                      <div className="text-[10px] italic text-zinc-500 py-1">
                        Upcoming
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* League Aggregate Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800/60 text-xs">
          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block">Total Points</span>
            <strong className="text-sm font-bold font-mono text-zinc-100">
              {league.leagueTotalPoints.toFixed(1)} <span className="text-[10px] text-zinc-500 font-normal">/ 360</span>
            </strong>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block">League Wins</span>
            <strong className="text-sm font-bold font-mono text-amber-400">
              {league.leagueWins} 🥇
            </strong>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block">League Avg Score</span>
            <strong className="text-sm font-bold font-mono text-zinc-100">
              {league.leagueAverageScore > 0 ? league.leagueAverageScore.toFixed(1) : '0.0'}
            </strong>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block">League Avg Place</span>
            <strong className="text-sm font-bold font-mono text-zinc-100">
              {league.leagueAveragePlace > 0 ? `${league.leagueAveragePlace.toFixed(1)}th` : 'N/A'}
            </strong>
          </div>
        </div>
      </section>

      {/* Primary KPI Grid (Games Won, Tie Breakers, Average Place, Peak Score) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Career & Overall Performance
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            label="Games Won"
            value={stats.gamesWon}
            badge={stats.gamesWon > 0 ? `${stats.winRate.toFixed(0)}% Win Rate` : undefined}
            subValue={`${stats.podiumFinishes} podium finishes`}
            icon={<Trophy className="w-4 h-4 text-amber-400" />}
            highlight
          />

          <StatsCard
            label="Tie-Breakers Won"
            value={`${stats.tieBreakersWon} / ${stats.tieBreakersPlayed}`}
            badge={stats.tieBreakersPlayed > 0 ? `${stats.tieBreakerWinRate.toFixed(0)}% Won` : undefined}
            subValue={stats.tieBreakersPlayed > 0 ? 'Sudden death record' : 'No tie-breakers yet'}
            icon={<Swords className="w-4 h-4 text-emerald-400" />}
          />

          <StatsCard
            label="Average Placement"
            value={stats.averagePlace > 0 ? `${stats.averagePlace.toFixed(1)}th` : 'N/A'}
            subValue={`Rank across ${stats.totalGames - stats.pendingGamesCount} placed games`}
            icon={<Award className="w-4 h-4 text-sky-400" />}
          />

          <StatsCard
            label="Peak Score / 60"
            value={stats.highestScore > 0 ? stats.highestScore.toFixed(1) : '0.0'}
            subValue={`Team avg: ${stats.averageScore.toFixed(1)} pts`}
            icon={<Flame className="w-4 h-4 text-orange-400" />}
          />
        </div>
      </section>

      {/* TEAM SIGNATURE VIBE & GUEST MVP (Excluding Kevin & Amanda per user specification) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Team Culture & Guests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Signature Vibe Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Signature Vibe
              </span>
              <h3 className="text-lg font-black text-zinc-100 flex items-center gap-2">
                Most Used Emoji
              </h3>
              <p className="text-xs text-zinc-400">
                Logged across <span className="font-bold text-zinc-200">{stats.mostFrequentEmojiCount}</span> trivia nights
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-3xl shadow-inner select-none">
              {stats.mostFrequentEmoji}
            </div>
          </div>

          {/* MVP Guest Card (Excludes Kevin & Amanda) */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  MVP Guest / Sub
                </span>
                <span className="text-[9px] text-zinc-500 font-normal">(Excludes Captains)</span>
              </div>
              <h3 className="text-lg font-black text-zinc-100 truncate max-w-[140px]">
                {stats.mostFrequentGuest !== 'None' ? stats.mostFrequentGuest : 'No Guests Yet'}
              </h3>
              <p className="text-xs text-zinc-400">
                Top non-captain teammate
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Active Streak Card */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Active Weekly Streak
              </span>
              <h3 className="text-lg font-black text-zinc-100 font-mono">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Week' : 'Weeks'} 🔥
              </h3>
              <p className="text-xs text-zinc-400">
                Consecutive trivia appearances
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Season Stages Breakdown */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Milestones Breakdown
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center space-y-1">
            <span className="text-[11px] text-zinc-400 font-medium">Total Played</span>
            <span className="text-xl font-black text-zinc-100 font-mono block">{stats.totalGames}</span>
            <span className="text-[10px] text-zinc-500">All Sessions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center space-y-1">
            <span className="text-[11px] text-purple-300 font-medium">Championships</span>
            <span className="text-xl font-black text-purple-300 font-mono block">
              {stats.championshipsWon} / {stats.championshipsPlayed}
            </span>
            <span className="text-[10px] text-zinc-500">Playoffs Won 🏆</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center space-y-1">
            <span className="text-[11px] text-amber-300 font-medium">Golden Month</span>
            <span className="text-xs font-bold text-zinc-200 block truncate pt-1">
              {formatMonth(stats.bestMonth)}
            </span>
            <span className="text-[10px] text-zinc-500">Highest Avg Score</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center space-y-1">
            <span className="text-[11px] text-emerald-300 font-medium">High Volume</span>
            <span className="text-xs font-bold text-zinc-200 block truncate pt-1">
              {formatMonth(stats.mostAttendedMonth)}
            </span>
            <span className="text-[10px] text-zinc-500">Most Attended</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsView;
