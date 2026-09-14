import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [station, setStation] = useState('Goldstone (California, USA)');
  const [coordinateSystem, setCoordinateSystem] = useState('Ecliptic J2000');
  const [units, setUnits] = useState('Metric / AU (Standard)');
  const [showStarLabels, setShowStarLabels] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <div className="w-full max-w-lg bg-[#080e1a] border border-[#3e484f] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3e484f]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
              tune
            </span>
            <h2 className="font-display text-xl font-bold text-[#dde2f3]">
              Telemetry Console Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#bdc8d1] hover:text-[#dde2f3] p-1 rounded-lg hover:bg-[#242a36] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 font-mono-code text-xs">
          {/* Ground Station */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] uppercase text-[10px] font-bold">
              Primary DSN Uplink Station
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="bg-[#161c28] border border-[#3e484f]/40 rounded-lg p-2.5 text-[#dde2f3] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="Goldstone (California, USA)">Goldstone DSS 14 / DSS 24 (California, USA)</option>
              <option value="Madrid (Spain)">Madrid DSS 63 / DSS 65 (Robledo, Spain)</option>
              <option value="Canberra (Australia)">Canberra DSS 43 / DSS 35 (Tidbinbilla, Australia)</option>
            </select>
          </div>

          {/* Coordinate System */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] uppercase text-[10px] font-bold">
              Astronomical Ephemeris Standard
            </label>
            <select
              value={coordinateSystem}
              onChange={(e) => setCoordinateSystem(e.target.value)}
              className="bg-[#161c28] border border-[#3e484f]/40 rounded-lg p-2.5 text-[#dde2f3] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="Ecliptic J2000">JPL DE440 Ecliptic J2000 (Recommended)</option>
              <option value="ICRF">International Celestial Reference Frame (ICRF3)</option>
              <option value="Barycentric">Barycentric Dynamical Time (TDB) Inertial</option>
            </select>
          </div>

          {/* Units */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] uppercase text-[10px] font-bold">
              Distances &amp; Kinematics Units
            </label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="bg-[#161c28] border border-[#3e484f]/40 rounded-lg p-2.5 text-[#dde2f3] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="Metric / AU (Standard)">Astronomical Units (AU) &amp; Kilometers (km/s)</option>
              <option value="Imperial">Statute Miles &amp; Miles per Second (mi/s)</option>
              <option value="LightTime">One-Way Light Time Seconds (OWLT)</option>
            </select>
          </div>

          {/* Starfield HUD labels */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#161c28] border border-[#3e484f]/25 cursor-pointer">
            <span className="text-[#dde2f3]">Show Milestones &amp; Trajectory Halos</span>
            <input
              type="checkbox"
              checked={showStarLabels}
              onChange={(e) => setShowStarLabels(e.target.checked)}
              className="accent-[#38bdf8] rounded w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#3e484f]/25">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#7bd0ff] text-[#00354a] font-mono-code text-xs font-bold transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          >
            Apply &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}
