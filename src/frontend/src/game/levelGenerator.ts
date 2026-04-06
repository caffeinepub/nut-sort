export type NutColor =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "black"
  | "white"
  | "brown"
  | "grey";

export const NUT_COLORS: NutColor[] = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "pink",
  "black",
  "white",
  "brown",
  "grey",
];

export interface ColorInfo {
  bg: string;
  gradient: string;
  shadow: string;
  highlight: string;
}

export const COLOR_MAP: Record<NutColor, ColorInfo> = {
  red: {
    bg: "#FF4757",
    gradient: "linear-gradient(135deg, #FF6B7A 0%, #FF2D3D 100%)",
    shadow: "#CC1A2A",
    highlight: "rgba(255,255,255,0.35)",
  },
  blue: {
    bg: "#2F86FF",
    gradient: "linear-gradient(135deg, #5AA3FF 0%, #1A6FEE 100%)",
    shadow: "#1050BB",
    highlight: "rgba(255,255,255,0.35)",
  },
  green: {
    bg: "#2ED573",
    gradient: "linear-gradient(135deg, #5EE895 0%, #1CBD5A 100%)",
    shadow: "#0F9444",
    highlight: "rgba(255,255,255,0.35)",
  },
  yellow: {
    bg: "#FFD700",
    gradient: "linear-gradient(135deg, #FFE44D 0%, #FFBE00 100%)",
    shadow: "#CC9A00",
    highlight: "rgba(255,255,255,0.4)",
  },
  orange: {
    bg: "#FF6B35",
    gradient: "linear-gradient(135deg, #FF8B5A 0%, #FF4A10 100%)",
    shadow: "#CC3300",
    highlight: "rgba(255,255,255,0.35)",
  },
  purple: {
    bg: "#9B59B6",
    gradient: "linear-gradient(135deg, #B87FCC 0%, #7D3C98 100%)",
    shadow: "#6C3483",
    highlight: "rgba(255,255,255,0.3)",
  },
  pink: {
    bg: "#FF6BC1",
    gradient: "linear-gradient(135deg, #FF8DD4 0%, #FF4AAD 100%)",
    shadow: "#CC2891",
    highlight: "rgba(255,255,255,0.35)",
  },
  black: {
    bg: "#2a2a2a",
    gradient: "linear-gradient(135deg, #444444 0%, #1a1a1a 100%)",
    shadow: "#111",
    highlight: "rgba(255,255,255,0.2)",
  },
  white: {
    bg: "#e8e8e8",
    gradient: "linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)",
    shadow: "#b0b0b0",
    highlight: "rgba(255,255,255,0.9)",
  },
  brown: {
    bg: "#8B4513",
    gradient: "linear-gradient(135deg, #A0522D 0%, #6B3410 100%)",
    shadow: "#5c2a00",
    highlight: "rgba(255,200,150,0.3)",
  },
  grey: {
    bg: "#7f7f7f",
    gradient: "linear-gradient(135deg, #999999 0%, #666666 100%)",
    shadow: "#555",
    highlight: "rgba(255,255,255,0.3)",
  },
};

export interface LevelConfig {
  tubes: number;
  colors: number;
  nutsPerTube: number;
  emptyTubes: number;
}

export function getLevelConfig(levelNum: number): LevelConfig {
  // Always 2 empty tubes so players have room to sort
  if (levelNum <= 5)
    return { tubes: 7, colors: 5, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 15)
    return { tubes: 8, colors: 6, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 40)
    return { tubes: 8, colors: 6, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 100)
    return { tubes: 9, colors: 7, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 200)
    return { tubes: 9, colors: 7, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 400)
    return { tubes: 10, colors: 8, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 700)
    return { tubes: 11, colors: 9, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 1200)
    return { tubes: 12, colors: 10, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 2000)
    return { tubes: 13, colors: 11, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 3000)
    return { tubes: 13, colors: 11, nutsPerTube: 5, emptyTubes: 2 };
  if (levelNum <= 4000)
    return { tubes: 13, colors: 11, nutsPerTube: 5, emptyTubes: 2 };
  return { tubes: 13, colors: 11, nutsPerTube: 5, emptyTubes: 2 };
}

