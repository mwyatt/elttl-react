export const WeekTypes = {
  nothing: 0,
  fixture: 1,
  vets: 2,
  fred0: 3,
  fred1: 4,
  fred2: 5,
  fred3: 6,
  div: 7,
  presentation: 8,
  agm: 9,
  catchup: 10
}

export const FredHoldenCupWeekTypes = [
    WeekTypes.fred0,
    WeekTypes.fred1,
    WeekTypes.fred2,
    WeekTypes.fred3,
  ]

export const WeekTypeLabels = {
  [WeekTypes.nothing]: 'No Events Scheduled',
  [WeekTypes.fixture]: 'Fixtures', // Show all fixtures scheduled to be played
  [WeekTypes.vets]: 'Vets Competitions', // Show fragment from /competitions/ page
  [WeekTypes.fred0]: 'Fred Holden Preliminary Round', // Show recent press relating to this
  [WeekTypes.fred1]: 'Fred Holden 1st Round', // Show recent press relating to this
  [WeekTypes.fred2]: 'Fred Holden 2nd Round', // Show recent press relating to this
  [WeekTypes.fred3]: 'Fred Holden 3rd Round', // Show recent press relating to this
  [WeekTypes.div]: 'Divisional Handicap Competition', // Show fragment from /competitions/ page
  [WeekTypes.presentation]: 'Presentation Night',
  [WeekTypes.agm]: 'Annual General Meeting',
  [WeekTypes.catchup]: 'Catch-Up Week'
}

export const getWeekTypeLabel = (weekType) =>
  WeekTypeLabels[weekType] ?? 'Unknown Week Type'
