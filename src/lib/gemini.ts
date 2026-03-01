import { fetchDictionaryAudioUrl } from '@/lib/audio'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export interface GeneratedCard {
  front: string
  back: string
  example_sentence: string
  pronunciation: string
  audio_url?: string | null
}

export interface GeneratedJapaneseCard {
  front: string
  back: string
  example_sentence: string
  pronunciation: string
  hiragana: string
  audio_url?: string | null
}

/**
 * Gửi danh sách từ đến Groq API và nhận lại thông tin chi tiết cho mỗi từ.
 * Hỗ trợ cả input tiếng Anh lẫn tiếng Việt.
 */
export async function generateVocabularyCards(words: string[]): Promise<GeneratedCard[]> {
  if (!GROQ_API_KEY) {
    throw new Error('Chưa cấu hình Groq API key. Vui lòng thêm VITE_GROQ_API_KEY vào file .env.local')
  }

  const wordList = words.map((w, i) => `${i + 1}. ${w.trim()}`).join('\n')

  const prompt = `Bạn là trợ lý tạo thẻ từ vựng Anh-Việt. Tôi sẽ cho bạn một danh sách từ (có thể là tiếng Anh hoặc tiếng Việt).

Với MỖI từ, hãy trả về JSON với format chính xác như sau:
- Nếu input là tiếng Anh: "front" = từ tiếng Anh, "back" = nghĩa tiếng Việt
- Nếu input là tiếng Việt: "front" = từ tiếng Anh tương ứng, "back" = nghĩa tiếng Việt (chính là input)

Trả về ĐÚNG JSON array, KHÔNG có markdown, KHÔNG có giải thích thêm.

Format:
[
  {
    "front": "từ tiếng Anh",
    "back": "nghĩa tiếng Việt (có thể nhiều nghĩa, cách nhau bằng dấu phẩy)",
    "example_sentence": "một câu ví dụ bằng tiếng Anh sử dụng từ này",
    "pronunciation": "phiên âm IPA (ví dụ: /əˈbæn.dən/)"
  }
]

Danh sách từ:
${wordList}

Trả về JSON array:`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('Groq API error:', response.status, errText)
    if (response.status === 401) {
      throw new Error('API key không hợp lệ. Kiểm tra VITE_GROQ_API_KEY.')
    }
    if (response.status === 429) {
      throw new Error('Đã vượt quá giới hạn gọi API. Vui lòng đợi một lát rồi thử lại.')
    }
    throw new Error(`Lỗi Groq API (${response.status}). Kiểm tra console để biết chi tiết.`)
  }

  const data = await response.json() as {
    choices?: { message?: { content?: string } }[]
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('Groq không trả về kết quả. Vui lòng thử lại.')
  }

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Không thể phân tích kết quả từ AI.')
  }

  const cards = JSON.parse(jsonMatch[0]) as GeneratedCard[]

  // Validate
  const validCards = cards.filter(
    (card) =>
      typeof card.front === 'string' &&
      typeof card.back === 'string' &&
      card.front.length > 0 &&
      card.back.length > 0
  )

  // Fetch audio URLs from dictionary API in parallel
  const cardsWithAudio = await Promise.all(
    validCards.map(async (card) => {
      const audioUrl = await fetchDictionaryAudioUrl(card.front)
      return { ...card, audio_url: audioUrl }
    })
  )

  return cardsWithAudio
}

/**
 * Tạo thẻ từ vựng tiếng Nhật bằng Groq API.
 * Hỗ trợ input tiếng Nhật, romaji, hoặc tiếng Việt.
 */
export async function generateJapaneseVocabularyCards(words: string[]): Promise<GeneratedJapaneseCard[]> {
  if (!GROQ_API_KEY) {
    throw new Error('Chưa cấu hình Groq API key. Vui lòng thêm VITE_GROQ_API_KEY vào file .env.local')
  }

  const wordList = words.map((w, i) => `${i + 1}. ${w.trim()}`).join('\n')

  const prompt = `Bạn là trợ lý tạo thẻ từ vựng Nhật-Việt. Tôi sẽ cho bạn một danh sách từ (có thể là tiếng Nhật, romaji, hoặc tiếng Việt).

Với MỖI từ, hãy trả về JSON với format chính xác như sau:
- "front": dạng kanji (nếu có), ví dụ: "食べる". Nếu từ không có kanji thì dùng hiragana.
- "back": nghĩa tiếng Việt
- "pronunciation": romaji, ví dụ: "taberu"
- "hiragana": dạng hiragana, ví dụ: "たべる"
- "example_sentence": câu ví dụ bằng tiếng Nhật (dùng furigana bracket notation cho kanji, ví dụ: 毎日[まいにち]ご飯[はん]を食[た]べます。)

Trả về ĐÚNG JSON array, KHÔNG có markdown, KHÔNG có giải thích thêm.

Format:
[
  {
    "front": "kanji hoặc từ tiếng Nhật",
    "back": "nghĩa tiếng Việt (có thể nhiều nghĩa, cách nhau bằng dấu phẩy)",
    "pronunciation": "romaji",
    "hiragana": "hiragana",
    "example_sentence": "câu ví dụ tiếng Nhật với furigana bracket"
  }
]

Danh sách từ:
${wordList}

Trả về JSON array:`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('Groq API error:', response.status, errText)
    if (response.status === 401) {
      throw new Error('API key không hợp lệ. Kiểm tra VITE_GROQ_API_KEY.')
    }
    if (response.status === 429) {
      throw new Error('Đã vượt quá giới hạn gọi API. Vui lòng đợi một lát rồi thử lại.')
    }
    throw new Error(`Lỗi Groq API (${response.status}). Kiểm tra console để biết chi tiết.`)
  }

  const data = await response.json() as {
    choices?: { message?: { content?: string } }[]
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('Groq không trả về kết quả. Vui lòng thử lại.')
  }

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Không thể phân tích kết quả từ AI.')
  }

  const cards = JSON.parse(jsonMatch[0]) as GeneratedJapaneseCard[]

  const validCards = cards.filter(
    (card) =>
      typeof card.front === 'string' &&
      typeof card.back === 'string' &&
      card.front.length > 0 &&
      card.back.length > 0
  )

  return validCards
}

/**
 * Dispatcher: chọn đúng generator theo ngôn ngữ.
 */
export async function generateCards(words: string[], language: string): Promise<(GeneratedCard | GeneratedJapaneseCard)[]> {
  if (language === 'ja') return generateJapaneseVocabularyCards(words)
  return generateVocabularyCards(words)
}
