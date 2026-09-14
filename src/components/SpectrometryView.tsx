import { useState } from 'react';
import { SPECTRAL_LINES, CELESTIAL_BODIES } from '../data/celestialData';

export default function SpectrometryView() {
  const [selectedWavelength, setSelectedWavelength] = useState<number>(589.0);
  const [selectedBodyKey, setSelectedBodyKey] = useState<string>('earth');

  const selectedBody = CELESTIAL_BODIES[selectedBodyKey] || CELESTIAL_BODIES['earth'];
  const activeSpectralLine = SPECTRAL_LINES.find(
    (l) => Math.abs(l.wavelengthNm - selectedWavelength) < 15
  ) || SPECTRAL_LINES[4]; // Default to Sodium D-line

  const targetBodies = ['sun', 'venus', 'earth', 'mars', 'jupiter', 'titan'];

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 select-none bg-[#0e131f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3e484f]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#38bdf8] font-mono-code text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">query_stats</span>
            <span>HIGH-RESOLUTION CELESTIAL SPECTROMETRY ARRAY</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dde2f3]">
            Atmospheric & Fraunhofer Spectral Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
            Continuous optical and infrared absorption spectroscopy across planetary atmospheres and the solar chromosphere.
          </p>
        </div>
      </div>

      {/* Interactive Spectrometer Waveform Analyzer */}
      <div className="bg-[#161c28] p-6 rounded-xl border border-[#3e484f]/30 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#bdc8d1] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>Fraunhofer Absorption & Emission Spectrogram</span>
          </span>
          <span className="font-mono-code text-xs text-[#ffb95f] bg-[#242a36] px-3 py-1 rounded font-bold">
            λ = {selectedWavelength.toFixed(1)} nm
          </span>
        </div>

        {/* Visual Spectral Band (Rainbow Gradient from UV to IR) */}
        <div className="relative w-full h-16 rounded-xl overflow-hidden shadow-inner border border-[#3e484f]/40">
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(to right, #4c1d95 0%, #3b82f6 15%, #06b6d4 30%, #10b981 45%, #eab308 60%, #f97316 75%, #ef4444 90%, #7f1d1d 100%)'
            }}
          />

          {/* Spectral absorption marker ticks */}
          {SPECTRAL_LINES.map((line, idx) => {
            const leftPct = ((line.wavelengthNm - 380) / (1160 - 380)) * 100;
            const isNear = Math.abs(line.wavelengthNm - selectedWavelength) < 15;
            return (
              <button
                key={idx}
                onClick={() => setSelectedWavelength(line.wavelengthNm)}
                className="absolute top-0 bottom-0 w-1 flex flex-col items-center group cursor-pointer"
                style={{ left: `${Math.min(99, Math.max(1, leftPct))}%` }}
                title={`${line.element}: ${line.wavelengthNm} nm`}
              >
                <div
                  className={`w-0.5 h-full ${
                    isNear ? 'bg-white shadow-[0_0_10px_white]' : 'bg-black/70 group-hover:bg-white'
                  }`}
                />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 text-[9px] font-mono-code text-white bg-black/90 px-1 rounded whitespace-nowrap z-20">
                  {line.element}
                </span>
              </button>
            );
          })}

          {/* Cursor needle for current wavelength */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#38bdf8] pointer-events-none"
            style={{ left: `${((selectedWavelength - 380) / (1160 - 380)) * 100}%` }}
          />
        </div>

        {/* Wavelength Slider */}
        <div className="flex items-center gap-3">
          <span className="font-mono-code text-xs text-[#bdc8d1]">380 nm (UV)</span>
          <input
            type="range"
            min="380"
            max="1160"
            step="0.5"
            value={selectedWavelength}
            onChange={(e) => setSelectedWavelength(parseFloat(e.target.value))}
            className="flex-1 accent-[#38bdf8] h-2 bg-[#080e1a] rounded-lg cursor-pointer"
          />
          <span className="font-mono-code text-xs text-[#bdc8d1]">1160 nm (IR)</span>
        </div>

        {/* Detected Signature Card */}
        <div className="p-4 rounded-xl bg-[#080e1a] border border-[#3e484f]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeSpectralLine.color }}
              />
              <span className="font-display text-lg font-bold text-[#dde2f3]">
                {activeSpectralLine.element}
              </span>
              <span className="font-mono-code text-xs text-[#38bdf8] bg-[#161c28] px-2 py-0.5 rounded font-bold">
                {activeSpectralLine.wavelengthNm} nm
              </span>
              <span className="font-mono-code text-[10px] text-[#ffb95f] uppercase">
                {activeSpectralLine.type} Line
              </span>
            </div>
            <p className="text-xs text-[#bdc8d1] mt-1">
              {activeSpectralLine.description}
            </p>
          </div>

          <div className="flex flex-col sm:text-right font-mono-code text-xs">
            <span className="text-[#bdc8d1]">Relative Intensity</span>
            <span className="text-base font-bold text-[#38bdf8]">
              {(activeSpectralLine.intensity * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Target Body Atmospheric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Body Selector */}
        <div className="flex flex-col gap-2 bg-[#161c28] p-5 rounded-xl border border-[#3e484f]/30">
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#bdc8d1] font-bold mb-2">
            Target Planetary Biospheres
          </span>
          {['sun', 'venus', 'earth', 'mars', 'jupiter', 'pluto'].map((key) => {
            const b = CELESTIAL_BODIES[key];
            if (!b) return null;
            const isSelected = selectedBodyKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedBodyKey(key)}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#242a36] border-[#38bdf8] text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-[#080e1a]/60 border-[#3e484f]/25 text-[#bdc8d1] hover:bg-[#242a36]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: b.colorHex }}
                  />
                  <span className="font-display text-sm font-bold text-[#dde2f3]">
                    {b.name}
                  </span>
                </div>
                <span className="font-mono-code text-[10px] text-[#ffb95f]">
                  {b.atmosphereGases.length} Major Gases
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Atmospheric Composition Breakdown */}
        <div className="lg:col-span-2 bg-[#161c28] p-6 rounded-xl border border-[#3e484f]/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#3e484f]/25 pb-3">
            <div>
              <span className="font-mono-code text-xs text-[#38bdf8] uppercase tracking-wider font-bold">
                ATMOSPHERIC COMPOSITION PROFILE
              </span>
              <h3 className="font-display text-2xl font-bold text-[#dde2f3] mt-0.5">
                {selectedBody.name}
              </h3>
            </div>
            <span className="font-mono-code text-xs text-[#ffb95f] bg-[#080e1a] px-3 py-1 rounded border border-[#3e484f]/30 font-bold">
              Mean Temp: {selectedBody.temp}
            </span>
          </div>

          {/* Large Segmented Composition Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#080e1a] gap-0.5">
            {selectedBody.atmosphereGases.map((gas, i) => (
              <div
                key={i}
                className="h-full"
                style={{
                  width: `${gas.percent}%`,
                  backgroundColor: gas.color
                }}
                title={`${gas.name}: ${gas.percent}%`}
              />
            ))}
          </div>

          {/* Detailed Gases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {selectedBody.atmosphereGases.map((gas, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#080e1a]/80 border border-[#3e484f]/25 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: gas.color }}
                  />
                  <span className="font-mono-code text-xs text-[#dde2f3] font-medium">
                    {gas.name}
                  </span>
                </div>
                <span className="font-mono-code text-sm font-bold text-[#38bdf8]">
                  {gas.percent}%
                </span>
              </div>
            ))}
          </div>

          {/* Scientific Annotation */}
          <div className="p-3.5 rounded-lg bg-[#080e1a]/50 border border-[#3e484f]/25 font-mono-code text-xs text-[#bdc8d1] flex items-center gap-2 mt-auto">
            <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">info</span>
            <span>Calibrated via high-resolution spectral absorption surveys and in-situ mass spectrometers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
