export const SIDE_LEFT = 'left'
export const SIDE_RIGHT = 'right'

export const scorecardStructure = [
  [1, 2],
  [3, 1],
  [2, 3],
  [3, 2],
  [1, 3],
  ['doubles', 'doubles'],
  [2, 1],
  [3, 3],
  [2, 2],
  [1, 1]
]

export const maxEncounters = scorecardStructure.length
export const minEncounters = 3

export const rankChangeMap = {
  24: [[12, -8], [12, -8]],
  49: [[11, -7], [14, -9]],
  99: [[9, -6], [17, -11]],
  149: [[8, -5], [21, -14]],
  199: [[6, -4], [26, -17]],
  299: [[5, -3], [33, -22]],
  399: [[3, -2], [45, -30]],
  499: [[2, -1], [60, -40]],
  99999: [[0, -0], [75, -50]]
}

export const rankMeritChangeMap = {
  24: [[10, null], [10, null]],
  49: [[9, null], [11, null]],
  99: [[8, null], [12, null]],
  149: [[7, null], [13, null]],
  199: [[6, null], [14, null]],
  299: [[5, null], [15, null]],
  399: [[4, null], [16, null]],
  499: [[3, null], [17, null]],
  99999: [[2, null], [18, null]]
}

// export const rankMeritChangeMap = {
//   24: [[8, null], [8, null]],
//   49: [[7, null], [9, null]],
//   99: [[6, null], [10, null]],
//   149: [[5, null], [11, null]],
//   199: [[4, null], [12, null]],
//   299: [[3, null], [13, null]],
//   399: [[2, null], [14, null]],
//   499: [[1, null], [15, null]],
//   99999: [[0, null], [16, null]]
// }
//
// @todo
export const rankMeritDescriptions = {
  2: 'Beat a much lower ranked player',
  6: 'Beat a lower ranked player',
  12: 'Beat a player of similar rank',
  14: 'Beat a stronger player',
  21: 'Beat a much stronger player',
  45: 'Beat a really strong player'
//   otherwise 'picked up points'
}

export function getSides () {
  return [SIDE_LEFT, SIDE_RIGHT]
}

export function getSidesCapitalized () {
  return [
    SIDE_LEFT.charAt(0).toUpperCase() + SIDE_LEFT.slice(1),
    SIDE_RIGHT.charAt(0).toUpperCase() + SIDE_RIGHT.slice(1)
  ]
}

export function getOtherSide (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? SIDE_RIGHT : SIDE_LEFT
}

export function getOtherSideCapitalized (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? SIDE_RIGHT.charAt(0).toUpperCase() + SIDE_RIGHT.slice(1) : SIDE_LEFT.charAt(0).toUpperCase() + SIDE_LEFT.slice(1)
}

export function getSideCapitalized (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide.charAt(0).toUpperCase() + normalisedSide.slice(1)
}

export function getSideIndex (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? 0 : 1
}
