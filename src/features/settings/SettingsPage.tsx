import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { profile, user, signOut, fetchProfile } = useAuthStore()
  const { theme, setTheme, newCardsPerDay, reviewLimit, dailyGoal, autoPlayAudio, accent, updateSettings } = useSettingsStore()

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      await fetchProfile()
      toast.success('Đã cập nhật hồ sơ!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật')
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cài đặt</h1>

      {/* Profile */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hồ sơ</h2>
        <div className="space-y-4">
          <Input
            label="Tên hiển thị"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
          <Input
            label="Email"
            value={user?.email ?? ''}
            disabled
            helperText="Email không thể thay đổi"
          />
          <Button onClick={handleSaveProfile} loading={savingProfile}>
            Luu thay doi
          </Button>
        </div>
      </Card>

      {/* Study settings */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Học tập</h2>
        <div className="space-y-4">
          <Input
            label="Số thẻ mới mỗi ngày"
            type="number"
            min={1}
            max={100}
            value={newCardsPerDay}
            onChange={e => updateSettings({ newCardsPerDay: parseInt(e.target.value) || 20 })}
          />
          <Input
            label="Giới hạn ôn tập mỗi ngày"
            type="number"
            min={10}
            max={500}
            value={reviewLimit}
            onChange={e => updateSettings({ reviewLimit: parseInt(e.target.value) || 100 })}
          />
          <Input
            label="Mục tiêu hàng ngày (số thẻ)"
            type="number"
            min={5}
            max={200}
            value={dailyGoal}
            onChange={e => updateSettings({ dailyGoal: parseInt(e.target.value) || 30 })}
          />
        </div>
      </Card>

      {/* Audio */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Âm thanh</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tự động phát âm
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Tự động phát âm khi lật thẻ trong chế độ ôn tập
              </p>
            </div>
            <button
              onClick={() => updateSettings({ autoPlayAudio: !autoPlayAudio })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                autoPlayAudio ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                autoPlayAudio ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giọng phát âm
            </p>
            <div className="flex gap-3">
              {([
                { value: 'us' as const, label: 'US', flag: '🇺🇸', desc: 'American English' },
                { value: 'uk' as const, label: 'UK', flag: '🇬🇧', desc: 'British English' },
              ]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ accent: opt.value })}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    accent === opt.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{opt.flag}</span>
                  <span className="ml-2">{opt.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Giao diện</h2>
        <div className="flex gap-3">
          {(['light', 'dark', 'system'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${theme === t
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
            >
              {t === 'light' ? 'Sáng' : t === 'dark' ? 'Tối' : 'Hệ thống'}
            </button>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card padding="lg" className="border-red-200 dark:border-red-900">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Tài khoản</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Đăng xuất khỏi tài khoản</p>
          </div>
          <Button variant="danger" onClick={() => signOut()}>Đăng xuất</Button>
        </div>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Xóa tài khoản vĩnh viễn</p>
            <p className="text-xs text-gray-400 mt-0.5">Tất cả dữ liệu sẽ bị xóa và không thể khôi phục.</p>
          </div>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>Xóa tài khoản</Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          toast.error('Chức năng đang được phát triển')
          setShowDeleteConfirm(false)
        }}
        title="Xóa tài khoản?"
        message="Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu sẽ bị xóa vĩnh viễn."
        confirmText="Xóa vĩnh viễn"
        variant="danger"
      />
    </div>
  )
}
