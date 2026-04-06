import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PauseMenu from "../components/PauseMenu";
import Tube from "../components/Tube";
import type { GameState } from "../game/gameLogic";
import {
  calculateStars,
  getHint,
  selectTube,
  undoMove,
} from "../game/gameLogic";
import { createGameState } from "../game/gameLogic";
import {
  generateLevel,
  getChapterForLevel,
  getChapterName,
  getLevelConfig,
} from "../game/levelGenerator";
import type { NutColor } from "../game/levelGenerator";
import { soundSystem } from "../game/soundSystem";
import type { SaveData } from "../game/storage";

// Inner rod colours — one per stand, cycling through 11 colours
const ROD_INNER_COLORS = [
  "#FF4757", // red
  "#2F86FF", // blue
  "#FFD700", // yellow
  "#2ED573", // green
  "#FF6B35", // orange
  "#9B59B6", // purple
  "#FF6BC1", // pink
  "#2a2a2a", // black
  "#e8e8e8", // white
  "#8B4513", // brown
  "#7f7f7f", // grey
];

// Cartoon cloud decorations for game background
const GAME_CLOUDS = [
  { id: "gc1", left: 2, top: 12, width: 70, opacity: 0.6, dur: 7 },
  { id: "gc2", left: 60, top: 8, width: 55, opacity: 0.5, dur: 9 },
  { id: "gc3", left: 82, top: 18, width: 45, opacity: 0.45, dur: 11 },
];

interface GameScreenProps {
  levelNum: number;
  isDaily?: boolean;
  dailyTubes?: NutColor[][];
  save: SaveData;
  onLevelComplete: (levelNum: number, stars: number, moves: number) => void;
  onQuitToMap: () => void;
  onQuitToHome: () => void;
  onLevelFailed?: (levelNum: number, hintsLeft: number) => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  levelNum,
  isDaily = false,
  dailyTubes,
  save,
  onLevelComplete,
  onQuitToMap,
  onQuitToHome: _onQuitToHome,
  onLevelFailed,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  const initTubes = useMemo(() => {
    if (isDaily && dailyTubes) return dailyTubes;
    return generateLevel(levelNum);
  }, [levelNum, isDaily, dailyTubes]);

  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(levelNum, initTubes, isDaily),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [invalidTube, setInvalidTube] = useState<number | null>(null);
  const [extraStandUsed, setExtraStandUsed] = useState(false);
  const [unscrewingTube, setUnscrewingTube] = useState<number | null>(null);
  const [screwingInTube, setScrewingInTube] = useState<number | null>(null);

  const config = useMemo(() => getLevelConfig(levelNum), [levelNum]);
  const nutsPerTube = isDaily ? 4 : config.nutsPerTube;
  const chapter = getChapterForLevel(levelNum);

  // Reset game when level changes
  useEffect(() => {
    const tubes = isDaily && dailyTubes ? dailyTubes : generateLevel(levelNum);
    setGameState(createGameState(levelNum, tubes, isDaily));
    setIsPaused(false);
    setInvalidTube(null);
    setExtraStandUsed(false);
    setUnscrewingTube(null);
    setScrewingInTube(null);
  }, [levelNum, isDaily, dailyTubes]);

  // Trigger complete callbacks
  useEffect(() => {
    if (gameState.isComplete) {
      const stars = calculateStars(
        gameState.moveCount,
        config.colors,
        nutsPerTube,
      );
      onLevelComplete(levelNum, stars, gameState.moveCount);
    }
  }, [
    gameState.isComplete,
    gameState.moveCount,
    config.colors,
    nutsPerTube,
    levelNum,
    onLevelComplete,
  ]);

  // Trigger failed callback
  useEffect(() => {
    if (gameState.isFailed && onLevelFailed) {
      onLevelFailed(levelNum, gameState.hintsLeft);
    }
  }, [gameState.isFailed, gameState.hintsLeft, levelNum, onLevelFailed]);

