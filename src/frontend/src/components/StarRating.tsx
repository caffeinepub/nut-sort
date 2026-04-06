import type React from "react";

interface StarRatingProps {
  stars: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  stars,
  size = "md",
  animate = false,
}) => {
  const sizeClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  return (
    <div className="flex gap-1 items-center justify-center">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`${sizeClass} transition-all duration-300 ${
            animate ? "star-pop" : ""
          }`}
          style={{
            animationDelay: animate ? `${(s - 1) * 0.3}s` : undefined,
            filter: s <= stars ? "drop-shadow(0 0 6px #FFD700)" : "none",
            transform: s <= stars ? "scale(1)" : "scale(0.8)",
            opacity: s <= stars ? 1 : 0.3,
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};

export default StarRating;
