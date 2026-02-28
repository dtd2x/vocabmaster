import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AudioButton } from '@/components/ui/AudioButton'
import { generateVocabularyCards, type GeneratedCard } from '@/lib/gemini'
import type { CreateCardInput } from '@/types/card'
import toast from 'react-hot-toast'

interface SmartAddModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (cards: CreateCardInput[]) => Promise<unknown>
  deckId: string
}

export function SmartAddModal({ isOpen, onClose, onImport, deckId }: SmartAddModalProps) {
  const [input, setInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<GeneratedCard[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    const words = input
      .split(/[\n,;]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0)

    if (words.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 từ')
      return
    }

    if (words.length > 30) {
      toast.error('Tối đa 30 từ mỗi lần')
      return
    }

    setGenerating(true)
    setPreview([])
    try {
      const cards = await generateVocabularyCards(words)
      setPreview(cards)
      setSelected(new Set(cards.map((_, i) => i)))
      toast.success(`Đã tạo ${cards.length} thẻ từ vựng!`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setGenerating(false)
    }
  }

  const toggleSelect = (index: number) => {
    if (editingIndex !== null) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === preview.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(preview.map((_, i) => i)))
    }
  }

  const updateCard = (index: number, field: keyof GeneratedCard, value: string) => {
    setPreview(prev => prev.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    ))
  }

  const handleImport = async () => {
    const cardsToImport: CreateCardInput[] = preview
      .filter((_, i) => selected.has(i))
      .map(card => ({
        deck_id: deckId,
        front: card.front,
        back: card.back,
        example_sentence: card.example_sentence,
        pronunciation: card.pronunciation,
        audio_url: card.audio_url ?? null,
      }))

    if (cardsToImport.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 thẻ')
      return
    }

    setImporting(true)
    try {
      await onImport(cardsToImport)
      toast.success(`Đã thêm ${cardsToImport.length} thẻ vào bộ từ!`)
      setInput('')
      setPreview([])
      setSelected(new Set())
      setEditingIndex(null)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi thêm thẻ')
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    if (!generating && !importing) {
      onClose()
      setPreview([])
      setInput('')
      setSelected(new Set())
      setEditingIndex(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Thêm từ vựng thông minh (AI)" size="lg">
      <div className="space-y-4">
        {/* Step 1: Input words */}
        {preview.length === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nhập danh sách từ
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Nhập từ tiếng Anh hoặc tiếng Việt, mỗi từ một dòng hoặc cách nhau bằng dấu phẩy.\n\nVí dụ:\nabandon, achieve, benefit\nhoặc:\ntừ bỏ\nđạt được\nlợi ích`}
                rows={8}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">
                Hỗ trợ tiếng Anh & tiếng Việt. Tối đa 30 từ/lần. AI sẽ tự động tạo nghĩa, phiên âm và câu ví dụ.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>Hủy</Button>
              <Button
                onClick={handleGenerate}
                loading={generating}
                disabled={!input.trim()}
              >
                {generating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tạo thẻ bằng AI
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Preview, edit and select */}
        {preview.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI đã tạo {preview.length} thẻ. Click vào biểu tượng bút để chỉnh sửa:
              </p>
              <button
                onClick={toggleAll}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                {selected.size === preview.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
              <AnimatePresence>
                {preview.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-3 rounded-xl border-2 transition-all ${selected.has(i)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 opacity-60'
                      }`}
                  >
                    {editingIndex === i ? (
                      /* Edit mode */
                      <div className="space-y-2" onClick={e => e.stopPropagation()}>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={card.front}
                            onChange={e => updateCard(i, 'front', e.target.value)}
                            className="px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Từ tiếng Anh"
                          />
                          <input
                            value={card.back}
                            onChange={e => updateCard(i, 'back', e.target.value)}
                            className="px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Nghĩa tiếng Việt"
                          />
                        </div>
                        <input
                          value={card.pronunciation}
                          onChange={e => updateCard(i, 'pronunciation', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Phiên âm IPA"
                        />
                        <input
                          value={card.example_sentence}
                          onChange={e => updateCard(i, 'example_sentence', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Câu ví dụ"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 px-2 py-1"
                          >
                            Xong
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          onClick={() => toggleSelect(i)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${selected.has(i)
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                          {selected.has(i) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Card content */}
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleSelect(i)}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {card.front}
                            </span>
                            {card.pronunciation && (
                              <span className="text-xs text-gray-400">{card.pronunciation}</span>
                            )}
                            <AudioButton word={card.front} audioUrl={card.audio_url} size="sm" />
                          </div>
                          <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">
                            {card.back}
                          </p>
                          {card.example_sentence && (
                            <p className="text-xs text-gray-400 italic mt-1 line-clamp-1">
                              {card.example_sentence}
                            </p>
                          )}
                        </div>

                        {/* Edit button */}
                        <button
                          onClick={e => { e.stopPropagation(); setEditingIndex(i) }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPreview([]); setSelected(new Set()); setEditingIndex(null) }}
              >
                ← Nhập lại
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>Hủy</Button>
                <Button
                  onClick={handleImport}
                  loading={importing}
                  disabled={selected.size === 0}
                >
                  Thêm {selected.size} thẻ vào bộ từ
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
