
import { TriviaGame, TriviaStats, MonthlyStat } from '../types';

export const calculateStreak = (games: TriviaGame[]): number => {
  if (games.length === 0) return 0;
  
  const sortedDates = [...new Set(games.map(g => g.date))].sort().reverse();
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Simple streak: consecutive days played or games within a 2-day window
  // For a more casual trivia streak, we just count consecutive sorted entries
  // but let's do a time-based one.
  for (let i = 0; i < sortedDates.length; i++) {
    const gameDate = new Date(sortedDates[i]);
    gameDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(currentDate.getTime() - gameDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Allow for a 1-day gap (e.g., played yesterday or today)
    if (diffDays <= 1) {
      streak++;
      currentDate = gameDate;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const getStats = (games: TriviaGame[]): TriviaStats => {
  if (games.length === 0) {
    return {
      averageScore: 0, highestScore: 0, lowestScore: 0, totalGames: 0,
      currentStreak: 0, mostFrequentEmoji: 'N/A', mostFrequentGuest: 'N/A',
      bestMonth: 'N/A', worstMonth: 'N/A', mostAttendedMonth: 'N/A',
      averagePlace: 0
    };
  }

  const scores = games.map(g => g.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / games.length;
  const high = Math.max(...scores);
  const low = Math.min(...scores);
  const avgPlace = games.map(g => g.place).reduce((a, b) => a + b, 0) / games.length;

  // Emoji analysis
  const emojiMap: Record<string, number> = {};
  games.forEach(g => {
    const emojis = Array.from(g.emojis);
    emojis.forEach(e => {
      if (e.trim()) emojiMap[e] = (emojiMap[e] || 0) + 1;
    });
  });
  const mostFreqEmoji = Object.entries(emojiMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Guest analysis
  const guestMap: Record<string, number> = {};
  games.forEach(g => {
    g.guests.forEach(guest => {
      const name = guest.trim();
      if (name) guestMap[name] = (guestMap[name] || 0) + 1;
    });
  });
  const mostFreqGuest = Object.entries(guestMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Monthly breakdown
  const monthlyData: Record<string, { total: number, count: number }> = {};
  games.forEach(g => {
    const month = g.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = { total: 0, count: 0 };
    monthlyData[month].total += g.score;
    monthlyData[month].count += 1;
  });

  const months = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    average: data.total / data.count,
    count: data.count
  }));

  const bestMonth = months.sort((a, b) => b.average - a.average)[0]?.month || 'N/A';
  const worstMonth = months.sort((a, b) => a.average - b.average)[0]?.month || 'N/A';
  const mostAttended = months.sort((a, b) => b.count - a.count)[0]?.month || 'N/A';

  return {
    averageScore: avgScore,
    highestScore: high,
    lowestScore: low,
    totalGames: games.length,
    currentStreak: calculateStreak(games),
    mostFrequentEmoji: mostFreqEmoji,
    mostFrequentGuest: mostFreqGuest,
    bestMonth,
    worstMonth,
    mostAttendedMonth: mostAttended,
    averagePlace: avgPlace
  };
};

export const formatMonth = (monthStr: string) => {
  if (monthStr === 'N/A') return 'N/A';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