  const handleTubeClick = useCallback(
    (tubeIdx: number) => {
      if (gameState.isComplete || gameState.isFailed || isPaused) return;

      const prevSelected = gameState.selectedTube;
      const newState = selectTube(gameState, tubeIdx);

      if (
        newState.selectedTube === gameState.selectedTube &&
        newState.moveCount === gameState.moveCount &&
        prevSelected !== null &&
        prevSelected !== tubeIdx
      ) {
        soundSystem.playError();
        setInvalidTube(tubeIdx);
        setTimeout(() => setInvalidTube(null), 500);
        setGameState({ ...newState, selectedTube: null });
        return;
      }

      if (newState.moveCount > gameState.moveCount) {
        soundSystem.playPlace();
        setScrewingInTube(tubeIdx);
        setTimeout(() => setScrewingInTube(null), 400);
        if (newState.isComplete) {
          soundSystem.playDing();
        }
      } else if (newState.selectedTube !== null && prevSelected === null) {
        soundSystem.playClick();
        setUnscrewingTube(tubeIdx);
        setTimeout(() => setUnscrewingTube(null), 420);
      }

      setGameState(newState);
    },
    [gameState, isPaused],
  );

  const handleUndo = useCallback(() => {
    if (gameState.undosLeft <= 0 || gameState.undoStack.length === 0) return;
    soundSystem.playClick();
    setGameState((prev) => undoMove(prev));
  }, [gameState.undosLeft, gameState.undoStack.length]);

  const handleHint = useCallback(() => {
    if (gameState.hintsLeft <= 0) return;
    soundSystem.playClick();
    const { state: newState } = getHint(gameState);
    setGameState(newState);
  }, [gameState]);

  const handleRestart = useCallback(() => {
    const tubes = isDaily && dailyTubes ? dailyTubes : generateLevel(levelNum);
    setGameState(createGameState(levelNum, tubes, isDaily));
    setIsPaused(false);
    setExtraStandUsed(false);
    setUnscrewingTube(null);
    setScrewingInTube(null);
    soundSystem.playClick();
  }, [levelNum, isDaily, dailyTubes]);

  const handleAddStand = useCallback(() => {
    if (extraStandUsed) return;
    setExtraStandUsed(true);
    soundSystem.playClick();
    setGameState((prev) => ({
      ...prev,
      tubes: [...prev.tubes, []],
    }));
  }, [extraStandUsed]);

  const tubeCount = gameState.tubes.length;
  const isManyTubes = tubeCount > 7;
  const nutSize = isManyTubes ? 38 : 46;

