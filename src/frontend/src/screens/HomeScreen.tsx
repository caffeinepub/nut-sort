import type React from "react";
import { useCallback, useMemo } from "react";
import { soundSystem } from "../game/soundSystem";
import type { SaveData } from "../game/storage";

interface HomeScreenProps {
  save: SaveData;
  onPlay: () => void;
  onLevelSelect: () => void;
  onDailyChallenge: () => void;
}

const STAR_PARTICLES = [
  { id: "sp-1", left: 5, top: 8, size: 8, delay: 0, dur: 2.1, color: "yellow" },
  {
    id: "sp-2",
    left: 12,
    top: 22,
    size: 6,
    delay: 0.4,
    dur: 1.8,
    color: "pink",
  },
  {
    id: "sp-3",
    left: 22,
    top: 12,
    size: 10,
    delay: 0.8,
    dur: 2.4,
    color: "blue",
  },
  {
    id: "sp-4",
    left: 35,
    top: 6,
    size: 7,
    delay: 1.2,
    dur: 1.9,
    color: "green",
  },
  {
    id: "sp-5",
    left: 48,
    top: 18,
    size: 8,
    delay: 0.3,
    dur: 2.2,
    color: "yellow",
  },
  {
    id: "sp-6",
    left: 60,
    top: 9,
    size: 11,
    delay: 1.6,
    dur: 1.7,
    color: "pink",
  },
  {
    id: "sp-7",
    left: 72,
    top: 24,
    size: 7,
    delay: 0.6,
    dur: 2.5,
    color: "blue",
  },
  {
    id: "sp-8",
    left: 83,
    top: 14,
    size: 9,
    delay: 1.0,
    dur: 2.0,
    color: "green",
  },
  {
    id: "sp-9",
    left: 91,
    top: 30,
    size: 8,
    delay: 0.2,
    dur: 1.8,
    color: "yellow",
  },
  {
    id: "sp-10",
    left: 8,
    top: 45,
    size: 6,
    delay: 1.4,
    dur: 2.3,
    color: "pink",
  },
  {
    id: "sp-11",
    left: 25,
    top: 55,
    size: 10,
    delay: 0.7,
    dur: 1.9,
    color: "blue",
  },
  {
    id: "sp-12",
    left: 40,
    top: 40,
    size: 7,
    delay: 1.9,
    dur: 2.1,
    color: "yellow",
  },
  {
    id: "sp-13",
    left: 55,
    top: 50,
    size: 8,
    delay: 0.5,
    dur: 2.6,
    color: "green",
  },
  {
    id: "sp-14",
    left: 68,
    top: 38,
    size: 12,
    delay: 1.1,
    dur: 1.7,
    color: "pink",
  },
  {
    id: "sp-15",
    left: 80,
    top: 60,
    size: 7,
    delay: 0.9,
    dur: 2.0,
    color: "blue",
  },
  {
    id: "sp-16",
    left: 93,
    top: 48,
    size: 9,
    delay: 1.7,
    dur: 2.4,
    color: "yellow",
  },
  {
    id: "sp-17",
    left: 15,
    top: 72,
    size: 10,
    delay: 0.1,
    dur: 1.8,
    color: "green",
  },
  {
    id: "sp-18",
    left: 30,
    top: 80,
    size: 7,
    delay: 1.3,
    dur: 2.2,
    color: "pink",
  },
  {
    id: "sp-19",
    left: 50,
    top: 75,
    size: 8,
    delay: 0.8,
    dur: 2.0,
    color: "blue",
  },
  {
    id: "sp-20",
    left: 75,
    top: 82,
    size: 10,
    delay: 1.5,
    dur: 1.9,
    color: "yellow",
  },
  {
    id: "sp-21",
    left: 88,
    top: 70,
    size: 6,
    delay: 0.4,
    dur: 2.5,
    color: "green",
  },
  {
    id: "sp-22",
    left: 3,
    top: 65,
    size: 8,
    delay: 2.0,
    dur: 1.7,
    color: "pink",
  },
  {
    id: "sp-23",
    left: 44,
    top: 88,
    size: 11,
    delay: 0.6,
    dur: 2.3,
    color: "blue",
  },
  {
    id: "sp-24",
    left: 62,
    top: 92,
    size: 7,
    delay: 1.2,
    dur: 2.1,
    color: "yellow",
  },
];

