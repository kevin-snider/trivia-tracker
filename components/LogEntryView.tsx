
import React, { useState } from 'react';
import { Calendar, Trophy, Users, Hash, Smile, ChevronLeft, X } from 'lucide-react';
import { TriviaGame } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface LogEntryViewProps {
  onSave: (game: TriviaGame) => void;
  onCancel: () => void;
  initialData?: TriviaGame;
}

const LogEntryView: React.FC<LogEntryViewProps> = ({ onSave, onCancel, initialData }) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<string>(initialData?.score !== undefined ? String(initialData.score) : '');
  const [place, setPlace] = useState<number>(initialData?.place || 1);
  const [emojis, setEmojis] = useState(initialData?.emojis || '');
  const [guestInput, setGuestInput] = useState('');
  const [guests, setGuests] = useState<string[]>(initialData?.guests || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = parseFloat(score);
    if (isNaN(finalScore) || finalScore < 0 || finalScore > 60) {
      toast.error('Invalid score', { description: 'Please enter a valid score between 0 and 60' });
      return;
    }

    const savedGame: TriviaGame = {
      id: initialData?.id || crypto.randomUUID(),
      date,
      score: finalScore,
      place,
      emojis,
      guests: [...guests, ...(guestInput.trim() ? [guestInput.trim()] : [])],
      timestamp: initialData?.timestamp || Date.now(),
    };

    onSave(savedGame);
  };

  const addGuest = () => {
    if (guestInput.trim()) {
      setGuests([...guests, guestInput.trim()]);
      setGuestInput('');
    }
  };

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 dark:text-slate-500 uppercase text-[10px] font-black tracking-widest pl-0 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-transparent">
          <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-slate-100">
          {initialData ? 'Edit Game' : 'Log New Game'}
        </CardTitle>
        <div className="w-16"></div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          <div className="text-center space-y-2">
            <Label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase flex items-center justify-center gap-2">
              <Hash className="w-3 h-3 text-blue-500" /> Score / 60
            </Label>
            <Input
              type="number"
              step="0.1"
              required
              autoFocus
              placeholder="00.0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="text-6xl md:text-8xl font-black text-center h-24 md:h-32 focus-visible:ring-offset-0 focus-visible:ring-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-200 dark:placeholder:text-slate-800"
            />
            <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Quiz Date
              </Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Trophy className="w-3 h-3" /> Final Place
              </Label>
              <Select value={String(place)} onValueChange={(val) => setPlace(parseInt(val))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 1 ? '🥇 1st Place' : n === 2 ? '🥈 2nd Place' : n === 3 ? '🥉 3rd Place' : `${n}th Place`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Smile className="w-3 h-3" /> Vibe (Emojis)
              </Label>
              <Input
                type="text"
                placeholder="🔥 🧠 🏆 ..."
                value={emojis}
                onChange={(e) => setEmojis(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Users className="w-3 h-3" /> Guest List
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add names..."
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                  className="flex-1"
                />
                <Button type="button" onClick={addGuest} variant="secondary" className="uppercase font-bold tracking-widest text-xs">
                  Add
                </Button>
              </div>
              {guests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {guests.map((g, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-[10px] flex items-center gap-2 font-black uppercase tracking-wider">
                      {g}
                      <button type="button" onClick={() => setGuests(guests.filter((_, idx) => idx !== i))} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full font-black py-7 rounded-2xl uppercase tracking-[0.2em] text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/10 border-none transition-all hover:-translate-y-1">
            {initialData ? 'Update Game' : 'Save Game'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogEntryView;