  const tubeIds = useMemo(
    () =>
      Array.from(
        { length: gameState.tubes.length },
        (_, i) => `tube-slot-${levelNum}-${i}`,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState.tubes.length, levelNum],
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 40%, #E8F4FF 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Nunito, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
      data-ocid="game.page"
    >
      {/* Cartoon clouds in background */}
      {GAME_CLOUDS.map((cloud) => (
        <div
          key={cloud.id}
          style={{
            position: "absolute",
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: cloud.width,
            height: cloud.width * 0.42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            opacity: cloud.opacity,
            pointerEvents: "none",
            animation: `float-cloud ${cloud.dur}s ease-in-out infinite alternate`,
            filter: "blur(1.5px)",
            zIndex: 0,
          }}
        />
      ))}

      {/* ── TOP HUD ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)",
          borderBottom: "3px solid rgba(0,0,0,0.2)",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(255,100,120,0.3)",
        }}
      >
        {/* Left: Settings + Shop */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              soundSystem.playClick();
              setIsPaused(true);
            }}
            data-ocid="game.pause_button"
            title="Settings"
            style={{
              background: "linear-gradient(135deg, #fff9e6 0%, #ffe47c 100%)",
              border: "3px solid rgba(0,0,0,0.25)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.12)",
            }}
          >
            ⚙️
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              soundSystem.playClick();
              setIsPaused(true);
            }}
            data-ocid="game.shop_button"
            title="Shop"
            style={{
              background: "linear-gradient(135deg, #d4f5ff 0%, #7cd8ff 100%)",
              border: "3px solid rgba(0,0,0,0.25)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.12)",
            }}
          >
            🛒
          </button>
        </div>

        {/* Center: Level badge */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFE566 0%, #FFB800 100%)",
            border: "3px solid rgba(0,0,0,0.25)",
            borderRadius: 16,
            padding: "6px 20px",
            textAlign: "center",
            boxShadow:
              "0 4px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(255,180,0,0.3)",
          }}
        >
          <div
            style={{
              color: "#5a3000",
              fontWeight: 900,
              fontSize: 16,
              lineHeight: 1.1,
              letterSpacing: "0.5px",
              fontFamily: "Fredoka One, Nunito, sans-serif",
            }}
          >
            {isDaily ? "🌟 Daily" : `Level ${levelNum}`}
          </div>
          {!isDaily && (
            <div
              style={{
                fontSize: 10,
                color: "#8B5000",
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}
            >
              {getChapterName(chapter)}
            </div>
          )}
        </div>

        {/* Right: Trophy + Points + Restart */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "linear-gradient(135deg, #fffbe6 0%, #ffe04f 100%)",
              border: "2px solid rgba(0,0,0,0.2)",
              borderRadius: 999,
              padding: "4px 10px",
              boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ fontSize: 14 }}>🏆</span>
            <span
              style={{
                color: "#5a3000",
                fontWeight: 800,
                fontSize: 13,
                fontFamily: "Fredoka One, Nunito, sans-serif",
              }}
            >
              {save.totalPoints.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={handleRestart}
            data-ocid="game.restart_button"
            title="Restart level"
            style={{
              background: "linear-gradient(135deg, #d4ffd4 0%, #7cdd7c 100%)",
              border: "3px solid rgba(0,0,0,0.25)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.12)",
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Moves counter — cartoon pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 14px",
          gap: 6,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "2px solid rgba(0,0,0,0.15)",
            borderRadius: 999,
            padding: "4px 14px",
            fontSize: 13,
            fontWeight: 700,
            color: "#4a3060",
            boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
            fontFamily: "Fredoka One, Nunito, sans-serif",
          }}
        >
          🔀 {gameState.moveCount} moves
        </div>
      </div>

      {/* Game area — bolt stands */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 8px 20px",
          overflowX: "auto",
          overflowY: "hidden",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: tubeCount <= 8 ? "wrap" : "nowrap",
            gap: isManyTubes ? 6 : 10,
            justifyContent: "center",
            alignItems: "flex-end",
            padding: "8px 8px",
            maxWidth: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {gameState.tubes.map((tube, i) => (
            <Tube
              key={tubeIds[i] ?? `tube-new-${i}`}
              nuts={tube}
              nutsPerTube={nutsPerTube}
              isSelected={gameState.selectedTube === i}
              isHintFrom={gameState.hintHighlight?.from === i}
              isHintTo={gameState.hintHighlight?.to === i}
              isInvalid={invalidTube === i}
              isUnscrewing={unscrewingTube === i}
              isScrewingIn={screwingInTube === i}
              isComplete={
                tube.length === nutsPerTube &&
                tube.length > 0 &&
                tube.every((n) => n === tube[0])
              }
              innerColor={ROD_INNER_COLORS[i % ROD_INNER_COLORS.length]}
              onClick={() => handleTubeClick(i)}
              nutSize={nutSize}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div
        style={{
          padding: "10px 14px 14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, #56C596 0%, #2ECC71 100%)",
          borderTop: "3px solid rgba(0,0,0,0.2)",
          position: "relative",
          zIndex: 10,
          flexWrap: "wrap",
          boxShadow: "0 -4px 12px rgba(46,204,113,0.2)",
        }}
      >
        {/* Undo button */}
        <button
          type="button"
          className="hud-btn hud-btn-action hud-btn-undo"
          onClick={handleUndo}
          disabled={
            gameState.undosLeft === 0 || gameState.undoStack.length === 0
          }
          data-ocid="game.undo_button"
          title="Undo"
        >
          ↩<span style={{ marginLeft: 4, fontSize: 13 }}>Undo</span>
          <span className="hud-btn-badge">{gameState.undosLeft}</span>
        </button>

        {/* Hint button */}
        <button
          type="button"
          className="hud-btn hud-btn-action hud-btn-hint"
          onClick={handleHint}
          disabled={gameState.hintsLeft === 0}
          data-ocid="game.hint_button"
          title="Hint"
        >
          💡<span style={{ marginLeft: 4, fontSize: 13 }}>Hint</span>
          <span className="hud-btn-badge">{gameState.hintsLeft}</span>
        </button>

        {/* Add Stand button */}
        {!isDaily && (
          <button
            type="button"
            className="hud-btn hud-btn-action hud-btn-stand hud-btn-stand-add"
            onClick={handleAddStand}
            disabled={extraStandUsed}
            data-ocid="game.add_stand_button"
            title="Add an extra empty stand"
            style={{
              opacity: extraStandUsed ? 0.45 : 1,
            }}
          >
            ➕
            <span style={{ marginLeft: 4, fontSize: 13 }}>
              {extraStandUsed ? "Stand" : "Stand (free)"}
            </span>
          </button>
        )}
      </div>

      {/* Pause menu */}
      {isPaused && (
        <PauseMenu
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onQuitToMap={onQuitToMap}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={onToggleSound}
          onToggleMusic={onToggleMusic}
        />
      )}
    </div>
  );
};

export default GameScreen;
