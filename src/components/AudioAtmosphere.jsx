import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const nodesRef = useRef([]);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Harmonic warm drone (Warm Sitar/Tanpura resonance at 146.8Hz - D3 & 220Hz - A3)
    const freqs = [146.83, 220.0, 293.66, 440.0];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Gentle slow LFO modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.035 / (idx + 1), ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      nodesRef.current.push(osc, oscGain, lfo, lfoGain);
    });

    // Soft simmer & warm room acoustic bed (lowpass filtered noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.04;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start();

    nodesRef.current.push(whiteNoise, filter, noiseGain);
  };

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!isPlaying) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume * 0.5,
        audioCtxRef.current.currentTime + 1.8
      );
      setIsPlaying(true);
    } else {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.2);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="nav-icon-btn"
      title={isPlaying ? 'Mute Dining Room Ambience' : 'Play Dining Room Ambience (Acoustic Tanpura & Room Tone)'}
      aria-label="Toggle dining room acoustic atmosphere"
    >
      {isPlaying ? (
        <div className="flex items-end justify-center gap-[2.5px] h-3.5 w-3.5" style={{ display: 'inline-flex' }}>
          <span className="w-[2px] bg-[var(--brass-400)] animate-pulse h-full" />
          <span className="w-[2px] bg-[var(--brass-300)] animate-pulse h-2.5" style={{ animationDelay: '0.2s' }} />
          <span className="w-[2px] bg-[var(--brass-500)] animate-pulse h-3" style={{ animationDelay: '0.4s' }} />
        </div>
      ) : (
        <VolumeX className="w-4 h-4 text-[var(--brass-300)]" />
      )}
    </button>
  );
}