const LOGO_DOTS = [
  { id: "ld-1", color: "#FF4FD8", dur: 0.6 },
  { id: "ld-2", color: "#FFD700", dur: 0.75 },
  { id: "ld-3", color: "#FF8C00", dur: 0.9 },
  { id: "ld-4", color: "#4DE3FF", dur: 0.65 },
  { id: "ld-5", color: "#9B59B6", dur: 0.8 },
];

// Cartoon clouds config
const CLOUDS = [
  { id: "c1", left: 3, top: 8, width: 90, opacity: 0.85, dur: 6 },
  { id: "c2", left: 55, top: 14, width: 70, opacity: 0.75, dur: 8 },
  { id: "c3", left: 75, top: 5, width: 55, opacity: 0.65, dur: 10 },
  { id: "c4", left: 20, top: 22, width: 50, opacity: 0.6, dur: 7 },
];

const HomeScreen: React.FC<HomeScreenProps> = ({
  save,
  onPlay,
  onLevelSelect,
  onDailyChallenge,
}) => {
  const handlePlay = useCallback(() => {
    soundSystem.init();
    soundSystem.playClick();
    onPlay();
  }, [onPlay]);

  const today = new Date().toISOString().split("T")[0];
  const hasDailyToday = save.lastDailyChallenge === today;

  const starStyles = useMemo(
    () =>
      STAR_PARTICLES.map((p) => ({
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.dur}s`,
      })),
    [],
  );

  return (
    <div
      className="home-screen"
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, #FF9A9E 0%, #FAD0C4 25%, #A8EDEA 65%, #FED6E3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px 100px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Nunito, sans-serif",
      }}
      data-ocid="home.page"
    >
      {/* Cartoon clouds in background */}
      {CLOUDS.map((cloud) => (
        <div
          key={cloud.id}
          style={{
            position: "absolute",
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: cloud.width,
            height: cloud.width * 0.45,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.88)",
            opacity: cloud.opacity,
            pointerEvents: "none",
            animation: `float-cloud ${cloud.dur}s ease-in-out infinite alternate`,
            filter: "blur(2px)",
            boxShadow: "0 4px 16px rgba(255,255,255,0.5)",
          }}
        />
      ))}

      {/* Colorful star sparkle particles */}
      {STAR_PARTICLES.map((p, i) => (
        <div
          key={p.id}
          className={`star-particle star-particle-${p.color}`}
          style={starStyles[i]}
        />
      ))}

      {/* Score pill — top right */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "linear-gradient(135deg, #ffe566 0%, #ffb800 100%)",
          border: "3px solid rgba(0,0,0,0.2)",
          borderRadius: 999,
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(255,180,0,0.3)",
        }}
      >
        <span style={{ fontSize: 18 }}>⭐</span>
        <span
          style={{
            color: "#5a3c00",
            fontWeight: 900,
            fontSize: 16,
            fontFamily: "Fredoka One, Nunito, sans-serif",
          }}
        >
          {save.totalPoints.toLocaleString()}
        </span>
      </div>

      {/* Logo area */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 6,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Bouncing color dots above title */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          {LOGO_DOTS.map((dot) => (
            <div
              key={dot.id}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: dot.color,
                border: "2px solid rgba(0,0,0,0.2)",
                boxShadow: `0 3px 0 rgba(0,0,0,0.2), 0 0 12px ${dot.color}88`,
                animation: `bounce-dot ${dot.dur}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* NUT SORT title — Fredoka One, cartoon text stroke */}
        <h1
          className="game-logo"
          style={{
            fontSize: "clamp(3.2rem, 15vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: "Fredoka One, Nunito, sans-serif",
            margin: 0,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #FFE000 0%, #FF8C00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline",
              textShadow: "none",
              filter:
                "drop-shadow(-3px -3px 0 rgba(0,0,0,0.55)) drop-shadow(3px -3px 0 rgba(0,0,0,0.55)) drop-shadow(-3px 3px 0 rgba(0,0,0,0.55)) drop-shadow(3px 3px 0 rgba(0,0,0,0.55)) drop-shadow(0 6px 0 rgba(0,0,0,0.25))",
            }}
          >
            NUT
          </span>
          <span
            style={{
              color: "rgba(0,0,0,0.15)",
              display: "inline",
              fontFamily: "Fredoka One, sans-serif",
            }}
          >
            {" "}
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #FF60C0 0%, #9B40F8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline",
              textShadow: "none",
              filter:
                "drop-shadow(-3px -3px 0 rgba(0,0,0,0.55)) drop-shadow(3px -3px 0 rgba(0,0,0,0.55)) drop-shadow(-3px 3px 0 rgba(0,0,0,0.55)) drop-shadow(3px 3px 0 rgba(0,0,0,0.55)) drop-shadow(0 6px 0 rgba(0,0,0,0.25))",
            }}
          >
            SORT
          </span>
        </h1>

        <p
          style={{
            color: "#6b3d6e",
            fontSize: 15,
            marginTop: 10,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textShadow: "0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          Sort the nuts. Master the puzzle.
        </p>
      </div>

      {/* Fox mascot */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: 8,
          display: "flex",
          justifyContent: "center",
          animation: "cartoon-bounce 3s ease-in-out infinite",
        }}
      >
        <img
          src="/assets/generated/fox-mascot-transparent.dim_400x500.png"
          alt="NUT SORT mascot"
          style={{
            width: 200,
            maxWidth: "52vw",
            objectFit: "contain",
            filter:
              "drop-shadow(0 8px 24px rgba(200,80,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Main buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "min(320px, 90vw)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          type="button"
          className="game-btn btn-primary btn-xl"
          onClick={handlePlay}
          data-ocid="home.primary_button"
        >
          🎮 PLAY
        </button>

        <button
          type="button"
          className="game-btn btn-green btn-lg"
          onClick={() => {
            soundSystem.playClick();
            onLevelSelect();
          }}
          data-ocid="home.levels_button"
        >
          🗺 LEVELS
        </button>

        <button
          type="button"
          className="game-btn btn-purple btn-lg"
          onClick={() => {
            soundSystem.playClick();
            onDailyChallenge();
          }}
          data-ocid="home.daily_button"
          style={{ position: "relative" }}
        >
          <span>🌟 Daily Challenge</span>
          {save.dailyChallengeStreak > 0 && (
            <span
              style={{
                position: "absolute",
                top: -10,
                right: -4,
                background: "linear-gradient(135deg, #FF4FD8, #FF6B35)",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 800,
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.5)",
                boxShadow: "0 2px 6px rgba(255,80,100,0.4)",
              }}
            >
              🔥 {save.dailyChallengeStreak}
            </span>
          )}
          {hasDailyToday && (
            <span
              style={{
                position: "absolute",
                top: -10,
                left: -4,
                background: "linear-gradient(135deg, #2ED573, #00b894)",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 800,
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.4)",
              }}
            >
              ✓ Done
            </span>
          )}
        </button>
      </div>

      {/* Level progress pill */}
      <div
        style={{
          marginTop: 16,
          background: "rgba(255,255,255,0.65)",
          border: "2px solid rgba(0,0,0,0.12)",
          borderRadius: 999,
          padding: "6px 18px",
          fontSize: 13,
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          color: "#7a4070",
          zIndex: 2,
          position: "relative",
          boxShadow: "0 3px 0 rgba(0,0,0,0.1)",
        }}
      >
        Level {save.maxUnlockedLevel > 1 ? save.maxUnlockedLevel - 1 : 1}{" "}
        reached &nbsp;·&nbsp;
        {Object.keys(save.levelProgress).length} completed
      </div>

      {/* Colorful nuts decoration — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 500,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <img
          src="/assets/generated/colorful-nuts-transparent.dim_600x200.png"
          alt=""
          style={{
            width: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          color: "rgba(100,50,80,0.5)",
          fontFamily: "Nunito, sans-serif",
          zIndex: 3,
        }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          style={{ color: "rgba(120,60,120,0.55)", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Built with ♥ using caffeine.ai
        </a>
      </footer>
    </div>
  );
};

export default HomeScreen;
