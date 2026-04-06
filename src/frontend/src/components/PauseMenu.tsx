import type React from "react";
import { soundSystem } from "../game/soundSystem";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMap: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onQuitToMap,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div
      className="pause-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,12,40,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
      data-ocid="pause.modal"
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e2060 0%, #2d2f7a 100%)",
          border: "2px solid rgba(255,255,255,0.15)",
          borderRadius: 24,
          padding: "32px 28px",
          width: "min(340px, 90vw)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 4,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          ⏸ Paused
        </h2>

        <button
          type="button"
          className="game-btn btn-primary"
          onClick={() => {
            soundSystem.playClick();
            onResume();
          }}
          data-ocid="pause.resume_button"
        >
          ▶ Resume
        </button>

        <button
          type="button"
          className="game-btn btn-secondary"
          onClick={() => {
            soundSystem.playClick();
            onRestart();
          }}
          data-ocid="pause.restart_button"
        >
          🔄 Restart Level
        </button>

        <button
          type="button"
          className="game-btn btn-danger"
          onClick={() => {
            soundSystem.playClick();
            onQuitToMap();
          }}
          data-ocid="pause.quit_button"
        >
          🗺 Quit to Map
        </button>

        {/* Settings toggles */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 8,
            padding: "12px",
            background: "rgba(255,255,255,0.07)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              onToggleSound();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
            data-ocid="pause.sound_toggle"
          >
            <span style={{ fontSize: 28 }}>{soundEnabled ? "🔊" : "🔇"}</span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              {soundEnabled ? "Sound On" : "Sound Off"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              onToggleMusic();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
            data-ocid="pause.music_toggle"
          >
            <span style={{ fontSize: 28 }}>{musicEnabled ? "🎵" : "🎵"}</span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              {musicEnabled ? "Music On" : "Music Off"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
