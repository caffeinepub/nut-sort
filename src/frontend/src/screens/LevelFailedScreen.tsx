import type React from "react";
import { soundSystem } from "../game/soundSystem";

interface LevelFailedScreenProps {
  onRetry: () => void;
  onUseHint: () => void;
  onQuitToMap: () => void;
  hintsLeft: number;
}

const LevelFailedScreen: React.FC<LevelFailedScreenProps> = ({
  onRetry,
  onUseHint,
  onQuitToMap,
  hintsLeft,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,14,50,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(6px)",
        fontFamily: "Nunito, sans-serif",
      }}
      data-ocid="level_failed.modal"
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e2060 0%, #3a1a2a 100%)",
          border: "2px solid rgba(255,100,100,0.3)",
          borderRadius: 28,
          padding: "36px 28px 28px",
          width: "min(340px, 92vw)",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>😅</div>

        <h2
          style={{
            color: "#FF6B7A",
            fontSize: 26,
            fontWeight: 900,
            margin: "0 0 8px",
          }}
        >
          No More Moves!
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 14,
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          You&apos;ve run out of valid moves. Don&apos;t worry — every master
          was once a beginner! Try a different approach.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            className="game-btn btn-primary"
            onClick={() => {
              soundSystem.playClick();
              onRetry();
            }}
            data-ocid="level_failed.retry_button"
          >
            🔄 Try Again
          </button>

          {hintsLeft > 0 && (
            <button
              type="button"
              className="game-btn btn-green"
              onClick={() => {
                soundSystem.playClick();
                onUseHint();
              }}
              data-ocid="level_failed.hint_button"
            >
              💡 Use a Hint ({hintsLeft} left)
            </button>
          )}

          <button
            type="button"
            className="game-btn btn-ghost"
            onClick={() => {
              soundSystem.playClick();
              onQuitToMap();
            }}
            data-ocid="level_failed.map_button"
          >
            🗺 Quit to Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelFailedScreen;
