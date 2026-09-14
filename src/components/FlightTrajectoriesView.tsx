import { useState } from 'react';
import { PROBE_TRAJECTORIES } from '../data/celestialData';

interface FlightTrajectoriesViewProps {
  onSelectProbe: (id: string) => void;
  onSwitchToOrrery: () => void;
}

export default function FlightTrajectoriesView({
  onSelectProbe,
  onSwitchToOrrery,
}: FlightTrajectoriesViewProps) {
  const [selectedProbeId, setSelectedProbeId] = useState('voyager-1');
  const currentProbe = PROBE_TRAJECTORIES.find((p) => p.id === selectedProbeId) || PROBE_TRAJECTORIES[0];

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 select-none bg-[#0e131f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3e484f]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#38bdf8] font-mono-code text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">route</span>
            <span>DEEP SPACE NETWORK (DSN) TRACKING VECTOR</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dde2f3]">
            Interstellar & Planetary Flight Trajectories
          </h1>
          <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
            Real-time hyperbolic kinematics, telemetry link budgets, and instrumentation status for deep-space missions.
          </p>
        </div>

        <button
          onClick={() => {
            onSelectProbe(currentProbe.id);
            onSwitchToOrrery();
          }}
          className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#7bd0ff] text-[#00354a] font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">videocam</span>
          <span>Lock 3D Camera on {currentProbe.name}</span>
        </button>
      </div>

      {/* Main Grid: Left Probe Selector Cards + Right Telemetry Radar Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Probe List Deck */}
        <div className="flex flex-col gap-3">
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#bdc8d1] font-bold">
            Monitored Deep Space Craft ({PROBE_TRAJECTORIES.length})
          </span>

          {PROBE_TRAJECTORIES.map((probe) => {
            const isSelected = probe.id === selectedProbeId;
            return (
              <button
                key={probe.id}
                onClick={() => setSelectedProbeId(probe.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-[#161c28] border-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                    : 'bg-[#161c28]/60 border-[#3e484f]/30 hover:bg-[#161c28] hover:border-[#bdc8d1]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        probe.status === 'INTERSTELLAR'
                          ? 'bg-[#38bdf8] animate-pulse shadow-[0_0_6px_#38bdf8]'
                          : 'bg-[#ffb95f]'
                      }`}
                    />
                    <span className="font-display text-base font-bold text-[#dde2f3]">
                      {probe.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono-code text-[10px] px-2 py-0.5 rounded font-bold ${
                      probe.status === 'INTERSTELLAR'
                        ? 'text-[#38bdf8] bg-[#38bdf8]/20'
                        : 'text-[#ffb95f] bg-[#ffb95f]/20'
                    }`}
                  >
                    {probe.status}
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono-code text-xs text-[#bdc8d1]">
                  <span>Agency: {probe.agency}</span>
                  <span className="text-[#38bdf8] font-bold">{probe.currentDistAU} AU</span>
                </div>

                <div className="flex items-center justify-between font-mono-code text-[11px] text-[#64748b]">
                  <span>Speed: {probe.velocityKmS} km/s</span>
                  <span>Delay: {probe.lightDelay}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Flight Radar & Telemetry Instrumentation Console */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Active Probe Banner Card */}
          <div className="bg-[#161c28] rounded-xl p-6 border border-[#3e484f]/30 flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3e484f]/25 pb-4">
              <div>
                <span className="font-mono-code text-xs text-[#38bdf8] uppercase tracking-widest font-bold">
                  TELEMETRY MATRIX RECORD // {currentProbe.id.toUpperCase()}
                </span>
                <h2 className="font-display text-3xl font-bold text-[#dde2f3] mt-1">
                  {currentProbe.name}
                </h2>
                <span className="font-mono-code text-xs text-[#ffb95f]">
                  Launched: {currentProbe.launchDate} • Destination: {currentProbe.destination}
                </span>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <span className="font-mono-code text-[11px] text-[#bdc8d1]">Radio Carrier</span>
                <span className="font-mono-code text-base text-[#38bdf8] font-bold">{currentProbe.frequency}</span>
                <span className="font-mono-code text-[10px] text-emerald-400">{currentProbe.signalStrength}</span>
              </div>
            </div>

            {/* 4 Stat Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code">
              <div className="bg-[#080e1a]/80 p-3 rounded-lg border border-[#3e484f]/25 flex flex-col">
                <span className="text-[10px] text-[#bdc8d1] uppercase">Heliocentric Dist</span>
                <span className="text-base text-[#38bdf8] font-bold">{currentProbe.currentDistAU} AU</span>
                <span className="text-[10px] text-[#bdc8d1] truncate">{currentProbe.currentDistKm}</span>
              </div>

              <div className="bg-[#080e1a]/80 p-3 rounded-lg border border-[#3e484f]/25 flex flex-col">
                <span className="text-[10px] text-[#bdc8d1] uppercase">Kinetic Speed</span>
                <span className="text-base text-[#dde2f3] font-bold">{currentProbe.velocityKmS} km/s</span>
                <span className="text-[10px] text-[#ffb95f]">{(currentProbe.velocityKmS * 3600).toLocaleString()} km/h</span>
              </div>

              <div className="bg-[#080e1a]/80 p-3 rounded-lg border border-[#3e484f]/25 flex flex-col">
                <span className="text-[10px] text-[#bdc8d1] uppercase">One-Way Light Delay</span>
                <span className="text-base text-[#ffb95f] font-bold">{currentProbe.lightDelay}</span>
                <span className="text-[10px] text-[#bdc8d1]">Round-trip x2</span>
              </div>

              <div className="bg-[#080e1a]/80 p-3 rounded-lg border border-[#3e484f]/25 flex flex-col">
                <span className="text-[10px] text-[#bdc8d1] uppercase">Power Source</span>
                <span className="text-sm text-emerald-400 font-bold truncate">{currentProbe.powerStatus}</span>
                <span className="text-[10px] text-[#bdc8d1]">Continuous</span>
              </div>
            </div>

            {/* Scientific Payload Instruments */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-mono-code text-xs uppercase tracking-wider text-[#bdc8d1] font-bold">
                Active Science Package & Sensor Payload
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentProbe.keyInstruments.map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#080e1a]/60 border border-[#3e484f]/25 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">
                        sensors
                      </span>
                      <span className="font-mono-code text-xs text-[#dde2f3] font-medium">
                        {inst}
                      </span>
                    </div>
                    <span className="font-mono-code text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ONLINE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DSN Ground Link Telemetry Terminal */}
            <div className="p-4 rounded-xl bg-[#080e1a] border border-[#3e484f]/30 font-mono-code text-xs flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-[#bdc8d1]">
                <span className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                  <span className="material-symbols-outlined text-[16px]">satellite_alt</span>
                  <span>DSN 70-METER ANTENNA COMPLEX INTERCEPT</span>
                </span>
                <span className="text-[#ffb95f]">SNR: +14.2 dB</span>
              </div>
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                Carrier tracking lock maintained via Goldstone Deep Space Communications Complex (DSS 14 / DSS 24). Spacecraft ephemeris synchronized with JPL DE440 high-precision numerical orbit integrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
