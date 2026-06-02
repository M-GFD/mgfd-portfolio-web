'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  EXPERIENCE_ENTERED_KEY,
  EXPERIENCE_MUSIC_KEY,
  PORTFOLIO_LOOP_SRC,
  PORTFOLIO_LOOP_VOLUME,
} from '@/lib/experience-audio';

type ExperienceContextValue = {
  /** Gate ya superado (localStorage o tras fade). */
  hasEntered: boolean;
  /** Preferencia: reproducir música cuando el usuario lo permita. */
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  /** Gate visible (antes del fade final). */
  showGate: boolean;
  isFadingOut: boolean;
  /** Audio en reproducción activa. */
  isPlaying: boolean;
  enterExperience: () => void;
  onGateFadeComplete: () => void;
  togglePlayback: () => Promise<void>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showGate, setShowGate] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [musicEnabled, setMusicEnabledState] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const entered = localStorage.getItem(EXPERIENCE_ENTERED_KEY) === 'true';
      const music = localStorage.getItem(EXPERIENCE_MUSIC_KEY) === 'true';
      setHasEntered(entered);
      setShowGate(!entered);
      setMusicEnabledState(music);
      setMounted(true);
    });
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    setMusicEnabledState(enabled);
  }, []);

  const enterExperience = useCallback(() => {
    localStorage.setItem(EXPERIENCE_ENTERED_KEY, 'true');
    localStorage.setItem(EXPERIENCE_MUSIC_KEY, String(musicEnabled));
    setIsFadingOut(true);

    const audio = audioRef.current;
    if (musicEnabled && audio) {
      audio.loop = true;
      audio.volume = PORTFOLIO_LOOP_VOLUME;
      void audio.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      );
    }
  }, [musicEnabled]);

  const onGateFadeComplete = useCallback(() => {
    setHasEntered(true);
    setShowGate(false);
    setIsFadingOut(false);
  }, []);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !musicEnabled) return;

    if (audio.paused) {
      audio.loop = true;
      audio.volume = PORTFOLIO_LOOP_VOLUME;
      try {
        await audio.play();
        setIsPlaying(true);
        localStorage.setItem(EXPERIENCE_MUSIC_KEY, 'true');
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [musicEnabled]);

  useEffect(() => {
    if (!hasEntered || !musicEnabled) return;

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const audio = audioRef.current;
      if (!audio || !musicEnabled) return;
      if (audio.paused) {
        void audio.play().then(
          () => setIsPlaying(true),
          () => setIsPlaying(false),
        );
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [hasEntered, musicEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mounted) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [mounted]);

  return (
    <ExperienceContext.Provider
      value={{
        hasEntered,
        musicEnabled,
        setMusicEnabled,
        showGate: mounted && showGate,
        isFadingOut,
        isPlaying,
        enterExperience,
        onGateFadeComplete,
        togglePlayback,
        audioRef,
      }}
    >
      <audio ref={audioRef} src={PORTFOLIO_LOOP_SRC} preload="none" loop />
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error('useExperience debe usarse dentro de ExperienceProvider');
  }
  return ctx;
}
