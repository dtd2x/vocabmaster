import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { FullPageLoader } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'

const features = [
  {
    icon: RepeatIcon,
    title: 'Lặp lại ngắt quãng',
    description: 'Thuật toán thông minh giúp bạn ôn tập đúng thời điểm, ghi nhớ lâu hơn gấp nhiều lần.',
  },
  {
    icon: CardIcon,
    title: 'Flashcard thông minh',
    description: 'Thẻ ghi nhớ hai mặt với hình ảnh, âm thanh và ví dụ giúp học từ vựng hiệu quả.',
  },
  {
    icon: QuizIcon,
    title: 'Quiz đa dạng',
    description: 'Nhiều dạng bài kiểm tra: trắc nghiệm, điền từ, nghe viết giúp củng cố kiến thức.',
  },
  {
    icon: ChartIcon,
    title: 'Theo dõi tiến độ',
    description: 'Biểu đồ trực quan giúp bạn theo dõi quá trình học tập và cải thiện mỗi ngày.',
  },
  {
    icon: TrophyIcon,
    title: 'Game hóa',
    description: 'Hệ thống XP, cấp độ, huy hiệu và chuỗi ngày học giữ cho bạn luôn có động lực.',
  },
  {
    icon: BookIcon,
    title: 'Bộ từ có sẵn',
    description: 'Kho bộ từ vựng phong phú theo chủ đề, cấp độ từ cơ bản đến nâng cao.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Tạo bộ từ',
    description: 'Chọn bộ từ có sẵn hoặc tự tạo bộ từ vựng theo chủ đề yêu thích.',
  },
  {
    number: '02',
    title: 'Học và ôn tập',
    description: 'Học từ mới mỗi ngày, ôn tập theo lịch thông minh với flashcard và quiz.',
  },
  {
    number: '03',
    title: 'Theo dõi tiến bộ',
    description: 'Xem thống kê, nhận huy hiệu và duy trì chuỗi ngày học liên tục.',
  },
]

const stats = [
  { value: '1000+', label: 'Từ vựng' },
  { value: '50+', label: 'Bộ từ có sẵn' },
  { value: '100%', label: 'Miễn phí' },
]

export function LandingPage() {
  const { user, loading } = useAuthStore()

  if (loading) return <FullPageLoader />
  if (user) return <Navigate to={ROUTES.DASHBOARD} replace />

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">VocabMaster</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link to={ROUTES.SIGNUP}>
              <Button size="sm">Đăng ký</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Học từ vựng
                <span className="text-primary-500"> thông minh</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl">
                Ghi nhớ từ vựng nhanh hơn, lâu hơn với phương pháp lặp lại ngắt quãng.
                Flashcard, quiz và game hóa giúp việc học trở nên thú vị.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to={ROUTES.SIGNUP}>
                  <Button size="lg" className="w-full sm:w-auto px-8">Bắt đầu học ngay</Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">Đăng nhập</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </section>

      {/* Features */}
      <section className="bg-surface-light dark:bg-sidebar py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Tính năng nổi bật
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Mọi thứ bạn cần để học từ vựng hiệu quả, tất cả trong một ứng dụng.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Cách hoạt động
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Chỉ 3 bước đơn giản để bắt đầu hành trình học từ vựng.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl sm:text-5xl font-extrabold text-white">{stat.value}</div>
                <div className="mt-2 text-lg text-primary-100">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Tạo tài khoản miễn phí và bắt đầu học từ vựng ngay hôm nay. Không cần thẻ tín dụng.
            </p>
            <div className="mt-8">
              <Link to={ROUTES.SIGNUP}>
                <Button size="lg" className="px-10">Đăng ký miễn phí</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12 border-t border-border-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">VocabMaster</span>
            </div>
            <p className="text-sidebar-text text-sm">Học từ vựng thông minh</p>
            <p className="text-sidebar-text text-xs">
              &copy; {new Date().getFullYear()} VocabMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ===== SVG Icon Components ===== */

function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M6 6v12l6-3 6 3V6M6 6H4.5A1.5 1.5 0 003 7.5v10A1.5 1.5 0 004.5 19H6" />
    </svg>
  )
}

function QuizIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.853m0 0H11m3 0a6.023 6.023 0 0 0 2.77-.853" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function HeroIllustration() {
  return (
    <svg className="w-full max-w-md" viewBox="0 0 400 300" fill="none">
      {/* Background cards */}
      <rect x="60" y="40" width="160" height="100" rx="12" className="fill-primary-100 dark:fill-primary-900/30" />
      <rect x="180" y="80" width="160" height="100" rx="12" className="fill-primary-50 dark:fill-primary-900/20" />

      {/* Main flashcard */}
      <g>
        <rect x="100" y="60" width="200" height="130" rx="16" className="fill-white dark:fill-sidebar" filter="url(#shadow)" />
        <rect x="100" y="60" width="200" height="130" rx="16" className="stroke-border-light dark:stroke-border-dark" strokeWidth="1" />

        {/* Card content */}
        <text x="200" y="110" textAnchor="middle" className="fill-primary-500 text-xl font-bold" fontSize="22" fontFamily="Inter, sans-serif">
          Hello
        </text>
        <text x="200" y="140" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="14" fontFamily="Inter, sans-serif">
          Xin chào
        </text>
        <line x1="130" y1="155" x2="270" y2="155" className="stroke-border-light dark:stroke-border-dark" strokeWidth="1" />
        <text x="200" y="175" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="11" fontFamily="Inter, sans-serif">
          /həˈloʊ/
        </text>
      </g>

      {/* Floating elements */}
      <circle cx="320" cy="50" r="20" className="fill-success-500/20" />
      <path d="M312 50l5 5 10-10" className="stroke-success-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx="60" cy="200" r="16" className="fill-warning-500/20" />
      <text x="60" y="205" textAnchor="middle" className="fill-warning-500" fontSize="16" fontFamily="Inter, sans-serif">
        ★
      </text>

      <circle cx="340" cy="220" r="14" className="fill-primary-500/20" />
      <text x="340" y="225" textAnchor="middle" className="fill-primary-500" fontSize="14" fontFamily="Inter, sans-serif">
        A
      </text>

      {/* Progress bar decoration */}
      <rect x="80" y="230" width="240" height="8" rx="4" className="fill-gray-200 dark:fill-border-dark" />
      <rect x="80" y="230" width="160" height="8" rx="4" className="fill-primary-500" />

      {/* Streak fire */}
      <g transform="translate(50, 120)">
        <circle cx="0" cy="0" r="18" className="fill-danger-500/15" />
        <text x="0" y="6" textAnchor="middle" fontSize="18">🔥</text>
      </g>

      {/* Shadow filter */}
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  )
}
