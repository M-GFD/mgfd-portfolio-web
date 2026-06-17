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
import {
  playBackgroundVideoFromGesture,
  primeBackgroundVideo,
} from '@/lib/background-media';

type ExperienceContextValue = {
  hasEntered: boolean;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  showGate: boolean;
  isFadingOut: boolean;
  isPlaying: boolean;
  enterExperience: () => void;
  onGateFadeComplete: () => void;
  togglePlayback: () => Promise<void>;
  primeMedia: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function startAudioPlayback(
  audio: HTMLAudioElement,
  shouldPlay: () => boolean,
) {
  audio.loop = true;
  audio.volume = PORTFOLIO_LOOP_VOLUME;
  audio.muted = false;

  const attempt = () => {
    if (!shouldPlay()) return;

    const playAttempt = audio.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => undefined);
    }
  };

  if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    attempt();
    return;
  }

  attempt();
  audio.addEventListener('canplay', attempt, { once: true });
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** Solo true tras gesto explícito del usuario (entrar con música o pulsar play). */
  const userRequestedPlaybackRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showGate, setShowGate] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [musicEnabled, setMusicEnabledState] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const primeMedia = useCallback(() => {
    primeBackgroundVideo();
    audioRef.current?.load();
  }, []);

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

  useEffect(() => {
    if (!mounted) return;
    primeMedia();
  }, [mounted, primeMedia]);

  useEffect(() => {
    if (!mounted || musicEnabled) return;

    userRequestedPlaybackRef.current = false;
    audioRef.current?.pause();
  }, [mounted, musicEnabled]);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    setMusicEnabledState(enabled);
  }, []);

  const enterExperience = useCallback(() => {
    if (isFadingOut) return;

    // Gesto de usuario: play síncrono antes de setState / storage (crítico en Android).
    playBackgroundVideoFromGesture();

    const audio = audioRef.current;
    if (musicEnabled && audio) {
      userRequestedPlaybackRef.current = true;
      startAudioPlayback(audio, () => userRequestedPlaybackRef.current);
    } else {
      userRequestedPlaybackRef.current = false;
      audio?.pause();
    }

    localStorage.setItem(EXPERIENCE_ENTERED_KEY, 'true');
    localStorage.setItem(EXPERIENCE_MUSIC_KEY, String(musicEnabled));
    setIsFadingOut(true);
  }, [isFadingOut, musicEnabled]);

  const onGateFadeComplete = useCallback(() => {
    setHasEntered(true);
    setShowGate(false);
    setIsFadingOut(false);
  }, []);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !musicEnabled) return;

    if (audio.paused) {
      userRequestedPlaybackRef.current = true;
      audio.loop = true;
      audio.volume = PORTFOLIO_LOOP_VOLUME;
      try {
        await audio.play();
        setIsPlaying(true);
        localStorage.setItem(EXPERIENCE_MUSIC_KEY, 'true');
      } catch {
        userRequestedPlaybackRef.current = false;
        setIsPlaying(false);
      }
    } else {
      userRequestedPlaybackRef.current = false;
      audio.pause();
      setIsPlaying(false);
    }
  }, [musicEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mounted) return;

    const onPlay = () => {
      if (!userRequestedPlaybackRef.current) {
        audio.pause();
        return;
      }
      setIsPlaying(true);
    };
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
        primeMedia,
        audioRef,
      }}
    >
      <audio ref={audioRef} src={PORTFOLIO_LOOP_SRC} preload="auto" loop />
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
