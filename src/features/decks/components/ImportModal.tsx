import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { parseCSV, parseTSV, parseJSON, toCreateCardInputs } from '@/lib/import-export'
import type { CreateCardInput } from '@/types/card'
import toast from 'react-hot-toast'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (cards: CreateCardInput[]) => Promise<unknown>
  deckId: string
}

export function ImportModal({ isOpen, onClose, onImport, deckId }: ImportModalProps) {
  const [preview, setPreview] = useState<{ front: string; back: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      let cards: { front: string; back: string }[]

      if (file.name.endsWith('.json')) {
        cards = parseJSON(content)
      } else if (file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
        cards = parseTSV(content)
      } else {
        cards = parseCSV(content)
      }

      setPreview(cards.slice(0, 10))
      // Store full parsed data on the element for import
      if (fileRef.current) {
        (fileRef.current as unknown as { _parsedCards: typeof cards })._parsedCards = cards
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    const allCards = (fileRef.current as unknown as { _parsedCards?: { front: string; back: string }[] })?._parsedCards
    if (!allCards || allCards.length === 0) {
      toast.error('Không có dữ liệu để import')
      return
    }

    setLoading(true)
    try {
      const inputs = toCreateCardInputs(allCards, deckId)
      await onImport(inputs)
      toast.success(`Đã import ${allCards.length} thẻ từ vựng!`)
      onClose()
      setPreview([])
      setFileName('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import từ vựng" size="lg">
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
          onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.tsv,.txt,.json"
            className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {fileName ? (
            <p className="text-sm text-primary-600 font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kéo file vào đây hoặc click để chọn</p>
              <p className="text-xs text-gray-400 mt-1">Hỗ trợ: CSV, TSV, TXT (Anki), JSON</p>
            </>
          )}
        </div>

        {/* Format guide */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <p className="font-medium mb-1">Định dạng CSV/TSV:</p>
          <code>front,back,example,pronunciation</code>
          <br />
          <code>abandon,tu bo,He abandoned his car.,/əˈbæn.dən/</code>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xem trước ({preview.length} thẻ đầu tiên):
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {preview.map((card, i) => (
                <div key={i} className="flex gap-4 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-gray-100 min-w-[120px]">{card.front}</span>
                  <span className="text-gray-500">{card.back}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={handleImport} loading={loading} disabled={preview.length === 0}>
            Import
          </Button>
        </div>
      </div>
    </Modal>
  )
}
