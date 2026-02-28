import type { CreateCardInput } from '@/types/card'

interface ImportedCard {
  front: string
  back: string
  example_sentence?: string
  pronunciation?: string
  tags?: string[]
}

/**
 * Parse CSV content into card data.
 * Expected format: front,back,example,pronunciation
 * First row can be a header (auto-detected).
 */
export function parseCSV(content: string): ImportedCard[] {
  const lines = content.trim().split('\n')
  if (lines.length === 0) return []

  // Auto-detect header
  const firstLine = (lines[0] ?? '').toLowerCase()
  const hasHeader = firstLine.includes('front') || firstLine.includes('word') || firstLine.includes('english')
  const dataLines = hasHeader ? lines.slice(1) : lines

  return dataLines
    .map(line => {
      const parts = parseCSVLine(line)
      if (parts.length < 2) return null

      const front = parts[0]?.trim() ?? ''
      const back = parts[1]?.trim() ?? ''
      if (!front || !back) return null

      const card: ImportedCard = {
        front,
        back,
        example_sentence: parts[2]?.trim() || undefined,
        pronunciation: parts[3]?.trim() || undefined,
      }
      return card
    })
    .filter((card): card is ImportedCard => card !== null)
}

/**
 * Parse a single CSV line, handling quoted fields.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if ((char === ',' || char === '\t') && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

/**
 * Parse tab-separated text (Anki-compatible format).
 */
export function parseTSV(content: string): ImportedCard[] {
  return parseCSV(content.replace(/\t/g, ','))
}

/**
 * Parse JSON import format.
 */
export function parseJSON(content: string): ImportedCard[] {
  const data = JSON.parse(content) as unknown

  if (Array.isArray(data)) {
    return data
      .filter((item): item is Record<string, string> =>
        typeof item === 'object' && item !== null && 'front' in item && 'back' in item
      )
      .map(item => ({
        front: String(item.front),
        back: String(item.back),
        example_sentence: item.example_sentence ? String(item.example_sentence) : undefined,
        pronunciation: item.pronunciation ? String(item.pronunciation) : undefined,
        tags: Array.isArray(item.tags) ? item.tags.map(String) : undefined,
      }))
  }

  return []
}

/**
 * Convert cards to importable format with a deck_id.
 */
export function toCreateCardInputs(cards: ImportedCard[], deckId: string): CreateCardInput[] {
  return cards.map(card => ({
    deck_id: deckId,
    front: card.front,
    back: card.back,
    example_sentence: card.example_sentence,
    pronunciation: card.pronunciation,
    tags: card.tags,
  }))
}

/**
 * Export cards as CSV string.
 */
export function exportToCSV(cards: { front: string; back: string; example_sentence?: string | null; pronunciation?: string | null }[]): string {
  const header = 'front,back,example,pronunciation'
  const rows = cards.map(card => {
    const fields = [
      escapeCSVField(card.front),
      escapeCSVField(card.back),
      escapeCSVField(card.example_sentence ?? ''),
      escapeCSVField(card.pronunciation ?? ''),
    ]
    return fields.join(',')
  })
  return [header, ...rows].join('\n')
}

/**
 * Export cards as JSON string.
 */
export function exportToJSON(cards: { front: string; back: string; example_sentence?: string | null; pronunciation?: string | null }[]): string {
  return JSON.stringify(cards, null, 2)
}

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
