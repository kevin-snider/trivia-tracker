import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  History, 
  Plus, 
  Settings, 
  Sparkles,
  Beer
} from 'lucide-react';
import { TriviaGame } from './types';
import * as storage from './services/storage';
import { getStats, isTriviaWrappedActive, getYearStats } from './utils/stats';
import AnalyticsView from './components/AnalyticsView';
import HistoryView from './components/HistoryView';
import LogEntryModal from './components/LogEntryModal';
import QuickPlaceModal from './components/QuickPlaceModal';
import TeamSettingsModal from './components/TeamSettingsModal';
import TriviaWrappedModal from './components/TriviaWrappedModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

declare const confetti: any;

export const App: React.FC = () => {
  const [games, setGames] = useState<TriviaGame[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'history'>('analytics');
  const [editingGame, setEditingGame] = useState<TriviaGame | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [quickPlaceGame, setQuickPlaceGame] = useState<TriviaGame | null>(null);

  const [teamName, setTeamName] = useState<string>(() => {
    return localStorage.getItem('trivia_team_name') || 'Quizzspicable Me!';
  });
  
  const [teamLogo, setTeamLogo] = useState<string>(() => {
    return localStorage.getItem('trivia_team_logo') || storage.DEFAULT_TEAM_LOGO;
  });

  // Force pure dark mode permanently for pub trivia nights
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-zinc-950', 'text-zinc-100');
    setGames(storage.getGames());
  }, []);

  // Compute live statistics across all games
  const stats = useMemo(() => getStats(games), [games]);

  // Compute seasonal Trivia Wrapped status (1st Wednesday of Dec -> 1st Wednesday of Jan)
  const wrappedStatus = useMemo(() => isTriviaWrappedActive(games), [games]);

  // Handle saving new or edited game
  const handleSaveGame = (game: TriviaGame) => {
    let updated: TriviaGame[];
    const isEdit = games.some(g => g.id === game.id);

    if (isEdit) {
      updated = games.map(g => (g.id === game.id ? game : g)).sort((a, b) => b.timestamp - a.timestamp);
      toast.success('Trivia game updated!');
    } else {
      updated = [game, ...games].sort((a, b) => b.timestamp - a.timestamp);
      toast.success('Trivia night logged!');

      // Celebrate 1st place or high score
      if (game.place === 1 || game.score >= 48) {
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#6366f1', '#10b981']
          });
        }
      }
    }

    setGames(updated);
    storage.saveGames(updated);
  };

  // Quick place update directly from dashboard card
  const handleSavePlace = (
    gameId: string, 
    newPlace: number, 
    tieBreaker?: { occurred: boolean; won: boolean }
  ) => {
    const updated = games.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          place: newPlace,
          tieBreaker: tieBreaker || g.tieBreaker
        };
      }
      return g;
    });

    setGames(updated);
    storage.saveGames(updated);
    toast.success(`Standing updated to ${newPlace === 1 ? '1st Place! 🥇' : newPlace + 'th Place'}`);

    if (newPlace === 1 && typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981']
      });
    }
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to remove this trivia record?')) {
      const updated = games.filter(g => g.id !== id);
      setGames(updated);
      storage.saveGames(updated);
      toast.success('Trivia record deleted');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearStatsData = useMemo(() => getYearStats(games, wrappedStatus.year || currentYear), [games, wrappedStatus.year, currentYear]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 pb-28">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Mobile-Optimized Top App Bar */}
      <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-3xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
          
          {/* Brand & Team Lockup with Dancing Beer Icon */}
          <div className="flex items-center gap-2.5">
            <img 
              src={teamLogo} 
              alt="Team dancing beer icon" 
              className="w-9 h-9 rounded-xl object-cover border border-blue-500/40 shadow-sm shrink-0"
              onError={(e) => {
                // Fallback to emoji if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-black text-zinc-100 tracking-tight leading-tight flex items-center gap-1.5">
                Trivia on Tap
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 truncate max-w-[170px] sm:max-w-xs">
                {teamName}
              </span>
            </div>
          </div>

          {/* Top Settings Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 flex items-center justify-center transition-colors"
            title="Team Hub & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main View Area (Analytics or History) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 sm:py-6">
        {activeTab === 'analytics' ? (
          <AnalyticsView
            stats={stats}
            games={games}
            wrappedActive={wrappedStatus.active}
            wrappedYear={wrappedStatus.year || currentYear}
            onOpenWrapped={() => setIsWrappedOpen(true)}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        ) : (
          <HistoryView
            games={games}
            onEditGame={(game) => {
              setEditingGame(game);
              setIsLogModalOpen(true);
            }}
            onDeleteGame={handleDeleteGame}
            onQuickPlace={(game) => setQuickPlaceGame(game)}
            onLogGame={() => {
              setEditingGame(null);
              setIsLogModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Minimal Footer (User requested: "for the footer just put trivia on tap") */}
      <footer className="mt-auto py-4 text-center text-xs text-zinc-600 font-medium tracking-wider lowercase select-none">
        trivia on tap
      </footer>

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      {/* User preference: Analytics, elevated center Log Game button, and History */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 shadow-[0_-8px_30px_rgb(0,0,0,0.4)]">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between relative">
          
          {/* TAB 1: Analytics (Home) */}
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-colors ${
              activeTab === 'analytics'
                ? 'text-indigo-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Analytics</span>
          </button>

          {/* ELEVATED CENTER ACTION BUTTON: Log Game */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setEditingGame(null);
                setIsLogModalOpen(true);
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 border-4 border-zinc-950 active:scale-95 transition-all"
              title="Log Trivia Game"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
            <span className="text-[10px] font-bold text-zinc-300 mt-0.5 tracking-tight">
              Log Game
            </span>
          </div>

          {/* TAB 2: History (Past Games Ledger) */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-colors relative ${
              activeTab === 'history'
                ? 'text-indigo-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <div className="relative">
              <History className="w-5 h-5 mb-0.5" />
              {stats.pendingGamesCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                  {stats.pendingGamesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">History</span>
          </button>

        </div>
      </nav>

      {/* MODALS */}
      {/* 1. Log / Edit Game Modal (with Season Type & Pending Placement) */}
      <LogEntryModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingGame(null);
        }}
        onSave={handleSaveGame}
        initialData={editingGame}
      />

      {/* 2. Quick Place Modal (One-tap podium resolution from card) */}
      <QuickPlaceModal
        game={quickPlaceGame}
        isOpen={Boolean(quickPlaceGame)}
        onClose={() => setQuickPlaceGame(null)}
        onSavePlace={handleSavePlace}
      />

      {/* 3. Team Hub & Settings Modal */}
      <TeamSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        games={games}
        onGamesUpdated={(updatedGames) => {
          setGames(updatedGames);
          storage.saveGames(updatedGames);
        }}
        teamName={teamName}
        setTeamName={setTeamName}
        teamLogo={teamLogo}
        setTeamLogo={setTeamLogo}
        onOpenWrapped={() => setIsWrappedOpen(true)}
      />

      {/* 4. Seasonal Trivia Wrapped Animated Video Story */}
      <TriviaWrappedModal
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        stats={yearStatsData.stats}
        year={wrappedStatus.year || currentYear}
        teamName={teamName}
      />
    </div>
  );
};

export default App;
