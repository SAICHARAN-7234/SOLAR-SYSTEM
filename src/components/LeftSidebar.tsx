import { ViewTab } from '../types';

interface LeftSidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenSettings: () => void;
}

export default function LeftSidebar({
  currentTab,
  onSelectTab,
  onOpenSettings,
}: LeftSidebarProps) {
  const navItems: { id: ViewTab; label: string; icon: string }[] = [
    { id: 'orrery', label: 'Orrery Core', icon: 'planet' },
    { id: 'telemetry', label: 'Body Telemetry', icon: 'public' },
    { id: 'trajectories', label: 'Flight Trajectories', icon: 'route' },
    { id: 'spectrometry', label: 'Spectrometry', icon: 'query_stats' },
    { id: 'events', label: 'Orbital Events', icon: 'event_upcoming' },
  ];

  return (
    <aside className="h-full w-64 bg-[#080e1a]/95 backdrop-blur-2xl z-40 flex flex-col justify-between py-4 border-r border-[#3e484f]/30 select-none shrink-0">
      <div className="flex flex-col gap-4">
        {/* Logo & Title */}
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#242a36] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px] animate-spin" style={{ animationDuration: '14s' }}>
                radar
              </span>
            </div>
            <div>
              <span className="font-display text-lg text-[#38bdf8] tracking-tight font-bold block leading-tight">
                ORRERY-X
              </span>
              <span className="font-mono-code text-[10px] text-[#bdc8d1] tracking-wider uppercase block">
                Telemetry Matrix
              </span>
            </div>
          </div>
        </div>

        {/* DSN Uplink Status */}
        <div className="px-4">
          <div className="p-3 rounded-xl bg-[#161c28] flex flex-col gap-1 border border-[#3e484f]/25 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase tracking-wider">
                DSN Uplink
              </span>
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
            </div>
            <span className="font-mono-code text-xs text-[#38bdf8] font-bold tracking-wide">
              GOLDSTONE // LOCK
            </span>
          </div>
        </div>

        {/* Navigation Deck */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'text-[#bdc8d1] hover:bg-[#242a36] hover:text-[#dde2f3]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span className="font-mono-code text-xs tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: Obs Array & User Profile */}
      <div className="px-4 flex flex-col gap-3">
        {/* Obs Array Monitor */}
        <div className="p-3 rounded-xl bg-[#161c28] flex flex-col gap-1.5 border border-[#3e484f]/25">
          <div className="flex justify-between items-center">
            <span className="font-mono-code text-[10px] text-[#bdc8d1] uppercase">
              Obs. Array
            </span>
            <span className="font-mono-code text-[10px] text-[#ffb95f] font-bold">
              NOMINAL
            </span>
          </div>
          <div className="w-full bg-[#2f3542] h-1 rounded-full overflow-hidden">
            <div className="bg-[#38bdf8] h-full w-[94%] shadow-[0_0_6px_#38bdf8]" />
          </div>
          <div className="flex justify-between font-mono-code text-[10px] text-[#bdc8d1]">
            <span>Sync 99.98%</span>
            <span>2.4 GHz</span>
          </div>
        </div>

        {/* Commander Vance User Tag */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#38bdf8] flex items-center justify-center text-[#00354a] shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono-code text-[11px] text-[#dde2f3] font-bold leading-tight">
                CMDR. VANCE
              </span>
              <span className="font-mono-code text-[9px] text-[#bdc8d1]">
                SYS-ADM // LEVEL 5
              </span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="text-[#bdc8d1] hover:text-[#38bdf8] transition-colors p-1"
            title="Telemetry Console Settings"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
