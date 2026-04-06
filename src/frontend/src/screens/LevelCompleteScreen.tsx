import type React from "react";
import { useEffect, useState } from "react";
import Confetti from "../components/Confetti";
import StarRating from "../components/StarRating";
import { soundSystem } from "../game/soundSystem";

interface LevelCompleteScreenProps {
  levelNum: number;
  stars: number;
  moves: number;
  totalPoints: number;
  isDaily?: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onQuitToMap: () => void;
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  levelNum,
  stars,
  moves,
  totalPoints,
  isDaily = false,
  onNextLevel,
  onReplay,
  onQuitToMap,
}) => {
  const [visible, setVisible] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowPoints(true), 800);
    soundSystem.playCelebration();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,10,50,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(8px)",
        fontFamily: "Nunito, sans-serif",
      }}
      data-ocid="level_complete.modal"
    >
      <Confetti active={visible} />

      <div
        style={{
          background:
            "linear-gradient(135deg, #FFF9E6 0%, #FFF0A0 50%, #FFE066 100%)",
          border: "4px solid rgba(0,0,0,0.2)",
          borderRadius: 28,
          padding: "28px 24px 24px",
          width: "min(320px, 82vw)",
          textAlign: "center",
          boxShadow:
            "0 8px 0 rgba(0,0,0,0.2), 0 16px 40px rgba(0,0,0,0.4), 0 0 60px rgba(255,200,0,0.3)",
          transform: visible ? "scale(1)" : "scale(0.7)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Amazing! headline */}
        <div
          style={{
            fontSize: "clamp(2.8rem, 12vw, 4.2rem)",
            fontWeight: 900,
            fontFamily: "Fredoka One, Nunito, sans-serif",
            lineHeight: 1,
            marginBottom: 8,
            background:
              "linear-gradient(135deg, #FF4FD8 0%, #FF8C00 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(-2px -2px 0 rgba(0,0,0,0.35)) drop-shadow(2px -2px 0 rgba(0,0,0,0.35)) drop-shadow(-2px 2px 0 rgba(0,0,0,0.35)) drop-shadow(2px 2px 0 rgba(0,0,0,0.35)) drop-shadow(0 5px 0 rgba(0,0,0,0.2))",
            animation: visible ? "bounce-in 0.5s ease 0.15s both" : "none",
          }}
        >
          Amazing! 🎉
        </div>

        <p
          style={{
            color: "#9a5a00",
            fontSize: 14,
            margin: "0 0 12px",
            fontWeight: 700,
          }}
        >
          {isDaily ? "Daily Challenge" : `Level ${levelNum}`} · {moves} moves
        </p>

        {/* Stars */}
        <div style={{ marginBottom: 12 }}>
          <StarRating stars={stars} size="lg" animate />
        </div>

        {/* Points */}
        {showPoints && (
          <div
            style={{
              background: "linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)",
              border: "3px solid rgba(0,0,0,0.2)",
              borderRadius: 18,
              padding: "10px 18px",
              marginBottom: 16,
              animation: "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow:
                "0 5px 0 rgba(0,0,0,0.2), 0 8px 20px rgba(255,100,120,0.35)",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "Fredoka One, Nunito, sans-serif",
                textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                letterSpacing: "1px",
              }}
            >
              +{isDaily ? 100 : 50} Points! 🎉
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                marginTop: 3,
                fontWeight: 700,
              }}
            >
              Total: {totalPoints.toLocaleString()} pts
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!isDaily && (
            <button
              type="button"
              className="game-btn btn-primary"
              onClick={onNextLevel}
              data-ocid="level_complete.next_button"
            >
              ▶ Next Level
            </button>
          )}

          <button
            type="button"
            className="game-btn btn-secondary"
            onClick={onReplay}
            data-ocid="level_complete.replay_button"
          >
            🔄 Replay
          </button>

          <button
            type="button"
            className="game-btn btn-ghost"
            onClick={onQuitToMap}
            data-ocid="level_complete.map_button"
          >
            🗺 Level Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteScreen;
