import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserProfile, UserStats } from '@/types/user'
import { supabase } from '@/config/supabase'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  stats: UserStats | null
  loading: boolean

  initialize: () => () => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
  fetchStats: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  stats: null,
  loading: true,

  initialize: () => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false })
      if (session?.user) {
        get().fetchProfile()
        get().fetchStats()
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
      if (session?.user) {
        get().fetchProfile()
        get().fetchStats()
      } else {
        set({ profile: null, stats: null })
      }
    })

    return () => subscription.unsubscribe()
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  signUp: async (email, password, displayName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: displayName } },
    })
    if (error) throw error
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw error
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, profile: null, stats: null })
  },

  fetchProfile: async () => {
    const userId = get().user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }
    set({ profile: data })
  },

  fetchStats: async () => {
    const userId = get().user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching stats:', error)
      return
    }
    set({ stats: data })
  },
}))
