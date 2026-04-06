export interface LevelRecord {
  stars: number;
  bestMoves: number;
}

export interface SaveData {
  totalPoints: number;
  levelProgress: Record<number, LevelRecord>;
  maxUnlockedLevel: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  lastDailyChallenge: string;
  dailyChallengeStreak: number;
}

const STORAGE_KEY = "sortcraft_nuts_save";

export function getDefaultSave(): SaveData {
  return {
    totalPoints: 0,
    levelProgress: {},
    maxUnlockedLevel: 1,
    soundEnabled: true,
    musicEnabled: true,
    lastDailyChallenge: "",
    dailyChallengeStreak: 0,
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSave();
    return { ...getDefaultSave(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSave();
  }
}

export function saveSave(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function completeLevelInSave(
  save: SaveData,
  levelNum: number,
  stars: number,
  moveCount: number,
): SaveData {
  const existing = save.levelProgress[levelNum];
  const betterStars = existing ? Math.max(existing.stars, stars) : stars;
  const betterMoves = existing
    ? Math.min(existing.bestMoves, moveCount)
    : moveCount;

  const isFirstComplete = !existing || existing.stars === 0;
  const newPoints = isFirstComplete ? save.totalPoints + 50 : save.totalPoints;

  const newMaxUnlocked = Math.max(save.maxUnlockedLevel, levelNum + 1);

  return {
    ...save,
    totalPoints: newPoints,
    maxUnlockedLevel: Math.min(newMaxUnlocked, 5000),
    levelProgress: {
      ...save.levelProgress,
      [levelNum]: { stars: betterStars, bestMoves: betterMoves },
    },
  };
}

export function claimDailyChallenge(save: SaveData): SaveData {
  const today = new Date().toISOString().split("T")[0];
  if (save.lastDailyChallenge === today) return save;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const streak =
    save.lastDailyChallenge === yesterdayStr
      ? save.dailyChallengeStreak + 1
      : 1;

  return {
    ...save,
    lastDailyChallenge: today,
    dailyChallengeStreak: streak,
    totalPoints: save.totalPoints + 100, // bonus for daily
  };
}
