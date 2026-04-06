import type React from "react";
import { COLOR_MAP, type NutColor } from "../game/levelGenerator";

interface NutPieceProps {
  isComplete?: boolean;
  color: NutColor;
  size?: number;
  isSelected?: boolean;
  isFloating?: boolean;
  isUnscrewing?: boolean;
  isScrewingIn?: boolean;
  style?: React.CSSProperties;
}

const NutPiece: React.FC<NutPieceProps> = ({
  color,
  size = 56,
  isSelected = false,
  isFloating = false,
  isUnscrewing = false,
  isScrewingIn = false,
  isComplete = false,
  style,
}) => {
  const info = COLOR_MAP[color];

  // Flat horizontal hex nut — wider than tall (side view on rod)
  const nutW = size;
  const nutH = Math.round(size * 0.4);

  // Hole in the center — oval shaped (rod passes through)
  const holeW = Math.round(nutW * 0.28);
  const holeH = Math.round(nutH * 0.6);

  // Flat-top hex polygon on the WIDE axis (pointing left/right)
  // Points: left-mid, top-left, top-right, right-mid, bottom-right, bottom-left
  const hexClip =
    "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)";

  let transform = "scale(1)";
  let transition = "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)";
  let animation: string | undefined;

  if (isUnscrewing) {
    animation = "nut-unscrew 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards";
    transform = "scale(1)";
    transition = "none";
  } else if (isScrewingIn) {
    animation = "nut-screwIn 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards";
    transform = "scale(1)";
    transition = "none";
  } else if (isFloating) {
    transform = "translateY(-16px) scale(1.14)";
  } else if (isSelected) {
    transform = "translateY(-8px) scale(1.08)";
  } else if (isComplete) {
    animation = "nut-complete-shine 1.2s ease-in-out infinite";
    transform = "scale(1)";
    transition = "none";
  }

  // Vivid metallic gradient — top-lit, deep bottom shadow
  const hexGradient = `linear-gradient(to bottom,
    rgba(255,255,255,0.95) 0%,
    ${info.highlight} 10%,
    ${info.bg} 28%,
    ${info.bg} 60%,
    ${info.shadow} 82%,
    rgba(0,0,0,0.80) 100%
  )`;

  const glowColor = info.bg;

  return (
    <div
      className="nut-piece"
      style={{
        width: nutW,
        height: nutH,
        flexShrink: 0,
        position: "relative",
        cursor: "pointer",
        transform,
        transition,
        animation,
        filter:
          isSelected || isFloating || isUnscrewing || isComplete
            ? `drop-shadow(0 6px 14px ${info.bg}ee) drop-shadow(0 0 10px ${info.bg}bb)`
            : `drop-shadow(0 4px 8px ${info.shadow}cc) drop-shadow(0 2px 4px rgba(0,0,0,0.75))`,
        ...style,
      }}
    >
      {/* Layer 1: Outer hex body — full-width flat hex */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background: hexGradient,
          border: `2px solid ${info.shadow}`,
        }}
      />

      {/* Layer 2: Metallic face sheen — top-lit lighting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.18) 35%, transparent 55%, rgba(0,0,0,0.30) 80%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3: Left chamfer highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background:
            "linear-gradient(to right, rgba(255,255,255,0.22) 0%, transparent 25%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 4: Right chamfer shadow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background:
            "linear-gradient(to left, rgba(0,0,0,0.30) 0%, transparent 25%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 5: Center rod hole — oval dark tunnel where rod passes through */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: holeW,
          height: holeH,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 35% 30%, #282828, #080808 60%, #000)",
          boxShadow:
            "inset 0 3px 8px rgba(0,0,0,0.99), inset 0 -1px 3px rgba(255,255,255,0.04), 0 0 0 2.5px rgba(0,0,0,0.80)",
          zIndex: 3,
        }}
      />

      {/* Layer 6: Top gloss highlight — bright oval catching the light */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "20%",
          width: "42%",
          height: "36%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.90)",
          transform: "rotate(-5deg)",
          pointerEvents: "none",
          filter: "blur(1px)",
          zIndex: 4,
        }}
      />

      {/* Layer 7: Bottom secondary glint */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "22%",
          width: "18%",
          height: "25%",
          borderRadius: "50%",
          background: "rgba(200,230,255,0.35)",
          transform: "rotate(-10deg)",
          pointerEvents: "none",
          filter: "blur(1.5px)",
          zIndex: 4,
        }}
      />

      {/* Layer 8: Selection/float glow ring */}
      {(isSelected || isFloating) && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            clipPath: hexClip,
            border: `3px solid ${glowColor}`,
            borderRadius: 3,
            boxShadow: `0 0 0 3px ${glowColor}77, 0 0 16px ${glowColor}99, 0 0 28px ${glowColor}55`,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
};

export default NutPiece;
