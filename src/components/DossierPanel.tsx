import { useEffect, useState } from 'react';
import { CelestialBody } from '../types';

interface DossierPanelProps {
  body: CelestialBody;
}

export default function DossierPanel({ body }: DossierPanelProps) {
  const [localTime, setLocalTime] = useState('14:38:11');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setLocalTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      id="planetary-dossier"
      className="w-full lg:w-[430px] bg-[#080e1a]/95 backdrop-blur-2xl overflow-y-auto p-5 sm:p-6 flex flex-col gap-4 border-l border-[#3e484f]/35 shadow-[-12px_0_35px_rgba(0,0,0,0.6)] h-full select-text z-30"
    >
      {/* 1. Header & Badges */}
      <div className="flex flex-col gap-1.5 border-b border-[#3e484f]/25 pb-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#38bdf8] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">{body.icon}</span>
            <span>{body.category}</span>
          </span>
          <span className="font-mono-code text-[11px] text-[#bdc8d1] bg-[#242a36] px-2 py-0.5 rounded">
            {body.iauId}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <h2 className="font-display text-3xl sm:text-[32px] font-bold text-[#dde2f3] tracking-tight">
            {body.name}
          </h2>
          <span className="font-mono-code text-xs text-[#ffb95f] uppercase font-semibold">
            {body.type}
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-[#bdc8d1] leading-relaxed">
          {body.tagline}
        </p>
      </div>

      {/* 2. Diurnal / Downlink Clock Widget */}
      <div className="bg-[#161c28]/90 p-4 rounded-xl flex flex-col gap-2 border border-[#3e484f]/30">
        <div className="flex justify-between items-center text-[#bdc8d1] font-mono-code text-[11px]">
          <span className="uppercase tracking-wider">
            {body.isProbe ? 'Downlink OWLT Delay' : 'Diurnal Solar Cycle'}
          </span>
          <span className="text-[#ffb95f] font-semibold">
            {body.dayLength}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase">
              {body.isProbe ? 'Signal Light-Time' : 'Subsolar Local Time'}
            </span>
            <span className="font-display text-2xl font-bold text-[#38bdf8]">
              {body.isProbe ? body.solarClock : localTime}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase">
              {body.isProbe ? 'Helio Radial V∞' : 'Sync Drift (Sol)'}
            </span>
            <span className="font-mono-code text-xs text-[#dde2f3] font-semibold">
              {body.drift}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#2f3542] h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-[#38bdf8] h-full transition-all duration-700 shadow-[0_0_8px_#38bdf8]"
            style={{ width: body.isProbe ? '88%' : '64%' }}
          />
        </div>
      </div>

      {/* 3. Orbital & Physical Ephemerides Bento Grid */}
      <div className="flex flex-col gap-2">
        <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#bdc8d1] font-bold">
          {body.isProbe ? 'Probe Trajectory & Kinematics' : 'Orbital & Physical Ephemerides'}
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Box 1 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Heliocentric Dist' : 'Semi-Major Axis'}
            </span>
            <span className="font-mono-code text-sm text-[#dde2f3] font-bold">
              {body.axis}
            </span>
            <span className="font-mono-code text-[10px] text-[#38bdf8] truncate">
              {body.axisKm}
            </span>
          </div>

          {/* Box 2 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Antenna & Network' : 'Equatorial Radius'}
            </span>
            <span className="font-mono-code text-sm text-[#dde2f3] font-bold">
              {body.radius}
            </span>
            <span className="font-mono-code text-[10px] text-[#ffb95f]">
              {body.radiusRatio}
            </span>
          </div>

          {/* Box 3 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Gravity State' : 'Surface Gravity'}
            </span>
            <span className="font-mono-code text-sm text-[#dde2f3] font-bold">
              {body.gravity}
            </span>
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.gravitySub || 'Standard G'}
            </span>
          </div>

          {/* Box 4 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Orbital Regime' : 'Orbital Period'}
            </span>
            <span className="font-mono-code text-sm text-[#dde2f3] font-bold">
              {body.period}
            </span>
            <span className="font-mono-code text-[10px] text-[#38bdf8]">
              {body.velocity}
            </span>
          </div>

          {/* Box 5 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Trajectory Orbit Ecc.' : 'Orbital Eccentricity'}
            </span>
            <span className="font-mono-code text-sm text-[#dde2f3] font-bold">
              {body.eccentricity}
            </span>
            <span className="font-mono-code text-[10px] text-[#bdc8d1] truncate">
              {body.eccentricitySub || 'DE440 Orbit'}
            </span>
          </div>

          {/* Box 6 */}
          <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex flex-col border border-[#3e484f]/25">
            <span className="font-mono-code text-[10px] text-[#bdc8d1]">
              {body.isProbe ? 'Ambient Cold / RTG' : 'Surface Temp (Mean)'}
            </span>
            <span className="font-mono-code text-sm text-[#ffb95f] font-bold">
              {body.temp}
            </span>
            <span className="font-mono-code text-[10px] text-[#bdc8d1] truncate">
              {body.tempRange}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Moons & Mass Readout */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex items-center gap-2.5 border border-[#3e484f]/25">
          <div className="w-8 h-8 rounded-lg bg-[#242a36] flex items-center justify-center text-[#38bdf8] shrink-0">
            <span className="material-symbols-outlined text-[18px]">
              {body.isProbe ? 'military_tech' : 'satellite_alt'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono-code text-[10px] text-[#bdc8d1] truncate">
              {body.isProbe ? 'Milestone' : 'Moons Confirmed'}
            </span>
            <span className="font-display text-base sm:text-lg font-bold text-[#dde2f3] truncate">
              {body.moons}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#161c28]/70 flex items-center gap-2.5 border border-[#3e484f]/25">
          <div className="w-8 h-8 rounded-lg bg-[#242a36] flex items-center justify-center text-[#ffb95f] shrink-0">
            <span className="material-symbols-outlined text-[18px]">scale</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono-code text-[10px] text-[#bdc8d1] truncate">
              {body.isProbe ? 'Mass Spec' : 'Total Mass (kg)'}
            </span>
            <span className="font-mono-code text-xs sm:text-sm font-bold text-[#dde2f3] truncate">
              {body.mass}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Spectrometric Gas Profile / RF Profile */}
      <div className="p-3.5 rounded-xl bg-[#161c28]/90 flex flex-col gap-2 border border-[#3e484f]/30">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#bdc8d1] font-bold">
            {body.isProbe ? 'Downlink Carrier & RF Link' : 'Spectrometric Gas Profile'}
          </span>
          <span className="font-mono-code text-[11px] text-[#38bdf8]">
            {body.isProbe ? body.carrierFreq || '8.4 GHz' : 'ATMOSPHERIC ABSORPTION'}
          </span>
        </div>

        {/* Gas Breakdown segmented bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#2f3542] gap-0.5 mt-1">
          {body.atmosphereGases.map((gas, i) => (
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

        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 font-mono-code text-[11px] text-[#bdc8d1]">
          {body.atmosphereGases.map((gas, i) => (
            <span key={i} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: gas.color }}
              />
              {gas.name} {gas.percent}%
            </span>
          ))}
        </div>
      </div>

      {/* 6. Key Orbital Intercept Missions / Instruments */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#bdc8d1] font-bold">
            {body.isProbe ? 'Scientific Payload Instruments' : 'Key Orbital Intercept Missions'}
          </span>
          <span className="font-mono-code text-[10px] text-[#bdc8d1]">
            {body.isProbe ? 'JPL • NASA • DSN' : 'ESA • NASA • ISRO'}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {body.missions.map((mission, idx) => {
            const isActive = mission.status === 'ACTIVE' || mission.status === 'OPERATIONAL';
            const isEnRoute = mission.status === 'EN ROUTE' || mission.status === 'STANDBY' || mission.status === 'TESTING';

            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#161c28]/70 flex items-center justify-between border border-[#3e484f]/25 hover:border-[#38bdf8]/40 transition-colors"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-mono-code text-xs font-semibold text-[#dde2f3] truncate">
                    {mission.name}
                  </span>
                  <span className="text-[11px] text-[#bdc8d1] truncate">
                    {mission.desc}
                  </span>
                </div>

                <span
                  className={`font-mono-code text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                    isActive
                      ? 'text-[#38bdf8] bg-[#38bdf8]/20 border border-[#38bdf8]/35'
                      : isEnRoute
                      ? 'text-[#ffb95f] bg-[#ffb95f]/15 border border-[#ffb95f]/35'
                      : 'text-[#bdc8d1] bg-[#242a36]'
                  }`}
                >
                  {mission.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Calibrated Scientific Repositories Footer */}
      <div className="p-3 rounded-lg bg-[#080e1a]/80 text-[#bdc8d1] font-mono-code text-[10px] flex flex-col gap-1 border border-[#3e484f]/25 mt-auto">
        <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          <span>CALIBRATED SCIENTIFIC REPOSITORIES</span>
        </div>
        <p className="leading-relaxed opacity-85">
          NASA Planetary Fact Sheet • JPL Deep Space Network Telemetry Matrix • Voyagers Interstellar Data Repository • DE440 Orbit Integration.
        </p>
      </div>
    </aside>
  );
}
