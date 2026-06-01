/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CelestialBody, ExoplanetConfig, TourStop } from './types';
import { SOLAR_SYSTEM, GUIDED_TOURS, PRESET_EXOPLANETS } from './data';
import { PlanetCanvas } from './components/PlanetCanvas';
import { PlanetTelemetry } from './components/PlanetTelemetry';
import { CoreStructurePanel } from './components/CoreStructurePanel';
import { GuidedTourConsole } from './components/GuidedTourConsole';
import { ExoplanetLaboratory } from './components/ExoplanetLaboratory';
import {
  Compass,
  Cpu,
  Tv,
  Milestone,
  Layers,
  CircleDot,
  Radio,
  Calendar,
  Layers3,
  Flame,
  Binary,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [viewMode, setViewMode] = useState<'solar_system' | 'single_planet'>('single_planet');
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialBody>(SOLAR_SYSTEM[2]); // Default Earth
  const [isExoplanetMode, setIsExoplanetMode] = useState<boolean>(false);
  const [exoplanetConfig, setExoplanetConfig] = useState<ExoplanetConfig>(PRESET_EXOPLANETS[0]);
  
  // Custom Controls State
  const [crossSectionMode, setCrossSectionMode] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeTourStop, setActiveTourStop] = useState<TourStop | null>(null);
  
  // Tabs State (Main interactive side drawer)
  const [activeTab, setActiveTab] = useState<'telemetry' | 'guided_tours' | 'exoplanet_lab'>('telemetry');

  // Real-time UTC simulation clock
  const [systemTime, setSystemTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // System status logs block (updating telemetry values dynamically for hyper-fidelity feel)
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'SYS: Orbital Nexus III diagnostic complete.',
    'LINK: WebGL dynamic renderer initialized.',
    'ESTIMATION: Spatial vector grid aligned to 0.00°.'
  ]);

  const addSystemLog = (log: string) => {
    setSystemLogs((prev) => [
      `SYS: ${log}`,
      ...prev.slice(0, 3)
    ]);
  };

  // Synchronize tabs if Guided Tours overrides the selected planetary body
  useEffect(() => {
    if (activeTourStop) {
      if (activeTourStop.planetId === 'system') {
        setViewMode('solar_system');
      } else {
        const matchingBody = SOLAR_SYSTEM.find((b) => b.id === activeTourStop.planetId);
        if (matchingBody) {
          setViewMode('single_planet');
          setIsExoplanetMode(false);
          setSelectedPlanet(matchingBody);
        }
      }
      addSystemLog(`Autonavigated camera orientation to ${activeTourStop.title}.`);
    }
  }, [activeTourStop]);

  // Synchronize planet selection
  const selectPlanetHandler = (planet: CelestialBody) => {
    setSelectedPlanet(planet);
    setIsExoplanetMode(false);
    setViewMode('single_planet');
    addSystemLog(`Coordinate focus locked on planet: ${planet.name}.`);
  };

  // Activate exoplanet lab mode helper
  const activateExoplanetLab = () => {
    setIsExoplanetMode(true);
    setViewMode('single_planet');
    setActiveTab('exoplanet_lab');
    setCrossSectionMode(false);
    addSystemLog(`Procedural sandbox loaded for exoplanet ${exoplanetConfig.name}.`);
  };

  return (
    <div className="relative z-0 min-h-screen text-neutral-200 font-sans selection:bg-[#00F0FF]/30 selection:text-white pb-8 bg-[#050505]" id="app-viewport">
      {/* Sophisticated Dark background lines grid */}
      <div className="grid-bg" />

      {/* 1. Sleek Technical Google font header and status grid lines */}
      <header className="border-b border-white/10 bg-[#050505b0] backdrop-blur-md sticky top-0 z-40 py-3.5 px-4 md:px-8 select-none" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00F0FF]"></span>
                <span className="text-sm font-mono font-bold tracking-widest text-white">ORBITAL NEXUS <span className="text-cyber-cyan font-light">3D</span></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                ASTROPHYSICAL GEOPHYSICS DATA ENGINE
              </span>
            </div>
          </div>

          {/* Centered navigation controller indicators */}
          <div className="flex rounded-md border border-white/10 bg-[#0a0a0af0] p-1 font-mono text-xs overflow-hidden">
            <button
              onClick={() => {
                setViewMode('solar_system');
                setIsExoplanetMode(false);
                addSystemLog('Switched projection array to Solar System Map view.');
              }}
              className={`px-3 py-1.5 rounded transition cursor-pointer ${
                viewMode === 'solar_system' && !isExoplanetMode
                  ? 'bg-white/10 text-cyber-cyan font-semibold border border-white/5'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              id="tab-btn-solar-map"
            >
              SOLAR SYSTEM MAP
            </button>
            <button
              onClick={() => {
                setViewMode('single_planet');
                addSystemLog(`Focused camera matrix on localized target ${selectedPlanet.name}.`);
              }}
              className={`px-3 py-1.5 rounded transition cursor-pointer ${
                viewMode === 'single_planet'
                  ? 'bg-white/10 text-cyber-cyan font-semibold border border-white/5'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              id="tab-btn-celestial-viewer"
            >
              CELESTIAL VIEWER
            </button>
          </div>

          {/* Astronomical clock metrics */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-mono border-l border-white/10 pl-6 text-neutral-400">
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[9px]">UTC TIMESTAMP</span>
              <span className="text-white">{systemTime.toISOString().replace('T', ' ').substring(0, 19)}</span>
            </div>
            <div>
              <span className="text-neutral-500 block uppercase font-bold text-[9px]">ENGINE LATENCY</span>
              <span className="flex items-center gap-1 text-cyber-cyan font-medium">
                <span className="w-1.5 h-1.5 rounded bg-cyber-cyan animate-pulse shadow-[0_0_6px_#00F0FF]"></span>
                0.86 MS (ONLINE)
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main interactive layout framework */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-container">
        
        {/* LEFT COLUMN: Monochrome target list selection (3 units wide) */}
        <div className="lg:col-span-3 flex flex-col gap-4" id="left-sidebar">
          
          {/* Celestial search/selection list */}
          <div className="hud-border rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#00F0FF] uppercase mb-3 flex items-center justify-between">
                <span>Celestial Anchors</span>
                <span className="text-[10px] text-neutral-500">SOLAR_SYS</span>
              </h2>

              <div className="space-y-1.5" id="planets-selector-menu">
                {SOLAR_SYSTEM.map((body) => {
                  const isSelected = selectedPlanet.id === body.id && !isExoplanetMode;
                  return (
                    <button
                      key={body.id}
                      onClick={() => selectPlanetHandler(body)}
                      className={`w-full text-left p-2.5 rounded border font-mono transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 text-white border-[#00F0FF]/35 shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                          : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/15 hover:text-white'
                      }`}
                      id={`planet-btn-${body.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-md"
                          style={{ backgroundColor: body.color }}
                        />
                        <span className="text-xs font-semibold tracking-wider">{body.name}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        {body.diameter.toLocaleString()} km
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom procedural Exoplanet laboratory button */}
            <div className="border-t border-white/10 mt-4 pt-4">
              <button
                onClick={activateExoplanetLab}
                className={`w-full py-2 px-3 rounded border font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isExoplanetMode
                    ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-[0_0_12px_#00F0FF]'
                    : 'bg-white/5 text-emerald-400 border-[#10b981]/25 hover:bg-white/10'
                }`}
                id="btn-goto-exoplanet"
              >
                <Cpu className={`w-3.5 h-3.5 ${isExoplanetMode ? 'text-black' : 'text-emerald-400 animate-pulse'}`} />
                <span>EXOPLANET LABORATORY</span>
              </button>
            </div>
          </div>

          {/* Real-time system log feed terminal for hyper science look */}
          <div className="hud-border rounded-lg p-3 font-mono text-[10px] space-y-1 text-neutral-500">
            <span className="text-[#00F0FF] font-bold block uppercase border-b border-white/5 pb-1 mb-2 tracking-widest text-[9px]">
              SOLAR VECTOR MONITOR
            </span>
            {systemLogs.map((log, listIndex) => (
              <p key={listIndex} className="truncate">
                {log}
              </p>
            ))}
          </div>

        </div>

        {/* CENTER COLUMN: The WebGL 3D planet canvas renderer (6 units wide) */}
        <div className="lg:col-span-6 flex flex-col gap-4" id="main-content-column">
          
          {/* Main 3D WebGL Arena */}
          <div className="h-[480px] w-full" id="viewport-canvas-wrapper">
            <PlanetCanvas
              selectedPlanet={selectedPlanet}
              selectedExoplanet={exoplanetConfig}
              isExoplanetMode={isExoplanetMode}
              crossSectionMode={crossSectionMode}
              viewMode={viewMode}
              speedMultiplier={speedMultiplier}
              activeTourStop={activeTourStop}
              onSelectPlanet={selectPlanetHandler}
            />
          </div>

          {/* Quick adjustment control cluster below the canvas */}
          <div className="hud-border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-center select-none" id="control-cluster-bar">
            
            <div className="flex flex-col gap-1.5 w-full md:w-auto">
              {/* Slicing Cross section trigger */}
              <button
                onClick={() => {
                  setCrossSectionMode(prev => !prev);
                  addSystemLog(`Toggled interior core slicing mode to: ${!crossSectionMode ? 'ACTIVE' : 'INACTIVE'}`);
                }}
                disabled={viewMode === 'solar_system'}
                className={`py-2 px-4 rounded border font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  viewMode === 'solar_system'
                    ? 'opacity-30 cursor-not-allowed border-white/5 text-neutral-600'
                    : crossSectionMode
                      ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-[0_0_10px_#00F0FF]'
                      : 'bg-white/5 text-neutral-300 border-white/10 hover:text-white hover:bg-white/10'
                }`}
                title="Toggles interior wireframe cross section to expose mantle and core layers"
                id="btn-slice-toggle"
              >
                <Layers3 className="w-4 h-4" />
                <span>{crossSectionMode ? 'SOLID OUTER CRUST' : 'SLICE INTERIOR CORE'}</span>
              </button>
            </div>

            {/* Orbit Simulation speed multipliers */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end font-mono text-xs">
              <span className="text-neutral-500 uppercase text-[10px]">REVOLUTION RATE:</span>
              <div className="flex rounded border border-white/10 overflow-hidden bg-[#0a0a0af0]">
                {[1, 2, 5, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSpeedMultiplier(m);
                      addSystemLog(`Simulated timeline acceleration rate adjusted to ${m}x.`);
                    }}
                    className={`px-2.5 py-1.5 text-[11px] border-r border-white/10 last:border-0 cursor-pointer ${
                      speedMultiplier === m
                        ? 'bg-white/15 text-[#00F0FF] font-bold'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                    id={`btn-speed-${m}`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Tab-controlled information console (3 units wide) */}
        <div className="lg:col-span-3 flex flex-col gap-4" id="right-sidebar">
          
          {/* Tab buttons to select interactive mode */}
          <div className="flex border border-white/10 bg-[#0a0a0af0] rounded-t-lg p-1 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('telemetry');
                setIsExoplanetMode(false);
              }}
              className={`flex-1 text-center py-2 rounded transition-all cursor-pointer ${
                activeTab === 'telemetry' && !isExoplanetMode
                  ? 'bg-white/10 text-cyber-cyan font-bold shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                  : 'text-neutral-500 hover:text-neutral-350'
              }`}
              id="tab-btn-telemetry"
            >
              DATA
            </button>
            <button
              onClick={() => setActiveTab('guided_tours')}
              className={`flex-1 text-center py-2 rounded transition-all cursor-pointer ${
                activeTab === 'guided_tours'
                  ? 'bg-white/10 text-cyber-cyan font-bold shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                  : 'text-neutral-500 hover:text-neutral-350'
              }`}
              id="tab-btn-tours"
            >
              TOURS
            </button>
            <button
              onClick={activateExoplanetLab}
              className={`flex-1 text-center py-2 rounded transition-all cursor-pointer ${
                activeTab === 'exoplanet_lab' || isExoplanetMode
                  ? 'bg-white/10 text-cyber-cyan font-bold shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                  : 'text-neutral-500 hover:text-neutral-350'
              }`}
              id="tab-btn-lab"
            >
              LAB
            </button>
          </div>

          {/* Contextual control sidebar container */}
          <div id="side-contextual-scaffold">
            <AnimatePresence mode="wait">
              {activeTab === 'exoplanet_lab' || isExoplanetMode ? (
                <motion.div
                  key="exoplanet_lab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  <ExoplanetLaboratory config={exoplanetConfig} onChangeConfig={setExoplanetConfig} />
                </motion.div>
              ) : activeTab === 'guided_tours' ? (
                <motion.div
                  key="guided_tours"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  <GuidedTourConsole currentTourStop={activeTourStop} onSetTourStop={setActiveTourStop} />
                </motion.div>
              ) : (
                <motion.div
                  key="telemetry_overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Planetary detailed description card */}
                  <div className="hud-border p-4 rounded-lg font-mono">
                    <span className="text-[9px] text-cyber-cyan uppercase block tracking-wider font-bold">
                      CELESTIAL PROFILE
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight mt-0.5 mb-2.5">
                      {selectedPlanet.name}
                    </h2>
                    <p className="text-xs text-neutral-350 leading-relaxed font-light">
                      {selectedPlanet.description}
                    </p>
                  </div>

                  {/* Geophysics sub-controller layered list */}
                  <CoreStructurePanel planet={selectedPlanet} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* 3. Global Comparative grid dashboard for Space Enthusiasts and Educators (Full width 12 units wide) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 border-t border-white/10 pt-8" id="comparative-dashboard">
        <h2 className="text-xs font-mono font-bold tracking-widest text-[#00F0FF] uppercase mb-4 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
          SYSTEM COMPARATIVE TELEMETRY MATRIX
        </h2>

        {/* Dynamic comparison cards or full dataset matrix */}
        <div className="hud-border rounded-lg overflow-x-auto" id="comparative-table-scroller">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] text-neutral-400 uppercase tracking-wider">
                <th className="p-3.5">TARGET CELESTIAL</th>
                <th className="p-3.5">SIZE (EQUAT. DIA)</th>
                <th className="p-3.5">ORBIT BOUNDARY (AU)</th>
                <th className="p-3.5">YEAR CYCLE</th>
                <th className="p-3.5">GRAVITY RATIO</th>
                <th className="p-3.5">TEMPERATURE RATIO</th>
                <th className="p-3.5">CORE LAYERS TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {SOLAR_SYSTEM.map((body) => {
                const isFocused = body.id === selectedPlanet.id && !isExoplanetMode;
                return (
                  <tr
                    key={body.id}
                    onClick={() => selectPlanetHandler(body)}
                    className={`cursor-pointer hover:bg-white/5 transition-all ${
                      isFocused ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold tracking-wide flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full border border-black/45 shadow-sm"
                        style={{ backgroundColor: body.color }}
                      />
                      {body.name}
                      {isFocused && (
                        <span className="text-[8px] bg-[#00F0FF]/15 text-cyber-cyan border border-[#00F0FF]/25 px-1 rounded block font-bold">
                          ACTIVE SEARCH
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">{body.diameter.toLocaleString()} km</td>
                    <td className="p-3.5">{(body.distanceFromSun / 100).toFixed(2)} AU</td>
                    <td className="p-3.5">{body.orbitalPeriod} Earth Days</td>
                    <td className="p-3.5">{(body.gravity / 9.81).toFixed(2)} xg</td>
                    <td className="p-3.5 text-neutral-200">{body.temperature}</td>
                    <td className="p-3.5">
                      <div className="flex gap-1">
                        {body.coreStructure.map((c, idx) => (
                           <span
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Primary Details Panel overlay below context */}
      {!isExoplanetMode && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6" id="primary-details-panel">
          <PlanetTelemetry planet={selectedPlanet} />
        </section>
      )}

      {/* Tiny clean footer indicator strictly abiding by anti-ai-slop rules */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-12 border-t border-white/10 pt-6 text-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
        <span>Orbital Nexus Planetary Intelligence Systems // calibrated UTC-6 standard telemetry model</span>
      </footer>
    </div>
  );
}
