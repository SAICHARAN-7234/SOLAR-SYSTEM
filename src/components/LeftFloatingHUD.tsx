interface LeftFloatingHUDProps {
  selectedTarget: string;
  onSelectTarget: (id: string) => void;
  speedMultiplier: number;
  onChangeSpeed: (val: number) => void;
  isPaused: boolean;
  onTogglePlayPause: () => void;
  onStepFrame: () => void;
  isCinematic: boolean;
  onToggleCinematic: () => void;
  onResetCamera: () => void;
  showAsteroids: boolean;
  onToggleAsteroids: (checked: boolean) => void;
  showKuiper: boolean;
  onToggleKuiper: (checked: boolean) => void;
  showProbes: boolean;
  onToggleProbes: (checked: boolean) => void;
}

export default function LeftFloatingHUD({
  selectedTarget,
  onSelectTarget,
  speedMultiplier,
  onChangeSpeed,
  isPaused,
  onTogglePlayPause,
  onStepFrame,
  isCinematic,
  onToggleCinematic,
  onResetCamera,
  showAsteroids,
  onToggleAsteroids,
  showKuiper,
  onToggleKuiper,
  showProbes,
  onToggleProbes,
}: LeftFloatingHUDProps) {
  const planetList = [
    { id: 'sun', label: 'Sun', color: 'bg-[#ffb95f]' },
    { id: 'mercury', label: 'Merc', color: 'bg-slate-400' },
    { id: 'venus', label: 'Ven', color: 'bg-amber-200' },
    { id: 'earth', label: 'Earth', color: 'bg-[#38bdf8]' },
    { id: 'mars', label: 'Mars', color: 'bg-[#ffbcb7]' },
    { id: 'jupiter', label: 'Jup', color: 'bg-[#ffb95f]' },
    { id: 'saturn', label: 'Sat', color: 'bg-amber-100' },
    { id: 'uranus', label: 'Ura', color: 'bg-cyan-300' },
    { id: 'neptune', label: 'Nep', color: 'bg-blue-400' },
    { id: 'pluto', label: 'Plu', color: 'bg-stone-400' },
  ];

  const probeList = [
    { id: 'voyager-1', label: 'Voyager 1', color: 'bg-sky-400' },
    { id: 'voyager-2', label: 'Voyager 2', color: 'bg-emerald-400' },
    { id: 'new-horizons', label: 'New Horiz', color: 'bg-amber-400' },
  ];

  return (
    <div className="absolute left-4 sm:left-6 top-4 bottom-4 w-72 sm:w-80 flex flex-col justify-between pointer-events-none z-20 overflow-y-auto pr-1">
      {/* Top Left Stack */}
      <div className="flex flex-col gap-2.5 pointer-events-auto">
        {/* Ephemeris status pill */}
        <div className="bg-[#080e1a]/85 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl flex flex-col gap-2 border border-[#3e484f]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#38bdf8] font-bold">
                JPL EPHEMERIS DE440
              </span>
            </div>
            <span className="font-mono-code text-[10px] text-[#ffb95f] bg-[#242a36] px-1.5 py-0.5 rounded font-bold">
              ONLINE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="flex flex-col bg-[#161c28]/70 p-2 rounded-lg border border-[#3e484f]/20">
              <span className="font-mono-code text-[10px] text-[#bdc8d1]">
                SENSOR FOV
              </span>
              <span className="font-mono-code text-xs text-[#dde2f3] font-bold">
                45.0°
              </span>
            </div>

            <div className="flex flex-col bg-[#161c28]/70 p-2 rounded-lg border border-[#3e484f]/20">
              <span className="font-mono-code text-[10px] text-[#bdc8d1]">
                CAMERA LOCK
              </span>
              <span className="font-mono-code text-xs text-[#ffb95f] font-bold truncate">
                {selectedTarget.toUpperCase()} // LOCK
              </span>
            </div>
          </div>
        </div>

        {/* Compact Celestial Switcher Deck */}
        <div className="bg-[#080e1a]/85 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl flex flex-col gap-2 border border-[#3e484f]/30">
          <div className="flex items-center justify-between pb-0.5">
            <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#bdc8d1] font-bold">
              Direct Orbit Focus
            </span>
            <span className="font-mono-code text-[10px] text-[#38bdf8] font-bold">
              10 BODIES
            </span>
          </div>

          {/* 10 Planet grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {planetList.map((p) => {
              const isSelected = selectedTarget === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectTarget(p.id)}
                  className={`py-1.5 px-1 rounded-lg text-center flex flex-col items-center transition-all ${
                    isSelected
                      ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                      : 'bg-[#161c28] hover:bg-[#242a36] border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${p.color} mb-1 ${
                      isSelected ? 'shadow-[0_0_6px_#38bdf8]' : ''
                    }`}
                  />
                  <span
                    className={`font-mono-code text-[10px] ${
                      isSelected ? 'text-[#38bdf8] font-bold' : 'text-[#bdc8d1]'
                    }`}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Probes section */}
          <div className="flex items-center justify-between pt-1 border-t border-[#3e484f]/30 mt-0.5">
            <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#bdc8d1] font-bold">
              Deep Probes
            </span>
            <span className="font-mono-code text-[10px] text-[#ffb95f] font-bold">
              INTERSTELLAR
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {probeList.map((pr) => {
              const isSelected = selectedTarget === pr.id;
              return (
                <button
                  key={pr.id}
                  onClick={() => onSelectTarget(pr.id)}
                  className={`py-1.5 px-1 rounded-lg text-center flex flex-col items-center transition-all ${
                    isSelected
                      ? 'bg-[#38bdf8]/20 border border-[#38bdf8]/60 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                      : 'bg-[#161c28] hover:bg-[#242a36] border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${pr.color} mb-1 ${
                      isSelected ? 'shadow-[0_0_6px_#38bdf8]' : ''
                    }`}
                  />
                  <span
                    className={`font-mono-code text-[10px] truncate w-full ${
                      isSelected ? 'text-[#38bdf8] font-bold' : 'text-[#bdc8d1]'
                    }`}
                  >
                    {pr.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep-Space Layers Filters */}
        <div className="bg-[#080e1a]/85 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl flex flex-col gap-2 border border-[#3e484f]/30">
          <div className="flex items-center justify-between pb-0.5">
            <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#bdc8d1] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#38bdf8]">
                filter_alt
              </span>
              <span>Deep-Space Layers</span>
            </span>
            <span className="font-mono-code text-[10px] text-[#ffb95f] font-bold">
              FILTERS
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Asteroid Belt */}
            <label className="flex items-center justify-between p-2 rounded-lg bg-[#161c28]/80 hover:bg-[#242a36] transition-colors cursor-pointer border border-[#3e484f]/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b09e86]" />
                <span className="font-mono-code text-xs text-[#dde2f3]">
                  Main Asteroid Belt
                </span>
              </div>
              <input
                type="checkbox"
                checked={showAsteroids}
                onChange={(e) => onToggleAsteroids(e.target.checked)}
                className="accent-[#38bdf8] rounded w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* Kuiper Belt */}
            <label className="flex items-center justify-between p-2 rounded-lg bg-[#161c28]/80 hover:bg-[#242a36] transition-colors cursor-pointer border border-[#3e484f]/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9bd8ff]" />
                <span className="font-mono-code text-xs text-[#dde2f3]">
                  Kuiper Disc Belt
                </span>
              </div>
              <input
                type="checkbox"
                checked={showKuiper}
                onChange={(e) => onToggleKuiper(e.target.checked)}
                className="accent-[#38bdf8] rounded w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* Probes Trajectories */}
            <label className="flex items-center justify-between p-2 rounded-lg bg-[#161c28]/80 hover:bg-[#242a36] transition-colors cursor-pointer border border-[#3e484f]/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono-code text-xs text-[#dde2f3]">
                  Deep Probe Paths
                </span>
              </div>
              <input
                type="checkbox"
                checked={showProbes}
                onChange={(e) => onToggleProbes(e.target.checked)}
                className="accent-[#38bdf8] rounded w-3.5 h-3.5 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Left: Flight Dynamics Simulation Controller */}
      <div className="pointer-events-auto bg-[#080e1a]/85 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl flex flex-col gap-2.5 border border-[#3e484f]/30 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-[10px] uppercase tracking-wider text-[#bdc8d1] font-bold">
            Temporal Multiplier
          </span>
          <span className="font-mono-code text-xs text-[#38bdf8] font-bold">
            {speedMultiplier.toFixed(1)}x {speedMultiplier === 1.0 ? '(Real)' : `(${(speedMultiplier * 24).toFixed(0)}h/s)`}
          </span>
        </div>

        {/* Custom Slider */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#bdc8d1]">
            history
          </span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.2"
            value={speedMultiplier}
            onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#38bdf8] h-1.5 bg-[#2f3542] rounded-lg cursor-pointer"
          />
          <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">
            fast_forward
          </span>
        </div>

        {/* 4 Control Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          <button
            onClick={onTogglePlayPause}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
              isPaused
                ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                : 'bg-[#242a36] text-[#38bdf8] hover:bg-[#343946]'
            }`}
            title={isPaused ? 'Resume Simulation' : 'Freeze Simulation'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>

          <button
            onClick={onStepFrame}
            className="p-2 rounded-lg bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] flex items-center justify-center transition-colors"
            title="Step Forward (+1 Sol)"
          >
            <span className="material-symbols-outlined text-[18px]">
              skip_next
            </span>
          </button>

          <button
            onClick={onToggleCinematic}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
              isCinematic
                ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                : 'bg-[#242a36] text-[#dde2f3] hover:bg-[#343946]'
            }`}
            title="Cinematic Orbit Drone"
          >
            <span className="material-symbols-outlined text-[18px]">
              videocam
            </span>
          </button>

          <button
            onClick={onResetCamera}
            className="p-2 rounded-lg bg-[#242a36] hover:bg-[#343946] text-[#ffb95f] flex items-center justify-center transition-colors"
            title="Reset Camera View"
          >
            <span className="material-symbols-outlined text-[18px]">
              restart_alt
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
