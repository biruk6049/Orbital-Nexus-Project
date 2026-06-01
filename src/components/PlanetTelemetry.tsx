import React from 'react';
import { CelestialBody } from '../types';
import { Compass, Thermometer, Wind, Orbit, CircleDot, Database, Milestone } from 'lucide-react';

interface PlanetTelemetryProps {
  planet: CelestialBody;
}

export const PlanetTelemetry: React.FC<PlanetTelemetryProps> = ({ planet }) => {
  // Comparative ratios against earth defaults
  const sizeRatioOfEarth = (planet.diameter / 12742).toFixed(2);
  const gravityRatioOfEarth = (planet.gravity / 9.81).toFixed(2);
  const orbitalVelocity = planet.orbitalPeriod ? Math.round(107200 / (planet.orbitalPeriod / 365.25)) : 0; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="telemetry-panel-grid">
      {/* Structural dimensions metric frame */}
      <div className="hud-border p-4 rounded-lg flex flex-col justify-between" id="metric-frame-physical">
        <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Celestial Telemetry
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-cyber-cyan">
            CLASS: {planet.type === 'rocky' ? 'TERRESTRIAL' : 'JOVIAN'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
          <div className="p-2 bg-white/5 border border-white/5 rounded">
            <div className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Equatorial Diameter</div>
            <div className="text-sm font-semibold tracking-tight text-white mb-1">
              {planet.diameter.toLocaleString()} km
            </div>
            <div className="text-[10px] text-cyber-cyan font-light">
              {sizeRatioOfEarth}x Earth Size
            </div>
          </div>

          <div className="p-2 bg-white/5 border border-white/5 rounded">
            <div className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Surface Gravity</div>
            <div className="text-sm font-semibold tracking-tight text-white mb-1">
              {planet.gravity} m/s²
            </div>
            <div className="text-[10px] text-cyber-cyan font-light">
              {gravityRatioOfEarth}x Earth gravity
            </div>
          </div>

          <div className="p-2 bg-white/5 border border-white/5 rounded">
            <div className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Revolution Period</div>
            <div className="text-sm font-semibold tracking-tight text-white mb-1">
              {planet.orbitalPeriod} days
            </div>
            <div className="text-[10px] text-cyber-cyan font-light">
              {(planet.orbitalPeriod / 365).toFixed(2)} Earth Years
            </div>
          </div>

          <div className="p-2 bg-white/5 border border-white/5 rounded">
            <div className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Rotation Speed</div>
            <div className="text-sm font-semibold tracking-tight text-white mb-1">
              {Math.abs(planet.rotationPeriod)} hrs
            </div>
            <div className="text-[10px] text-cyber-cyan font-light">
              {planet.rotationPeriod < 0 ? 'Retrograde motion' : 'Prograde motion'}
            </div>
          </div>
        </div>

        {/* Dynamic Relative Gravity Visual slider */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded">
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1.5">
            <span>COMPARATIVE MASS RATIO</span>
            <span className="text-cyber-cyan">{sizeRatioOfEarth} : 1.00 (EARTH)</span>
          </div>
          <div className="w-full bg-[#050505] h-1.5 rounded-full overflow-hidden border border-white/5 flex">
            <div
              className="bg-cyber-cyan h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00F0FF]"
              style={{ width: `${Math.min(100, Math.max(8, Number(sizeRatioOfEarth) * 35))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Atmospheric spectrum & thermal envelope card */}
      <div className="hud-border p-4 rounded-lg flex flex-col justify-between" id="metric-frame-atmosphere">
        <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-cyber-cyan" />
            Atmospheric Envelope
          </h3>
          <span className="text-[10px] font-mono text-neutral-500 uppercase">
            SPECTRUM PROFILE
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-2.5 rounded mb-3">
          <div className="p-1 rounded bg-white/10">
            <Thermometer className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="grow">
            <div className="text-[9px] font-mono text-white/40 uppercase">Thermal Spectrum Bounds</div>
            <div className="text-xs font-mono font-semibold text-white tracking-tight">
              {planet.temperature}
            </div>
          </div>
        </div>

        {/* Chemical gaseous concentrations display */}
        <div className="grow mb-3">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CircleDot className="w-2.5 h-2.5 text-cyber-cyan" />
            Major Atmospheric Compounds
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {planet.atmosphere.length > 0 ? (
              planet.atmosphere.map((gas, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-200 rounded hover:border-[#00F0FF]/30 transition"
                >
                  {gas}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-mono text-neutral-500 italic">
                None (True vacuum atmosphere)
              </span>
            )}
          </div>
        </div>

        {/* Dynamic educational explanation box */}
        <div className="text-[10px] font-mono text-neutral-300 bg-white/5 p-2 rounded border border-white/5 flex gap-2">
          <Database className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {planet.funFact}
          </p>
        </div>
      </div>
    </div>
  );
};
