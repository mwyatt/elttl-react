const SIDE_LEFT = 'left'
const SIDE_RIGHT = 'right'

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
