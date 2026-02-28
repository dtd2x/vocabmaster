import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/config/routes'
import toast from 'react-hot-toast'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      setSent(true)
      toast.success('Email đặt lại mật khẩu đã được gửi!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gửi email thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Kiểm tra email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>
        </p>
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
          Quay lại đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quên mật khẩu</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Nhập email để nhận link đặt lại mật khẩu</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Gui link reset
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  )
}
