import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  ArrowLeft, Download, Check, Users, Radio, 
  Sparkles, ListMusic, ArrowUp, ArrowDown, ShieldAlert
} from 'lucide-react';
import { SOUNDFLOW_TRACKS, TrackInfo, soundflowAudio } from '../utils/audioEngine';
import { UserSubscription } from '../types/soundflow';

interface WebPlayerDemoProps {
  subscription: UserSubscription | null;
  onBackToLanding: () => void;
  onOpenCheckout: () => void;
}

export const WebPlayerDemo: React.FC<WebPlayerDemoProps> = ({
  subscription,
  onBackToLanding,
  onOpenCheckout,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHiFi, setIsHiFi] = useState(true);
  const [isAdFree, setIsAdFree] = useState(subscription?.active ?? true);
  const [showAdNotice, setShowAdNotice] = useState(false);
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<string[]>(['phonk-1', 'friday-2']);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [queue, setQueue] = useState<TrackInfo[]>([...SOUNDFLOW_TRACKS]);
  const [progress, setProgress] = useState(0);
  const [groupSessionActive, setGroupSessionActive] = useState(false);
  const [friendsCount, setFriendsCount] = useState(3);
  const [activeTab, setActiveTab] = useState<'player' | 'features' | 'queue'>('player');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentTrack = queue[currentTrackIndex] || SOUNDFLOW_TRACKS[0];

  // Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = soundflowAudio.getAnalyser();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (!isPlaying || !analyser) {
        // Flatline / idle wave
        ctx.beginPath();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * (isHiFi ? 0.95 : 0.45);

        // Gradient color for visualizer
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#1ED760');
        gradient.addColorStop(0.6, isHiFi ? '#C2F738' : '#38bdf8');
        gradient.addColorStop(1, '#FFFFFF');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isHiFi]);

  // Track progress ticker
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    if (isPlaying) {
      soundflowAudio.stop();
      setIsPlaying(false);
    } else {
      if (isOfflineMode && !downloadedTrackIds.includes(currentTrack.id)) {
        alert(`Cannot play "${currentTrack.title}" in Offline Mode. Please download the track first!`);
        return;
      }

      if (!isAdFree) {
        setShowAdNotice(true);
        setTimeout(() => {
          setShowAdNotice(false);
          soundflowAudio.playTrack(currentTrack.id);
          setIsPlaying(true);
        }, 3000);
      } else {
        soundflowAudio.playTrack(currentTrack.id);
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    soundflowAudio.stop();
    setIsPlaying(false);
    setProgress(0);
    const nextIdx = (currentTrackIndex + 1) % queue.length;
    setCurrentTrackIndex(nextIdx);
    setTimeout(() => {
      soundflowAudio.playTrack(queue[nextIdx].id);
      setIsPlaying(true);
    }, 150);
  };

  const handlePrev = () => {
    soundflowAudio.stop();
    setIsPlaying(false);
    setProgress(0);
    const prevIdx = (currentTrackIndex - 1 + queue.length) % queue.length;
    setCurrentTrackIndex(prevIdx);
    setTimeout(() => {
      soundflowAudio.playTrack(queue[prevIdx].id);
      setIsPlaying(true);
    }, 150);
  };

  const handleToggleHiFi = () => {
    const nextVal = !isHiFi;
    setIsHiFi(nextVal);
    soundflowAudio.setHiFiMode(nextVal);
  };

  const toggleDownload = (trackId: string) => {
    if (downloadedTrackIds.includes(trackId)) {
      setDownloadedTrackIds(downloadedTrackIds.filter(id => id !== trackId));
    } else {
      setDownloadedTrackIds([...downloadedTrackIds, trackId]);
    }
  };

  const moveQueueItem = (index: number, direction: 'up' | 'down') => {
    const newQueue = [...queue];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQueue.length) return;
    const temp = newQueue[index];
    newQueue[index] = newQueue[targetIndex];
    newQueue[targetIndex] = temp;
    setQueue(newQueue);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-black/90 backdrop-blur sticky top-0 z-40 border-b border-[#282828] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs text-[#a7a7a7] hover:text-white transition px-2 py-1 rounded bg-[#242424]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm-5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM2 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm20 0a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">SoundFlow Player</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {subscription?.active ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-brand-green bg-brand-green/10 border border-brand-green/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{subscription.planName} Active</span>
            </div>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="bg-brand-green hover:bg-brand-green-hover text-black text-xs font-bold px-3 py-1.5 rounded-full transition shadow"
            >
              Upgrade to Premium ($0)
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Ad Notice Simulation Banner */}
        {showAdNotice && (
          <div className="bg-amber-500/20 border border-amber-500 text-amber-200 p-4 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white">Playing Sponsor Audio Ad (SoundFlow Free)</p>
                <p className="text-[11px] text-amber-300">
                  "Want uninterrupted music? Go Premium for $0 to listen ad-free."
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500 text-black px-2 py-0.5 rounded">
              Ad: 3s
            </span>
          </div>
        )}

        {/* Feature Demonstration Tabs */}
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'player' ? 'bg-[#2a2a2a] text-brand-green' : 'text-[#888] hover:text-white'
              }`}
            >
              Now Playing
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'features' ? 'bg-[#2a2a2a] text-brand-green' : 'text-[#888] hover:text-white'
              }`}
            >
              Premium Simulator
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'queue' ? 'bg-[#2a2a2a] text-brand-green' : 'text-[#888] hover:text-white'
              }`}
            >
              Queue ({queue.length})
            </button>
          </div>

          <div className="text-[11px] text-[#888] hidden sm:block">
            Synthesized Live Web Audio Engine
          </div>
        </div>

        {/* TAB 1: PLAYER */}
        {activeTab === 'player' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Album Cover Art */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div 
                className={`w-60 h-60 sm:w-72 sm:h-72 rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all duration-300 border border-white/10 ${
                  currentTrack.genre === 'Phonk'
                    ? 'bg-gradient-to-br from-purple-800 to-indigo-950'
                    : currentTrack.genre === 'Chill / Lo-Fi'
                    ? 'bg-[#f3efe6] text-black border-amber-200'
                    : currentTrack.genre === 'House / Electronic'
                    ? 'bg-[#C2F738] text-black border-black/30'
                    : currentTrack.genre === 'Classic Reggaeton'
                    ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600'
                    : 'bg-gradient-to-t from-pink-600 to-violet-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest uppercase">
                    {currentTrack.albumName}
                  </span>
                  {isHiFi && (
                    <span className="text-[10px] font-mono font-bold bg-black/40 text-white px-2 py-0.5 rounded-full border border-white/20">
                      FLAC 24-BIT
                    </span>
                  )}
                </div>

                <div className="text-center py-6">
                  {isPlaying && (
                    <div className="flex items-end justify-center gap-1.5 h-10">
                      <div className="w-1.5 bg-current rounded-full animate-eq-1" />
                      <div className="w-1.5 bg-current rounded-full animate-eq-2" />
                      <div className="w-1.5 bg-current rounded-full animate-eq-3" />
                      <div className="w-1.5 bg-current rounded-full animate-eq-4" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold leading-tight truncate">{currentTrack.title}</h4>
                  <p className="text-xs opacity-80">{currentTrack.artist}</p>
                </div>
              </div>
            </div>

            {/* Audio Visualizer & Track Details */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-green tracking-wider">
                  {currentTrack.genre}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-[#b3b3b3]">{currentTrack.artist} · {currentTrack.albumName}</p>
              </div>

              {/* Real-time spectrum canvas */}
              <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a]">
                <div className="flex items-center justify-between text-[11px] text-[#888] mb-2 font-mono">
                  <span>SPECTRUM ANALYZER</span>
                  <span className={isHiFi ? 'text-brand-green' : 'text-sky-400'}>
                    {isHiFi ? 'LOSSLESS 96kHz HIFI' : 'COMPRESSED 160kbps'}
                  </span>
                </div>
                <canvas 
                  ref={canvasRef} 
                  width={380} 
                  height={70} 
                  className="w-full h-16 rounded bg-black/40"
                />
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-green h-full transition-all duration-300"
                    style={{ width: `${(progress / currentTrack.durationSeconds) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#888] font-mono">
                  <span>{formatSeconds(progress)}</span>
                  <span>{formatSeconds(currentTrack.durationSeconds)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDownload(currentTrack.id)}
                    className={`p-2 rounded-full border transition ${
                      downloadedTrackIds.includes(currentTrack.id)
                        ? 'bg-brand-green/20 border-brand-green text-brand-green'
                        : 'border-[#333] text-[#888] hover:text-white'
                    }`}
                    title="Download track for offline playback"
                  >
                    {downloadedTrackIds.includes(currentTrack.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={handleToggleHiFi}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      isHiFi
                        ? 'bg-brand-green text-black border-brand-green shadow-sm'
                        : 'bg-[#222] text-[#888] border-[#333] hover:text-white'
                    }`}
                  >
                    {isHiFi ? 'HiFi Lossless' : 'Normal MP3'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrev}
                    className="text-[#a7a7a7] hover:text-white p-2 transition"
                    aria-label="Previous track"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 rounded-full bg-brand-green hover:bg-brand-green-hover text-black flex items-center justify-center transition shadow-lg active:scale-95"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>
                  <button 
                    onClick={handleNext}
                    className="text-[#a7a7a7] hover:text-white p-2 transition"
                    aria-label="Next track"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREMIUM SIMULATOR */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1: Lossless Audio */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-[#2a2a2a] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-brand-green" />
                  <h4 className="font-bold text-sm text-white">Lossless Audio Quality</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isHiFi ? 'bg-brand-green text-black' : 'bg-[#333] text-[#aaa]'}`}>
                  {isHiFi ? 'Active (FLAC)' : 'Disabled (160kbps)'}
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Experience 24-bit 96kHz studio master audio vs standard compressed audio. Toggle live while music is playing to hear high frequencies open up.
              </p>
              <button
                onClick={handleToggleHiFi}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${
                  isHiFi ? 'bg-brand-green text-black border-brand-green' : 'bg-[#222] text-white border-[#333]'
                }`}
              >
                {isHiFi ? 'Switch to Standard Compressed' : 'Enable Lossless HiFi'}
              </button>
            </div>

            {/* Feature 2: Ad-free music */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-[#2a2a2a] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-green" />
                  <h4 className="font-bold text-sm text-white">Ad-Free Music Listening</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isAdFree ? 'bg-brand-green text-black' : 'bg-amber-400 text-black'}`}>
                  {isAdFree ? 'Premium (0 Ads)' : 'Free (Simulate Ads)'}
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Free users get occasional audio ads between songs. With Premium, playback is 100% uninterrupted.
              </p>
              <button
                onClick={() => setIsAdFree(!isAdFree)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${
                  isAdFree ? 'bg-brand-green text-black border-brand-green' : 'bg-[#222] text-white border-[#333]'
                }`}
              >
                {isAdFree ? 'Simulate Free Tier (Enable Ads)' : 'Enable Ad-Free Mode'}
              </button>
            </div>

            {/* Feature 3: Offline Downloads */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-[#2a2a2a] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-brand-green" />
                  <h4 className="font-bold text-sm text-white">Download to Listen Offline</h4>
                </div>
                <span className="text-[10px] font-mono bg-[#282828] text-brand-green px-2 py-0.5 rounded">
                  {downloadedTrackIds.length} / {SOUNDFLOW_TRACKS.length} Saved
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Save songs directly to your device for offline flights and subways. Turn on Airplane / Offline Mode to test offline playback.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOfflineMode(!isOfflineMode)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                    isOfflineMode ? 'bg-amber-400 text-black border-amber-400' : 'bg-[#222] text-white border-[#333]'
                  }`}
                >
                  {isOfflineMode ? 'Exit Offline Mode' : 'Simulate Offline Mode'}
                </button>
                <button
                  onClick={() => setDownloadedTrackIds(SOUNDFLOW_TRACKS.map(t => t.id))}
                  className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] text-xs font-semibold rounded-xl text-white transition"
                >
                  Download All
                </button>
              </div>
            </div>

            {/* Feature 4: Group Session */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-[#2a2a2a] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-green" />
                  <h4 className="font-bold text-sm text-white">Listen with Friends in Real Time</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${groupSessionActive ? 'bg-brand-green text-black' : 'bg-[#333] text-[#aaa]'}`}>
                  {groupSessionActive ? `${friendsCount} Friends Synced` : 'Solo Mode'}
                </span>
              </div>
              <p className="text-xs text-[#a7a7a7]">
                Start a live SoundFlow Group Session. Whoever changes the track or pauses syncs across everyone's headphones worldwide.
              </p>
              <button
                onClick={() => setGroupSessionActive(!groupSessionActive)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition border ${
                  groupSessionActive ? 'bg-brand-green text-black border-brand-green' : 'bg-[#222] text-white border-[#333]'
                }`}
              >
                {groupSessionActive ? 'End Group Session' : 'Start Live Group Session'}
              </button>
              {groupSessionActive && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-pink-500 border border-black flex items-center justify-center text-[9px] font-bold">ST</div>
                    <div className="w-6 h-6 rounded-full bg-sky-500 border border-black flex items-center justify-center text-[9px] font-bold">MK</div>
                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-black flex items-center justify-center text-[9px] font-bold">EL</div>
                  </div>
                  <span className="text-[11px] text-[#aaa]">Sarah, Marcus, & Elena listening simultaneously</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-[#181818] p-5 rounded-2xl border border-[#2a2a2a] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-brand-green" />
                <h3 className="font-bold text-base text-white">Organise Listening Queue</h3>
              </div>
              <span className="text-xs text-[#888]">Drag or reorder your playlist order</span>
            </div>

            <div className="divide-y divide-[#282828]">
              {queue.map((track, idx) => {
                const isCurrent = idx === currentTrackIndex;
                const isDownloaded = downloadedTrackIds.includes(track.id);

                return (
                  <div 
                    key={track.id}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between gap-3 transition ${
                      isCurrent ? 'bg-brand-green/10 text-brand-green' : 'hover:bg-[#202020]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono w-4 text-[#888]">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrent ? 'text-brand-green' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-[11px] text-[#888] truncate">{track.artist} · {track.genre}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isDownloaded && (
                        <Check className="w-3.5 h-3.5 text-brand-green" />
                      )}
                      <button
                        onClick={() => moveQueueItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-[#888] hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveQueueItem(idx, 'down')}
                        disabled={idx === queue.length - 1}
                        className="p-1 rounded text-[#888] hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTrackIndex(idx);
                          soundflowAudio.stop();
                          soundflowAudio.playTrack(track.id);
                          setIsPlaying(true);
                        }}
                        className="px-2.5 py-1 bg-[#282828] hover:bg-brand-green hover:text-black rounded text-[11px] font-semibold text-white transition"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Mini Persistent Player Bar */}
      <footer className="bg-black border-t border-[#282828] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#242424] flex items-center justify-center font-bold text-xs text-brand-green">
            SF
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white truncate max-w-[180px]">{currentTrack.title}</p>
            <p className="text-[10px] text-[#888]">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handlePrev} className="text-[#a7a7a7] hover:text-white p-1">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 rounded-full bg-brand-green text-black flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button onClick={handleNext} className="text-[#a7a7a7] hover:text-white p-1">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#888]">
          <Volume2 className="w-4 h-4" />
          <span className="font-mono text-[10px]">{isHiFi ? '96kHz' : '44.1kHz'}</span>
        </div>
      </footer>
    </div>
  );
};
