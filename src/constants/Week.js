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
};

export const WeekTypeLabels = {
  [WeekTypes.nothing]: "No Events Scheduled",
  [WeekTypes.fixture]: "Fixtures",
  [WeekTypes.vets]: "Vets Handicap Competition",
  [WeekTypes.fred0]: "Fred Holden Preliminary Round",
  [WeekTypes.fred1]: "Fred Holden 1st Round",
  [WeekTypes.fred2]: "Fred Holden 2nd Round",
  [WeekTypes.fred3]: "Fred Holden 3rd Round",
  [WeekTypes.div]: "Divisional Handicap Competition",
  [WeekTypes.presentation]: "Presentation Night",
  [WeekTypes.agm]: "Annual General Meeting",
  [WeekTypes.catchup]: "Catch-Up Week"
};

export const getWeekTypeLabel = (weekType) =>
  WeekTypeLabels[weekType] ?? "Unknown Week Type";
