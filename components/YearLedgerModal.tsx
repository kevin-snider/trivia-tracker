import React, { useState } from 'react';
import { X, Trophy, Swords, Calendar, Search, Download, ArrowUpDown } from 'lucide-react';
import { ArchivedSeason, TriviaGame } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { exportGamesToJSON } from '../services/storage';
import { toast } from 'sonner';

interface YearLedgerModalProps {
  archive: ArchivedSeason | null;
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

export const YearLedgerModal: React.FC<YearLedgerModalProps> = ({
  archive,
  isOpen,
  onClose,
  teamName
}) => {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen || !archive) return null;

  const filteredGames = archive.games
    .filter((g) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        g.date.includes(q) ||
        g.emojis.toLowerCase().includes(q) ||
        (g.guests && g.guests.some(guest => guest.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  const handleDownload = () => {
    exportGamesToJSON(archive.games, `${teamName}_${archive.label}`);
    toast.success(`Exported ${archive.label} JSON file`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-2xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Grab Bar */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header with Neon Theme Accent */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {archive.artworkUrl ? (
              <img 
                src={archive.artworkUrl} 
                alt="Season Artwork" 
                className="w-10 h-13 rounded-lg object-cover border border-amber-500/40 shadow-sm shrink-0" 
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-base font-black text-zinc-100 tracking-tight">
                {archive.label} Ledger
              </h2>
              <p className="text-xs text-zinc-400">
                {archive.gamesCount} games recorded · {teamName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs h-8 px-2.5 gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download JSON</span>
            </Button>
            
            <button 
              type="button" 
              onClick={onClose} 
              className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-950/40 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search date, vibe, or teammates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-zinc-900 border-zinc-800 rounded-lg"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
            className="text-xs text-zinc-400 hover:text-zinc-200 h-8 px-2 gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortAsc ? 'Oldest First' : 'Newest First'}</span>
          </Button>
        </div>

        {/* Games List Feed */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[65vh]">
          {filteredGames.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No games match your search query.
            </div>
          ) : (
            filteredGames.map((game, idx) => {
              const isWinner = game.place === 1;
              const isPodium = game.place && game.place <= 3;
              const hadTieBreaker = Boolean(game.tieBreaker?.occurred);

              return (
                <div 
                  key={game.id || idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isWinner 
                      ? 'bg-amber-500/10 border-amber-500/40 text-zinc-100' 
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Place Badge */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isWinner 
                        ? 'bg-amber-500 text-zinc-950 font-bold' 
                        : isPodium
                        ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {game.place ? `${game.place}` : 'TBD'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-zinc-200">
                          {new Date(game.date + 'T00:00:00').toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        
                        {isWinner && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            1st Place 🥇
                          </span>
                        )}

                        {hadTieBreaker && (
                          <span className="text-[10px] text-indigo-400 font-medium">
                            ⚡ Tie-Break
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <span>Score: <strong className="text-zinc-200 font-mono font-bold">{game.score.toFixed(1)}/60</strong></span>
                        <span>·</span>
                        <span className="text-sm select-none">{game.emojis}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-200 block">
                      {game.score.toFixed(1)} pts
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {game.place === 1 ? 'Winner' : `${game.place}th Place`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default YearLedgerModal;
