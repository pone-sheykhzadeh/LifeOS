import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const AnimatedSvgBadge: React.FC<Props> = ({ className = 'w-16 h-16', size }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        fill="none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="checkGlowBadge" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter height="140%" id="softGlowBadge" width="140%" x="-20%" y="-20%">
            <feGaussianBlur result="blur" stdDeviation="3" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <style>{`
          @keyframes pulseRing {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.7; }
          }
          @keyframes starTwinkle {
            0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.3; }
            50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
          }
          .ring-pulse-badge { transform-origin: 50px 50px; animation: pulseRing 3s ease-in-out infinite; }
          .star-1-badge { transform-origin: 25px 25px; animation: starTwinkle 2.5s ease-in-out infinite; }
          .star-2-badge { transform-origin: 80px 75px; animation: starTwinkle 2.2s ease-in-out infinite 0.7s; }
        `}</style>
        <circle
          className="ring-pulse-badge"
          cx="50"
          cy="50"
          opacity="0.4"
          r="38"
          stroke="url(#checkGlowBadge)"
          strokeDasharray="6 4"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          fill="#10B981"
          fillOpacity="0.15"
          filter="url(#softGlowBadge)"
          r="28"
        />
        <circle cx="50" cy="50" r="24" stroke="url(#checkGlowBadge)" strokeWidth="2.5" />
        <path
          d="M41 50.5L47 56.5L60 43.5"
          filter="url(#softGlowBadge)"
          stroke="#34D399"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
        />
        <path
          className="star-1-badge"
          d="M25 21L26.5 25L30.5 26.5L26.5 28L25 32L23.5 28L19.5 26.5L23.5 25Z"
          fill="#FBBF24"
        />
        <path
          className="star-2-badge"
          d="M80 71L81.2 74.5L84.8 75.7L81.2 76.9L80 80.5L78.8 76.9L75.2 75.7L78.8 74.5Z"
          fill="#38BDF8"
        />
      </svg>
    </div>
  );
};
