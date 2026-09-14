interface BottomFloatingToolbarProps {
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  lightIntensity: number;
  onCycleLighting: () => void;
}

export default function BottomFloatingToolbar({
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
  lightIntensity,
  onCycleLighting,
}: BottomFloatingToolbarProps) {
  const getLightLabel = () => {
    if (lightIntensity >= 2.0) return 'Stellar 2.4x (High)';
    if (lightIntensity <= 0.8) return 'Stellar 0.6x (Night)';
    return 'Stellar 1.3x';
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 pointer-events-auto bg-[#080e1a]/90 backdrop-blur-2xl px-5 py-2 rounded-full shadow-2xl z-20 border border-[#3e484f]/35 select-none">
      {/* Coordinate system badge */}
      <div className="flex items-center gap-1.5 text-[#bdc8d1]">
        <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">
          explore
        </span>
        <span className="font-mono-code text-[11px] font-bold">
          ECLIPTIC J2000
        </span>
      </div>

      <div className="h-4 w-px bg-[#2f3542]" />

      {/* Orbits Toggle */}
      <button
        onClick={onToggleOrbits}
        className={`px-3 py-1 rounded-full text-[11px] font-mono-code flex items-center gap-1.5 transition-colors ${
          showOrbits
            ? 'text-[#38bdf8] bg-[#242a36] shadow-[0_0_8px_rgba(56,189,248,0.25)] font-bold'
            : 'text-[#bdc8d1] bg-[#161c28] hover:bg-[#242a36]'
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          all_inclusive
        </span>
        <span>Orbits: {showOrbits ? 'ON' : 'OFF'}</span>
      </button>

      {/* Labels Toggle */}
      <button
        onClick={onToggleLabels}
        className={`px-3 py-1 rounded-full text-[11px] font-mono-code flex items-center gap-1.5 transition-colors ${
          showLabels
            ? 'text-[#dde2f3] bg-[#242a36] font-semibold'
            : 'text-[#bdc8d1] bg-[#161c28] hover:bg-[#242a36]'
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          label
        </span>
        <span>Labels: {showLabels ? 'ON' : 'OFF'}</span>
      </button>

      {/* Lighting Cycle */}
      <button
        onClick={onCycleLighting}
        className="px-3 py-1 rounded-full text-[11px] font-mono-code text-[#bdc8d1] hover:text-[#dde2f3] bg-[#161c28] hover:bg-[#242a36] flex items-center gap-1.5 transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">
          wb_sunny
        </span>
        <span>{getLightLabel()}</span>
      </button>

      <div className="h-4 w-px bg-[#2f3542]" />

      {/* Live Probes Telemetry Status */}
      <div className="flex items-center gap-2 font-mono-code text-[11px] text-[#bdc8d1]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-pulse" />
        <span className="font-semibold">PROBES TELEMETRY LIVE</span>
      </div>
    </div>
  );
}
