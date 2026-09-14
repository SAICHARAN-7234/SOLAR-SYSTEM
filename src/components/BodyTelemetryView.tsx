import { useState } from 'react';
import { CELESTIAL_BODIES } from '../data/celestialData';
import { CelestialBody } from '../types';

interface BodyTelemetryViewProps {
  onSelectBody: (id: string) => void;
  onSwitchToOrrery: () => void;
}

export default function BodyTelemetryView({
  onSelectBody,
  onSwitchToOrrery,
}: BodyTelemetryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dist' | 'radius' | 'temp'>('dist');

  const allBodies = Object.values(CELESTIAL_BODIES);

  const filtered = allBodies.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.iauId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'terrestrial') return b.type.toLowerCase().includes('terrestrial');
    if (filterCategory === 'gas') return b.type.toLowerCase().includes('gas');
    if (filterCategory === 'ice') return b.type.toLowerCase().includes('ice');
    if (filterCategory === 'probes') return b.isProbe;
    if (filterCategory === 'dwarf') return b.type.toLowerCase().includes('dwarf');
    return true;
  });

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 select-none bg-[#0e131f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3e484f]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#38bdf8] font-mono-code text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span>JPL DE440 EPHEMERIDES MATRIX</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dde2f3]">
            Celestial Body Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
            Comparative orbital mechanics, gravitational gradients, and atmospheric ephemerides across the Sol system.
          </p>
        </div>

        <button
          onClick={onSwitchToOrrery}
          className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#7bd0ff] text-[#00354a] font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">planet</span>
          <span>Open 3D Orrery</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161c28] p-3.5 rounded-xl border border-[#3e484f]/25">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bdc8d1] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search celestial body, IAU identifier, or probe..."
            className="w-full bg-[#080e1a] border border-[#3e484f]/40 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dde2f3] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 font-mono-code text-[11px]">
          {[
            { id: 'all', label: 'All Bodies' },
            { id: 'terrestrial', label: 'Terrestrial' },
            { id: 'gas', label: 'Gas Giants' },
            { id: 'ice', label: 'Ice Giants' },
            { id: 'probes', label: 'Deep Probes' },
            { id: 'dwarf', label: 'Dwarf Worlds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                  : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#dde2f3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((body) => (
          <div
            key={body.id}
            className="bg-[#161c28]/90 rounded-xl p-5 border border-[#3e484f]/30 hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between gap-4 shadow-lg group hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: body.colorHex }}
                  />
                  <span className="font-mono-code text-[11px] text-[#38bdf8] font-bold">
                    {body.iauId}
                  </span>
                </div>
                <span className="font-mono-code text-[10px] text-[#ffb95f] bg-[#242a36] px-2 py-0.5 rounded font-semibold">
                  {body.type}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-display text-xl font-bold text-[#dde2f3] mt-2 group-hover:text-[#38bdf8] transition-colors">
                {body.name}
              </h3>
              <p className="text-xs text-[#bdc8d1] leading-relaxed mt-1 line-clamp-2">
                {body.tagline}
              </p>

              {/* Key Metrics Bento */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#3e484f]/25 font-mono-code text-xs">
                <div className="flex flex-col bg-[#080e1a]/60 p-2 rounded-lg">
                  <span className="text-[10px] text-[#bdc8d1]">Axis / Dist</span>
                  <span className="font-bold text-[#38bdf8] truncate">{body.axis}</span>
                </div>
                <div className="flex flex-col bg-[#080e1a]/60 p-2 rounded-lg">
                  <span className="text-[10px] text-[#bdc8d1]">Velocity</span>
                  <span className="font-bold text-[#dde2f3] truncate">{body.velocity}</span>
                </div>
                <div className="flex flex-col bg-[#080e1a]/60 p-2 rounded-lg">
                  <span className="text-[10px] text-[#bdc8d1]">Mean Temp</span>
                  <span className="font-bold text-[#ffb95f] truncate">{body.temp}</span>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono-code text-xs">
                <div className="flex justify-between p-2 rounded bg-[#080e1a]/40">
                  <span className="text-[#bdc8d1]">Gravity:</span>
                  <span className="text-[#dde2f3] font-semibold">{body.gravity}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#080e1a]/40">
                  <span className="text-[#bdc8d1]">Moons:</span>
                  <span className="text-[#dde2f3] font-semibold">{body.moons}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#3e484f]/25 font-mono-code text-xs">
              <span className="text-[11px] text-[#bdc8d1]">
                {body.missions.length} Registered Missions
              </span>
              <button
                onClick={() => {
                  onSelectBody(body.id);
                  onSwitchToOrrery();
                }}
                className="px-3 py-1 rounded-lg bg-[#242a36] hover:bg-[#38bdf8] text-[#38bdf8] hover:text-[#00354a] font-bold transition-all flex items-center gap-1"
              >
                <span>Track in 3D</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
