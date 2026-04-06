import type React from "react";
import { useCallback } from "react";
import StarRating from "../components/StarRating";
import { getChapterForLevel, getChapterName } from "../game/levelGenerator";
import { soundSystem } from "../game/soundSystem";
import type { SaveData } from "../game/storage";

interface LevelSelectScreenProps {
  save: SaveData;
  onSelectLevel: (levelNum: number) => void;
  onBack: () => void;
}

// Vibrant cartoon chapter colors
const CHAPTER_COLORS: Record<
  number,
  { bg: string; shadow: string; text: string }
> = {
  1: {
    bg: "linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)",
    shadow: "#0d3d8a",
    text: "#fff",
  },
  2: {
    bg: "linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)",
    shadow: "#1a4d1d",
    text: "#fff",
  },
  3: {
    bg: "linear-gradient(135deg, #CE93D8 0%, #7B1FA2 100%)",
    shadow: "#4a0d6b",
    text: "#fff",
  },
  4: {
    bg: "linear-gradient(135deg, #EF9A9A 0%, #C62828 100%)",
    shadow: "#7a1010",
    text: "#fff",
  },
  5: {
    bg: "linear-gradient(135deg, #FFD54F 0%, #F57F17 100%)",
    shadow: "#8a4800",
    text: "#5a2800",
  },
  6: {
    bg: "linear-gradient(135deg, #4DB6AC 0%, #00695C 100%)",
    shadow: "#003d35",
    text: "#fff",
  },
  7: {
    bg: "linear-gradient(135deg, #64B5F6 0%, #1565C0 100%)",
    shadow: "#0d3d8a",
    text: "#fff",
  },
  8: {
    bg: "linear-gradient(135deg, #F48FB1 0%, #880E4F 100%)",
    shadow: "#4d082e",
    text: "#fff",
  },
  9: {
    bg: "linear-gradient(135deg, #BCAAA4 0%, #4E342E 100%)",
    shadow: "#2b1d1a",
    text: "#fff",
  },
  10: {
    bg: "linear-gradient(135deg, #B0BEC5 0%, #37474F 100%)",
    shadow: "#1b2830",
    text: "#fff",
  },
};

function getChapterStyle(chapterNum: number) {
  return CHAPTER_COLORS[chapterNum % 10 || 10];
}

