import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { FullPageLoader } from '@/components/shared/LoadingSpinner'
import { ROUTES } from '@/config/routes'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    })
  }, [navigate])

  return <FullPageLoader />
}
