import React, { useState, useEffect } from 'react';
import { TourStop } from '../types';
import { GUIDED_TOURS } from '../data';
import { Play, Pause, ChevronRight, ChevronLeft, Award, HelpCircle } from 'lucide-react';

interface GuidedTourConsoleProps {
  currentTourStop: TourStop | null;
  onSetTourStop: (stop: TourStop | null) => void;
}

export const GuidedTourConsole: React.FC<GuidedTourConsoleProps> = ({
  currentTourStop,
  onSetTourStop,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Sync index if external change occurred
  useEffect(() => {
    if (currentTourStop === null) {
      setCurrentIndex(-1);
      setIsPlaying(false);
    } else {
      const idx = GUIDED_TOURS.findIndex((stop) => stop.id === currentTourStop.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [currentTourStop]);

  // Handle tour stop forward/backward
  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % GUIDED_TOURS.length;
    setCurrentIndex(nextIdx);
    onSetTourStop(GUIDED_TOURS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = currentIndex <= 0 ? GUIDED_TOURS.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIdx);
    onSetTourStop(GUIDED_TOURS[prevIdx]);
  };

  // Autoplay loop timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      handleNext();
    }, 8500); // 8.5 seconds per tour destination

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    // Start from first stop if inactive
    if (!isPlaying && currentIndex === -1) {
      setCurrentIndex(0);
      onSetTourStop(GUIDED_TOURS[0]);
    }
  };

  return (
    <div className="hud-border p-4 rounded-lg flex flex-col justify-between" id="guided-tour-con">
      <div>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Solar Guided Tours
          </h3>
          <span className="text-[10px] font-mono p-1 bg-white/5 border border-white/10 rounded text-cyber-cyan uppercase font-bold">
            {currentIndex + 1} / {GUIDED_TOURS.length} Destination
          </span>
        </div>

        {currentIndex === -1 ? (
          <div className="text-center py-6 font-mono text-xs" id="tour-welcome-state">
            <p className="text-neutral-400 mb-4 font-light">
              Unlock a cinematic orbit simulation with scientific telemetry overlays.
            </p>
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded hover:bg-[#00D0EE] transition-all text-xs tracking-wider uppercase inline-flex items-center gap-1.5 shadow-[0_0_12px_#00F0FF]"
              id="btn-start-cinematic-tour"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Launch Cinematic Tour
            </button>
          </div>
        ) : (
          <div className="space-y-3 font-mono" id="tour-active-state">
            {/* Active destination title */}
            <div className="p-2 border border-white/10 bg-white/5 rounded flex items-center justify-between">
              <div>
                <span className="text-[9px] text-white/40 block uppercase font-bold tracking-wider">CURRENT ANCHOR POINT</span>
                <span className="text-sm font-semibold text-white tracking-tight">
                  {GUIDED_TOURS[currentIndex].title}
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-neutral-950 border border-white/10 text-cyber-cyan font-bold tracking-widest uppercase">
                {GUIDED_TOURS[currentIndex].planetId}
              </span>
            </div>

            {/* active narrative text */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-md min-h-[90px] flex items-start gap-1">
              <p className="text-xs text-neutral-200 leading-relaxed font-light">
                {GUIDED_TOURS[currentIndex].commentary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {currentIndex !== -1 && (
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 gap-2 font-mono">
          <div className="flex gap-1.5">
            <button
              onClick={handlePrev}
              className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/15 text-neutral-400 hover:text-white transition"
              title="Previous Telemetry Destination"
              id="btn-tour-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/15 text-neutral-400 hover:text-white transition"
              title="Next Telemetry Destination"
              id="btn-tour-next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
              isPlaying
                ? 'bg-white text-black hover:bg-neutral-100 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
            id="btn-tour-play-pause"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-black text-black" />
                <span>PAUSE PLAYBACK</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white text-white" />
                <span>RESUME TOURING</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onSetTourStop(null);
            }}
            className="text-[10px] text-neutral-400 hover:text-white underline font-semibold uppercase"
            id="btn-exit-tour"
          >
            EXIT
          </button>
        </div>
      )}
    </div>
  );
};
