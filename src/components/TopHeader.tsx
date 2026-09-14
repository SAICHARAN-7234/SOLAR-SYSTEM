import { useState, useEffect } from 'react';
import { cosmicAudio } from '../services/audioSynthesizer';

interface TopHeaderProps {
  selectedTarget: string;
  onSelectTarget: (id: string) => void;
  onResetCamera: () => void;
  onToggleCinematic: () => void;
  isCinematic: boolean;
}

export default function TopHeader({
  selectedTarget,
  onSelectTarget,
  onResetCamera,
  onToggleCinematic,
  isCinematic,
}: TopHeaderProps) {
  const [utcTime, setUtcTime] = useState('');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [waveHeights, setWaveHeights] = useState([4, 8, 5, 3]);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Audio waveform animation
  useEffect(() => {
    let animId: number;
    const animateWaveform = () => {
      if (isAudioActive) {
        setWaveHeights(cosmicAudio.getWaveformData());
      } else {
        setWaveHeights([4, 4, 4, 4]);
      }
      animId = requestAnimationFrame(animateWaveform);
    };
    animId = requestAnimationFrame(animateWaveform);
    return () => cancelAnimationFrame(animId);
  }, [isAudioActive]);

  const handleToggleAudio = () => {
    const playing = cosmicAudio.toggle();
    setIsAudioActive(playing);
  };

  const celestials = [
    { id: 'sun', label: 'SUN' },
    { id: 'mercury', label: 'MERC' },
    { id: 'venus', label: 'VEN' },
    { id: 'earth', label: 'EARTH' },
    { id: 'mars', label: 'MARS' },
    { id: 'jupiter', label: 'JUP' },
    { id: 'saturn', label: 'SAT' },
    { id: 'uranus', label: 'URA' },
    { id: 'neptune', label: 'NEP' },
    { id: 'pluto', label: 'PLU' },
  ];

  const probes = [
    { id: 'voyager-1', label: 'V-1', color: 'bg-[#38bdf8]' },
    { id: 'voyager-2', label: 'V-2', color: 'bg-emerald-400' },
    { id: 'new-horizons', label: 'NH', color: 'bg-[#ffb95f]' },
  ];

  return (
    <header className="h-20 w-full bg-[#080e1a]/85 backdrop-blur-xl border-b border-[#3e484f]/30 px-4 sm:px-6 flex items-center justify-between gap-4 z-40 select-none">
      {/* 1. Time Gauges */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <div className="flex flex-col">
          <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase tracking-wider">
            Mission Elapsed Time
          </span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ffb95f] text-[16px]">
              timelapse
            </span>
            <span className="font-mono-code text-sm sm:text-base text-[#ffb95f] font-bold">
              +382d 14:28:09
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-[#2f3542]" />

        <div className="hidden md:flex flex-col">
          <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase tracking-wider">
            Universal Time (UTC)
          </span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#38bdf8] text-[16px]">
              schedule
            </span>
            <span className="font-mono-code text-sm sm:text-base text-[#dde2f3] font-bold">
              {utcTime || '2026-09-14 08:42:43'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Celestial Fast Selector Pills Deck */}
      <div className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 px-2 bg-[#161c28] rounded-xl border border-[#3e484f]/25">
        {celestials.map((c) => {
          const isSelected = selectedTarget === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectTarget(c.id)}
              className={`px-2.5 py-1 rounded-lg font-mono-code text-[11px] font-semibold transition-all ${
                isSelected
                  ? 'bg-[#242a36] text-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.3)] font-bold'
                  : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#dde2f3]'
              }`}
            >
              {c.label}
            </button>
          );
        })}

        <span className="h-4 w-px bg-[#2f3542] mx-1" />

        {probes.map((p) => {
          const isSelected = selectedTarget === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectTarget(p.id)}
              className={`px-2.5 py-1 rounded-lg font-mono-code text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#242a36] text-[#dde2f3] shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                  : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#dde2f3]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* 3. View Controls & Audio Synthesizer */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Camera Control Group */}
        <div className="flex items-center bg-[#161c28] rounded-xl p-1 gap-1 border border-[#3e484f]/25">
          <button
            onClick={onResetCamera}
            className="p-1.5 rounded-lg text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#38bdf8] transition-colors"
            title="Reset Camera View to Origin"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
          </button>
          <button
            onClick={onToggleCinematic}
            className={`p-1.5 rounded-lg transition-colors ${
              isCinematic
                ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#38bdf8]'
            }`}
            title="Free Drone Cinematic Orbit"
          >
            <span className="material-symbols-outlined text-[18px]">3d_rotation</span>
          </button>
          <button
            onClick={() => onSelectTarget('sun')}
            className="p-1.5 rounded-lg text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#38bdf8] transition-colors"
            title="Solar System Overview Grid"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
        </div>

        {/* Cosmic Drone Audio Synthesizer */}
        <button
          onClick={handleToggleAudio}
          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 shadow-inner ${
            isAudioActive
              ? 'bg-[#38bdf8]/15 border-[#38bdf8]/60 text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
              : 'bg-[#161c28] border-[#3e484f]/30 text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#38bdf8]'
          }`}
          title="Toggle Web Audio Procedural Cosmic Drone Synthesizer (55 Hz)"
        >
          <div className="flex items-end gap-[2px] h-4 w-5 justify-center">
            {waveHeights.map((h, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full transition-all ${
                  isAudioActive ? 'bg-[#38bdf8]' : 'bg-[#bdc8d1]'
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <span className="font-mono-code text-[11px] tracking-wider font-semibold">
            {isAudioActive ? 'DRONE: 55Hz' : 'DRONE: OFF'}
          </span>
        </button>

        {/* User Icon */}
        <div className="w-8 h-8 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#00354a] shadow-[0_0_8px_rgba(56,189,248,0.5)]">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
