import type { Rating } from '@/types/review'
import type { LevelInfo } from '@/types/gamification'
import { BASE_XP, MAX_STREAK_MULTIPLIER, STREAK_MULTIPLIER_STEP, XP_PER_LEVEL_UNIT } from '@/config/constants'

/**
 * Calculate XP earned for a single card review.
 */
export function calculateXP(rating: Rating, streak: number): number {
  const base = BASE_XP[rating]
  const multiplier = Math.min(MAX_STREAK_MULTIPLIER, 1.0 + streak * STREAK_MULTIPLIER_STEP)
  return Math.round(base * multiplier)
}

/**
 * Calculate cumulative XP required to reach a given level.
 * Uses triangular number formula: level N requires N*(N-1)/2 * 100 XP
 */
export function xpForLevel(level: number): number {
  return (level * (level - 1)) / 2 * XP_PER_LEVEL_UNIT
}

/**
 * Calculate level from total XP.
 */
export function levelFromXP(xp: number): number {
  return Math.floor((1 + Math.sqrt(1 + 8 * xp / XP_PER_LEVEL_UNIT)) / 2)
}

/**
 * Get detailed level information for display.
 */
export function getLevelInfo(xp: number): LevelInfo {
  const level = levelFromXP(xp)
  const xpForCurrentLevel = xpForLevel(level)
  const xpForNextLevel = xpForLevel(level + 1)
  const xpInCurrentLevel = xp - xpForCurrentLevel
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel

  return {
    level,
    currentXP: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    progress: xpNeededForNext > 0 ? xpInCurrentLevel / xpNeededForNext : 1,
  }
}
