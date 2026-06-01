import React from 'react';
import { ExoplanetConfig } from '../types';
import { PRESET_EXOPLANETS } from '../data';
import { Sparkles, SlidersHorizontal, Layers, Orbit } from 'lucide-react';

interface ExoplanetLaboratoryProps {
  config: ExoplanetConfig;
  onChangeConfig: (newConfig: ExoplanetConfig) => void;
}

export const ExoplanetLaboratory: React.FC<ExoplanetLaboratoryProps> = ({
  config,
  onChangeConfig,
}) => {
  const updateField = (field: keyof ExoplanetConfig, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  // Preset loaders
  const loadPreset = (preset: ExoplanetConfig) => {
    onChangeConfig({ ...preset });
  };

  return (
    <div className="hud-border p-4 rounded-lg flex flex-col justify-between" id="exoplanet-lab-panel">
      <div>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Exoplanet Generator Matrix
          </h3>
          <span className="text-[10px] font-mono text-cyber-cyan font-bold uppercase">
            VERSION 1.10
          </span>
        </div>

        {/* Presets Quick Grid */}
        <div className="mb-4">
          <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-2 font-bold">
            TELESCOPICAL DISCOVERY TEMPLATES
          </label>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
            {PRESET_EXOPLANETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className={`py-1.5 px-1 border rounded text-center transition-all truncate hover:bg-white/5 ${
                  config.name === preset.name
                    ? 'bg-white/10 text-[#00F0FF] border-[#00F0FF]/30 font-semibold shadow-[0_0_8px_rgba(0,240,255,0.15)]'
                    : 'bg-white/5 text-neutral-400 border-white/10'
                }`}
                title={`Load preset ${preset.name}`}
                id={`btn-preset-${index}`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders and Configurations */}
        <div className="space-y-3 font-mono text-xs">
          {/* Custom Name */}
          <div>
            <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
              PROVISIONAL CATALOG NAME
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00F0FF]/50 text-xs transition"
              placeholder="e.g. Kepler-22E"
              id="input-exoplanet-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Color Primary */}
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
                CRUST COLOR
              </label>
              <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded px-2 py-1">
                <input
                  type="color"
                  value={config.colorPrimary}
                  onChange={(e) => updateField('colorPrimary', e.target.value)}
                  className="w-5 h-5 border-0 rounded bg-transparent cursor-pointer"
                  id="color-primary-input"
                />
                <span className="text-[10px] text-neutral-350 uppercase font-mono">{config.colorPrimary}</span>
              </div>
            </div>

            {/* Color Secondary */}
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
                SOLUTE CLOUD TINT
              </label>
              <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded px-2 py-1">
                <input
                  type="color"
                  value={config.colorSecondary}
                  onChange={(e) => updateField('colorSecondary', e.target.value)}
                  className="w-5 h-5 border-0 rounded bg-transparent cursor-pointer"
                  id="color-secondary-input"
                />
                <span className="text-[10px] text-neutral-350 uppercase font-mono">{config.colorSecondary}</span>
              </div>
            </div>
          </div>

          {/* Size Multiplier Slider */}
          <div>
            <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase mb-1">
              <span>PLANETARY RADIUS SCALE</span>
              <span className="text-cyber-cyan">{config.size}x Earth</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={config.size}
              onChange={(e) => updateField('size', parseFloat(e.target.value))}
              className="w-full accent-[#00F0FF] bg-white/10 cursor-pointer h-1 rounded-sm"
              id="range-exoplanet-size"
            />
          </div>

          {/* Atmosphere Density */}
          <div>
            <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase mb-1">
              <span>ATMOSPHERE DENSITY (ENVELOPE)</span>
              <span className="text-cyber-cyan">{Math.round(config.atmosphereDensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.02"
              value={config.atmosphereDensity}
              onChange={(e) => updateField('atmosphereDensity', parseFloat(e.target.value))}
              className="w-full accent-[#00F0FF] bg-white/10 cursor-pointer h-1 rounded-sm"
              id="range-exoplanet-atmosphere"
            />
          </div>

          {/* Rotation speed */}
          <div>
            <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase mb-1">
              <span>DIURNAL SPIN RATE</span>
              <span className="text-cyber-cyan">{config.rotationSpeed}x Speed</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.5"
              step="0.1"
              value={config.rotationSpeed}
              onChange={(e) => updateField('rotationSpeed', parseFloat(e.target.value))}
              className="w-full accent-[#00F0FF] bg-white/10 cursor-pointer h-1 rounded-sm"
              id="range-exoplanet-rotation"
            />
          </div>

          <div className="grid grid-cols-2 gap-2" id="exoplanet-dropdowns">
            {/* Ring system style */}
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
                RING SYSTEMS
              </label>
              <select
                value={config.ringStyle}
                onChange={(e) => updateField('ringStyle', e.target.value)}
                className="w-full bg-[#0a0a0ae0] border border-white/10 rounded px-2 py-1.5 text-white text-[11px] focus:outline-none focus:border-[#00F0FF]/50 transition"
                id="select-exoplanet-rings"
              >
                <option value="none" className="bg-[#121212]">No Rings</option>
                <option value="thin" className="bg-[#121212]">Thin Dust Plane</option>
                <option value="dense" className="bg-[#121212]">Dense Asteroid Field</option>
              </select>
            </div>

            {/* Star type heating index */}
            <div>
              <label className="text-[9px] text-neutral-500 uppercase tracking-wider block mb-1">
                ANCHOR STAR SYSTEM
              </label>
              <select
                value={config.starType}
                onChange={(e) => updateField('starType', e.target.value)}
                className="w-full bg-[#0a0a0ae0] border border-white/10 rounded px-2 py-1.5 text-white text-[11px] focus:outline-none focus:border-[#00F0FF]/50 transition"
                id="select-exoplanet-star"
              >
                <option value="m-class" className="bg-[#121212]">M-Class Red Dwarf</option>
                <option value="g-class" className="bg-[#121212]">G-Class Yellow (Earth-like)</option>
                <option value="o-class" className="bg-[#121212]">O-Class Blue Supergiant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Core dynamic telemetry footer summary */}
      <div className="bg-white/5 border border-white/5 p-2.5 rounded font-mono text-[9px] text-neutral-400 mt-4 flex gap-1.5 items-start">
        <SlidersHorizontal className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />
        <p className="leading-snug">
          Exoplanet algorithms calculate custom liquid metal mantles, atmospheric density filters, and asteroid collision planes procedurally in WebGL.
        </p>
      </div>
    </div>
  );
};
