
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BarChart3, History, Flame, Trophy, Ghost, Trash2 } from 'lucide-react';
import { TriviaGame } from './types';
import * as storage from './services/storage';
import { getStats } from './utils/stats';
import StatsCard from './components/StatsCard';
import LogEntryModal from './components/LogEntryModal';
import TriviaWrapped from './components/TriviaWrapped';

declare const confetti: any;

const App: React.FC = () => {
  const [games, setGames] = useState<TriviaGame[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'failure' | null>(null);

  // Load from "database" (localStorage) on mount
  useEffect(() => {
    const loadedGames = storage.getGames();
    setGames(loadedGames);
  }, []);

  const stats = useMemo(() => getStats(games), [games]);

  const handleSaveGame = (game: TriviaGame) => {
    const updatedGames = [game, ...games].sort((a, b) => b.timestamp - a.timestamp);
    setGames(updatedGames);
    // Persistent save to database
    storage.saveGames(updatedGames);

    // Performance Feedback
    const percentage = (game.score / 60) * 100;
    if (percentage >= 80) {
      setFeedback('success');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1d4ed8', '#facc15', '#3b82f6'] // Blue and Yellow confetti
      });
    } else {
      setFeedback('failure');
    }

    setTimeout(() => setFeedback(null), 4000);
  };

  const deleteGame = (id: string) => {
    // Explicit confirmation as requested
    if (window.confirm('Are you sure you want to delete this score? This action cannot be undone.')) {
      const updated = games.filter(g => g.id !== id);
      setGames(updated);
      storage.saveGames(updated);
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pb-24 relative overflow-x-hidden">
      {/* Brand Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none -z-10 rounded-full"></div>

      {/* Floating Feedback */}
      {feedback === 'failure' && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-8 rounded-full shadow-2xl flex flex-col items-center">
            <span className="text-8xl">😢</span>
            <p className="text-center text-yellow-400 font-bold mt-4 uppercase tracking-tighter">Under 80%</p>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                Quizspicalble <span className="text-yellow-400">Me!</span>
              </h1>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 ml-9">est. 2024</span>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Log Game</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        {/* High Level Dashboard */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-200">Team Performance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              label="Average Score" 
              value={`${stats.averageScore.toFixed(1)}`} 
              icon={<Trophy className="w-5 h-5" />}
              color="bg-slate-900/50"
            />
            <StatsCard 
              label="Personal Best" 
              value={stats.highestScore.toFixed(1)} 
              icon={<Sparkles className="w-5 h-5" />}
              color="bg-slate-900/50"
            />
            <StatsCard 
              label="Trivia Streak" 
              value={`${stats.currentStreak}`} 
              icon={<Flame className="w-5 h-5" />}
              color="bg-slate-900/50"
            />
            <StatsCard 
              label="Games Played" 
              value={stats.totalGames} 
              icon={<BarChart3 className="w-5 h-5" />}
              color="bg-slate-900/50"
            />
          </div>
        </section>

        {/* Trivia Wrapped */}
        {games.length >= 2 && <TriviaWrapped stats={stats} />}

        {/* Game History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-slate-200">Recent Sessions</h2>
            </div>
            <span className="text-slate-500 text-sm font-medium">{games.length} total entries</span>
          </div>

          <div className="bg-slate-900/50 rounded-3xl border border-blue-900/30 overflow-hidden shadow-xl">
            {games.length === 0 ? (
              <div className="p-12 text-center">
                <Ghost className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Your database is empty. Log a score to begin!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-black tracking-widest border-b border-blue-900/50">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4 text-center">Vibe</th>
                      <th className="px-6 py-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {games.map((game) => (
                      <tr key={game.id} className="hover:bg-blue-600/5 transition-colors group">
                        <td className="px-6 py-4 text-white font-medium">
                          {new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${game.score >= 48 ? 'text-yellow-400' : 'text-slate-200'}`}>
                            {game.score.toFixed(1)}
                          </span>
                          <span className="text-slate-500 text-xs ml-1">/60</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            game.place === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                            game.place === 2 ? 'bg-blue-500/20 text-blue-300' :
                            game.place === 3 ? 'bg-amber-700/20 text-amber-600' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {game.place === 1 ? '🥇 1st' : game.place === 2 ? '🥈 2nd' : game.place === 3 ? '🥉 3rd' : `${game.place}th`}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-400 text-sm italic">
                          {game.guests.length > 0 ? game.guests.join(', ') : 'Solo'}
                        </td>
                        <td className="px-6 py-4 text-center text-xl">
                          {game.emojis || '🧠'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteGame(game.id)}
                            className="text-slate-600 hover:text-red-500 p-2 rounded-lg transition-colors group-hover:bg-red-500/10"
                            title="Delete this score"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Large Mobile Log Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent md:hidden z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 text-yellow-400 stroke-[3px]" />
          <span className="text-xl uppercase tracking-tighter">Log New Game</span>
        </button>
      </div>

      <LogEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveGame} 
      />
    </div>
  );
};

export default App;

const Sparkles = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
