
import React, { useState } from 'react';
import { Calendar, Trophy, Users, Hash, Smile, ChevronLeft } from 'lucide-react';
import { TriviaGame } from '../types';

interface LogEntryViewProps {
  onSave: (game: TriviaGame) => void;
  onCancel: () => void;
}

const LogEntryView: React.FC<LogEntryViewProps> = ({ onSave, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<string>('');
  const [place, setPlace] = useState<number>(1);
  const [emojis, setEmojis] = useState('');
  const [guestInput, setGuestInput] = useState('');
  const [guests, setGuests] = useState<string[]>([]);

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
  };

  const addGuest = () => {
    if (guestInput.trim()) {
      setGuests([...guests, guestInput.trim()]);
      setGuestInput('');
    }
  };

  return (
    <div className="space-y-8 bg-slate-900/40 p-8 rounded-[2rem] border border-blue-900/20 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Cancel
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Log New Game</h2>
        <div className="w-12"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Big Score Field */}
        <div className="text-center space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <Hash className="w-3 h-3 text-blue-500" /> Score / 60
          </label>
          <div className="relative group">
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              placeholder="00.0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-transparent text-white text-8xl md:text-9xl font-black text-center placeholder-slate-900 focus:outline-none focus:text-yellow-400 transition-all selection:bg-yellow-400 selection:text-blue-950"
            />
            <div className="h-1.5 w-32 bg-blue-900/50 mx-auto rounded-full group-focus-within:bg-yellow-400 transition-colors mt-2 shadow-[0_0_20px_rgba(250,204,21,0.2)]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Quiz Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-blue-900/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-3 h-3" /> Final Place
            </label>
            <select
              value={place}
              onChange={(e) => setPlace(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-blue-900/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none transition-all"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n === 1 ? '1st Place' : n === 2 ? '2nd Place' : n === 3 ? '3rd Place' : `${n}th Place`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Smile className="w-3 h-3" /> Vibe (Emojis)
            </label>
            <input
              type="text"
              placeholder="🔥 🧠 🏆 ..."
              value={emojis}
              onChange={(e) => setEmojis(e.target.value)}
              className="w-full bg-slate-950 border border-blue-900/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Guest List
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add names..."
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                className="flex-1 bg-slate-950 border border-blue-900/30 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              />
              <button
                type="button"
                onClick={addGuest}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Add
              </button>
            </div>
            {guests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {guests.map((g, i) => (
                  <span key={i} className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-[10px] border border-blue-500/20 flex items-center gap-2 font-black uppercase tracking-wider">
                    {g}
                    <button type="button" onClick={() => setGuests(guests.filter((_, idx) => idx !== i))}>
                      <ChevronLeft className="w-3 h-3 rotate-45 text-red-400" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black py-6 rounded-3xl shadow-2xl shadow-yellow-400/20 transition-all duration-300 uppercase tracking-[0.2em] text-sm active:scale-95 border-b-4 border-yellow-600 active:border-b-0"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default LogEntryView;
