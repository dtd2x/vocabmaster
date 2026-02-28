export interface Achievement {
  id: string
  name: string
  description: string
  icon_url: string | null
  xp_reward: number
  condition: Record<string, unknown>
  unlocked?: boolean
  unlocked_at?: string
}

export interface LevelInfo {
  level: number
  currentXP: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  progress: number // 0-1
}
