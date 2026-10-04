import React, { useState, useEffect, useRef } from 'react';
import { AnimatedOrbit } from '../common/AnimatedOrbit';
import confetti from 'canvas-confetti';

interface DeepFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSprint: (minutes: number, xp: number) => void;
}

export const DeepFocusModal: React.FC<DeepFocusModalProps> = ({
  isOpen,
  onClose,
  onCompleteSprint,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [soundMode, setSoundMode] = useState<'alpha' | 'waves' | 'binaural'>('alpha');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (isRunning && remainingSeconds === 0) {
      // Completed sprint!
      setIsRunning(false);
      stopAmbientSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteSprint(Math.round(totalSeconds / 60), 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, remainingSeconds, totalSeconds, onCompleteSprint]);

  // Audio synthesis for alpha waves (432Hz with 10Hz binaural beat pulse)
  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = soundMode === 'alpha' ? 432 : soundMode === 'waves' ? 216 : 528;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Soft ambient volume
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setAudioEnabled(true);
    } catch (e) {
      console.error('Audio init error', e);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch {
      // ignored
    }
    oscRef.current = null;
    gainRef.current = null;
    audioCtxRef.current = null;
    setAudioEnabled(false);
  };

  const toggleSound = () => {
    if (audioEnabled) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    stopAmbientSound();
  };

  const handleClose = () => {
    stopAmbientSound();
    onClose();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressRatio = (totalSeconds - remainingSeconds) / totalSeconds;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f1422] border border-cyan-500/30 p-6 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Ambient background glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Orbit Star Header Graphic */}
        <div className="flex items-center gap-2 mt-2">
          <AnimatedOrbit className="w-10 h-10" />
          <div className="flex flex-col text-right">
            <h2 className="font-outfit text-xl font-bold text-white tracking-tight">
              اسپرینت تمرکز عمیق (Deep Focus)
            </h2>
            <span className="text-xs text-cyan-300">امواج آلفا نئونی • فرکانس ۴۳۲ هرتز</span>
          </div>
        </div>

        {/* Timer SVG Circle */}
        <div className="relative my-6 flex items-center justify-center">
          <svg className="w-64 h-64 -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background track */}
            <circle
              cx="120"
              cy="120"
              r="110"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="120"
              cy="120"
              r="110"
              stroke="url(#focusGradientRing)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="focusGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-outfit text-5xl font-extrabold text-white tracking-tight tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 mt-1 font-outfit">
              {isRunning ? 'در حال اجرای اسپرینت' : 'آماده برای تمرکز'}
            </span>
            <span className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-bold font-outfit">
              +۱۰۰ XP پاداش تکمیل
            </span>
          </div>
        </div>

        {/* Preset duration choices */}
        <div className="flex items-center gap-2 mb-5">
          {[15, 25, 45].map(mins => (
            <button
              key={mins}
              disabled={isRunning}
              onClick={() => {
                setTotalSeconds(mins * 60);
                setRemainingSeconds(mins * 60);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-outfit transition-all cursor-pointer ${
                totalSeconds === mins * 60
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mins} دقیقه
            </button>
          ))}
        </div>

        {/* Ambient audio toggle */}
        <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[20px]">
              {audioEnabled ? 'graphic_eq' : 'volume_off'}
            </span>
            <span>صدای زمینه تمرکز (امواج آلفا)</span>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              audioEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {audioEnabled ? 'روشن 🔊' : 'خاموش 🔇'}
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#00373a] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-outfit"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'توقف موقت' : 'شروع اسپرینت'}</span>
          </button>

          <button
            onClick={handleReset}
            title="شروع مجدد"
            className="w-13 h-13 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-white/5"
          >
            <span className="material-symbols-outlined text-[22px]">replay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
