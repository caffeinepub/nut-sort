import type React from "react";
import type { NutColor } from "../game/levelGenerator";
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
  innerColor,
  onClick,
  nutSize = 48,
}) => {
  // Layout sizing — thicker rod
  const rodWidth = 36;
  const nutSpacing = 4;
  const rodHeight = nutsPerTube * (nutSize + nutSpacing) + 24;
  const baseWidth = nutSize + 64;
  const baseHeight = 52;
  const totalWidth = Math.max(baseWidth, nutSize + 16);
  const floatingZoneHeight = nutSize + 16;

  // Glow/highlight state
  let rodGlow = "none";
  let rodBorder = "1.5px solid rgba(255,255,255,0.18)";
  let hintAnimation: string | undefined;

  if (isSelected) {
    rodGlow = "0 0 18px rgba(255,220,50,0.8), 0 0 36px rgba(255,220,50,0.4)";
    rodBorder = "1.5px solid rgba(255,220,50,0.7)";
  } else if (isHintFrom) {
    rodGlow = "0 0 16px rgba(255,170,0,0.9), 0 0 32px rgba(255,170,0,0.45)";
    rodBorder = "1.5px solid rgba(255,170,0,0.75)";
    hintAnimation = "stand-glow-hint 1s ease-in-out infinite";
  } else if (isHintTo) {
    rodGlow = "0 0 16px rgba(80,255,120,0.9), 0 0 32px rgba(80,255,120,0.45)";
    rodBorder = "1.5px solid rgba(80,255,120,0.75)";
    hintAnimation = "stand-glow-hint-to 1s ease-in-out infinite";
  }

  // Smooth matte metallic cylinder gradient — thicker rod, more 3D
  const rodGradient =
    "linear-gradient(to right, #1a1a1a 0%, #444 6%, #7a7a7a 18%, #b8b8b8 32%, #d8d8d8 42%, #e8e8e8 50%, #d8d8d8 58%, #b8b8b8 68%, #7a7a7a 82%, #444 94%, #1a1a1a 100%)";

  // Circular disc base gradient — wide heavy chrome platform
  const baseGradient =
    "linear-gradient(to bottom, #d8e0e8 0%, #eef2f6 15%, #ccd4dc 40%, #8896a8 70%, #4a5668 100%)";

  // Nuts stacked on rod (exclude floating top nut if selected)
  const stackedNuts = nuts.slice(0, isSelected ? nuts.length - 1 : nuts.length);
  const topNutIdx = stackedNuts.length - 1;

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
        animation: isInvalid ? "tube-shake 0.4s ease" : hintAnimation,
      }}
      data-ocid="game.tube"
    >
      {/* Floating zone for selected (top) nut */}
      <div
        style={{
          height: floatingZoneHeight,
          width: totalWidth,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {isSelected && nuts.length > 0 && (
          <NutPiece
            color={nuts[nuts.length - 1]}
            size={nutSize}
            isFloating
            isUnscrewing={isUnscrewing}
          />
        )}
      </div>

      {/* Bolt stand — clickable */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`Bolt stand with ${nuts.length} nut${
          nuts.length !== 1 ? "s" : ""
        }`}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Rod top flat cap */}
        <div
          style={{
            width: rodWidth + 6,
            height: 12,
            background:
              "linear-gradient(to bottom, #ddd 0%, #999 50%, #666 100%)",
            borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
            marginBottom: -2,
            zIndex: 3,
            boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
            flexShrink: 0,
          }}
        />

        {/* Vertical rod with nuts stacked on it */}
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
          {/* The matte 3D cylindrical rod — thicker */}
          <div
            style={{
              position: "absolute",
              width: rodWidth,
              height: "100%",
              background: rodGradient,
              border: rodBorder,
              boxShadow:
                isSelected || isHintFrom || isHintTo
                  ? rodGlow
                  : "0 4px 12px rgba(0,0,0,0.7), 2px 0 6px rgba(0,0,0,0.4)",
              borderRadius: 6,
              zIndex: 1,
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
              overflow: "hidden",
            }}
          >
            {/* Inner colour band — shows the rod's inner color through the hollow */}
            {innerColor && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 14,
                  background: `linear-gradient(to bottom, ${innerColor}bb 0%, ${innerColor}ff 50%, ${innerColor}bb 100%)`,
                  pointerEvents: "none",
                  zIndex: 0,
                  borderRadius: 4,
                }}
              />
            )}

            {/* Left deep shadow — 3D cylinder edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "24%",
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
                borderRadius: "6px 0 0 6px",
              }}
            />
            {/* Right deep shadow — 3D cylinder edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "24%",
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
                borderRadius: "0 6px 6px 0",
              }}
            />
          </div>

          {/* Nuts stacked from bottom, centered on rod */}
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: nutSpacing,
              zIndex: 2,
            }}
          >
            {stackedNuts.map((nutColor, i) => (
              <NutPiece
                key={`nut-${i}-${nutColor}`}
                color={nutColor}
                size={nutSize}
                isSelected={isSelected && i === topNutIdx}
                isUnscrewing={isUnscrewing && i === topNutIdx}
                isScrewingIn={isScrewingIn && i === topNutIdx}
              />
            ))}
          </div>
        </div>

        {/* Circular disc base — wide heavy chrome platform */}
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            background: baseGradient,
            borderRadius: "50%",
            boxShadow:
              "0 14px 32px rgba(0,0,0,0.85), 0 6px 14px rgba(0,0,0,0.65), inset 0 5px 0 rgba(255,255,255,0.55), inset 0 -5px 0 rgba(0,0,0,0.5)",
            marginTop: -2,
            zIndex: 2,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Base surface gloss highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "45%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.08))",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }}
          />
          {/* Machined bolt dot — left */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "18%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d8dfe8, #5a6070)",
              boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)",
            }}
          />
          {/* Machined bolt dot — right */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "18%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #d8dfe8, #5a6070)",
              boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </button>
    </div>
  );
};

export default Tube;
