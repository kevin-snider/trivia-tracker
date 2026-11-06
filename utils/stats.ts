import { TriviaGame, TriviaStats, LeagueStats, LeagueSlot } from '../types';

export const GAMES_PER_LEAGUE = 6;
export const EXCLUDED_MVP_NAMES = ['kevin', 'amanda'];

export const calculateStreak = (games: TriviaGame[]): number => {
  if (games.length === 0) return 0;
  
  const sortedDates = [...new Set(games.map(g => g.date))].sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const gameDate = new Date(sortedDates[i] + 'T00:00:00');
    gameDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(currentDate.getTime() - gameDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) { // weekly trivia streak
      streak++;
      currentDate = gameDate;
    } else {
      break;
    }
  }
  
  return streak > 0 ? streak : 1;
};

export const getStats = (games: TriviaGame[]): TriviaStats => {
  const emptyLeague: LeagueStats = {
    gamesInLeague: GAMES_PER_LEAGUE,
    leagueGamesPlayed: 0,
    leagueTotalPoints: 0,
    leagueMaxPoints: GAMES_PER_LEAGUE * 60,
    leagueAverageScore: 0,
    leagueAveragePlace: 0,
    leagueWins: 0,
    isComplete: false,
    gameSlots: Array.from({ length: GAMES_PER_LEAGUE }, (_, i) => ({ gameNumber: i + 1 }))
  };

  if (games.length === 0) {
    return {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalGames: 0,
      currentStreak: 0,
      mostFrequentEmoji: '🍻',
      mostFrequentEmojiCount: 0,
      mostFrequentGuest: 'None',
      bestMonth: 'N/A',
      worstMonth: 'N/A',
      mostAttendedMonth: 'N/A',
      averagePlace: 0,
      gamesWon: 0,
      winRate: 0,
      podiumFinishes: 0,
      tieBreakersPlayed: 0,
      tieBreakersWon: 0,
      tieBreakerWinRate: 0,
      pendingGamesCount: 0,
      championshipsPlayed: 0,
      championshipsWon: 0,
      league: emptyLeague,
    };
  }

  const scores = games.map(g => g.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / games.length;
  const high = Math.max(...scores);
  const low = Math.min(...scores);

  const placedGames = games.filter(g => typeof g.place === 'number' && g.place > 0);
  const pendingGames = games.filter(g => g.place === null || g.place === undefined || g.place === 0);
  
  const avgPlace = placedGames.length > 0 
    ? placedGames.reduce((acc, g) => acc + (g.place as number), 0) / placedGames.length 
    : 0;

  const gamesWon = placedGames.filter(g => g.place === 1).length;
  const winRate = placedGames.length > 0 ? (gamesWon / placedGames.length) * 100 : 0;
  const podiumFinishes = placedGames.filter(g => (g.place as number) <= 3).length;

  const tieBreakersPlayed = games.filter(g => g.tieBreaker?.occurred).length;
  const tieBreakersWon = games.filter(g => g.tieBreaker?.occurred && g.tieBreaker?.won).length;
  const tieBreakerWinRate = tieBreakersPlayed > 0 ? (tieBreakersWon / tieBreakersPlayed) * 100 : 0;

  const championshipsPlayed = games.filter(g => g.seasonType === 'championship').length;
  const championshipsWon = games.filter(g => g.seasonType === 'championship' && g.place === 1).length;

  // Emoji analysis: calculate most used emoji and exact frequency count
  const emojiMap: Record<string, number> = {};
  games.forEach(g => {
    if (!g.emojis) return;
    const match = g.emojis.match(/\p{Extended_Pictographic}/ug);
    if (match) {
      match.forEach(e => {
        emojiMap[e] = (emojiMap[e] || 0) + 1;
      });
    } else {
      Array.from(g.emojis).forEach(e => {
        if (e.trim()) emojiMap[e] = (emojiMap[e] || 0) + 1;
      });
    }
  });

  const sortedEmojis = Object.entries(emojiMap).sort((a, b) => b[1] - a[1]);
  const mostFreqEmoji = sortedEmojis[0]?.[0] || '🍻';
  const mostFreqEmojiCount = sortedEmojis[0]?.[1] || 0;

  // Guest analysis (Kevin and Amanda EXCLUDED from MVP per user requirement)
  const guestMap: Record<string, number> = {};
  games.forEach(g => {
    (g.guests || []).forEach(guest => {
      const name = guest.trim();
      const lower = name.toLowerCase();
      // Kevin and Amanda are permanent captains; only count other teammates/guests for MVP
      if (name && !EXCLUDED_MVP_NAMES.includes(lower)) {
        guestMap[name] = (guestMap[name] || 0) + 1;
      }
    });
  });
  const mostFreqGuest = Object.entries(guestMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Monthly breakdown
  const monthlyData: Record<string, { total: number; count: number }> = {};
  games.forEach(g => {
    const month = g.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = { total: 0, count: 0 };
    monthlyData[month].total += g.score;
    monthlyData[month].count += 1;
  });

  const months = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    average: data.total / data.count,
    count: data.count,
  }));

  const bestMonth = months.slice().sort((a, b) => b.average - a.average)[0]?.month || 'N/A';
  const worstMonth = months.slice().sort((a, b) => a.average - b.average)[0]?.month || 'N/A';
  const mostAttended = months.slice().sort((a, b) => b.count - a.count)[0]?.month || 'N/A';

  // ================= 6-GAME LEAGUE STATS =================
  // Official league games exclude 'one-off' exhibitions, sorted chronologically
  const allOfficialGames = games
    .filter(g => g.seasonType !== 'one-off')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Determine the current active 6-game league:
  // For the active season, the current league cycle is Games 1-5 from Oct 7 to Nov 4, 2026.
  let leagueOfficialGames: TriviaGame[] = [];
  const oct7Index = allOfficialGames.findIndex(g => g.date === '2026-10-07');
  if (oct7Index !== -1) {
    leagueOfficialGames = allOfficialGames.slice(oct7Index, oct7Index + GAMES_PER_LEAGUE);
  } else if (allOfficialGames.length > 0) {
    const remainder = allOfficialGames.length % GAMES_PER_LEAGUE;
    const startIndex = remainder === 0
      ? Math.max(0, allOfficialGames.length - GAMES_PER_LEAGUE)
      : allOfficialGames.length - remainder;
    leagueOfficialGames = allOfficialGames.slice(startIndex, startIndex + GAMES_PER_LEAGUE);
  }

  const leagueTotalPoints = leagueOfficialGames.reduce((acc, g) => acc + g.score, 0);
  const leagueGamesPlayed = leagueOfficialGames.length;
  const leagueAverageScore = leagueGamesPlayed > 0 ? leagueTotalPoints / leagueGamesPlayed : 0;
  
  const placedLeagueGames = leagueOfficialGames.filter(g => typeof g.place === 'number' && g.place > 0);
  const leagueAveragePlace = placedLeagueGames.length > 0
    ? placedLeagueGames.reduce((acc, g) => acc + (g.place as number), 0) / placedLeagueGames.length
    : 0;

  const leagueWins = leagueOfficialGames.filter(g => g.place === 1).length;
  const isComplete = leagueGamesPlayed >= GAMES_PER_LEAGUE;

  const gameSlots: LeagueSlot[] = Array.from({ length: GAMES_PER_LEAGUE }, (_, i) => {
    const slotGame = leagueOfficialGames[i];
    let dateLabel: string | undefined;
    if (slotGame) {
      try {
        const d = new Date(slotGame.date + 'T12:00:00');
        dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        dateLabel = slotGame.date;
      }
    } else if (i === leagueGamesPlayed) {
      dateLabel = 'Game 6';
    }

    return {
      gameNumber: i + 1,
      game: slotGame,
      dateLabel
    };
  });

  const league: LeagueStats = {
    gamesInLeague: GAMES_PER_LEAGUE,
    leagueGamesPlayed,
    leagueTotalPoints,
    leagueMaxPoints: GAMES_PER_LEAGUE * 60,
    leagueAverageScore,
    leagueAveragePlace,
    leagueWins,
    isComplete,
    gameSlots
  };

  return {
    averageScore: avgScore,
    highestScore: high,
    lowestScore: low,
    totalGames: games.length,
    currentStreak: calculateStreak(games),
    mostFrequentEmoji: mostFreqEmoji,
    mostFrequentEmojiCount: mostFreqEmojiCount,
    mostFrequentGuest: mostFreqGuest,
    bestMonth,
    worstMonth,
    mostAttendedMonth: mostAttended,
    averagePlace: avgPlace,
    gamesWon,
    winRate,
    podiumFinishes,
    tieBreakersPlayed,
    tieBreakersWon,
    tieBreakerWinRate,
    pendingGamesCount: pendingGames.length,
    championshipsPlayed,
    championshipsWon,
    league
  };
};

