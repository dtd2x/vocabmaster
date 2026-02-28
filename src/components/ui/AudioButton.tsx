import { useAudio } from '@/hooks/useAudio'
import { cn } from '@/lib/utils'

interface AudioButtonProps {
  word: string
  audioUrl?: string | null
  lang?: 'en-US' | 'vi-VN'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-1.5',
  lg: 'w-10 h-10 p-2',
}

export function AudioButton({ word, audioUrl, lang = 'en-US', size = 'md', className }: AudioButtonProps) {
  const { play, isPlaying } = useAudio({ word, audioUrl, lang })

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        play()
      }}
      disabled={isPlaying}
      className={cn(
        'rounded-full transition-all duration-200 shrink-0',
        'text-gray-400 hover:text-primary-600 hover:bg-primary-50',
        'dark:hover:text-primary-400 dark:hover:bg-primary-900/30',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        isPlaying && 'text-primary-600 dark:text-primary-400 animate-pulse',
        sizeClasses[size],
        className,
      )}
      title="Phát âm"
      aria-label={`Phát âm từ ${word}`}
    >
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
      </svg>
    </button>
  )
}
