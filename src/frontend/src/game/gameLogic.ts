import type { NutColor } from "./levelGenerator";
import { getLevelConfig } from "./levelGenerator";

export interface GameState {
  levelNum: number;
  tubes: NutColor[][];
  selectedTube: number | null;
  moveCount: number;
  undoStack: NutColor[][][];
  undosLeft: number;
  hintsLeft: number;
  hintHighlight: { from: number; to: number } | null;
  isComplete: boolean;
  isFailed: boolean;
  startTime: number;
  isDaily?: boolean;
}

export function createGameState(
  levelNum: number,
  tubes: NutColor[][],
  isDaily = false,
): GameState {
  return {
    levelNum,
    tubes: tubes.map((t) => [...t]),
    selectedTube: null,
    moveCount: 0,
    undoStack: [],
    undosLeft: 3,
    hintsLeft: 3,
    hintHighlight: null,
    isComplete: false,
    isFailed: false,
    startTime: Date.now(),
    isDaily,
  };
}

export function deepCopyTubes(tubes: NutColor[][]): NutColor[][] {
  return tubes.map((t) => [...t]);
}

export function isLevelComplete(
  tubes: NutColor[][],
  nutsPerTube: number,
): boolean {
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length !== nutsPerTube) return false;
    const first = tube[0];
    for (const nut of tube) {
      if (nut !== first) return false;
    }
  }
  return true;
}

export function canPickFrom(tubes: NutColor[][], tubeIdx: number): boolean {
  return tubes[tubeIdx].length > 0;
}

export function canPlaceOn(
  tubes: NutColor[][],
  tubeIdx: number,
  nut: NutColor,
  nutsPerTube: number,
): boolean {
  const tube = tubes[tubeIdx];
  if (tube.length >= nutsPerTube) return false;
  if (tube.length === 0) return true;
  return tube[tube.length - 1] === nut;
}

export function getValidMoves(
  tubes: NutColor[][],
  nutsPerTube: number,
): Array<{ from: number; to: number }> {
  const moves: Array<{ from: number; to: number }> = [];
  for (let from = 0; from < tubes.length; from++) {
    if (tubes[from].length === 0) continue;
    const nut = tubes[from][tubes[from].length - 1];
    for (let to = 0; to < tubes.length; to++) {
      if (from === to) continue;
      if (canPlaceOn(tubes, to, nut, nutsPerTube)) {
        moves.push({ from, to });
      }
    }
  }
  return moves;
}

export function applyMove(
  state: GameState,
  fromIdx: number,
  toIdx: number,
): GameState {
  const config = getLevelConfig(state.levelNum);
  const nutsPerTube = state.isDaily ? 4 : config.nutsPerTube;

  if (!canPickFrom(state.tubes, fromIdx)) return state;
  const nut = state.tubes[fromIdx][state.tubes[fromIdx].length - 1];
  if (!canPlaceOn(state.tubes, toIdx, nut, nutsPerTube)) return state;

  const newTubes = deepCopyTubes(state.tubes);
  newTubes[toIdx].push(newTubes[fromIdx].pop()!);

  const newStack = [...state.undoStack, deepCopyTubes(state.tubes)];
  const complete = isLevelComplete(newTubes, nutsPerTube);

  const validMovesAfter = complete ? [] : getValidMoves(newTubes, nutsPerTube);
  const failed = !complete && validMovesAfter.length === 0;

  return {
    ...state,
    tubes: newTubes,
    selectedTube: null,
    moveCount: state.moveCount + 1,
    undoStack: newStack,
    hintHighlight: null,
    isComplete: complete,
    isFailed: failed,
  };
}

export function undoMove(state: GameState): GameState {
  if (state.undoStack.length === 0 || state.undosLeft <= 0) return state;

  const prevTubes = state.undoStack[state.undoStack.length - 1];
  return {
    ...state,
    tubes: deepCopyTubes(prevTubes),
    undoStack: state.undoStack.slice(0, -1),
    undosLeft: state.undosLeft - 1,
    selectedTube: null,
    hintHighlight: null,
    isComplete: false,
    isFailed: false,
  };
}

export function getHint(state: GameState): {
  state: GameState;
  hint: { from: number; to: number } | null;
} {
  if (state.hintsLeft <= 0) return { state, hint: null };

  const config = getLevelConfig(state.levelNum);
  const nutsPerTube = state.isDaily ? 4 : config.nutsPerTube;
  const moves = getValidMoves(state.tubes, nutsPerTube);

  if (moves.length === 0) return { state, hint: null };

  // Prefer moves that stack same-color nuts
  const scoredMoves = moves.map((m) => {
    const destTube = state.tubes[m.to];
    const srcTop = state.tubes[m.from][state.tubes[m.from].length - 1];
    let score = 0;
    if (destTube.length > 0 && destTube[destTube.length - 1] === srcTop) {
      score += 10;
    }
    if (destTube.length === 0) score += 1;
    return { ...m, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  const best = scoredMoves[0];

  const newState: GameState = {
    ...state,
    hintsLeft: state.hintsLeft - 1,
    hintHighlight: { from: best.from, to: best.to },
  };

  return { state: newState, hint: best };
}

export function calculateStars(
  moveCount: number,
  colors: number,
  nutsPerTube: number,
): number {
  const optimal = colors * nutsPerTube;
  if (moveCount <= optimal * 1.5) return 3;
  if (moveCount <= optimal * 2.5) return 2;
  return 1;
}

export function selectTube(state: GameState, tubeIdx: number): GameState {
  const config = getLevelConfig(state.levelNum);
  const nutsPerTube = state.isDaily ? 4 : config.nutsPerTube;

  // If no tube selected yet
  if (state.selectedTube === null) {
    if (!canPickFrom(state.tubes, tubeIdx)) {
      return state; // can't pick from empty tube
    }
    return { ...state, selectedTube: tubeIdx, hintHighlight: null };
  }

  // Same tube selected — deselect
  if (state.selectedTube === tubeIdx) {
    return { ...state, selectedTube: null };
  }

  // Try to move from selected to tubeIdx
  const fromIdx = state.selectedTube;
  const nut = state.tubes[fromIdx][state.tubes[fromIdx].length - 1];

  if (canPlaceOn(state.tubes, tubeIdx, nut, nutsPerTube)) {
    return applyMove({ ...state, selectedTube: null }, fromIdx, tubeIdx);
  }

  // If can pick from new tube, switch selection
  if (canPickFrom(state.tubes, tubeIdx)) {
    return { ...state, selectedTube: tubeIdx, hintHighlight: null };
  }

  return state;
}
