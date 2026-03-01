import { useState, useCallback, useRef, useEffect } from 'react'
import { playPronunciation, preloadPronunciation } from '@/lib/audio'
import type { AudioLang } from '@/lib/audio'
import { useSettingsStore } from '@/stores/settingsStore'

interface UseAudioOptions {
  word: string
  audioUrl?: string | null
  lang?: AudioLang
}

export function useAudio({ word, audioUrl = null, lang }: UseAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false)
  const playingRef = useRef(false)
  const accent = useSettingsStore((s) => s.accent)

  const effectiveLang = lang ?? (accent === 'uk' ? 'en-GB' : 'en-US') as AudioLang

  // Preload audio as soon as the word is known (not on click)
  useEffect(() => {
    if (word) {
      preloadPronunciation(word, audioUrl ?? null, accent)
    }
  }, [word, audioUrl, accent])

  const play = useCallback(async () => {
    if (playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)
    try {
      await playPronunciation(word, audioUrl ?? null, effectiveLang, accent)
    } catch (err) {
      console.warn('Audio playback failed:', err)
    } finally {
      setIsPlaying(false)
      playingRef.current = false
    }
  }, [word, audioUrl, effectiveLang, accent])

  return { play, isPlaying }
}
