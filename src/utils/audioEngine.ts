/**
 * Web Audio API Engine for SoundFlow
 * Generates rich synthetic musical loops matching the 5 album cover genres:
 * 1. Phonk (Heavy 808, cowbell melody, trap rhythm)
 * 2. Easy on Friday (Chill Lo-Fi rhodes chords, vinyl crackle, mellow bass)
 * 3. Housewerk (Punchy 4-on-the-floor kick, synth stab, acid groove)
 * 4. Old School Reggaeton (Dembow beat, synth lead, reggaeton rhythm)
 * 5. My Life is a Movie (Cinematic sunset synthwave, lush arpeggios)
 */

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverStyle: string;
  albumName: string;
  durationSeconds: number;
  bpm: number;
}

export const SOUNDFLOW_TRACKS: TrackInfo[] = [
  {
    id: 'phonk-1',
    title: 'Drift Mirage',
    artist: 'Kaito Ghost',
    genre: 'Phonk',
    albumName: 'PHONK VOLUME II',
    coverStyle: 'from-purple-800 to-indigo-950',
    durationSeconds: 154,
    bpm: 135
  },
  {
    id: 'friday-2',
    title: 'Warm Sunlight & Coffee',
    artist: 'The Weekend Session',
    genre: 'Chill / Lo-Fi',
    albumName: 'easy on FRIDAY',
    coverStyle: 'bg-[#f3efe6] text-black',
    durationSeconds: 198,
    bpm: 85
  },
  {
    id: 'housewerk-3',
    title: 'Club Paradigm',
    artist: 'Neon Maze',
    genre: 'House / Electronic',
    albumName: 'HOUSEWERK',
    coverStyle: 'bg-[#C2F738] text-black',
    durationSeconds: 215,
    bpm: 126
  },
  {
    id: 'reggaeton-4',
    title: 'Noche de Gasolina',
    artist: 'El Ritmo 99',
    genre: 'Classic Reggaeton',
    albumName: 'OLD SCHOOL REGGAETON',
    coverStyle: 'from-amber-400 via-rose-500 to-indigo-600',
    durationSeconds: 182,
    bpm: 96
  },
  {
    id: 'sunset-5',
    title: 'Neon Horizon at Dusk',
    artist: 'Aura Cinematics',
    genre: 'Synthwave / Ambient',
    albumName: 'my life is a movie',
    coverStyle: 'from-pink-600 to-violet-800',
    durationSeconds: 240,
    bpm: 110
  }
];

class SoundFlowAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private isHiFi: boolean = true;
  private filterNode: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private onTrackEndCallback?: () => void;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = this.isHiFi ? 22000 : 8000; // Standard vs HiFi audio simulation

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;

      this.filterNode.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setHiFiMode(enabled: boolean) {
    this.isHiFi = enabled;
    if (this.filterNode && this.ctx) {
      this.filterNode.frequency.setTargetAtTime(
        enabled ? 22000 : 6500,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public playTrack(trackId: string, onEnd?: () => void) {
    this.initContext();
    if (!this.ctx) return;

    this.stop();
    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.onTrackEndCallback = onEnd;

    const track = SOUNDFLOW_TRACKS.find(t => t.id === trackId) || SOUNDFLOW_TRACKS[0];
    const beatInterval = 60 / track.bpm;
    let step = 0;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Generate genre-specific beats and tones
      if (track.genre === 'Phonk') {
        // Heavy 808 kick on beats 0, 2
        if (step % 4 === 0) this.playKick(now, 55, 0.4);
        // Snare on beat 2, 6
        if (step % 4 === 2) this.playSnare(now, 0.2);
        // Cowbell syncopated melody
        const cowbellNotes = [587.33, 659.25, 783.99, 880.00, 587.33, 783.99];
        const note = cowbellNotes[step % cowbellNotes.length];
        this.playCowbell(now, note, 0.15);
        // Hi-hat 16th notes
        this.playHiHat(now, 0.05);
      } else if (track.genre === 'Chill / Lo-Fi') {
        // Soft kick
        if (step % 8 === 0 || step % 8 === 5) this.playKick(now, 70, 0.3);
        if (step % 8 === 4) this.playSnare(now, 0.15);
        // Rhodes chords
        const chords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [196.00, 246.94, 293.66, 349.23], // G7
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        if (step % 2 === 0) {
          chord.forEach(freq => this.playSynthNote(now, freq, 'sine', 0.4, 0.08));
        }
      } else if (track.genre === 'House / Electronic') {
        // Four on the floor kick!
        this.playKick(now, 60, 0.4);
        // Off-beat open hi-hat
        this.playHiHat(now + beatInterval * 0.5, 0.12);
        // Bass groove
        const bassNotes = [110, 110, 130.81, 146.83, 110, 164.81];
        const bNote = bassNotes[step % bassNotes.length];
        this.playSynthNote(now, bNote, 'sawtooth', 0.2, 0.12);
      } else if (track.genre === 'Classic Reggaeton') {
        // Dembow rhythm: Kick on 1, 2, 3, 4 + snare on the "and" of 1 and on 3
        this.playKick(now, 65, 0.35);
        this.playSnare(now + beatInterval * 0.375, 0.2);
        this.playSnare(now + beatInterval * 0.75, 0.18);
        const synthNotes = [440, 523.25, 493.88, 392];
        this.playSynthNote(now, synthNotes[step % synthNotes.length], 'triangle', 0.25, 0.15);
      } else {
        // Synthwave / Ambient
        if (step % 4 === 0) this.playKick(now, 50, 0.35);
        if (step % 4 === 2) this.playSnare(now, 0.15);
        const arpNotes = [220, 277.18, 329.63, 440, 554.37, 659.25];
        this.playSynthNote(now, arpNotes[step % arpNotes.length], 'sawtooth', 0.2, 0.1);
      }

      step++;
    };

    playStep();
    this.timer = window.setInterval(playStep, beatInterval * 1000);
  }

  private playKick(time: number, freq: number, decay: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(freq * 2.5, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + decay);

    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(time);
    osc.stop(time + decay);
  }

  private playSnare(time: number, decay: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + decay);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(time);
    osc.stop(time + decay);
  }

  private playHiHat(time: number, decay: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(7000 + Math.random() * 2000, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(time);
    osc.stop(time + decay);
  }

  private playCowbell(time: number, freq: number, decay: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc2.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.5, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.filterNode);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + decay);
    osc2.stop(time + decay);
  }

  private playSynthNote(time: number, freq: number, type: OscillatorType, decay: number, volume: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(time);
    osc.stop(time + decay);
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): TrackInfo | null {
    if (!this.currentTrackId) return null;
    return SOUNDFLOW_TRACKS.find(t => t.id === this.currentTrackId) || null;
  }
}

export const soundflowAudio = new SoundFlowAudioEngine();
