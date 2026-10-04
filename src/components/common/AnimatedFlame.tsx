import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const AnimatedFlame: React.FC<Props> = ({ className = 'w-10 h-10', size }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        fill="none"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="fireGradStitch" x1="0%" x2="0%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="innerFireStitch" x1="0%" x2="0%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
          <filter id="flameGlowStitch">
            <feGaussianBlur result="flameBlur" stdDeviation="4" />
            <feComposite in="SourceGraphic" in2="flameBlur" operator="over" />
          </filter>
        </defs>
        <style>{`
          @keyframes flameBounce {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.08, 0.95) translateY(-3px); }
          }
          @keyframes sparkWiggle {
            0% { transform: translateY(0px) scale(0.8); opacity: 0.9; }
            50% { transform: translateY(-12px) translateX(4px) scale(1.1); opacity: 1; }
            100% { transform: translateY(-20px) translateX(-2px) scale(0.3); opacity: 0; }
          }
          .flame-base { transform-origin: 60px 95px; animation: flameBounce 1.4s ease-in-out infinite; }
          .spark-left { transform-origin: 45px 50px; animation: sparkWiggle 1.8s ease-out infinite; }
          .spark-right { transform-origin: 75px 45px; animation: sparkWiggle 1.5s ease-out infinite 0.6s; }
        `}</style>
        <circle cx="60" cy="65" fill="#F97316" filter="url(#flameGlowStitch)" opacity="0.18" r="42" />
        <circle className="spark-left" cx="45" cy="45" fill="#FDE047" r="3" />
        <circle className="spark-right" cx="75" cy="40" fill="#FB923C" r="3.5" />
        <path
          className="flame-base"
          d="M60 20C60 20 72 38 72 52C72 56 75 60 79 57C85 52 87 64 87 73C87 88 75 98 60 98C45 98 33 88 33 73C33 58 45 42 52 35C55 31 56 26 60 20Z"
          fill="url(#fireGradStitch)"
          filter="url(#flameGlowStitch)"
        />
        <path
          className="flame-base"
          d="M60 48C60 48 68 60 68 70C68 78 64 86 60 86C56 86 52 78 52 70C52 62 57 55 60 48Z"
          fill="url(#innerFireStitch)"
        />
      </svg>
    </div>
  );
};
