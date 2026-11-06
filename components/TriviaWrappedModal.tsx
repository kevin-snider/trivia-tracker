import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Share2, 
  Download, 
  Trophy, 
  Flame, 
  Star, 
  Swords, 
  Users, 
  Sparkles, 
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { TriviaStats, TriviaGame } from '../types';
import { Button } from './ui/button';
import { toast } from 'sonner';

declare const confetti: any;

interface TriviaWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TriviaStats;
  year: number;
  teamName: string;
}

const TOTAL_SLIDES = 6;
const SLIDE_DURATION_MS = 5000;

export const TriviaWrappedModal: React.FC<TriviaWrappedModalProps> = ({
  isOpen,
  onClose,
  stats,
  year,
  teamName
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti on slide changes
  useEffect(() => {
    if (!isOpen) return;

    if (currentSlide === 0 || currentSlide === 3 || currentSlide === 5) {
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#6366f1', '#10b981', '#38bdf8']
        });
      }
    }
  }, [currentSlide, isOpen]);

  // Story Timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < TOTAL_SLIDES - 1) {
            setCurrentSlide((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSlide]);

  if (!isOpen) return null;

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const handleShare = async () => {
    const shareText = `🍺 ${teamName} - ${year} Trivia Wrapped!\n\n` +
      `🏆 Games Won: ${stats.gamesWon} (${stats.winRate.toFixed(0)}% Win Rate)\n` +
      `⚡ Tie-Breakers Won: ${stats.tieBreakersWon} / ${stats.tieBreakersPlayed}\n` +
      `🎯 Avg Place: ${stats.averagePlace > 0 ? stats.averagePlace.toFixed(1) + 'th' : 'N/A'}\n` +
      `🔥 Highest Score: ${stats.highestScore.toFixed(1)}/60\n` +
      `🍻 Most Iconic Vibe: ${stats.mostFrequentEmoji}\n\n` +
      `Tracked live with Trivia on Tap!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${teamName} ${year} Trivia Wrapped`,
          text: shareText
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Copied Wrapped summary to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Copied Wrapped summary to clipboard!');
    }
  };

  const handleDownloadCard = () => {
    setIsGeneratingImage(true);
    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast.error('Unable to create image canvas');
        setIsGeneratingImage(false);
        return;
      }

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
      bgGrad.addColorStop(0, '#09090b');
      bgGrad.addColorStop(0.5, '#18181b');
      bgGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Ambient glows
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.beginPath();
      ctx.arc(540, 400, 350, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.beginPath();
      ctx.arc(800, 1400, 400, 0, Math.PI * 2);
      ctx.fill();

      // Card Container
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 100, 920, 1720);

      // Header Brand
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRIVIA ON TAP · ANNUAL RECAP', 540, 240);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 86px sans-serif';
      ctx.fillText(`${year} WRAPPED`, 540, 350);

      // Team Name
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(teamName, 540, 450);

      // Section divider
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 520);
      ctx.lineTo(880, 520);
      ctx.stroke();

      // Stats Grid Boxes
      const drawMetric = (label: string, value: string, sub: string, x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#a1a1aa';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label.toUpperCase(), x + w / 2, y + 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 70px sans-serif';
        ctx.fillText(value, x + w / 2, y + 145);

        ctx.fillStyle = '#818cf8';
        ctx.font = '500 26px sans-serif';
        ctx.fillText(sub, x + w / 2, y + 200);
      };

      // 4 Main Metric Blocks
      drawMetric('Games Won', `${stats.gamesWon} 🥇`, `${stats.winRate.toFixed(0)}% Win Rate`, 140, 600, 380, 240);
      drawMetric('Tie-Breakers', `${stats.tieBreakersWon} Won`, `${stats.tieBreakersPlayed} Played`, 560, 600, 380, 240);
      drawMetric('Avg Position', `${stats.averagePlace > 0 ? stats.averagePlace.toFixed(1) + 'th' : 'N/A'}`, 'Overall Placement', 140, 890, 380, 240);
      drawMetric('Peak Score', `${stats.highestScore.toFixed(1)}`, 'Out of 60 Pts', 560, 890, 380, 240);

      // Bottom Highlights Box
      ctx.fillStyle = '#18181b';
      ctx.fillRect(140, 1180, 800, 360);
      ctx.strokeStyle = '#3f3f46';
      ctx.strokeRect(140, 1180, 800, 360);

      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Season Superlatives', 180, 1250);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '32px sans-serif';
      ctx.fillText(`• Total Quiz Nights Played: ${stats.totalGames}`, 180, 1330);
      ctx.fillText(`• MVP Teammate / Guest: ${stats.mostFrequentGuest}`, 180, 1400);
      ctx.fillText(`• Team Signature Vibe: ${stats.mostFrequentEmoji}`, 180, 1470);

      // Watermark footer
      ctx.fillStyle = '#71717a';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Certified Pub Trivia Champions · #TriviaWrapped', 540, 1720);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${teamName.replace(/\s+/g, '_')}_${year}_Trivia_Wrapped.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded high-resolution story card!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export image card');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Hidden offscreen canvas for rendering downloadable 1080x1920 graphic */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Mobile/Desktop Story Player Frame */}
      <div className="relative w-full max-w-md h-[95vh] max-h-[840px] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-zinc-100 select-none">
        
        {/* Top Story Controls & Progress Bars */}
        <div className="p-4 z-20 space-y-3 bg-gradient-to-b from-black/80 to-transparent">
          {/* Multi-segment Story Progress Bar */}
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-75"
                  style={{
                    width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Bar Details */}
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{teamName} · {year} Wrapped</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Slide Content Area with Tap Navigation */}
        <div className="relative flex-1 flex items-center justify-center p-6 text-center z-10 overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* SLIDE 0: Welcome Title */}
          {currentSlide === 0 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/10">
                🍺
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] font-black text-amber-400">Annual Review</span>
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-100 tracking-tight">
                  {year} TRIVIA WRAPPED
                </h1>
                <p className="text-lg font-bold text-indigo-400">{teamName}</p>
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Another full year of buzzer beaters, disputed answers, cold drafts, and podium finishes.
              </p>
            </div>
          )}

          {/* SLIDE 1: Total Nights & Questions */}
          {currentSlide === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <span className="text-xs uppercase tracking-[0.2em] font-black text-zinc-400">Dedication</span>
              <div className="space-y-2">
                <span className="text-7xl font-black text-indigo-400 font-mono tracking-tight">
                  {stats.totalGames}
                </span>
                <h3 className="text-2xl font-black text-zinc-100">Trivia Nights Played</h3>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <p>Over <strong className="text-zinc-100 font-mono font-bold">{stats.totalGames * 60}</strong> pub questions tackled.</p>
                <p className="text-amber-400 font-medium">Longest streak: {stats.currentStreak} weeks in a row 🔥</p>
              </div>
            </div>
          )}

          {/* SLIDE 2: Highest Score / Peak Night */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-amber-400">Peak Performance</span>
                <h3 className="text-6xl font-black text-zinc-100 font-mono">
                  {stats.highestScore.toFixed(1)}
                  <span className="text-2xl text-zinc-500 font-normal">/60</span>
                </h3>
                <p className="text-sm font-bold text-zinc-300">Highest Score of {year}</p>
              </div>
              <p className="text-xs text-zinc-400">
                Team average for the year: <span className="font-bold text-zinc-200 font-mono">{stats.averageScore.toFixed(1)} pts</span>
              </p>
            </div>
          )}

          {/* SLIDE 3: Games Won & Podium */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <span className="text-xs uppercase tracking-[0.2em] font-black text-emerald-400">Podium Finishes</span>
              <div className="space-y-2">
                <div className="text-7xl font-black text-amber-400 font-mono">
                  {stats.gamesWon}
                </div>
                <h3 className="text-2xl font-black text-zinc-100">1st Place Victories 🥇</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Win Rate</span>
                  <span className="text-xl font-bold font-mono text-zinc-100">{stats.winRate.toFixed(0)}%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Avg Rank</span>
                  <span className="text-xl font-bold font-mono text-zinc-100">
                    {stats.averagePlace > 0 ? `${stats.averagePlace.toFixed(1)}th` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Tie-Breakers */}
          {currentSlide === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Swords className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-indigo-400">The Clutch Factor</span>
                <h3 className="text-5xl font-black text-zinc-100 font-mono">
                  {stats.tieBreakersWon} / {stats.tieBreakersPlayed}
                </h3>
                <p className="text-sm font-bold text-zinc-300">Tie-Breakers Conquered ⚡</p>
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {stats.tieBreakersPlayed > 0 
                  ? `With a ${stats.tieBreakerWinRate.toFixed(0)}% tie-breaker win rate, your team thrived under sudden death pressure!` 
                  : `Zero tie-breakers were needed this season: your games were decided in regulation time!`}
              </p>
            </div>
          )}

          {/* SLIDE 5: Grand Finale Summary Card & Share */}
          {currentSlide === 5 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-500 w-full px-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-400">The Certified Recap</span>
                <h3 className="text-xl font-black text-zinc-100">{teamName}</h3>
              </div>

              {/* High Density Mini Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                  <span className="text-zinc-400">Year {year} Record</span>
                  <span className="font-bold text-amber-400 font-mono">{stats.gamesWon} Wins</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Tie-Breakers</span>
                    <strong className="text-zinc-200 font-mono">{stats.tieBreakersWon} Won</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Avg Place</span>
                    <strong className="text-zinc-200 font-mono">{stats.averagePlace > 0 ? stats.averagePlace.toFixed(1) + 'th' : 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Peak Score</span>
                    <strong className="text-zinc-200 font-mono">{stats.highestScore.toFixed(1)}/60</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Team Vibe</span>
                    <strong className="text-zinc-200">{stats.mostFrequentEmoji}</strong>
                  </div>
                </div>
              </div>

              {/* Share & Download Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isGeneratingImage}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-10 rounded-xl shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download Story Card (PNG)
                </Button>
                <Button
                  type="button"
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs h-10 rounded-xl"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share on Social / Copy Text
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => goToSlide(0)}
                  className="w-full text-zinc-400 hover:text-zinc-200 text-xs h-8"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Replay Wrapped
                </Button>
              </div>
            </div>
          )}

          {/* Left/Right Tap Zones for Interactive Story Scrubbing */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-1/3 z-20 cursor-pointer"
            onClick={handlePrev}
            title="Previous slide"
          />
          <div 
            className="absolute top-0 bottom-0 right-0 w-1/3 z-20 cursor-pointer"
            onClick={handleNext}
            title="Next slide"
          />
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="p-4 z-20 flex items-center justify-between border-t border-zinc-900 bg-zinc-950/90 text-xs text-zinc-500">
          <button 
            type="button" 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 hover:text-zinc-300 disabled:opacity-20"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span>Slide {currentSlide + 1} of {TOTAL_SLIDES}</span>
          <button 
            type="button" 
            onClick={handleNext}
            disabled={currentSlide === TOTAL_SLIDES - 1}
            className="flex items-center gap-1 hover:text-zinc-300 disabled:opacity-20"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriviaWrappedModal;
