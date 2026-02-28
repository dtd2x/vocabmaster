import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className, hover = false, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-sidebar rounded-xl border border-border-light dark:border-border-dark',
        hover && 'hover:shadow-sm transition-all duration-200 cursor-pointer',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
