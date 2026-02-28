import { cn } from '@/lib/utils'

interface UserAvatarProps {
  avatarUrl?: string | null
  displayName?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-9 h-9 text-sm',
  lg: 'w-20 h-20 text-2xl',
}

export function UserAvatar({ avatarUrl, displayName, size = 'md', className }: UserAvatarProps) {
  const initial = displayName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className={cn('rounded-full bg-primary-500 flex items-center justify-center overflow-hidden shrink-0', sizeClasses[size], className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white">{initial}</span>
      )}
    </div>
  )
}
