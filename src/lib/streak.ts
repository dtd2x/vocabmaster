import { differenceInCalendarDays, startOfDay } from 'date-fns'

/**
 * Calculate updated streak based on last review date.
 * Returns { currentStreak, isNewDay } where isNewDay indicates
 * if this is the first review of the day (for streak increment).
 */
export function calculateStreak(
  lastReviewDate: string | null,
  currentStreak: number
): { newStreak: number; isNewDay: boolean } {
  const today = startOfDay(new Date())

  if (!lastReviewDate) {
    return { newStreak: 1, isNewDay: true }
  }

  const lastDate = startOfDay(new Date(lastReviewDate))
  const daysDiff = differenceInCalendarDays(today, lastDate)

  if (daysDiff === 0) {
    // Same day, streak unchanged
    return { newStreak: currentStreak, isNewDay: false }
  }

  if (daysDiff === 1) {
    // Consecutive day, increment streak
    return { newStreak: currentStreak + 1, isNewDay: true }
  }

  // Streak broken (missed one or more days)
  return { newStreak: 1, isNewDay: true }
}

/**
 * Get the number of days until streak breaks (always tomorrow if active today).
 */
export function streakExpiresIn(lastReviewDate: string | null): number {
  if (!lastReviewDate) return 0

  const lastDate = startOfDay(new Date(lastReviewDate))
  const today = startOfDay(new Date())
  const daysDiff = differenceInCalendarDays(today, lastDate)

  if (daysDiff === 0) return 1 // Reviewed today, expires tomorrow
  if (daysDiff === 1) return 0 // Need to review today!
  return -1 // Already broken
}
