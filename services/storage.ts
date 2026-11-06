import { TriviaGame, ArchivedSeason } from '../types';

const STORAGE_KEY = 'triviatracker_games';
const ARCHIVE_STORAGE_KEY = 'triviatracker_archives';

export const DEFAULT_TEAM_LOGO = '/src/assets/images/dancing_beer_app_icon_1793982426751.jpg';
export const YEAR_2026_POSTER_ARTWORK = '/src/assets/images/pub_neon_poster_2026_1793984305059.jpg';

// The verified 33 games transcribed directly from user's screenshots (Jan 21 to Nov 4, 2026, including Oct 28)
export const TRANSCRIBED_2026_GAMES: TriviaGame[] = [
  {
    id: 'game-2026-11-04',
    date: '2026-11-04',
    score: 53.5,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '📺 🐻 🎸',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1793750400000
  },
  {
    id: 'game-2026-10-28',
    date: '2026-10-28',
    score: 58.0,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '👻 🩸 🔫 🧜‍♀️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1793145600000
  },
  {
    id: 'game-2026-10-21',
    date: '2026-10-21',
    score: 49.5,
    place: 2,
    seasonType: 'regular',
    tieBreaker: { occurred: true, won: false },
    emojis: '🚗 ❌ 🎥 🎟️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1792540800000
  },
  {
    id: 'game-2026-10-14',
    date: '2026-10-14',
    score: 53.5,
    place: 1,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🏀 🐛',
    guests: ['Kevin', 'Amanda', 'Dave'],
    timestamp: 1791936000000
  },
  {
    id: 'game-2026-10-07',
    date: '2026-10-07',
    score: 54.0,
    place: 1,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎸 ✋ 🏒',
    guests: ['Kevin', 'Amanda', 'Sarah'],
    timestamp: 1791331200000
  },
  {
    id: 'game-2026-09-30',
    date: '2026-09-30',
    score: 54.5,
    place: 1,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '90\'s 🧴 👾',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1790726400000
  },
  {
    id: 'game-2026-09-23',
    date: '2026-09-23',
    score: 43.5,
    place: 7,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '💍 🇨🇦',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1790121600000
  },
  {
    id: 'game-2026-08-26',
    date: '2026-08-26',
    score: 46.5,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🤠 ✈️ 🎬',
    guests: ['Kevin', 'Amanda', 'Dave'],
    timestamp: 1787702400000
  },
  {
    id: 'game-2026-08-04',
    date: '2026-08-04',
    score: 50.0,
    place: 4,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎥 🎬 🍿',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1785801600000
  },
  {
    id: 'game-2026-07-29',
    date: '2026-07-29',
    score: 39.5,
    place: 9,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎸 💩 🐍 🥔 🐱',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1785283200000
  },
  {
    id: 'game-2026-07-08',
    date: '2026-07-08',
    score: 51.0,
    place: 5,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '⚽ ☀️ 🏒 🐉',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1783468800000
  },
  {
    id: 'game-2026-06-24',
    date: '2026-06-24',
    score: 32.0,
    place: 10,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '😞',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1782259200000
  },
  {
    id: 'game-2026-06-17',
    date: '2026-06-17',
    score: 42.5,
    place: 7,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '👶 ⚽ 🐚 🐭',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1781654400000
  },
  {
    id: 'game-2026-06-10',
    date: '2026-06-10',
    score: 58.0,
    place: 1,
    seasonType: 'championship',
    championshipPlacement: 'League Champions 🏆',
    tieBreaker: { occurred: true, won: true },
    emojis: '🐭 🏰 🍿',
    guests: ['Kevin', 'Amanda', 'Dave'],
    timestamp: 1781049600000
  },
  {
    id: 'game-2026-06-03',
    date: '2026-06-03',
    score: 47.0,
    place: 6,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎂 🏒 🍑 ☀️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1780444800000
  },
  {
    id: 'game-2026-05-27',
    date: '2026-05-27',
    score: 47.5,
    place: 9,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🦁 🐬 🎺 👑',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1779840000000
  },
  {
    id: 'game-2026-05-20',
    date: '2026-05-20',
    score: 54.0,
    place: 2,
    seasonType: 'regular',
    tieBreaker: { occurred: true, won: false },
    emojis: '🪵 ⭐ 🐷 🎂',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1779235200000
  },
  {
    id: 'game-2026-05-13',
    date: '2026-05-13',
    score: 47.5,
    place: 6,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🥔 🐱 🐐 👀 🙈 🧜‍♀️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1778630400000
  },
  {
    id: 'game-2026-05-06',
    date: '2026-05-06',
    score: 54.5,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🇫🇮 📺 🏔️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1778025600000
  },
  {
    id: 'game-2026-04-29',
    date: '2026-04-29',
    score: 47.5,
    place: 5,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🪐 🍔',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1777420800000
  },
  {
    id: 'game-2026-04-15',
    date: '2026-04-15',
    score: 40.0,
    place: 7,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🍗 🍔 🎸 🦋',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1776211200000
  },
  {
    id: 'game-2026-04-08',
    date: '2026-04-08',
    score: 56.0,
    place: 4,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🇹🇷 🪐 ♒ 🍟 🥅 🍄 🍪',
    guests: ['Kevin', 'Amanda', 'Sarah'],
    timestamp: 1775606400000
  },
  {
    id: 'game-2026-04-01',
    date: '2026-04-01',
    score: 49.0,
    place: 8,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🧅 1️⃣ 👁️ 👁️',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1775001600000
  },
  {
    id: 'game-2026-03-25',
    date: '2026-03-25',
    score: 39.5,
    place: 7,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🚢 😳 💊',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1774396800000
  },
  {
    id: 'game-2026-03-18',
    date: '2026-03-18',
    score: 45.5,
    place: 7,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎬 🪨 🪐',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1773792000000
  },
  {
    id: 'game-2026-03-11',
    date: '2026-03-11',
    score: 50.5,
    place: 4,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🛒 🪓 💵',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1773187200000
  },
  {
    id: 'game-2026-03-04',
    date: '2026-03-04',
    score: 36.5,
    place: 6,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '👔 🍠 📉 🏢',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1772582400000
  },
  {
    id: 'game-2026-02-25',
    date: '2026-02-25',
    score: 48.0,
    place: 5,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🤿 🐮 🐰 🐜',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1771977600000
  },
  {
    id: 'game-2026-02-18',
    date: '2026-02-18',
    score: 51.0,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🇵🇱 👮 🧪 📦 🍗',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1771372800000
  },
  {
    id: 'game-2026-02-10',
    date: '2026-02-10',
    score: 51.0,
    place: 3,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🥢 🥉',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1770681600000
  },
  {
    id: 'game-2026-02-04',
    date: '2026-02-04',
    score: 47.0,
    place: 4,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '💥 ⭐ 🏒 👂',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1770163200000
  },
  {
    id: 'game-2026-01-28',
    date: '2026-01-28',
    score: 43.0,
    place: 4,
    seasonType: 'regular',
    tieBreaker: { occurred: false, won: false },
    emojis: '🎈 🐺 💿 ♎',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1769558400000
  },
  {
    id: 'game-2026-01-21',
    date: '2026-01-21',
    score: 44.5,
    place: 4,
    seasonType: 'opener',
    tieBreaker: { occurred: false, won: false },
    emojis: '📺 🔺 ⚡ 🐶',
    guests: ['Kevin', 'Amanda'],
    timestamp: 1768953600000
  }
];

