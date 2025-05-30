import { rankChangeMap } from '@/constants/encounter.js'

export function getRankChanges (
  scoreLeft,
  scoreRight,
  rankLeft,
  rankRight
) {
  const rankDifference = Math.abs(rankLeft - rankRight)
  const winnerKey = scoreLeft > scoreRight ? 0 : 1
  const favouriteKey = rankLeft > rankRight ? 0 : 1
  const favouriteWon = winnerKey === favouriteKey

  for (const [differenceThreshold, modifierGroups] of Object.entries(rankChangeMap)) {
    if (rankDifference <= differenceThreshold) {
      return [
        modifierGroups[favouriteWon ? 0 : 1][winnerKey === 0 ? 0 : 1],
        modifierGroups[favouriteWon ? 0 : 1][winnerKey === 1 ? 0 : 1]
      ]
    }
  }

  return new Error('No rank changes assigned')
}
