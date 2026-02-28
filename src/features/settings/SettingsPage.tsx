import { useState, useRef } from 'react'
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 2MB')
      return
    }

    setUploadingAvatar(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) throw updateError

      await fetchProfile()
      toast.success('Đã cập nhật ảnh đại diện!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải ảnh lên')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user) return
    setUploadingAvatar(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      await fetchProfile()
      toast.success('Đã xóa ảnh đại diện!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa ảnh')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cài đặt</h1>

      {/* Profile */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hồ sơ</h2>
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div
                onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center cursor-pointer ring-4 ring-gray-100 dark:ring-gray-700"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadingAvatar ? (
                    <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ảnh đại diện</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG. Tối đa 2MB</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="text-xs font-medium text-primary-500 hover:text-primary-600 disabled:opacity-50"
                >
                  Thay đổi
                </button>
                {profile?.avatar_url && (
                  <>
                    <span className="text-xs text-gray-300">|</span>
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="text-xs font-medium text-danger-500 hover:text-red-600 disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

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
            Lưu thay đổi
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
