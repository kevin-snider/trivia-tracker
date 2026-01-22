
import { TriviaGame } from '../types';

const STORAGE_KEY = 'triviatracker_games';

export const saveGames = (games: TriviaGame[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

export const getGames = (): TriviaGame[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse stored games', e);
    return [];
  }
};
