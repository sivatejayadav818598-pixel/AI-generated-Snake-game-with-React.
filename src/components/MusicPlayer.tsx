import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { GlitchText } from './GlitchText';

const TRACKS = [
  { id: '0x01', title: "SYNTHETIC_SORROW.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: '0x02', title: "NEURAL_DECAY.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: '0x03', title: "VOID_ECHO.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  return (
    <div className="neon-border-magenta p-4 bg-black/80 flex flex-col gap-4 w-full max-w-md relative z-10">
      <div className="flex justify-between items-center border-b border-magenta pb-2">
        <GlitchText text="AUDIO_SUBSYSTEM" className="text-magenta text-xl" />
        <span className="text-xs animate-pulse text-magenta">STATUS: {isPlaying ? 'ACTIVE' : 'STANDBY'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-cyan/70">CURRENT_TRACK:</span>
        <div className="text-lg text-cyan truncate">
          {TRACKS[currentTrack].id} // {TRACKS[currentTrack].title}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={nextTrack}
        className="hidden"
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4">
          <button onClick={prevTrack} className="hover:text-magenta transition-colors focus:outline-none cursor-pointer">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlay} className="hover:text-magenta transition-colors focus:outline-none cursor-pointer">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={nextTrack} className="hover:text-magenta transition-colors focus:outline-none cursor-pointer">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-magenta focus:outline-none cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-magenta cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
