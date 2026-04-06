import type React from "react";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onDone: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={onDone}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(135deg, #1a0533 0%, #3b0f6b 40%, #1a0533 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: "pointer",
        overflow: "hidden",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.6s ease" : "none",
        border: "none",
        padding: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Animated radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(180,80,255,0.25) 0%, transparent 70%)",
          animation: "pulse-glow 2s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />

      {/* Floating sparkles */}
      {[
        { left: "10%", top: "15%", delay: 0, size: 10 },
        { left: "85%", top: "20%", delay: 0.3, size: 8 },
        { left: "20%", top: "75%", delay: 0.6, size: 12 },
        { left: "75%", top: "70%", delay: 0.9, size: 9 },
        { left: "50%", top: "10%", delay: 0.4, size: 11 },
        { left: "5%", top: "50%", delay: 0.7, size: 7 },
        { left: "92%", top: "55%", delay: 0.2, size: 8 },
        { left: "40%", top: "85%", delay: 1.1, size: 10 },
      ].map((s, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static sparkles
          key={i}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: `hsl(${280 + i * 20}, 100%, 75%)`,
            boxShadow: `0 0 ${s.size * 2}px hsl(${280 + i * 20}, 100%, 75%)`,
            animation: `float-sparkle 2s ease-in-out ${s.delay}s infinite alternate`,
            opacity: phase === "show" ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Welcome text group */}
      <div
        style={{
          textAlign: "center",
          transform:
            phase === "show"
              ? "translateY(0) scale(1)"
              : "translateY(40px) scale(0.85)",
          opacity: phase === "show" ? 1 : 0,
          transition:
            "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
          position: "relative",
          zIndex: 2,
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1rem, 4vw, 1.4rem)",
            color: "rgba(255,220,255,0.85)",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          ✨ Welcome to ✨
        </div>

        <div
          style={{
            fontSize: "clamp(3rem, 13vw, 5.5rem)",
            fontWeight: 900,
            fontFamily: "Fredoka One, Nunito, sans-serif",
            lineHeight: 1,
            background:
              "linear-gradient(135deg, #FFE000 0%, #FF8C00 60%, #FF4FD8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(-3px -3px 0 rgba(0,0,0,0.6)) drop-shadow(3px -3px 0 rgba(0,0,0,0.6)) drop-shadow(-3px 3px 0 rgba(0,0,0,0.6)) drop-shadow(3px 3px 0 rgba(0,0,0,0.6)) drop-shadow(0 8px 0 rgba(0,0,0,0.3))",
            letterSpacing: "2px",
          }}
        >
          SortCraft
        </div>

        <div
          style={{
            fontSize: "clamp(2rem, 9vw, 3.8rem)",
            fontWeight: 900,
            fontFamily: "Fredoka One, Nunito, sans-serif",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #FF60C0 0%, #9B40F8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(-2px -2px 0 rgba(0,0,0,0.5)) drop-shadow(2px -2px 0 rgba(0,0,0,0.5)) drop-shadow(-2px 2px 0 rgba(0,0,0,0.5)) drop-shadow(2px 2px 0 rgba(0,0,0,0.5))",
            letterSpacing: "2px",
            marginBottom: 24,
          }}
        >
          Puzzle
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {[
            "#FF4757",
            "#2F86FF",
            "#FFD700",
            "#2ED573",
            "#FF6BC1",
            "#9B59B6",
          ].map((color, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static decoration
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: color,
                border: "2px solid rgba(255,255,255,0.4)",
                boxShadow: `0 0 12px ${color}`,
                animation: `bounce-dot ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: "clamp(0.85rem, 3vw, 1rem)",
            color: "rgba(255,200,255,0.6)",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 600,
            animation: "pulse-opacity 1.2s ease-in-out infinite alternate",
          }}
        >
          Tap anywhere to continue
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          from { opacity: 0.6; transform: scale(1); }
          to { opacity: 1; transform: scale(1.1); }
        }
        @keyframes float-sparkle {
          from { transform: translateY(0) scale(1); opacity: 0.7; }
          to { transform: translateY(-12px) scale(1.3); opacity: 1; }
        }
        @keyframes pulse-opacity {
          from { opacity: 0.4; }
          to { opacity: 0.9; }
        }
      `}</style>
    </button>
  );
};

export default WelcomeScreen;
