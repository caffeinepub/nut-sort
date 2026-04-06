import type React from "react";
import { NUT_COLORS } from "../game/levelGenerator";
import { COLOR_MAP } from "../game/levelGenerator";

interface ConfettiProps {
  active: boolean;
}

// Pre-generate stable particle data to avoid noArrayIndexKey with stable keys
const PARTICLE_DATA = Array.from({ length: 60 }, (_, i) => ({
  id: `confetti-${i}`,
  color: COLOR_MAP[NUT_COLORS[i % NUT_COLORS.length]].bg,
  left: (i * 13 + 7) % 99,
  delay: (i * 0.27) % 2.0,
  duration: 3 + ((i * 0.08) % 1.5),
  size: 6 + ((i * 3) % 10),
  rotation: (i * 37) % 720,
  isCircle: i % 2 === 0,
}));

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {PARTICLE_DATA.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * (p.isCircle ? 1 : 0.6)}px`,
            borderRadius: p.isCircle ? "50%" : "2px",
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