export function getMinMoves(levelNum: number): number {
  if (levelNum <= 5) return 12;
  if (levelNum <= 15) return 16;
  if (levelNum <= 50) return 20;
  if (levelNum <= 200) return 25;
  if (levelNum <= 1000) return 30;
  return 40;
}

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Grouped mix: each rod gets mostly one colour as its "primary",
 * but a few nuts from other colours are scattered in.
 * This makes the puzzle clear (you can see what goes where)
 * while still requiring moves to solve.
 */
function groupedMixNuts(
  colors: NutColor[],
  nutsPerTube: number,
  emptyTubes: number,
  rand: () => number,
  mixFraction = 0.35, // fraction of "foreign" nuts per rod
): NutColor[][] {
  const numColors = colors.length;

  // Build a pool for each color — each appears exactly nutsPerTube times
  const pools: NutColor[][] = colors.map((c) => Array(nutsPerTube).fill(c));

  // For each rod, assign a primary color and fill mostly with it,
  // then swap some with random foreign nuts
  const tubes: NutColor[][] = [];

  for (let t = 0; t < numColors; t++) {
    const primaryColor = colors[t];
    // Start with all primary
    const tube: NutColor[] = Array(nutsPerTube).fill(primaryColor);

    // Decide how many foreign nuts to insert
    const foreignCount = Math.max(1, Math.round(nutsPerTube * mixFraction));

    // Pick random slots to replace with foreign colors
    const slotsToReplace: number[] = [];
    const allSlots = Array.from({ length: nutsPerTube }, (_, i) => i);
    // Shuffle slots
    for (let i = allSlots.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [allSlots[i], allSlots[j]] = [allSlots[j], allSlots[i]];
    }
    for (let i = 0; i < foreignCount; i++) slotsToReplace.push(allSlots[i]);

    // Replace selected slots with foreign colors
    for (const slot of slotsToReplace) {
      // Pick a random foreign color (not the primary)
      let foreignColor: NutColor;
      let attempts = 0;
      do {
        foreignColor = colors[Math.floor(rand() * numColors)];
        attempts++;
      } while (foreignColor === primaryColor && attempts < 10);

      tube[slot] = foreignColor;
      // Remove one of that foreign color from its pool (to keep total counts balanced)
      const poolIdx = pools[colors.indexOf(foreignColor)];
      const removeIdx = poolIdx.indexOf(foreignColor);
      if (removeIdx !== -1) poolIdx.splice(removeIdx, 1);

      // Add back the displaced primary to its pool
      pools[colors.indexOf(primaryColor)].push(primaryColor);
    }

    // Shuffle the tube contents so top nut is unpredictable
    for (let i = tube.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [tube[i], tube[j]] = [tube[j], tube[i]];
    }

    tubes.push(tube);
  }

  // Add empty tubes
  for (let i = 0; i < emptyTubes; i++) {
    tubes.push([]);
  }

  return tubes;
}

import { isLevelComplete } from "./gameLogic";

function countMinMoves(tubes: NutColor[][], nutsPerTube: number): number {
  if (isLevelComplete(tubes, nutsPerTube)) return 0;

  type State = { tubes: NutColor[][]; depth: number };
  const queue: State[] = [{ tubes: tubes.map((t) => [...t]), depth: 0 }];
  const visited = new Set<string>();
  visited.add(JSON.stringify(tubes));

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.depth >= 40) return cur.depth;

    for (let from = 0; from < cur.tubes.length; from++) {
      if (cur.tubes[from].length === 0) continue;
      const nut = cur.tubes[from][cur.tubes[from].length - 1];
      for (let to = 0; to < cur.tubes.length; to++) {
        if (from === to) continue;
        if (cur.tubes[to].length >= nutsPerTube) continue;
        if (
          cur.tubes[to].length > 0 &&
          cur.tubes[to][cur.tubes[to].length - 1] !== nut
        )
          continue;

        const next = cur.tubes.map((t) => [...t]);
        next[to].push(next[from].pop()!);
        const key = JSON.stringify(next);
        if (!visited.has(key)) {
          visited.add(key);
          if (isLevelComplete(next, nutsPerTube)) return cur.depth + 1;
          if (cur.depth + 1 < 40) {
            queue.push({ tubes: next, depth: cur.depth + 1 });
          }
        }
      }
    }
  }
  return 40;
}

