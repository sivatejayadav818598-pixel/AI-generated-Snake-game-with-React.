import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchText } from './components/GlitchText';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <div className="scanlines"></div>
      <div className="noise"></div>

      <header className="absolute top-6 left-6 z-20">
        <GlitchText text="OS.v9.4.2 // TERMINAL_ACTIVE" className="text-sm text-cyan/50" />
      </header>

      <main className="z-10 flex flex-col xl:flex-row items-center justify-center gap-12 w-full max-w-7xl">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        <div className="xl:w-96 w-full flex flex-col gap-8">
          <div className="border border-cyan/30 p-4 bg-black/50 backdrop-blur-md">
            <h2 className="text-cyan mb-2 border-b border-cyan/30 pb-1">SYSTEM_LOGS</h2>
            <ul className="text-xs text-cyan/70 space-y-1 font-mono">
              <li>&gt; UPLINK ESTABLISHED</li>
              <li>&gt; BIOMASS DETECTED</li>
              <li>&gt; AUDIO SUBSYSTEMS ONLINE</li>
              <li className="animate-pulse text-magenta">&gt; WARNING: ENTITY APPROACHING</li>
            </ul>
          </div>

          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