export const formatMonth = (monthStr: string) => {
  if (!monthStr || monthStr === 'N/A') return 'N/A';
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export function getFirstWednesday(year: number, monthIndex: number): Date {
  const date = new Date(year, monthIndex, 1);
  while (date.getDay() !== 3) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isTriviaWrappedActive(games: TriviaGame[], currentDate = new Date()): { active: boolean; year: number; reason?: string } {
  const month = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const targetYear = month === 0 ? currentYear - 1 : currentYear;

  const firstWedDec = getFirstWednesday(targetYear, 11);
  const firstWedJanNextYear = getFirstWednesday(targetYear + 1, 0);

  const inWindow = currentDate >= firstWedDec && currentDate <= firstWedJanNextYear;

  if (!inWindow) {
    return { active: false, year: targetYear, reason: 'Outside seasonal December-to-January window' };
  }

  const firstWedDecISO = firstWedDec.toISOString().split('T')[0];
  const hasGameAdded = games.some(g => g.date >= firstWedDecISO && g.date.startsWith(String(targetYear)));

  if (!hasGameAdded) {
    return { active: false, year: targetYear, reason: 'Pending first Wednesday of December trivia night log' };
  }

  return { active: true, year: targetYear };
}

export function getYearStats(games: TriviaGame[], targetYear: number): { stats: TriviaStats; yearGames: TriviaGame[] } {
  const yearGames = games.filter(g => g.date.startsWith(String(targetYear)));
  const stats = getStats(yearGames.length > 0 ? yearGames : games);
  return { stats, yearGames: yearGames.length > 0 ? yearGames : games };
}