export function generateLevel(levelNum: number): NutColor[][] {
  const config = getLevelConfig(levelNum);
  const { colors, nutsPerTube, emptyTubes } = config;
  const baseSeed = levelNum * 2654435761;

  const selectedColors = NUT_COLORS.slice(0, colors) as NutColor[];

  // Mix fraction increases slightly with level for more challenge
  const mixFraction = Math.min(0.5, 0.25 + levelNum * 0.001);

  // Try multiple seeds for early levels to ensure solvability
  if (levelNum <= 400) {
    const minRequired = getMinMoves(levelNum);
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const seed = baseSeed + attempt * 1234567;
      const rand = mulberry32(seed);
      const mixed = groupedMixNuts(
        selectedColors,
        nutsPerTube,
        emptyTubes,
        rand,
        mixFraction,
      );

      const depth = countMinMoves(mixed, nutsPerTube);
      if (depth >= minRequired) {
        return mixed;
      }
    }

    // Fallback
    const rand = mulberry32(baseSeed + 9 * 1234567);
    return groupedMixNuts(
      selectedColors,
      nutsPerTube,
      emptyTubes,
      rand,
      mixFraction,
    );
  }

  const rand = mulberry32(baseSeed);
  return groupedMixNuts(
    selectedColors,
    nutsPerTube,
    emptyTubes,
    rand,
    mixFraction,
  );
}

export function dateToSeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function generateDailyChallenge(date: Date): NutColor[][] {
  const seed = dateToSeed(date);
  const config: LevelConfig = {
    tubes: 12,
    colors: 10,
    nutsPerTube: 5,
    emptyTubes: 2,
  };
  const { colors, nutsPerTube, emptyTubes } = config;
  const rand = mulberry32(seed);

  const selectedColors = NUT_COLORS.slice(0, colors) as NutColor[];
  return groupedMixNuts(selectedColors, nutsPerTube, emptyTubes, rand, 0.35);
}

export const CHAPTER_NAMES: Record<number, string> = {
  1: "Beginner Bolts",
  2: "Twisted Tangles",
  3: "Color Conundrum",
  4: "Metallic Mayhem",
  5: "Nut Ninja",
  6: "Bolt Brigade",
  7: "Chromatic Chaos",
  8: "Hex Hysteria",
  9: "Rainbow Riddles",
  10: "Spiral Scramble",
  11: "Iron Illusions",
  12: "Steel Storm",
  13: "Copper Cascade",
  14: "Bronze Blitz",
  15: "Titanium Trials",
  16: "Neon Nexus",
  17: "Prism Puzzle",
  18: "Vortex Vault",
  19: "Quantum Quandary",
  20: "Crystal Craze",
  21: "Sapphire Shuffle",
  22: "Emerald Enigma",
  23: "Ruby Rush",
  24: "Amber Abyss",
  25: "Obsidian Order",
  26: "Cobalt Clash",
  27: "Crimson Conundrum",
  28: "Violet Vortex",
  29: "Cerulean Cipher",
  30: "Magenta Maze",
  31: "Teal Tempest",
  32: "Jade Jungle",
  33: "Lilac Labyrinth",
  34: "Scarlet Spiral",
  35: "Indigo Inferno",
  36: "Saffron Storm",
  37: "Maroon Mania",
  38: "Periwinkle Perils",
  39: "Vermillion Venture",
  40: "Chartreuse Challenge",
  41: "Fuchsia Frenzy",
  42: "Cerulean Clash",
  43: "Ochre Odyssey",
  44: "Tangerine Trials",
  45: "Lavender Loop",
  46: "Crimson Crossing",
  47: "Azure Ascent",
  48: "Jade Journey",
  49: "Opal Oracle",
  50: "Platinum Pinnacle",
};

export function getChapterName(chapterNum: number): string {
  return CHAPTER_NAMES[chapterNum] ?? `Chapter ${chapterNum}`;
}

export function getChapterForLevel(levelNum: number): number {
  return Math.ceil(levelNum / 50);
}
