import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SocialLoginButtons } from './components/SocialLoginButtons'
import { ROUTES } from '@/config/routes'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Đăng nhập thành công!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Đăng nhập</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Ghi nhớ</span>
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Đăng nhập
        </Button>
      </form>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.SIGNUP} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}
