/**
 * Renders Japanese text with furigana (ruby annotations).
 * Parses bracket notation: 漢字[ふりがな] → <ruby>漢字<rt>ふりがな</rt></ruby>
 */
export function FuriganaText({ text, className }: { text: string; className?: string }) {
  // Match kanji characters followed by [reading]
  const parts = text.split(/([^\s[\]]+\[[^\]]+\])/)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^(.+)\[([^\]]+)\]$/)
        if (match) {
          return (
            <ruby key={i}>
              {match[1]}
              <rp>(</rp>
              <rt>{match[2]}</rt>
              <rp>)</rp>
            </ruby>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
