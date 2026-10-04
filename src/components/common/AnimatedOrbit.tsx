import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const AnimatedOrbit: React.FC<Props> = ({ className = 'w-12 h-12', size }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        fill="none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="orbitGradStitch" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="coreGradStitch" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <filter height="140%" id="glowStitch" width="140%" x="-20%" y="-20%">
            <feGaussianBlur result="blur" stdDeviation="6" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <style>{`
          @keyframes pulseCore {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.12); opacity: 1; filter: drop-shadow(0 0 12px #F43F5E); }
          }
          @keyframes spinClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinCounter {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes floatParticle {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-8px) scale(1.2); }
          }
          .core-stitch { transform-origin: 100px 100px; animation: pulseCore 3s ease-in-out infinite; }
          .ring1-stitch { transform-origin: 100px 100px; animation: spinClockwise 12s linear infinite; }
          .ring2-stitch { transform-origin: 100px 100px; animation: spinCounter 8s linear infinite; }
          .sparkle1-stitch { transform-origin: 50px 40px; animation: floatParticle 2.5s ease-in-out infinite; }
          .sparkle2-stitch { transform-origin: 160px 140px; animation: floatParticle 3.2s ease-in-out infinite 1s; }
        `}</style>
        <circle cx="100" cy="100" fill="url(#orbitGradStitch)" filter="url(#glowStitch)" opacity="0.15" r="70" />
        <circle
          className="ring1-stitch"
          cx="100"
          cy="100"
          r="68"
          stroke="url(#orbitGradStitch)"
          strokeDasharray="16 12"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <g className="ring1-stitch">
          <circle cx="168" cy="100" fill="#38BDF8" filter="url(#glowStitch)" r="7" />
          <circle cx="32" cy="100" fill="#C084FC" r="5" />
        </g>
        <circle
          className="ring2-stitch"
          cx="100"
          cy="100"
          opacity="0.7"
          r="48"
          stroke="#38BDF8"
          strokeDasharray="6 8"
          strokeWidth="2"
        />
        <g className="ring2-stitch">
          <circle cx="100" cy="52" fill="#10B981" filter="url(#glowStitch)" r="6" />
          <circle cx="100" cy="148" fill="#FBBF24" r="4.5" />
        </g>
        <circle className="core-stitch" cx="100" cy="100" fill="url(#coreGradStitch)" filter="url(#glowStitch)" r="26" />
        <path className="core-stitch" d="M100 82L105 95L118 100L105 105L100 118L95 105L82 100L95 95Z" fill="#FFFFFF" />
        <g className="sparkle1-stitch">
          <path d="M50 35L52 40L57 42L52 44L50 49L48 44L43 42L48 40Z" fill="#FBBF24" />
        </g>
        <g className="sparkle2-stitch">
          <path d="M160 135L161.5 139L165.5 140.5L161.5 142L160 146L158.5 142L154.5 140.5L158.5 139Z" fill="#38BDF8" />
        </g>
      </svg>
    </div>
  );
};