export const saveGames = (games: TriviaGame[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error('Failed to save games to localStorage', e);
  }
};

export const normalizeGame = (raw: any): TriviaGame => {
  const validSeasonTypes = ['regular', 'opener', 'championship', 'one-off'];
  const seasonType = validSeasonTypes.includes(raw.seasonType) ? raw.seasonType : 'regular';

  return {
    id: String(raw.id || crypto.randomUUID()),
    date: String(raw.date || new Date().toISOString().split('T')[0]),
    score: Number(raw.score) || 0,
    place: raw.place === null || raw.place === undefined || raw.place === 0 ? null : Number(raw.place),
    seasonType,
    championshipPlacement: raw.championshipPlacement ? String(raw.championshipPlacement) : undefined,
    tieBreaker: raw.tieBreaker
      ? {
          occurred: Boolean(raw.tieBreaker.occurred),
          won: Boolean(raw.tieBreaker.won)
        }
      : {
          occurred: false,
          won: false
        },
    emojis: String(raw.emojis || '🧠'),
    guests: Array.isArray(raw.guests) ? raw.guests.map(String) : [],
    timestamp: Number(raw.timestamp) || Date.now()
  };
};

export const getGames = (): TriviaGame[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveGames(TRANSCRIBED_2026_GAMES);
    return TRANSCRIBED_2026_GAMES;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const games = parsed.map(normalizeGame);
      // Seamlessly inject October 28 if user loaded the app during the 32-game turn
      if (!games.some(g => g.id === 'game-2026-10-28' || g.date === '2026-10-28')) {
        const oct28Game = TRANSCRIBED_2026_GAMES.find(g => g.id === 'game-2026-10-28');
        if (oct28Game) {
          games.push(oct28Game);
          games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          saveGames(games);
        }
      }
      return games;
    }
    return TRANSCRIBED_2026_GAMES;
  } catch (e) {
    console.error('Failed to parse stored games', e);
    return TRANSCRIBED_2026_GAMES;
  }
};

