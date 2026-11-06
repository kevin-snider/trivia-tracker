export type SeasonType = 'regular' | 'opener' | 'championship' | 'one-off';

export interface TriviaGame {
  id: string;
  date: string;
  score: number;
  place: number | null; // null represents 'Pending / In Progress'
  seasonType?: SeasonType;
  championshipPlacement?: string; // e.g. 'League Champions 🏆', 'Runner Up 🥈'
  tieBreaker?: {
    occurred: boolean;
    won: boolean;
  };
  emojis: string;
  guests: string[];
  timestamp: number;
}

export interface MonthlyStat {
  month: string;
  averageScore: number;
  count: number;
}

export interface ArchivedSeason {
  id: string;
  label: string; // e.g. "2026 Season"
  archivedAt: string; // ISO string
  gamesCount: number;
  games: TriviaGame[];
  artworkUrl?: string;
}

export interface LeagueSlot {
  gameNumber: number;
  game?: TriviaGame;
  dateLabel?: string;
}

export interface LeagueStats {
  gamesInLeague: number; // 6
  leagueGamesPlayed: number;
  leagueTotalPoints: number;
  leagueMaxPoints: number; // 360 (6 * 60)
  leagueAverageScore: number;
  leagueAveragePlace: number;
  leagueWins: number;
  isComplete: boolean;
  gameSlots: LeagueSlot[];
}

export interface TriviaStats {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalGames: number;
  currentStreak: number;
  mostFrequentEmoji: string;
  mostFrequentEmojiCount: number;
  mostFrequentGuest: string;
  bestMonth: string;
  worstMonth: string;
  mostAttendedMonth: string;
  averagePlace: number;
  gamesWon: number;
  winRate: number;
  podiumFinishes: number;
  tieBreakersPlayed: number;
  tieBreakersWon: number;
  tieBreakerWinRate: number;
  pendingGamesCount: number;
  championshipsPlayed: number;
  championshipsWon: number;
  league: LeagueStats;
}
