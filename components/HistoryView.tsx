import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Pencil, 
  Trash2, 
  Clock, 
  Swords, 
  Trophy, 
  Crown, 
  Beer, 
  Flag,
  Sparkles
} from 'lucide-react';
import { TriviaGame } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface HistoryViewProps {
  games: TriviaGame[];
  onEditGame: (game: TriviaGame) => void;
  onDeleteGame: (id: string) => void;
  onQuickPlace: (game: TriviaGame) => void;
  onLogGame: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  games,
  onEditGame,
  onDeleteGame,
  onQuickPlace,
  onLogGame
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'wins' | 'pending' | 'championship' | 'tiebreakers'>('all');

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        g.date.includes(query) ||
        (g.emojis && g.emojis.toLowerCase().includes(query)) ||
        (g.championshipPlacement && g.championshipPlacement.toLowerCase().includes(query)) ||
        (g.guests && g.guests.some(name => name.toLowerCase().includes(query)));

      if (!matchesSearch) return false;

      if (filterType === 'wins') return g.place === 1;
      if (filterType === 'pending') return g.place === null || g.place === undefined || g.place === 0;
      if (filterType === 'championship') return g.seasonType === 'championship';
      if (filterType === 'tiebreakers') return Boolean(g.tieBreaker?.occurred);
      return true;
    });
  }, [games, searchQuery, filterType]);

  const pendingCount = games.filter(g => g.place === null || g.place === undefined || g.place === 0).length;
  const winsCount = games.filter(g => g.place === 1).length;
  const champCount = games.filter(g => g.seasonType === 'championship').length;
  const tieCount = games.filter(g => g.tieBreaker?.occurred).length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header & Filter Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-zinc-100 tracking-tight">
              Games History
            </h1>
            <p className="text-xs text-zinc-400">
              {games.length} total trivia nights recorded
            </p>
          </div>
        </div>

        {/* Filter Scrollable Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({games.length})
          </button>
          
          <button
            type="button"
            onClick={() => setFilterType('wins')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'wins'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Wins 🥇 ({winsCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'pending'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pending ⏳ ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('championship')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'championship'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Playoffs 🏆 ({champCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('tiebreakers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === 'tiebreakers'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ties ⚡ ({tieCount})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search dates, guests, or vibes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-zinc-900/70 border-zinc-800 text-zinc-100 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* List Feed */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/60 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400">
            <Beer className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200">No games found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchQuery || filterType !== 'all' 
              ? 'No games match your search or filter.'
              : 'Log your first trivia night to start building your ledger!'}
          </p>
          <Button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              onLogGame();
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl h-9"
          >
            Log New Game
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGames.map((game) => {
            const isPending = game.place === null || game.place === undefined || game.place === 0;
            const isWinner = game.place === 1;
            const hadTieBreaker = Boolean(game.tieBreaker?.occurred);
            const wonTieBreaker = hadTieBreaker && Boolean(game.tieBreaker?.won);

            return (
              <div
                key={game.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isWinner
                    ? 'bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/40 shadow-sm shadow-amber-500/5'
                    : isPending
                    ? 'bg-zinc-900/80 border-amber-500/30'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Standing Badge, Date, Score, Tags */}
                  <div className="flex items-center gap-3.5">
                    {/* Rank Indicator */}
                    <div className="shrink-0">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => onQuickPlace(game)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1 transition-colors"
                          title="Tap to resolve final place"
                        >
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Set Place
                        </button>
                      ) : (
                        <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-black ${
                          isWinner 
                            ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20' 
                            : game.place === 2
                            ? 'bg-zinc-700 text-zinc-100'
                            : game.place === 3
                            ? 'bg-amber-900/60 text-amber-200 border border-amber-800'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          <span className="text-sm leading-none font-mono">
                            {game.place}
                          </span>
                          <span className="text-[9px] uppercase font-bold tracking-tighter">
                            {game.place === 1 ? '1st' : game.place === 2 ? '2nd' : game.place === 3 ? '3rd' : 'Place'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date, Season Stage, Tie-Breakers */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-zinc-100">
                          {new Date(game.date + 'T00:00:00').toLocaleDateString(undefined, { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>

                        {/* Season Stage Tag */}
                        {game.seasonType === 'championship' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                            <Crown className="w-3 h-3" /> Championship
                          </span>
                        )}

                        {game.seasonType === 'opener' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                            <Flag className="w-3 h-3" /> Opener
                          </span>
                        )}

                        {game.seasonType === 'one-off' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
                            Exhibition
                          </span>
                        )}

                        {/* Tie-Breaker Tag */}
                        {hadTieBreaker && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            wonTieBreaker
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                          }`}>
                            <Swords className="w-3 h-3" />
                            {wonTieBreaker ? 'Won Tie' : 'Lost Tie'}
                          </span>
                        )}
                      </div>

                      {/* Championship note or Score metadata */}
                      <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                        <span>Score: <strong className="text-zinc-100 font-mono">{game.score.toFixed(1)}/60</strong></span>
                        <span>·</span>
                        <span>Vibe: <span className="text-sm select-none">{game.emojis || '🧠'}</span></span>
                        {game.championshipPlacement && (
                          <>
                            <span>·</span>
                            <span className="text-purple-300 font-semibold">{game.championshipPlacement}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Guest avatars & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                    {game.guests && game.guests.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {game.guests.slice(0, 3).map((name, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium"
                          >
                            {name}
                          </span>
                        ))}
                        {game.guests.length > 3 && (
                          <span className="text-[10px] text-zinc-400">+{game.guests.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">No guests</span>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditGame(game)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                        title="Edit trivia entry"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteGame(game.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
