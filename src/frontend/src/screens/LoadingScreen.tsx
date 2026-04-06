import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingMessages = [
  "Loading your nuts...",
  "Tightening the bolts...",
  "Sorting colors...",
  "Warming up the wrench...",
  "Almost ready to sort!",
];

const STAR_POSITIONS = [
  { id: "s0", left: "11%", top: "7%", size: 14, delay: 0 },
  { id: "s1", left: "48%", top: "60%", size: 22, delay: 0.3 },
  { id: "s2", left: "85%", top: "17%", size: 30, delay: 0.6 },
  { id: "s3", left: "22%", top: "43%", size: 14, delay: 0.9 },
  { id: "s4", left: "59%", top: "96%", size: 22, delay: 1.2 },
  { id: "s5", left: "96%", top: "53%", size: 30, delay: 1.5 },
  { id: "s6", left: "33%", top: "17%", size: 14, delay: 1.8 },
  { id: "s7", left: "70%", top: "7%", size: 22, delay: 0.1 },
  { id: "s8", left: "7%", top: "70%", size: 30, delay: 0.4 },
  { id: "s9", left: "44%", top: "33%", size: 14, delay: 0.7 },
  { id: "s10", left: "81%", top: "80%", size: 22, delay: 1.0 },
  { id: "s11", left: "18%", top: "80%", size: 30, delay: 1.3 },
  { id: "s12", left: "55%", top: "53%", size: 14, delay: 1.6 },
  { id: "s13", left: "92%", top: "27%", size: 22, delay: 1.9 },
  { id: "s14", left: "29%", top: "60%", size: 30, delay: 0.2 },
  { id: "s15", left: "66%", top: "43%", size: 14, delay: 0.5 },
  { id: "s16", left: "3%", top: "27%", size: 22, delay: 0.8 },
  { id: "s17", left: "40%", top: "7%", size: 30, delay: 1.1 },
];

const STAR_ICONS = ["\u2b50", "\u2728", "\ud83c\udf1f"];

const NUT_ITEMS = [
  { id: "n0", delay: "0s" },
  { id: "n1", delay: "0.15s" },
  { id: "n2", delay: "0.3s" },
  { id: "n3", delay: "0.45s" },
  { id: "n4", delay: "0.6s" },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(1);
  const [msgIndex] = useState(() =>
    Math.floor(Math.random() * loadingMessages.length),
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let current = 1;
    const intervalMs = 20;

    const interval = setInterval(() => {
      const remaining = 100 - current;
      const increment = Math.max(
        1,
        Math.floor(remaining * 0.12 + Math.random() * 3),
      );
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteRef.current();
        }, 200);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-ocid="loading.page"
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(160deg, #FF9A9E 0%, #FAD0C4 25%, #A8EDEA 65%, #FED6E3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fredoka One', cursive",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      {/* Stars background decoration */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {STAR_POSITIONS.map((star, idx) => (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
              fontSize: `${star.size}px`,
              opacity: 0.25 + (idx % 3) * 0.12,
              animation: `twinkle ${2 + (idx % 3)}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          >
            {STAR_ICONS[idx % 3]}
          </div>
        ))}
      </div>

      {/* Game Logo */}
      <div
        style={{
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          fontWeight: "900",
          letterSpacing: "0.08em",
          background:
            "linear-gradient(135deg, #FF6B35 0%, #F7C59F 30%, #FFD700 60%, #FF6B9D 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
          filter: "drop-shadow(0 3px 8px rgba(255,107,53,0.4))",
          marginBottom: "0.3em",
          textAlign: "center",
        }}
      >
        NUT SORT
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
          color: "#b05a2a",
          letterSpacing: "0.15em",
          marginBottom: "3rem",
          opacity: 0.85,
        }}
      >
        COLOR PUZZLE
      </div>

      {/* Loading Bar Container */}
      <div
        style={{
          width: "min(80vw, 340px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Percentage number */}
        <div
          data-ocid="loading.loading_state"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: "#FF6B35",
            fontFamily: "'Fredoka One', cursive",
            fontWeight: "900",
            letterSpacing: "0.05em",
            textShadow: "0 2px 8px rgba(255,107,53,0.3)",
            lineHeight: 1,
            minWidth: "4ch",
            textAlign: "center",
          }}
        >
          {progress}%
        </div>

        {/* Bar track */}
        <div
          style={{
            width: "100%",
            height: "28px",
            background: "rgba(255,255,255,0.55)",
            borderRadius: "999px",
            border: "3px solid rgba(255,107,53,0.55)",
            boxShadow:
              "0 4px 16px rgba(255,107,53,0.2), inset 0 2px 6px rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Fill */}
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #FFD700 0%, #FF9A00 35%, #FF6B35 70%, #FF6B9D 100%)",
              borderRadius: "999px",
              boxShadow:
                "0 0 14px rgba(255,107,53,0.6), inset 0 2px 6px rgba(255,255,255,0.4)",
              transition: "width 20ms linear",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Gloss highlight */}
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: "8px",
                right: "8px",
                height: "8px",
                background: "rgba(255,255,255,0.45)",
                borderRadius: "999px",
              }}
            />
          </div>

          {/* Tick marks at 25/50/75% */}
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              left: "25%",
              width: "2px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "1px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              left: "50%",
              width: "2px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "1px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              left: "75%",
              width: "2px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "1px",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Loading message */}
        <div
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "#a04525",
            fontFamily: "'Fredoka One', cursive",
            letterSpacing: "0.04em",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          {loadingMessages[msgIndex]}
        </div>
      </div>

      {/* Decorative nuts row */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          display: "flex",
          gap: "10px",
          opacity: 0.5,
          fontSize: "1.8rem",
        }}
      >
        {NUT_ITEMS.map((item) => (
          <span
            key={item.id}
            style={{
              display: "inline-block",
              animation: "nutBounce 0.9s ease-in-out infinite",
              animationDelay: item.delay,
            }}
          >
            \ud83d\udd29
          </span>
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
        @keyframes nutBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