const TOTAL_LEVELS = 5000;

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  save,
  onSelectLevel,
  onBack,
}) => {
  const handleLevelClick = useCallback(
    (levelNum: number) => {
      if (levelNum > save.maxUnlockedLevel) return;
      soundSystem.playClick();
      onSelectLevel(levelNum);
    },
    [save.maxUnlockedLevel, onSelectLevel],
  );

  const maxVisible = Math.min(
    TOTAL_LEVELS,
    Math.max(150, save.maxUnlockedLevel + 20),
  );

  const chaptersToShow: number[] = [];
  const maxChapter = getChapterForLevel(maxVisible);
  for (let c = 1; c <= maxChapter; c++) {
    chaptersToShow.push(c);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #667EEA 0%, #764BA2 100%)",
        fontFamily: "Nunito, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
      data-ocid="levelselect.page"
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)",
          borderBottom: "3px solid rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(255,100,120,0.3)",
        }}
      >
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          data-ocid="levelselect.back_button"
          style={{
            background: "linear-gradient(135deg, #fff9e6 0%, #ffe47c 100%)",
            border: "3px solid rgba(0,0,0,0.25)",
          }}
        >
          ←
        </button>
        <h1
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 900,
            margin: 0,
            flex: 1,
            fontFamily: "Fredoka One, Nunito, sans-serif",
            textShadow:
              "-2px -2px 0 rgba(0,0,0,0.3), 2px -2px 0 rgba(0,0,0,0.3), -2px 2px 0 rgba(0,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.3)",
          }}
        >
          🗺 Level Map
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "linear-gradient(135deg, #ffe566 0%, #ffb800 100%)",
            borderRadius: 999,
            padding: "5px 14px",
            border: "3px solid rgba(0,0,0,0.2)",
            boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
          }}
        >
          <span>⭐</span>
          <span
            style={{
              color: "#5a3c00",
              fontWeight: 900,
              fontSize: 15,
              fontFamily: "Fredoka One, Nunito, sans-serif",
            }}
          >
            {save.totalPoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Level grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px 40px" }}>
        {chaptersToShow.map((chapterNum) => {
          const startLevel = (chapterNum - 1) * 50 + 1;
          const endLevel = Math.min(chapterNum * 50, maxVisible);
          const chapterStyle = getChapterStyle(chapterNum);

          return (
            <div key={`chapter-${chapterNum}`} style={{ marginBottom: 32 }}>
              {/* Chapter header */}
              <div
                style={{
                  background: chapterStyle.bg,
                  borderRadius: 20,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "3px solid rgba(0,0,0,0.2)",
                  boxShadow: `0 5px 0 ${chapterStyle.shadow}, 0 8px 20px rgba(0,0,0,0.25)`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 18,
                    color: chapterStyle.text,
                    border: "3px solid rgba(255,255,255,0.4)",
                    fontFamily: "Fredoka One, Nunito, sans-serif",
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {chapterNum}
                </div>
                <div>
                  <div
                    style={{
                      color: chapterStyle.text,
                      fontWeight: 900,
                      fontSize: 17,
                      lineHeight: 1.2,
                      fontFamily: "Fredoka One, Nunito, sans-serif",
                      textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }}
                  >
                    {getChapterName(chapterNum)}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      fontWeight: 700,
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    Levels {startLevel}–{chapterNum * 50}
                  </div>
                </div>
              </div>

              {/* Level nodes */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "flex-start",
                  paddingLeft: 8,
                }}
              >
                {Array.from(
                  { length: endLevel - startLevel + 1 },
                  (_, i) => startLevel + i,
                ).map((levelNum) => {
                  const isLocked = levelNum > save.maxUnlockedLevel;
                  const isCurrent = levelNum === save.maxUnlockedLevel;
                  const progress = save.levelProgress[levelNum];
                  const isCompleted = !!progress && progress.stars > 0;
                  const stars = progress?.stars ?? 0;

                  return (
                    <div
                      key={`level-${levelNum}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleLevelClick(levelNum)}
                        disabled={isLocked}
                        data-ocid="levelselect.level_button"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          border: isCurrent
                            ? "3px solid #FFD700"
                            : "3px solid rgba(0,0,0,0.22)",
                          background: isLocked
                            ? "rgba(200,200,220,0.4)"
                            : isCompleted
                              ? "linear-gradient(135deg, #6ee86f 0%, #1d9e26 100%)"
                              : isCurrent
                                ? "linear-gradient(135deg, #FFE566 0%, #FF9900 100%)"
                                : chapterStyle.bg,
                          color: isLocked
                            ? "rgba(255,255,255,0.4)"
                            : isCompleted
                              ? "#0a3d0d"
                              : isCurrent
                                ? "#5a2800"
                                : chapterStyle.text,
                          fontWeight: 900,
                          fontSize: 15,
                          cursor: isLocked ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isLocked
                            ? "0 3px 0 rgba(0,0,0,0.1)"
                            : isCurrent
                              ? "0 4px 0 #b85e00, 0 0 16px rgba(255,215,0,0.55), 0 6px 14px rgba(0,0,0,0.25)"
                              : isCompleted
                                ? "0 4px 0 #157019, 0 6px 12px rgba(0,0,0,0.2)"
                                : `0 4px 0 ${chapterStyle.shadow}, 0 6px 12px rgba(0,0,0,0.2)`,
                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",
                          fontFamily: "Fredoka One, Nunito, sans-serif",
                          animation: isCurrent
                            ? "cartoon-bounce 2s ease-in-out infinite"
                            : "none",
                        }}
                      >
                        {isLocked ? "🔒" : isCompleted ? "✓" : levelNum}
                      </button>

                      {/* Stars */}
                      {isCompleted ? (
                        <div style={{ display: "flex", gap: 1 }}>
                          {[1, 2, 3].map((s) => (
                            <span
                              key={`star-${levelNum}-${s}`}
                              style={{
                                fontSize: 9,
                                opacity: s <= stars ? 1 : 0.25,
                                filter:
                                  s <= stars
                                    ? "drop-shadow(0 0 3px #FFD700)"
                                    : "none",
                              }}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      ) : !isLocked ? (
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.8)",
                            fontWeight: 700,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          {levelNum}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Show hint if max unlocked is low */}
        {save.maxUnlockedLevel < TOTAL_LEVELS && (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 700,
              padding: "20px 0",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            Complete levels to unlock more! ({TOTAL_LEVELS.toLocaleString()}{" "}
            total)
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSelectScreen;
