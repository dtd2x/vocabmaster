const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export type Accent = 'us' | 'uk'

interface DictionaryAudioResult {
  us: string | null
  uk: string | null
}

// In-memory cache to avoid repeat network calls
const audioCache = new Map<string, DictionaryAudioResult>()

// Preloaded HTMLAudioElement cache (url -> ready Audio element)
const preloadedAudio = new Map<string, HTMLAudioElement>()

/**
 * Fetch both US and UK audio URLs from Free Dictionary API.
 */
async function fetchDictionaryAudio(word: string): Promise<DictionaryAudioResult> {
  const normalized = word.toLowerCase().trim()

  if (audioCache.has(normalized)) {
    return audioCache.get(normalized)!
  }

  const result: DictionaryAudioResult = { us: null, uk: null }

  try {
    const res = await fetch(`${DICTIONARY_API}/${encodeURIComponent(normalized)}`)
    if (!res.ok) {
      audioCache.set(normalized, result)
      return result
    }

    const data = await res.json()
    const phonetics: { audio?: string }[] = data?.[0]?.phonetics ?? []

    for (const p of phonetics) {
      if (!p.audio) continue
      if (p.audio.includes('-us.')) result.us = p.audio
      else if (p.audio.includes('-uk.')) result.uk = p.audio
      else if (!result.us && !result.uk) {
        // Generic audio — assign to both as fallback
        result.us = p.audio
        result.uk = p.audio
      }
    }

    audioCache.set(normalized, result)
    return result
  } catch {
    audioCache.set(normalized, result)
    return result
  }
}

/**
 * Fetch audio URL for a specific accent.
 */
export async function fetchDictionaryAudioUrl(
  word: string,
  accent: Accent = 'us',
): Promise<string | null> {
  const result = await fetchDictionaryAudio(word)
  // Prefer requested accent, fall back to the other
  return result[accent] ?? (accent === 'us' ? result.uk : result.us)
}

/**
 * Preload an audio element so it's ready for instant playback.
 */
function preloadAudioElement(url: string): HTMLAudioElement {
  if (preloadedAudio.has(url)) return preloadedAudio.get(url)!

  const audio = new Audio()
  audio.preload = 'auto'
  audio.src = url
  preloadedAudio.set(url, audio)
  return audio
}

/**
 * Play audio from a URL. Uses preloaded element if available.
 */
export function playAudioFromUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = preloadedAudio.get(url) ?? new Audio(url)
    audio.currentTime = 0
    audio.addEventListener('ended', () => resolve(), { once: true })
    audio.addEventListener('error', () => reject(new Error('Audio playback failed')), { once: true })
    audio.play().catch(reject)
  })
}

/**
 * Fallback: Play pronunciation using Web Speech API.
 */
export function playWithSpeechSynthesis(
  text: string,
  lang: 'en-US' | 'en-GB' | 'vi-VN' = 'en-US',
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)
    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Strategy: stored audio_url → dictionary API (with accent) → Web Speech API.
 */
export async function playPronunciation(
  word: string,
  storedAudioUrl: string | null,
  lang: 'en-US' | 'en-GB' | 'vi-VN' = 'en-US',
  accent: Accent = 'us',
): Promise<void> {
  // 1. Try stored audio URL
  if (storedAudioUrl) {
    try {
      await playAudioFromUrl(storedAudioUrl)
      return
    } catch {
      // Fall through
    }
  }

  // 2. Try dictionary API (English only)
  if (lang !== 'vi-VN') {
    const dictUrl = await fetchDictionaryAudioUrl(word, accent)
    if (dictUrl) {
      try {
        await playAudioFromUrl(dictUrl)
        return
      } catch {
        // Fall through
      }
    }
  }

  // 3. Fallback to Web Speech API
  await playWithSpeechSynthesis(word, lang)
}

/**
 * Eagerly preload audio for a word so playback is instant when the user clicks.
 * Call this as early as possible (e.g. when a card becomes visible).
 */
export async function preloadPronunciation(
  word: string,
  storedAudioUrl: string | null,
  accent: Accent = 'us',
): Promise<void> {
  // Preload stored URL if available
  if (storedAudioUrl) {
    preloadAudioElement(storedAudioUrl)
  }

  // Prefetch dictionary API audio URL and preload it
  try {
    const dictUrl = await fetchDictionaryAudioUrl(word, accent)
    if (dictUrl) {
      preloadAudioElement(dictUrl)
    }
  } catch {
    // Ignore preload errors silently
  }
}
