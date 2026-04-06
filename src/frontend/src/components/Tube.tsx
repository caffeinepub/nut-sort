import type React from "react";
import type { NutColor } from "../game/levelGenerator";
import { COLOR_MAP } from "../game/levelGenerator";
import NutPiece from "./NutPiece";

interface TubeProps {
  nuts: NutColor[];
  nutsPerTube: number;
  isSelected: boolean;
  isHintFrom?: boolean;
  isHintTo?: boolean;
  isInvalid?: boolean;
  isUnscrewing?: boolean;
  isScrewingIn?: boolean;
  isComplete?: boolean;
  innerColor?: string;
  onClick: () => void;
  nutSize?: number;
}

const Tube: React.FC<TubeProps> = ({
  nuts,
  nutsPerTube,
  isSelected,
  isHintFrom = false,
  isHintTo = false,
  isInvalid = false,
  isUnscrewing = false,
  isScrewingIn = false,
  isComplete = false,
  innerColor,
  onClick,
  nutSize = 56,
}) => {
  // Nut dimensions — flat horizontal hex (wider than tall)
  const nutW = nutSize;
  const nutH = Math.round(nutSize * 0.42);
  const nutSpacing = 4;

  // Rod: real thin stick-like rod, slightly wider than nut hole
  const rodWidth = 10;

  // Rod height: compact — just enough for 5 nuts with spacing + top/bottom cap
  const rodHeight = nutsPerTube * (nutH + nutSpacing) + 48;

  // Wide heavy base
  const baseWidth = nutW + 36;
  const baseHeight = 36;

  const totalWidth = Math.max(baseWidth, nutW + 16);

  // Get the completed tube colour for glow
  const completedColor =
    isComplete && nuts.length > 0
      ? (COLOR_MAP[nuts[0]]?.bg ?? "#FFD700")
      : null;

  // Glow/highlight state
  let rodGlow = "none";
  let hintAnimation: string | undefined;

  if (isComplete) {
    rodGlow = `0 0 20px ${completedColor}cc, 0 0 40px ${completedColor}88, 0 0 60px ${completedColor}44`;
    hintAnimation = "rod-complete-pulse 1.2s ease-in-out infinite";
  } else if (isSelected) {
    rodGlow = "0 0 14px rgba(255,220,50,0.9), 0 0 28px rgba(255,220,50,0.5)";
  } else if (isHintFrom) {
    rodGlow = "0 0 14px rgba(255,170,0,0.9), 0 0 28px rgba(255,170,0,0.5)";
    hintAnimation = "stand-glow-hint 1s ease-in-out infinite";
  } else if (isHintTo) {
    rodGlow = "0 0 14px rgba(80,255,120,0.9), 0 0 28px rgba(80,255,120,0.5)";
    hintAnimation = "stand-glow-hint-to 1s ease-in-out infinite";
  }

  // Realistic thin metal rod gradient — bright center highlight, dark edges
  const rodGradient =
    "linear-gradient(to right, #111 0%, #444 12%, #888 25%, #ccc 40%, #efefef 50%, #ccc 60%, #888 75%, #444 88%, #111 100%)";

  // Thread stripes on the rod (repeating dashes)
  const threadCount = 12;
  const threadHeight = rodHeight / (threadCount * 2);

  // Floating top nut when selected
  const hasSelectedFloat = isSelected && nuts.length > 0;
  const stackedNuts = hasSelectedFloat ? nuts.slice(0, nuts.length - 1) : nuts;
  const floatingNut = hasSelectedFloat ? nuts[nuts.length - 1] : null;

  const getNutTop = (index: number) => {
    const bottomY = rodHeight - 24 - nutH;
    return bottomY - index * (nutH + nutSpacing);
  };

  // Base: thick round disc platform
  const baseGradient =
    "linear-gradient(to bottom, #d0d8e4 0%, #eef2f8 18%, #c0c8d4 42%, #7880a0 72%, #3a4060 100%)";

  return (
    <div
      className="tube-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        cursor: "pointer",
        width: totalWidth,
        animation: isInvalid
          ? "tube-shake 0.4s ease"
          : isComplete
            ? hintAnimation
            : hintAnimation,
        paddingTop: nutH + 20,
        position: "relative",
      }}
      data-ocid="game.tube"
    >
      {/* Complete burst overlay — coloured ring expanding outward */}
      {isComplete && completedColor && (
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: totalWidth + 20,
            height: rodHeight + 40,
            borderRadius: 16,
            background: `radial-gradient(ellipse at center, ${completedColor}33 0%, ${completedColor}11 60%, transparent 100%)`,
            border: `2px solid ${completedColor}88`,
            animation: "rod-complete-burst 1.2s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      )}

      {/* Floating star particles when complete */}
      {isComplete &&
        completedColor &&
        [0, 1, 2].map((i) => (
          <div
            key={`star-${i}`}
            style={{
              position: "absolute",
              top: `${20 + i * 22}%`,
              left: i % 2 === 0 ? "-14px" : "auto",
              right: i % 2 !== 0 ? "-14px" : "auto",
              fontSize: 14,
              animation: `rod-star-float-${i % 2 === 0 ? "left" : "right"} 1.4s ease-in-out ${i * 0.3}s infinite`,
              pointerEvents: "none",
              zIndex: 25,
              filter: `drop-shadow(0 0 4px ${completedColor})`,
            }}
          >
            ⭐
          </div>
        ))}

      <button
        type="button"
        onClick={onClick}
        aria-label={`Rod with ${nuts.length} nut${nuts.length !== 1 ? "s" : ""}`}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {/* Floating nut above rod (selected top nut) */}
        {floatingNut && (
          <div
            style={{
              position: "absolute",
              top: -(nutH + 18),
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <NutPiece
              color={floatingNut}
              size={nutSize}
              isFloating
              isUnscrewing={isUnscrewing}
            />
          </div>
        )}

        {/* Rod + nuts container */}
        <div
          style={{
            position: "relative",
            width: totalWidth,
            height: rodHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* === REAL STICK ROD === */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: rodWidth,
              height: "100%",
              zIndex: 1,
              boxShadow: isComplete
                ? rodGlow
                : isSelected || isHintFrom || isHintTo
                  ? rodGlow
                  : "2px 0 6px rgba(0,0,0,0.5), -1px 0 4px rgba(0,0,0,0.3)",
              borderRadius: "3px 3px 2px 2px",
              overflow: "hidden",
            }}
          >
            {/* Main rod cylinder */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: rodGradient,
              }}
            />

            {/* Thread grooves — horizontal lines for realistic look */}
            {Array.from({ length: threadCount }, (_, ti) => ti).map((ti) => (
              <div
                key={`thread-slot-${ti}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${(ti / threadCount) * 100}%`,
                  height: threadHeight,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.2) 100%)",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Inner colour line through center */}
            {innerColor && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 3,
                  background: `linear-gradient(to bottom, ${innerColor}66 0%, ${innerColor}cc 50%, ${innerColor}66 100%)`,
                  pointerEvents: "none",
                  zIndex: 0,
                  borderRadius: 2,
                }}
              />
            )}

            {/* Left deep edge shadow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "22%",
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.75) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            {/* Right deep edge shadow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "22%",
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.75) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />

            {/* Rod top cap */}
            <div
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                height: 8,
                background:
                  "linear-gradient(to bottom, #f0f0f0 0%, #999 60%, #666 100%)",
                borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%",
                zIndex: 3,
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            />
          </div>

          {/* Nuts absolutely positioned, passing through rod */}
          {stackedNuts.map((nutColor, i) => (
            <div
              key={`nut-${i}-${nutColor}`}
              style={{
                position: "absolute",
                top: getNutTop(i),
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 4 + i,
              }}
            >
              <NutPiece
                color={nutColor}
                size={nutSize}
                isSelected={isSelected && i === stackedNuts.length - 1}
                isUnscrewing={isUnscrewing && i === stackedNuts.length - 1}
                isScrewingIn={isScrewingIn && i === stackedNuts.length - 1}
                isComplete={isComplete}
              />
            </div>
          ))}
        </div>

        {/* Wide heavy chrome disc base */}
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            background:
              isComplete && completedColor
                ? `linear-gradient(to bottom, ${completedColor}88 0%, ${completedColor}44 40%, #7880a0 72%, #3a4060 100%)`
                : baseGradient,
            borderRadius: "50%",
            boxShadow:
              isComplete && completedColor
                ? `0 10px 24px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.6), inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.45), 0 0 20px ${completedColor}99`
                : "0 10px 24px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.6), inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.45)",
            marginTop: -2,
            zIndex: 2,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gloss highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "18%",
              right: "18%",
              height: "42%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.05))",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }}
          />
          {/* Left bolt dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "16%",
              transform: "translateY(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d0d8e4, #505870)",
              boxShadow: "inset 0 2px 3px rgba(0,0,0,0.55)",
            }}
          />
          {/* Right bolt dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "16%",
              transform: "translateY(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d0d8e4, #505870)",
              boxShadow: "inset 0 2px 3px rgba(0,0,0,0.55)",
            }}
          />
        </div>
      </button>
    </div>
  );
};

export default Tube;