// ================= ARCHIVE STORAGE HELPERS =================
export const getArchivedSeasons = (): ArchivedSeason[] => {
  const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY);
  if (!stored) {
    // Initialize default archive with the 2026 Season and retro neon pub poster artwork
    const default2026Archive: ArchivedSeason = {
      id: 'archive-2026',
      label: '2026 Season',
      archivedAt: '2026-11-06T08:58:00.000Z',
      gamesCount: TRANSCRIBED_2026_GAMES.length,
      games: TRANSCRIBED_2026_GAMES,
      artworkUrl: YEAR_2026_POSTER_ARTWORK
    };
    saveArchivedSeasons([default2026Archive]);
    return [default2026Archive];
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const archives = parsed.map((item: any) => ({
        id: String(item.id || crypto.randomUUID()),
        label: String(item.label || 'Archived Season'),
        archivedAt: String(item.archivedAt || new Date().toISOString()),
        gamesCount: Number(item.gamesCount) || (Array.isArray(item.games) ? item.games.length : 0),
        games: Array.isArray(item.games) ? item.games.map(normalizeGame) : [],
        artworkUrl: item.artworkUrl || YEAR_2026_POSTER_ARTWORK
      }));

      // Keep default 2026 archive synced with all 33 games
      const archive2026 = archives.find(a => a.id === 'archive-2026');
      if (archive2026 && !archive2026.games.some(g => g.id === 'game-2026-10-28' || g.date === '2026-10-28')) {
        archive2026.games = TRANSCRIBED_2026_GAMES;
        archive2026.gamesCount = TRANSCRIBED_2026_GAMES.length;
        saveArchivedSeasons(archives);
      }

      return archives;
    }
    return [];
  } catch (e) {
    console.error('Failed to parse archives', e);
    return [];
  }
};

export const saveArchivedSeasons = (archives: ArchivedSeason[]): void => {
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archives));
  } catch (e) {
    console.error('Failed to save archives', e);
  }
};

export const archiveCurrentSeason = (
  games: TriviaGame[], 
  label: string, 
  teamName: string
): { success: boolean; archive: ArchivedSeason } => {
  // 1. Auto-download backup file to ensure the user has an offline copy
  exportGamesToJSON(games, `${teamName}_${label}`);

  // 2. Create archive record with retro neon artwork
  const newArchive: ArchivedSeason = {
    id: crypto.randomUUID(),
    label: label.trim() || `${new Date().getFullYear()} Season`,
    archivedAt: new Date().toISOString(),
    gamesCount: games.length,
    games: [...games],
    artworkUrl: YEAR_2026_POSTER_ARTWORK
  };

  const existing = getArchivedSeasons();
  const updatedArchives = [newArchive, ...existing];
  saveArchivedSeasons(updatedArchives);

  // 3. Clear active games to start completely fresh
  saveGames([]);

  return { success: true, archive: newArchive };
};

export const restoreArchiveToActive = (archiveId: string): TriviaGame[] | null => {
  const archives = getArchivedSeasons();
  const found = archives.find(a => a.id === archiveId);
  if (!found) return null;

  saveGames(found.games);
  return found.games;
};

export const deleteArchivedSeason = (archiveId: string): void => {
  const archives = getArchivedSeasons();
  const filtered = archives.filter(a => a.id !== archiveId);
  saveArchivedSeasons(filtered);
};

// ================= EXPORT & IMPORT JSON =================
export const exportGamesToJSON = (games: TriviaGame[], fileNameSuffix: string): void => {
  const payload = {
    app: 'Trivia on Tap',
    version: '2.5',
    exportedAt: new Date().toISOString(),
    name: fileNameSuffix,
    gamesCount: games.length,
    games
  };
  const dataStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trivia_backup_${fileNameSuffix.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importGamesFromJSON = async (file: File): Promise<{ success: boolean; count: number; games?: TriviaGame[]; message?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        
        let gamesList: any[] = [];
        if (Array.isArray(parsed)) {
          gamesList = parsed;
        } else if (parsed && Array.isArray(parsed.games)) {
          gamesList = parsed.games;
        } else {
          return resolve({ success: false, count: 0, message: 'Invalid file structure: no games array found' });
        }

        const normalized = gamesList.map(normalizeGame).sort((a, b) => b.timestamp - a.timestamp);
        saveGames(normalized);
        resolve({ success: true, count: normalized.length, games: normalized });
      } catch (err: any) {
        resolve({ success: false, count: 0, message: err?.message || 'Failed to parse JSON file' });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, count: 0, message: 'File read error' });
    };
    reader.readAsText(file);
  });
};
