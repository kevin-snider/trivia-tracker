
import React, { useState } from 'react';
import { X, Calendar, Trophy, Users, Hash, Smile } from 'lucide-react';
import { TriviaGame } from '../types';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: TriviaGame) => void;
}

const LogEntryModal: React.FC<LogEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<string>('');
  const [place, setPlace] = useState<number>(1);
  const [emojis, setEmojis] = useState('');
  const [guestInput, setGuestInput] = useState('');
  const [guests, setGuests] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = parseFloat(score);
    if (isNaN(finalScore) || finalScore < 0 || finalScore > 60) {
      alert('Please enter a valid score between 0 and 60');
      return;
    }

    const newGame: TriviaGame = {
      id: crypto.randomUUID(),
      date,
      score: finalScore,
      place,
      emojis,
      guests: [...guests, ...(guestInput.trim() ? [guestInput.trim()] : [])],
      timestamp: Date.now(),
    };

    onSave(newGame);
    onClose();
    // Reset fields
    setScore('');
    setEmojis('');
    setGuests([]);
    setGuestInput('');
  };

  const addGuest = () => {
    if (guestInput.trim()) {
      setGuests([...guests, guestInput.trim()]);
      setGuestInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-950 border border-blue-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-blue-900/50 flex justify-between items-center bg-blue-950/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Log Quiz Result
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Big Score Field */}
          <div className="text-center space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Hash className="w-3 h-3 text-blue-500" /> Score Out of 60
            </label>
            <div className="relative group">
              <input
                type="number"
                step="0.1"
                required
                placeholder="00.0"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full bg-transparent text-white text-7xl md:text-8xl font-black text-center placeholder-slate-800 focus:outline-none focus:text-yellow-400 transition-all selection:bg-yellow-400 selection:text-blue-950"
              />
              <div className="h-1 w-24 bg-blue-900 mx-auto rounded-full group-focus-within:bg-yellow-400 transition-colors mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Quiz Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-3 h-3" /> Final Place
              </label>
              <select
                value={place}
                onChange={(e) => setPlace(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? '1st Place' : n === 2 ? '2nd Place' : n === 3 ? '3rd Place' : `${n}th Place`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Smile className="w-3 h-3" /> Vibe Check (Emojis)
              </label>
              <input
                type="text"
                placeholder="🔥 🎉 🧠 ..."
                value={emojis}
                onChange={(e) => setEmojis(e.target.value)}
                className="w-full bg-slate-900 border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" /> Guests
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name..."
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                  className="flex-1 bg-slate-900 border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="bg-blue-700 hover:bg-blue-600 px-6 py-2 rounded-xl text-white font-bold transition-colors"
                >
                  Add
                </button>
              </div>
              {guests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {guests.map((g, i) => (
                    <span key={i} className="bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full text-xs border border-yellow-500/30 flex items-center gap-2 font-bold uppercase tracking-tight">
                      {g}
                      <button type="button" onClick={() => setGuests(guests.filter((_, idx) => idx !== i))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-5 rounded-2xl shadow-2xl shadow-yellow-500/20 transition-all duration-300 uppercase tracking-widest text-sm active:scale-95"
          >
            Confirm & Save Result
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogEntryModal;
