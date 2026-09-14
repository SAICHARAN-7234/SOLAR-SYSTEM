import { useState } from 'react';
import { UPCOMING_ORBITAL_EVENTS } from '../data/celestialData';

export default function OrbitalEventsView() {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = UPCOMING_ORBITAL_EVENTS.filter((e) => {
    if (filterType === 'all') return true;
    return e.type.toLowerCase() === filterType.toLowerCase();
  });

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'CONJUNCTION':
        return 'text-[#38bdf8] bg-[#38bdf8]/20 border-[#38bdf8]/35';
      case 'ECLIPSE':
        return 'text-[#ffbcb7] bg-[#ffbcb7]/20 border-[#ffbcb7]/35';
      case 'PERIHELION':
        return 'text-[#ffb95f] bg-[#ffb95f]/20 border-[#ffb95f]/35';
      case 'FLYBY':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
      case 'OPPOSITION':
        return 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30';
      default:
        return 'text-[#bdc8d1] bg-[#242a36] border-[#3e484f]/30';
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 select-none bg-[#0e131f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3e484f]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#38bdf8] font-mono-code text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
            <span>CELESTIAL EPHEMERIS CALENDAR // J2000</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dde2f3]">
            Orbital Events &amp; Transfer Windows
          </h1>
          <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
            Astronomical conjunctions, lunar/solar eclipses, spacecraft gravitational assists, and planetary oppositions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 font-mono-code text-xs bg-[#161c28] p-2.5 rounded-xl border border-[#3e484f]/25">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'conjunction', label: 'Conjunctions' },
          { id: 'eclipse', label: 'Eclipses' },
          { id: 'opposition', label: 'Oppositions' },
          { id: 'perihelion', label: 'Perihelion' },
          { id: 'flyby', label: 'Maneuvers / Flybys' },
          { id: 'occultation', label: 'Occultations' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              filterType === f.id
                ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#dde2f3]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-[#161c28] rounded-xl p-5 border border-[#3e484f]/30 hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between gap-4 shadow-xl group"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono-code text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getBadgeColor(
                    evt.type
                  )}`}
                >
                  {evt.type}
                </span>

                <div className="flex items-center gap-1.5 font-mono-code text-xs text-[#ffb95f] font-bold">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  <span>T-{evt.timeRemainingDays} Days</span>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-[#dde2f3] group-hover:text-[#38bdf8] transition-colors mt-1">
                {evt.title}
              </h3>

              <div className="flex items-center gap-3 font-mono-code text-xs text-[#bdc8d1]">
                <span>Target: {evt.target}</span>
                <span>•</span>
                <span className="text-[#38bdf8]">{evt.date}</span>
              </div>

              <p className="text-xs text-[#bdc8d1] leading-relaxed mt-1">
                {evt.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#3e484f]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-code text-xs">
              <div className="flex items-center gap-1 text-[#64748b]">
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span>{evt.eclipticCoords}</span>
              </div>

              <span className="text-[#ffb95f] font-medium self-start sm:self-auto">
                {evt.visibility}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
