import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">:(</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
