/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { ViewTab } from './types';
import { CELESTIAL_BODIES } from './data/celestialData';
import LeftSidebar from './components/LeftSidebar';
import TopHeader from './components/TopHeader';
import OrreryScene from './components/OrreryScene';
import DossierPanel from './components/DossierPanel';
import LeftFloatingHUD from './components/LeftFloatingHUD';
import BottomFloatingToolbar from './components/BottomFloatingToolbar';
import BodyTelemetryView from './components/BodyTelemetryView';
import FlightTrajectoriesView from './components/FlightTrajectoriesView';
import SpectrometryView from './components/SpectrometryView';
import OrbitalEventsView from './components/OrbitalEventsView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('orrery');
  const [selectedTarget, setSelectedTarget] = useState<string>('earth');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true);
  const [showKuiper, setShowKuiper] = useState<boolean>(true);
  const [showProbes, setShowProbes] = useState<boolean>(true);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<number>(1.3);
  const [isCinematic, setIsCinematic] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hoverTarget, setHoverTarget] = useState<{
    name: string;
    dist: string;
    x: number;
    y: number;
  } | null>(null);

  const currentBody = CELESTIAL_BODIES[selectedTarget] || CELESTIAL_BODIES['earth'];

  const handleSelectTarget = useCallback((id: string) => {
    let normalized = id.toLowerCase().replace(/_/g, '-');
    if (normalized.includes('voyager-1') || normalized.includes('voyager 1')) normalized = 'voyager-1';
    else if (normalized.includes('voyager-2') || normalized.includes('voyager 2')) normalized = 'voyager-2';
    else if (normalized.includes('new-horizons') || normalized.includes('new horizons')) normalized = 'new-horizons';

    if (CELESTIAL_BODIES[normalized]) {
      setSelectedTarget(normalized);
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    setSelectedTarget('sun');
  }, []);

  const handleCycleLighting = useCallback(() => {
    setLightIntensity((prev) => {
      if (prev === 1.3) return 2.4;
      if (prev === 2.4) return 0.6;
      return 1.3;
    });
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#0e131f] text-[#dde2f3] overflow-hidden select-none">
      {/* 1. Left Persistent Sidebar */}
      <LeftSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Content Stage */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        {/* Top Header */}
        <TopHeader
          selectedTarget={selectedTarget}
          onSelectTarget={handleSelectTarget}
          onResetCamera={handleResetCamera}
          onToggleCinematic={() => setIsCinematic((prev) => !prev)}
          isCinematic={isCinematic}
        />

        {/* Dynamic Tab Views */}
        <main className="flex-1 relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-[#080e1a]">
          {currentTab === 'orrery' && (
            <div className="relative w-full h-full flex overflow-hidden">
              {/* Center 3D Three.js Orrery Scene */}
              <div className="relative flex-1 h-full overflow-hidden bg-[#080e1a]">
                <OrreryScene
                  selectedId={selectedTarget}
                  onSelectTarget={handleSelectTarget}
                  speedMultiplier={speedMultiplier}
                  isPaused={isPaused}
                  showAsteroids={showAsteroids}
                  showKuiper={showKuiper}
                  showProbes={showProbes}
                  showOrbits={showOrbits}
                  showLabels={showLabels}
                  lightIntensity={lightIntensity}
                  isCinematic={isCinematic}
                  onResetCamera={handleResetCamera}
                  onHoverTarget={setHoverTarget}
                />

                {/* Celestial Raycast Hover Tooltip */}
                {hoverTarget && showLabels && (
                  <div
                    className="fixed pointer-events-none transition-opacity duration-150 transform -translate-x-1/2 -translate-y-12 bg-[#080e1a]/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-[#38bdf8]/40"
                    style={{ left: `${hoverTarget.x}px`, top: `${hoverTarget.y}px` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                    <div className="flex flex-col font-mono-code text-xs">
                      <span className="font-bold text-[#38bdf8] uppercase tracking-wider">
                        {hoverTarget.name}
                      </span>
                      {hoverTarget.dist && (
                        <span className="text-[10px] text-[#bdc8d1]">
                          {hoverTarget.dist}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Left Floating HUD BENTO STACK */}
                <LeftFloatingHUD
                  selectedTarget={selectedTarget}
                  onSelectTarget={handleSelectTarget}
                  speedMultiplier={speedMultiplier}
                  onChangeSpeed={setSpeedMultiplier}
                  isPaused={isPaused}
                  onTogglePlayPause={() => setIsPaused((p) => !p)}
                  onStepFrame={() => {
                    setIsPaused(true);
                  }}
                  isCinematic={isCinematic}
                  onToggleCinematic={() => setIsCinematic((c) => !c)}
                  onResetCamera={handleResetCamera}
                  showAsteroids={showAsteroids}
                  onToggleAsteroids={setShowAsteroids}
                  showKuiper={showKuiper}
                  onToggleKuiper={setShowKuiper}
                  showProbes={showProbes}
                  onToggleProbes={setShowProbes}
                />

                {/* Bottom Floating Status & Lighting Toolbar */}
                <BottomFloatingToolbar
                  showOrbits={showOrbits}
                  onToggleOrbits={() => setShowOrbits((o) => !o)}
                  showLabels={showLabels}
                  onToggleLabels={() => setShowLabels((l) => !l)}
                  lightIntensity={lightIntensity}
                  onCycleLighting={handleCycleLighting}
                />
              </div>

              {/* Right Scientific Dossier Panel */}
              <DossierPanel body={currentBody} />
            </div>
          )}

          {currentTab === 'telemetry' && (
            <BodyTelemetryView
              onSelectBody={handleSelectTarget}
              onSwitchToOrrery={() => setCurrentTab('orrery')}
            />
          )}

          {currentTab === 'trajectories' && (
            <FlightTrajectoriesView
              onSelectProbe={handleSelectTarget}
              onSwitchToOrrery={() => setCurrentTab('orrery')}
            />
          )}

          {currentTab === 'spectrometry' && <SpectrometryView />}

          {currentTab === 'events' && <OrbitalEventsView />}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
