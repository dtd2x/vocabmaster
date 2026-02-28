import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SocialLoginButtons } from './components/SocialLoginButtons'
import { ROUTES } from '@/config/routes'
import toast from 'react-hot-toast'

export function SignupPage() {
  const { signUp } = useAuthStore()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp')
      return
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, displayName)
      toast.success('Đăng ký thành công!')
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Tạo tài khoản</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên hiển thị"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Nguyễn Văn A"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Input
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Ít nhất 6 ký tự"
          required
          autoComplete="new-password"
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          required
          autoComplete="new-password"
          error={confirmPassword && password !== confirmPassword ? 'Mật khẩu không khớp' : undefined}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Đăng ký
        </Button>
      </form>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Đã có tài khoản?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
