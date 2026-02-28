import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border bg-surface-light text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
            'dark:bg-surface-dark dark:text-gray-100 dark:border-border-dark dark:placeholder:text-gray-500',
            'transition-colors duration-150',
            error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : 'border-border-light',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
