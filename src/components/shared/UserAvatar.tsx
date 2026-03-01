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

const DEFAULT_AVATAR = '/assets/default-avatar.png'

export function UserAvatar({ avatarUrl, displayName, size = 'md', className }: UserAvatarProps) {
  const src = avatarUrl || DEFAULT_AVATAR

  return (
    <div className={cn('rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0', sizeClasses[size], className)}>
      <img
        src={src}
        alt={displayName || 'Avatar'}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
