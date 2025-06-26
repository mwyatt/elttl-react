import '@testing-library/jest-dom'
import { getRankChanges } from '@/lib/encounter'

test('it calculates rank changes', async () => {
  const rankChanges = getRankChanges(0, 3, 2500, 2600)

  expect(rankChanges).toEqual([-5, 8])

  const furtherRankChanges = getRankChanges(3, 0, 2500, 2600)

  expect(furtherRankChanges).toEqual([21, -14])
})

test('it calculates correct rank changes depending on ranking difference', async () => {
})

test('it calculates a big rank change for a good win', async () => {
})

test('it calculates a big rank change for a bad loss', async () => {
})
