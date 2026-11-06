import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Trophy, 
  Users, 
  Hash, 
  Smile, 
  Swords, 
  Check, 
  Sparkles, 
  Flag,
  Crown
} from 'lucide-react';
import { TriviaGame, SeasonType } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: TriviaGame) => void;
  initialData?: TriviaGame | null;
}

const QUICK_EMOJIS = ['🔥', '🧠', '🏆', '🍻', '🎯', '👑', '🚀', '🍕', '🎉', '⚡'];

export const LogEntryModal: React.FC<LogEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<string>('');
  const [place, setPlace] = useState<number | null>(null); // null = Pending
  const [seasonType, setSeasonType] = useState<SeasonType>('regular');
  const [championshipPlacement, setChampionshipPlacement] = useState<string>('League Champions 🏆');
  const [tieBreakerOccurred, setTieBreakerOccurred] = useState<boolean>(false);
  const [tieBreakerWon, setTieBreakerWon] = useState<boolean>(false);
  const [emojis, setEmojis] = useState('');
  const [guestInput, setGuestInput] = useState('');
  const [guests, setGuests] = useState<string[]>([]);
  const emojiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setScore(initialData.score !== undefined ? String(initialData.score) : '');
      setPlace(initialData.place);
      setSeasonType(initialData.seasonType || 'regular');
      setChampionshipPlacement(initialData.championshipPlacement || 'League Champions 🏆');
      setTieBreakerOccurred(Boolean(initialData.tieBreaker?.occurred));
      setTieBreakerWon(Boolean(initialData.tieBreaker?.won));
      setEmojis(initialData.emojis || '');
      setGuests(initialData.guests || []);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setScore('');
      setPlace(null); // default to Pending for live night games
      setSeasonType('regular');
      setChampionshipPlacement('League Champions 🏆');
      setTieBreakerOccurred(false);
      setTieBreakerWon(false);
      setEmojis('🍻');
      setGuests([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = parseFloat(score);
    if (isNaN(finalScore) || finalScore < 0 || finalScore > 60) {
      toast.error('Invalid score', { description: 'Please enter a valid trivia score between 0 and 60' });
      return;
    }

    const savedGame: TriviaGame = {
      id: initialData?.id || crypto.randomUUID(),
      date,
      score: finalScore,
      place,
      seasonType,
      championshipPlacement: seasonType === 'championship' ? championshipPlacement : undefined,
      tieBreaker: {
        occurred: tieBreakerOccurred,
        won: tieBreakerOccurred ? tieBreakerWon : false
      },
      emojis: emojis.trim() || '🧠',
      guests: [...guests, ...(guestInput.trim() ? [guestInput.trim()] : [])],
      timestamp: initialData?.timestamp || Date.now()
    };

    onSave(savedGame);
    onClose();
  };

  const addGuest = () => {
    if (guestInput.trim()) {
      if (!guests.includes(guestInput.trim())) {
        setGuests([...guests, guestInput.trim()]);
      }
      setGuestInput('');
    }
  };

  const addQuickEmoji = (emoji: string) => {
    setEmojis((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl text-zinc-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 tracking-tight">
                {initialData ? 'Edit Trivia Night' : 'Log Trivia Night'}
              </h2>
              <p className="text-xs text-zinc-400">Record scores, season stage, and tie-breakers</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          
          {/* Season Stage Segmented Toggle */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-indigo-400" /> Season Stage
            </Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => setSeasonType('regular')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  seasonType === 'regular'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Regular Season
              </button>
              
              <button
                type="button"
                onClick={() => setSeasonType('opener')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  seasonType === 'opener'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Season Opener
              </button>
              
              <button
                type="button"
                onClick={() => setSeasonType('championship')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  seasonType === 'championship'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Championship 🏆
              </button>
              
              <button
                type="button"
                onClick={() => setSeasonType('one-off')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  seasonType === 'one-off'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                One-Off Pop-Up
              </button>
            </div>

            {/* Contextual Championship Options */}
            {seasonType === 'championship' && (
              <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1.5 animate-in fade-in duration-200">
                <Label className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Championship Outcome
                </Label>
                <select
                  value={championshipPlacement}
                  onChange={(e) => setChampionshipPlacement(e.target.value)}
                  className="w-full h-9 rounded-lg bg-zinc-950 border border-purple-800/50 px-3 text-xs text-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="League Champions 🏆">🏆 League Champions (Trophy Winners!)</option>
                  <option value="Championship Runner-Up 🥈">🥈 Championship Runner-Up (2nd Place)</option>
                  <option value="Championship 3rd Place 🥉">🥉 Championship 3rd Place Podium</option>
                  <option value="Playoff Semifinalist 🎖️">🎖️ Playoff Semifinalist</option>
                  <option value="Tournament Participant">Tournament Finalist</option>
                </select>
              </div>
            )}

            {seasonType === 'opener' && (
              <p className="text-[11px] text-amber-400/90 pl-1">
                ⭐ Opening Night of the season benchmark game
              </p>
            )}

            {seasonType === 'one-off' && (
              <p className="text-[11px] text-zinc-400 pl-1">
                ☕ Exhibition or friendly match that won't skew your core league season metrics
              </p>
            )}
          </div>

          {/* Big Score Field */}
          <div className="text-center py-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80 p-4">
            <Label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
              <Hash className="w-3.5 h-3.5 text-indigo-400" /> Score / 60
            </Label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              placeholder="00.0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-transparent text-5xl sm:text-6xl font-black text-center text-zinc-100 focus:outline-none focus:text-amber-400 placeholder:text-zinc-800 font-mono tracking-tight"
            />
            <p className="text-[11px] text-zinc-500 mt-1">48+ is eligible for gold status</p>
          </div>

          {/* Date & Placement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Quiz Date
              </Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-zinc-950/80 border-zinc-800 text-zinc-100 h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Final Standing
                </Label>
                {place === null && (
                  <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Pending
                  </span>
                )}
              </div>
              
              <div className="relative">
                <select
                  value={place === null ? 'pending' : String(place)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlace(val === 'pending' ? null : parseInt(val));
                  }}
                  className="w-full h-10 rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="pending">⏳ Pending / In Progress (Set Later)</option>
                  <option value="1">🥇 1st Place (Winner!)</option>
                  <option value="2">🥈 2nd Place</option>
                  <option value="3">🥉 3rd Place</option>
                  <option value="4">4th Place</option>
                  <option value="5">5th Place</option>
                  <option value="6">6th Place</option>
                  <option value="7">7th Place</option>
                  <option value="8">8th Place</option>
                  <option value="9">9th Place</option>
                  <option value="10">10th Place+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tie-Breaker Section */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-zinc-200">Tie-Breaker Round</span>
                  <p className="text-[11px] text-zinc-400">Did your team play a tie-breaker question?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextOccurred = !tieBreakerOccurred;
                  setTieBreakerOccurred(nextOccurred);
                  if (!nextOccurred) setTieBreakerWon(false);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  tieBreakerOccurred
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tieBreakerOccurred ? 'Yes, Tied' : 'No Tie'}
              </button>
            </div>

            {tieBreakerOccurred && (
              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between animate-in fade-in duration-200">
                <span className="text-xs text-zinc-300 font-medium">Outcome: Did we win the tie-breaker?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTieBreakerWon(true)}
                    className={`px-3 py-1 text-xs font-bold rounded-md border transition-all flex items-center gap-1 ${
                      tieBreakerWon
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm shadow-emerald-900/30'
                        : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Won Tie-Breaker
                  </button>
                  <button
                    type="button"
                    onClick={() => setTieBreakerWon(false)}
                    className={`px-3 py-1 text-xs font-bold rounded-md border transition-all ${
                      !tieBreakerWon
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-200'
                        : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Lost Tie
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vibe & Emoji Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-sky-400" /> Team Vibe & Emojis
              </Label>
              <button
                type="button"
                onClick={() => emojiInputRef.current?.focus()}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Focus Emoji Keyboard
              </button>
            </div>

            <Input
              ref={emojiInputRef}
              type="text"
              placeholder="Tap to open emoji keyboard (e.g. 🔥 🧠 🍻)..."
              value={emojis}
              onChange={(e) => setEmojis(e.target.value)}
              className="bg-zinc-950/80 border-zinc-800 text-zinc-100 text-base h-11"
            />

            {/* Quick Tap Emoji Shelf */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-zinc-500 mr-1">Quick pick:</span>
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addQuickEmoji(emoji)}
                  className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 flex items-center justify-center text-sm hover:scale-110 active:scale-95 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Guest List */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Guests / Attending Team Members
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter member or guest name..."
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGuest();
                  }
                }}
                className="bg-zinc-950/80 border-zinc-800 text-zinc-100 flex-1 h-10"
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={addGuest}
                className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 font-semibold px-4 h-10"
              >
                Add
              </Button>
            </div>

            {guests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {guests.map((name, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/70"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => setGuests(guests.filter((_, idx) => idx !== i))}
                      className="text-zinc-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-sm tracking-wide transition-all"
            >
              {initialData ? 'Update Trivia Record' : 'Save Trivia Night'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogEntryModal;
