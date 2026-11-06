import React, { useState } from 'react';
import { Trophy, Swords, X, Check } from 'lucide-react';
import { TriviaGame } from '../types';
import { Button } from './ui/button';

interface QuickPlaceModalProps {
  game: TriviaGame | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePlace: (gameId: string, place: number, tieBreaker?: { occurred: boolean; won: boolean }) => void;
}

export const QuickPlaceModal: React.FC<QuickPlaceModalProps> = ({
  game,
  isOpen,
  onClose,
  onSavePlace
}) => {
  const [selectedPlace, setSelectedPlace] = useState<number>(1);
  const [tieBreakerOccurred, setTieBreakerOccurred] = useState<boolean>(game?.tieBreaker?.occurred || false);
  const [tieBreakerWon, setTieBreakerWon] = useState<boolean>(game?.tieBreaker?.won || false);

  if (!isOpen || !game) return null;

  const handleConfirm = () => {
    onSavePlace(game.id, selectedPlace, {
      occurred: tieBreakerOccurred,
      won: tieBreakerOccurred ? tieBreakerWon : false
    });
    onClose();
  };

  const placeOptions = [
    { rank: 1, label: '1st Place 🥇', badge: 'Winner' },
    { rank: 2, label: '2nd Place 🥈', badge: 'Podium' },
    { rank: 3, label: '3rd Place 🥉', badge: 'Podium' },
    { rank: 4, label: '4th Place', badge: '' },
    { rank: 5, label: '5th Place', badge: '' },
    { rank: 6, label: '6th Place', badge: '' },
    { rank: 7, label: '7th Place', badge: '' },
    { rank: 8, label: '8th Place+', badge: '' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 text-zinc-100 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-zinc-100">Set Final Place</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Score <span className="font-bold text-zinc-200 font-mono">{game.score.toFixed(1)}/60</span> on {new Date(game.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>

        {/* Place Selection Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {placeOptions.map((opt) => (
            <button
              key={opt.rank}
              type="button"
              onClick={() => setSelectedPlace(opt.rank)}
              className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                selectedPlace === opt.rank
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/30'
                  : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span>{opt.label}</span>
              {selectedPlace === opt.rank && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Tie Breaker Toggle */}
        <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-indigo-400" /> Tied Round?
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !tieBreakerOccurred;
                setTieBreakerOccurred(next);
                if (!next) setTieBreakerWon(false);
              }}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                tieBreakerOccurred
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {tieBreakerOccurred ? 'Yes' : 'No'}
            </button>
          </div>

          {tieBreakerOccurred && (
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Did we win tie-breaker?</span>
              <button
                type="button"
                onClick={() => setTieBreakerWon(!tieBreakerWon)}
                className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 border ${
                  tieBreakerWon
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                }`}
              >
                {tieBreakerWon ? '🏆 Won Tie!' : 'Lost Tie'}
              </button>
            </div>
          )}
        </div>

        <div className="pt-1 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-10 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-10 text-xs font-bold shadow-md shadow-indigo-900/30"
          >
            Confirm Rank
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickPlaceModal;
