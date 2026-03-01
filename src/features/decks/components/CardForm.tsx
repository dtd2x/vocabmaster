import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Card, CreateCardInput, JapaneseExtraFields } from '@/types/card'
import toast from 'react-hot-toast'

interface CardFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateCardInput) => Promise<unknown>
  deckId: string
  card?: Card | null
  language?: string
}

export function CardForm({ isOpen, onClose, onSubmit, deckId, card, language = 'en' }: CardFormProps) {
  const [front, setFront] = useState(card?.front ?? '')
  const [back, setBack] = useState(card?.back ?? '')
  const [example, setExample] = useState(card?.example_sentence ?? '')
  const [pronunciation, setPronunciation] = useState(card?.pronunciation ?? '')
  const [hiragana, setHiragana] = useState((card?.extra_fields as JapaneseExtraFields)?.hiragana ?? '')
  const [loading, setLoading] = useState(false)

  const isEdit = !!card
  const isJapanese = language === 'ja'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return

    setLoading(true)
    try {
      const input: CreateCardInput = {
        deck_id: deckId,
        front: front.trim(),
        back: back.trim(),
        example_sentence: example.trim() || undefined,
        pronunciation: pronunciation.trim() || undefined,
      }

      if (isJapanese && hiragana.trim()) {
        input.extra_fields = { hiragana: hiragana.trim() }
      }

      await onSubmit(input)
      toast.success(isEdit ? 'Cập nhật thẻ thành công!' : 'Thêm thẻ thành công!')

      if (!isEdit) {
        setFront('')
        setBack('')
        setExample('')
        setPronunciation('')
        setHiragana('')
      } else {
        onClose()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa thẻ từ vựng' : 'Thêm thẻ mới'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={isJapanese ? 'Kanji / Từ tiếng Nhật' : 'Từ tiếng Anh'}
            value={front}
            onChange={e => setFront(e.target.value)}
            placeholder={isJapanese ? 'VD: 食べる' : 'VD: abandon'}
            required
            autoFocus
          />
          <Input
            label="Nghĩa tiếng Việt"
            value={back}
            onChange={e => setBack(e.target.value)}
            placeholder={isJapanese ? 'VD: ăn, dùng bữa' : 'VD: từ bỏ, bỏ rơi'}
            required
          />
        </div>

        {isJapanese && (
          <Input
            label="Hiragana"
            value={hiragana}
            onChange={e => setHiragana(e.target.value)}
            placeholder="VD: たべる"
          />
        )}

        <Input
          label="Câu ví dụ"
          value={example}
          onChange={e => setExample(e.target.value)}
          placeholder={isJapanese ? 'VD: 毎日[まいにち]ご飯[はん]を食[た]べます。' : 'VD: He abandoned his car in the snow.'}
        />
        <Input
          label={isJapanese ? 'Romaji' : 'Phiên âm (IPA)'}
          value={pronunciation}
          onChange={e => setPronunciation(e.target.value)}
          placeholder={isJapanese ? 'VD: taberu' : 'VD: /əˈbæn.dən/'}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {isEdit ? 'Hủy' : 'Đóng'}
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Cập nhật' : 'Thêm thẻ'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
