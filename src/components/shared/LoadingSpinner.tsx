import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center text-primary-500', className)}>
      <svg className={cn(sizes[size])} viewBox="0 0 36 36" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
        <style>{`
          .box5532 {
            fill: currentColor;
            transform-origin: 50% 50%;
          }
          @keyframes box5532-1 {
            9.09%  { transform: translate(-12px,0); }
            18.18% { transform: translate(0px,0); }
            27.27% { transform: translate(0px,0); }
            36.36% { transform: translate(12px,0); }
            45.45% { transform: translate(12px,12px); }
            54.55% { transform: translate(12px,12px); }
            63.64% { transform: translate(12px,12px); }
            72.73% { transform: translate(12px,0px); }
            81.82% { transform: translate(0px,0px); }
            90.91% { transform: translate(-12px,0px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-2 {
            9.09%  { transform: translate(0,0); }
            18.18% { transform: translate(12px,0); }
            27.27% { transform: translate(0px,0); }
            36.36% { transform: translate(12px,0); }
            45.45% { transform: translate(12px,12px); }
            54.55% { transform: translate(12px,12px); }
            63.64% { transform: translate(12px,12px); }
            72.73% { transform: translate(12px,12px); }
            81.82% { transform: translate(0px,12px); }
            90.91% { transform: translate(0px,12px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-3 {
            9.09%  { transform: translate(-12px,0); }
            18.18% { transform: translate(-12px,0); }
            27.27% { transform: translate(0px,0); }
            36.36% { transform: translate(-12px,0); }
            45.45% { transform: translate(-12px,0); }
            54.55% { transform: translate(-12px,0); }
            63.64% { transform: translate(-12px,0); }
            72.73% { transform: translate(-12px,0); }
            81.82% { transform: translate(-12px,-12px); }
            90.91% { transform: translate(0px,-12px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-4 {
            9.09%  { transform: translate(-12px,0); }
            18.18% { transform: translate(-12px,0); }
            27.27% { transform: translate(-12px,-12px); }
            36.36% { transform: translate(0px,-12px); }
            45.45% { transform: translate(0px,0px); }
            54.55% { transform: translate(0px,-12px); }
            63.64% { transform: translate(0px,-12px); }
            72.73% { transform: translate(0px,-12px); }
            81.82% { transform: translate(-12px,-12px); }
            90.91% { transform: translate(-12px,0px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-5 {
            9.09%  { transform: translate(0,0); }
            18.18% { transform: translate(0,0); }
            27.27% { transform: translate(0,0); }
            36.36% { transform: translate(12px,0); }
            45.45% { transform: translate(12px,0); }
            54.55% { transform: translate(12px,0); }
            63.64% { transform: translate(12px,0); }
            72.73% { transform: translate(12px,0); }
            81.82% { transform: translate(12px,-12px); }
            90.91% { transform: translate(0px,-12px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-6 {
            9.09%  { transform: translate(0,0); }
            18.18% { transform: translate(-12px,0); }
            27.27% { transform: translate(-12px,0); }
            36.36% { transform: translate(0px,0); }
            45.45% { transform: translate(0px,0); }
            54.55% { transform: translate(0px,0); }
            63.64% { transform: translate(0px,0); }
            72.73% { transform: translate(0px,12px); }
            81.82% { transform: translate(-12px,12px); }
            90.91% { transform: translate(-12px,0px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-7 {
            9.09%  { transform: translate(12px,0); }
            18.18% { transform: translate(12px,0); }
            27.27% { transform: translate(12px,0); }
            36.36% { transform: translate(0px,0); }
            45.45% { transform: translate(0px,-12px); }
            54.55% { transform: translate(12px,-12px); }
            63.64% { transform: translate(0px,-12px); }
            72.73% { transform: translate(0px,-12px); }
            81.82% { transform: translate(0px,0px); }
            90.91% { transform: translate(12px,0px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-8 {
            9.09%  { transform: translate(0,0); }
            18.18% { transform: translate(-12px,0); }
            27.27% { transform: translate(-12px,-12px); }
            36.36% { transform: translate(0px,-12px); }
            45.45% { transform: translate(0px,-12px); }
            54.55% { transform: translate(0px,-12px); }
            63.64% { transform: translate(0px,-12px); }
            72.73% { transform: translate(0px,-12px); }
            81.82% { transform: translate(12px,-12px); }
            90.91% { transform: translate(12px,0px); }
            100%   { transform: translate(0px,0px); }
          }
          @keyframes box5532-9 {
            9.09%  { transform: translate(-12px,0); }
            18.18% { transform: translate(-12px,0); }
            27.27% { transform: translate(0px,0); }
            36.36% { transform: translate(-12px,0); }
            45.45% { transform: translate(0px,0); }
            54.55% { transform: translate(0px,0); }
            63.64% { transform: translate(-12px,0); }
            72.73% { transform: translate(-12px,0); }
            81.82% { transform: translate(-24px,0); }
            90.91% { transform: translate(-12px,0); }
            100%   { transform: translate(0px,0); }
          }
          .box5532:nth-child(1) { animation: box5532-1 4s infinite; }
          .box5532:nth-child(2) { animation: box5532-2 4s infinite; }
          .box5532:nth-child(3) { animation: box5532-3 4s infinite; }
          .box5532:nth-child(4) { animation: box5532-4 4s infinite; }
          .box5532:nth-child(5) { animation: box5532-5 4s infinite; }
          .box5532:nth-child(6) { animation: box5532-6 4s infinite; }
          .box5532:nth-child(7) { animation: box5532-7 4s infinite; }
          .box5532:nth-child(8) { animation: box5532-8 4s infinite; }
          .box5532:nth-child(9) { animation: box5532-9 4s infinite; }
        `}</style>
        <g>
          <rect className="box5532" x="13" y="1" rx="1" width="10" height="10" />
          <rect className="box5532" x="13" y="1" rx="1" width="10" height="10" />
          <rect className="box5532" x="25" y="25" rx="1" width="10" height="10" />
          <rect className="box5532" x="13" y="13" rx="1" width="10" height="10" />
          <rect className="box5532" x="13" y="13" rx="1" width="10" height="10" />
          <rect className="box5532" x="25" y="13" rx="1" width="10" height="10" />
          <rect className="box5532" x="1" y="25" rx="1" width="10" height="10" />
          <rect className="box5532" x="13" y="25" rx="1" width="10" height="10" />
          <rect className="box5532" x="25" y="25" rx="1" width="10" height="10" />
        </g>
      </svg>
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 z-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
