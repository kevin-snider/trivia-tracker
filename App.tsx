
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  BarChart3, 
  History, 
  Flame, 
  Trophy, 
  Ghost, 
  Trash2, 
  Download, 
  Upload, 
  Database, 
  CheckCircle2,
  Home,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { TriviaGame } from './types';
import * as storage from './services/storage';
import { getStats } from './utils/stats';
import StatsCard from './components/StatsCard';
import LogEntryModal from './components/LogEntryModal';
import TriviaWrapped from './components/TriviaWrapped';
import LogEntryView from './components/LogEntryView';

declare const confetti: any;

type View = 'home' | 'new-game' | 'wrapped';

const App: React.FC = () => {
  const [games, setGames] = useState<TriviaGame[]>([]);
  const [activeView, setActiveView] = useState<View>('home');
  const [feedback, setFeedback] = useState<'success' | 'failure' | null>(null);
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from "database" (localStorage) on mount
  useEffect(() => {
    const loadedGames = storage.getGames();
    setGames(loadedGames);
  }, []);

  const stats = useMemo(() => getStats(games), [games]);

  const handleSaveGame = (game: TriviaGame) => {
    const updatedGames = [game, ...games].sort((a, b) => b.timestamp - a.timestamp);
    setGames(updatedGames);
    storage.saveGames(updatedGames);
    
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);

    const percentage = (game.score / 60) * 100;
    if (percentage >= 80) {
      setFeedback('success');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1d4ed8', '#facc15', '#3b82f6']
      });
    } else {
      setFeedback('failure');
    }

    // After saving, go back home
    setTimeout(() => {
      setFeedback(null);
      setActiveView('home');
    }, 2000);
  };

  const deleteGame = (id: string) => {
    if (window.confirm('Are you sure you want to delete this score? This action cannot be undone.')) {
      const updated = games.filter(g => g.id !== id);
      setGames(updated);
      storage.saveGames(updated);
      
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `QuizspicalbleMe_Backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedGames = JSON.parse(content);
        if (Array.isArray(importedGames)) {
          if (window.confirm(`Import ${importedGames.length} games? This will overwrite your current browser data.`)) {
            setGames(importedGames);
            storage.saveGames(importedGames);
            alert('Database restored successfully!');
          }
        }
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen pb-32 md:pb-24 relative overflow-x-hidden bg-slate-950">
      {/* Brand Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none -z-10 rounded-full"></div>

      {/* Floating Feedback */}
      {feedback === 'failure' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-12 rounded-full shadow-2xl flex flex-col items-center">
            <span className="text-9xl">😢</span>
            <p className="text-center text-yellow-400 font-black mt-4 uppercase tracking-tighter text-2xl">Under 80%...</p>
          </div>
        </div>
      )}

      {/* Desktop Header & Nav */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-blue-900/50">
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
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-9">est. 2024</span>
              {saveStatus && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold animate-pulse">
                   <CheckCircle2 className="w-3 h-3" /> SYNCED
                </span>
              )}
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveView('home')}
              className={`text-sm font-black uppercase tracking-widest transition-colors ${activeView === 'home' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('wrapped')}
              className={`text-sm font-black uppercase tracking-widest transition-colors ${activeView === 'wrapped' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
            >
              Wrapped
            </button>
            <button 
              onClick={() => setActiveView('new-game')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Log Game</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        {activeView === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Dashboard Stats */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-slate-200 uppercase tracking-tight">Analytics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Avg Score" value={stats.averageScore.toFixed(1)} icon={<Trophy className="w-5 h-5" />} />
                <StatsCard label="Best Score" value={stats.highestScore.toFixed(1)} icon={<StarIcon className="w-5 h-5" />} />
                <StatsCard label="Streak" value={stats.currentStreak} icon={<Flame className="w-5 h-5" />} />
                <StatsCard label="Total Games" value={stats.totalGames} icon={<BarChart3 className="w-5 h-5" />} />
              </div>
            </section>

            {/* History Table */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-slate-200 uppercase tracking-tight">Recent Sessions</h2>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-3xl border border-blue-900/20 overflow-hidden shadow-2xl">
                {games.length === 0 ? (
                  <div className="p-20 text-center">
                    <Ghost className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No history found. Log your first game!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-blue-900/30">
                        <tr>
                          <th className="px-6 py-5">Date</th>
                          <th className="px-6 py-5">Score</th>
                          <th className="px-6 py-5">Rank</th>
                          <th className="px-6 py-5">Vibe</th>
                          <th className="px-6 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-900/10">
                        {games.map((game) => (
                          <tr key={game.id} className="hover:bg-blue-600/5 transition-colors group">
                            <td className="px-6 py-4 text-white font-medium">
                              {new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-black text-lg ${game.score >= 48 ? 'text-yellow-400' : 'text-slate-100'}`}>
                                {game.score.toFixed(1)}
                              </span>
                              <span className="text-slate-600 text-[10px] ml-1">/60</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                                game.place === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                game.place <= 3 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {game.place === 1 ? '🥇 1st' : game.place === 2 ? '🥈 2nd' : game.place === 3 ? '🥉 3rd' : `${game.place}th`}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xl">{game.emojis || '🧠'}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => deleteGame(game.id)} className="text-slate-600 hover:text-red-500 p-2 rounded-lg transition-all group-hover:scale-110">
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

            {/* Persistence Controls */}
            <section className="bg-slate-900/30 rounded-3xl p-8 border border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Database Management</h3>
                  <p className="text-slate-500 text-sm">Backup your data to a JSON file to transfer between devices.</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={exportData} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase">
                  <Download className="w-4 h-4 text-yellow-400" /> Export
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase">
                  <Upload className="w-4 h-4 text-blue-400" /> Import
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={importData} />
              </div>
            </section>
          </div>
        )}

        {activeView === 'new-game' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LogEntryView onSave={handleSaveGame} onCancel={() => setActiveView('home')} />
          </div>
        )}

        {activeView === 'wrapped' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {games.length < 2 ? (
              <div className="bg-slate-900/50 rounded-3xl p-16 text-center border border-blue-900/20">
                <Sparkles className="w-16 h-16 text-yellow-500/30 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Not enough data yet!</h2>
                <p className="text-slate-500 max-w-md mx-auto">Play at least 2 games to unlock your Quizspicalble Wrapped and see your team's secret patterns.</p>
                <button 
                  onClick={() => setActiveView('new-game')}
                  className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
                >
                  Log a Game
                </button>
              </div>
            ) : (
              <TriviaWrapped stats={stats} />
            )}
          </div>
        )}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-blue-900/50 rounded-2xl flex items-center justify-around p-2 shadow-2xl">
          <button 
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-xl transition-all ${activeView === 'home' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveView('new-game')}
            className={`flex flex-col items-center gap-1 p-3 -mt-8 flex-1 rounded-2xl transition-all shadow-2xl shadow-blue-600/40 ${activeView === 'new-game' ? 'bg-yellow-400 text-blue-950 scale-110' : 'bg-blue-600 text-white'}`}
          >
            <Plus className="w-8 h-8 stroke-[3px]" />
            <span className="text-[10px] font-black uppercase tracking-tighter mt-1">Log</span>
          </button>
          
          <button 
            onClick={() => setActiveView('wrapped')}
            className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-xl transition-all ${activeView === 'wrapped' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Wrapped</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
