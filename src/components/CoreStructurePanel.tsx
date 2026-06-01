import React, { useState } from 'react';
import { CelestialBody } from '../types';
import { Circle, Info, HelpCircle } from 'lucide-react';

interface CoreStructurePanelProps {
  planet: CelestialBody;
}

export const CoreStructurePanel: React.FC<CoreStructurePanelProps> = ({ planet }) => {
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(0);

  return (
    <div className="hud-border p-4 rounded-lg flex flex-col justify-between" id="core-structure-container">
      <div>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyber-cyan" />
            Geophysical Core Profile
          </h3>
          <span className="text-[10px] font-mono p-1 bg-white/5 border border-white/10 rounded text-cyber-cyan font-bold">
            {planet.coreStructure.length} LAYERS FOUND
          </span>
        </div>

        <p className="text-xs text-neutral-400 font-mono mb-4 leading-relaxed">
          Interactive interior slice. Click details below to match the simulated nested geometric core depths inside the 3D visualization.
        </p>

        {/* List of custom physical layers */}
        <div className="space-y-2 mb-4" id="geophysics-layers-menu">
          {planet.coreStructure.map((layer, index) => {
            const isSelected = activeLayerIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveLayerIndex(index)}
                className={`w-full text-left p-3 rounded-md border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-white/10 border-[#00F0FF]/40 text-white shadow-md shadow-black'
                    : 'bg-[#0a0a0ae0] border-white/5 text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                id={`btn-layer-${index}`}
              >
                {/* Colored Core Bullet point */}
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-black/30 mt-1 shadow-inner animate-pulse"
                  style={{ backgroundColor: layer.color }}
                />
                <div className="grow font-mono text-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold tracking-wide uppercase text-white">{layer.name}</span>
                    <span className="text-[9px] px-1 bg-white/5 border border-white/10 rounded text-cyber-cyan font-medium">
                      THICK: {layer.thickness}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mb-1 flex items-center gap-1">
                    <span className="text-white/40">Chemical formulation:</span>
                    <span className="text-neutral-200 font-medium">{layer.composition}</span>
                  </div>
                  
                  {/* Expanded layer insight text if configured */}
                  {isSelected && (
                    <p className="mt-2 text-[11px] text-neutral-300 leading-relaxed border-t border-white/10 pt-2 font-light">
                      {layer.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Physics Core dynamic telemetry footer summary */}
      <div className="bg-white/5 border border-white/5 p-2.5 rounded font-mono text-[9px] text-neutral-400 flex gap-1.5 items-start">
        <HelpCircle className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />
        <p className="leading-snug">
          Telemetry calibrated via planetary seismic shear waves velocity curves and high-pressure mineral physics modeling algorithms.
        </p>
      </div>
    </div>
  );
};
