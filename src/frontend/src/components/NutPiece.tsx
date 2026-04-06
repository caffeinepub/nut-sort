import type React from "react";
import { COLOR_MAP, type NutColor } from "../game/levelGenerator";

interface NutPieceProps {
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
  size = 48,
  isSelected = false,
  isFloating = false,
  isUnscrewing = false,
  isScrewingIn = false,
  style,
}) => {
  const info = COLOR_MAP[color];
  const holeSize = Math.round(size * 0.36);
  const innerRingSize = Math.round(size * 0.65);

  // Hex clip-path: 6-sided polygon (flat-top orientation)
  const hexClip =
    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

  let transform = "scale(1)";
  let transition = "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)";
  let animation: string | undefined;

  if (isUnscrewing) {
    animation = "bolt-unscrew 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards";
    transform = "scale(1)";
    transition = "none";
  } else if (isScrewingIn) {
    animation = "bolt-screwIn 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards";
    transform = "scale(1)";
    transition = "none";
  } else if (isFloating) {
    transform = "translateY(-12px) scale(1.18)";
  } else if (isSelected) {
    transform = "translateY(-6px) scale(1.1)";
  }

  // Ultra-vivid metallic gradient — near-white start, jump to full vivid color, deep shadow at bottom
  const hexGradient = `linear-gradient(135deg,
    rgba(255,255,255,0.98) 0%,
    ${info.bg} 18%,
    ${info.bg} 42%,
    ${info.shadow} 72%,
    rgba(0,0,0,0.85) 100%
  )`;

  const glowColor = info.bg;

  return (
    <div
      className="nut-piece"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        cursor: "pointer",
        transform,
        transition,
        animation,
        filter:
          isSelected || isFloating || isUnscrewing
            ? `drop-shadow(0 10px 20px ${info.bg}ee) drop-shadow(0 0 14px ${info.bg}bb)`
            : `drop-shadow(0 8px 14px ${info.shadow}cc) drop-shadow(0 3px 6px rgba(0,0,0,0.75))`,
        ...style,
      }}
    >
      {/* Layer 1: Outer hex body — vivid base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background: hexGradient,
          border: `2px solid ${info.shadow}`,
        }}
      />

      {/* Layer 2: Metallic face sheen — strong upper-left lighting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background:
            "linear-gradient(148deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.22) 22%, transparent 48%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.52) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3: Right-edge rim light — thin metallic highlight on right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: hexClip,
          background:
            "linear-gradient(270deg, rgba(255,255,255,0.20) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 4: Bottom edge shadow strip — adds thickness/3D depth */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          clipPath: hexClip,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Layer 5: Inner raised ring — machined metallic surface */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: innerRingSize,
          height: innerRingSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${info.highlight}, ${info.bg} 30%, ${info.shadow} 80%, rgba(0,0,0,0.9) 100%)`,
          boxShadow:
            "inset 0 4px 8px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.6), 0 0 0 2.5px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}
      />

      {/* Layer 6: Center bolt hole — dark deep tunnel */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: holeSize,
          height: holeSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 33% 28%, #252525, #050505 55%, #000)",
          boxShadow:
            "inset 0 5px 12px rgba(0,0,0,0.99), inset 0 -1px 4px rgba(255,255,255,0.05), 0 0 0 3.5px rgba(0,0,0,0.85)",
          zIndex: 3,
        }}
      />

      {/* Layer 7: Primary gloss highlight — large bright oval top-left */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "14%",
          width: "35%",
          height: "28%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          transform: "rotate(-24deg)",
          pointerEvents: "none",
          filter: "blur(1px)",
          zIndex: 4,
        }}
      />

      {/* Layer 8: Secondary gloss spot — smaller lower-right glint */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          right: "14%",
          width: "16%",
          height: "11%",
          borderRadius: "50%",
          background: "rgba(220,240,255,0.40)",
          transform: "rotate(-15deg)",
          pointerEvents: "none",
          filter: "blur(1.5px)",
          zIndex: 4,
        }}
      />

      {/* Layer 9: Selection / float glow ring */}
      {(isSelected || isFloating) && (
        <div
          style={{
            position: "absolute",
            inset: -5,
            clipPath: hexClip,
            border: `3px solid ${glowColor}`,
            borderRadius: 4,
            boxShadow: `0 0 0 3px ${glowColor}77, 0 0 20px ${glowColor}99, 0 0 36px ${glowColor}55`,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
};

export default NutPiece;
