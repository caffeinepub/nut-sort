import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { calculateStars } from "./game/gameLogic";
import { generateDailyChallenge } from "./game/levelGenerator";
import type { NutColor } from "./game/levelGenerator";
import { getLevelConfig } from "./game/levelGenerator";
import { soundSystem } from "./game/soundSystem";
import {
  type SaveData,
  claimDailyChallenge,
  completeLevelInSave,
  loadSave,
  saveSave,
} from "./game/storage";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";
import LevelCompleteScreen from "./screens/LevelCompleteScreen";
import LevelFailedScreen from "./screens/LevelFailedScreen";
import LevelSelectScreen from "./screens/LevelSelectScreen";
import LoadingScreen from "./screens/LoadingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

type Screen =
  | { type: "welcome" }
  | { type: "home" }
  | { type: "loading"; nextLevel: number }
  | { type: "levelSelect" }
  | {
      type: "game";
      levelNum: number;
      isDaily?: boolean;
      dailyTubes?: NutColor[][];
    }
  | {
      type: "levelComplete";
      levelNum: number;
      stars: number;
      moves: number;
      isDaily?: boolean;
    }
  | { type: "levelFailed"; levelNum: number; hintsLeft: number };

const App: React.FC = () => {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  // Always start with welcome screen
  const [screen, setScreen] = useState<Screen>({ type: "welcome" });
  const [soundEnabled, setSoundEnabled] = useState(
    () => loadSave().soundEnabled,
  );
  const [musicEnabled, setMusicEnabled] = useState(
    () => loadSave().musicEnabled,
  );

  // Persist save to localStorage whenever it changes
  useEffect(() => {
    saveSave(save);
  }, [save]);

  const handleToggleSound = useCallback(() => {
    const newVal = soundSystem.toggleSound();
    setSoundEnabled(newVal);
    setSave((prev) => ({ ...prev, soundEnabled: newVal }));
  }, []);

  const handleToggleMusic = useCallback(() => {
    const newVal = soundSystem.toggleMusic();
    setMusicEnabled(newVal);
    setSave((prev) => ({ ...prev, musicEnabled: newVal }));
  }, []);

  const handlePlay = useCallback(() => {
    // Show loading screen before entering game
    const levelNum = Math.max(1, save.maxUnlockedLevel);
    setScreen({ type: "loading", nextLevel: levelNum });
  }, [save.maxUnlockedLevel]);

  const handleLevelSelect = useCallback(() => {
    setScreen({ type: "levelSelect" });
  }, []);

  const handleDailyChallenge = useCallback(() => {
    const tubes = generateDailyChallenge(new Date());
    setScreen({ type: "game", levelNum: 0, isDaily: true, dailyTubes: tubes });
  }, []);

  const handleSelectLevel = useCallback((levelNum: number) => {
    setScreen({ type: "game", levelNum });
  }, []);

  const handleLevelComplete = useCallback(
    (levelNum: number, stars: number, moves: number, isDaily = false) => {
      if (isDaily) {
        // Daily challenge completed
        setSave((prev) => {
          const updated = claimDailyChallenge(prev);
          saveSave(updated);
          return updated;
        });
        setScreen({
          type: "levelComplete",
          levelNum,
          stars,
          moves,
          isDaily: true,
        });
        return;
      }

      // Normal level complete
      const config = getLevelConfig(levelNum);
      const computedStars = calculateStars(
        moves,
        config.colors,
        config.nutsPerTube,
      );
      const finalStars = Math.max(stars, computedStars);

      setSave((prev) => {
        const updated = completeLevelInSave(prev, levelNum, finalStars, moves);
        saveSave(updated);
        return updated;
      });

      setScreen({ type: "levelComplete", levelNum, stars: finalStars, moves });
    },
    [],
  );

  const handleLevelFailed = useCallback(
    (levelNum: number, hintsLeft: number) => {
      setScreen({ type: "levelFailed", levelNum, hintsLeft });
    },
    [],
  );

  const handleNextLevel = useCallback((currentLevel: number) => {
    const next = currentLevel + 1;
    if (next > 5000) {
      setScreen({ type: "home" });
      return;
    }
    // Go to next level directly (no loading screen to avoid double-trigger issues)
    setScreen({ type: "game", levelNum: next });
  }, []);

  const handleReplay = useCallback((levelNum: number, isDaily = false) => {
    if (isDaily) {
      const tubes = generateDailyChallenge(new Date());
      setScreen({
        type: "game",
        levelNum: 0,
        isDaily: true,
        dailyTubes: tubes,
      });
    } else {
      setScreen({ type: "game", levelNum });
    }
  }, []);

  const handleQuitToMap = useCallback(() => {
    setScreen({ type: "levelSelect" });
  }, []);

  const handleQuitToHome = useCallback(() => {
    setScreen({ type: "home" });
  }, []);

  // Render current screen
  const renderScreen = () => {
    switch (screen.type) {
      case "welcome":
        return <WelcomeScreen onDone={() => setScreen({ type: "home" })} />;

      case "home":
        return (
          <HomeScreen
            save={save}
            onPlay={handlePlay}
            onLevelSelect={handleLevelSelect}
            onDailyChallenge={handleDailyChallenge}
          />
        );

      case "loading":
        return (
          <LoadingScreen
            onComplete={() =>
              setScreen({ type: "game", levelNum: screen.nextLevel })
            }
          />
        );

      case "levelSelect":
        return (
          <LevelSelectScreen
            save={save}
            onSelectLevel={handleSelectLevel}
            onBack={handleQuitToHome}
          />
        );

      case "game":
        return (
          <div style={{ position: "relative" }}>
            <GameScreen
              key={`game-${screen.levelNum}-${screen.isDaily ? "daily" : "normal"}`}
              levelNum={screen.levelNum}
              isDaily={screen.isDaily}
              dailyTubes={screen.dailyTubes}
              save={save}
              onLevelComplete={(lvl, stars, moves) =>
                handleLevelComplete(lvl, stars, moves, screen.isDaily)
              }
              onLevelFailed={handleLevelFailed}
              onQuitToMap={handleQuitToMap}
              onQuitToHome={handleQuitToHome}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={handleToggleSound}
              onToggleMusic={handleToggleMusic}
            />
          </div>
        );

      case "levelComplete":
        return (
          <LevelCompleteScreen
            levelNum={screen.levelNum}
            stars={screen.stars}
            moves={screen.moves}
            totalPoints={save.totalPoints}
            isDaily={screen.isDaily}
            onNextLevel={() => handleNextLevel(screen.levelNum)}
            onReplay={() => handleReplay(screen.levelNum, screen.isDaily)}
            onQuitToMap={handleQuitToMap}
          />
        );

      case "levelFailed":
        return (
          <div style={{ position: "relative" }}>
            <GameScreen
              key={`failed-${screen.levelNum}`}
              levelNum={screen.levelNum}
              save={save}
              onLevelComplete={() => {}}
              onQuitToMap={handleQuitToMap}
              onQuitToHome={handleQuitToHome}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={handleToggleSound}
              onToggleMusic={handleToggleMusic}
            />
            <LevelFailedScreen
              onRetry={() =>
                setScreen({ type: "game", levelNum: screen.levelNum })
              }
              onUseHint={() =>
                setScreen({ type: "game", levelNum: screen.levelNum })
              }
              onQuitToMap={handleQuitToMap}
              hintsLeft={screen.hintsLeft}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="app-root">{renderScreen()}</div>;
};

export default App;
