import '@testing-library/jest-dom'
import { getRankChanges } from '@/lib/encounter'

test('it calculates rank changes', () => {
  const rankChanges = getRankChanges(0, 3, 2500, 2600)
  expect(rankChanges).toEqual([-5, 8])

  const furtherRankChanges = getRankChanges(3, 0, 2500, 2600)
  expect(furtherRankChanges).toEqual([21, -14])

  // 250 difference - expected win
  const moreRankChanges = getRankChanges(0, 3, 2350, 2600)
  expect(moreRankChanges).toEqual([-3, 5])

  // 250 difference - unexpected win
  const evenMoreRankChanges = getRankChanges(3, 0, 2350, 2600)
  expect(evenMoreRankChanges).toEqual([33, -22])
})

test('it calculates a big rank change for a good win', () => {
  const rankChanges = getRankChanges(0, 3, 2600, 2150)
  expect(rankChanges).toEqual([-40, 60])
})

test('it calculates a small rank change for an expected loss', () => {
  const rankChanges = getRankChanges(0, 3, 1500, 1850)
  expect(rankChanges).toEqual([-2, 3])
})
