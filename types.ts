
export interface TriviaGame {
  id: string;
  date: string;
  score: number;
  place: number;
  emojis: string;
  guests: string[];
  timestamp: number;
}

export interface MonthlyStat {
  month: string;
  averageScore: number;
  count: number;
}

export interface TriviaStats {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalGames: number;
  currentStreak: number;
  mostFrequentEmoji: string;
  mostFrequentGuest: string;
  bestMonth: string;
  worstMonth: string;
  mostAttendedMonth: string;
  averagePlace: number;
}
