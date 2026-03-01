import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { getDeckCategories } from '@/config/constants'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Deck, CreateDeckInput } from '@/types/card'
import toast from 'react-hot-toast'

interface DeckFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateDeckInput) => Promise<unknown>
  deck?: Deck | null
}

export function DeckForm({ isOpen, onClose, onSubmit, deck }: DeckFormProps) {
  const activeLanguage = useSettingsStore((s) => s.activeLanguage)
  const [name, setName] = useState(deck?.name ?? '')
  const [description, setDescription] = useState(deck?.description ?? '')
  const [category, setCategory] = useState(deck?.category ?? '')
  const [loading, setLoading] = useState(false)

  const isEdit = !!deck
  const categories = getDeckCategories(deck?.language ?? activeLanguage)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, category: category || undefined })
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo bộ từ thành công!')
      onClose()
      setName('')
      setDescription('')
      setCategory('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Sửa bộ từ' : 'Tạo bộ từ mới'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên bộ từ"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="VD: IELTS Academic Words"
          required
          autoFocus
        />
        <Input
          label="Mô tả"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Mô tả ngắn về bộ từ..."
        />
        <Select
          label="Danh mục"
          value={category}
          onChange={e => setCategory(e.target.value)}
          options={categories.map(c => ({ value: c.value, label: c.label }))}
          placeholder="Chọn danh mục"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" loading={loading}>{isEdit ? 'Cập nhật' : 'Tạo'}</Button>
        </div>
      </form>
    </Modal>
  )
}
