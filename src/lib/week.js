import { getDayAfter } from '@/lib/date'
import { WeekTypes } from '@/constants/Week'
import dayjs from 'dayjs'

// Moves the week commencing date forward to match the style used by elttl
export const getWeekDate = (weekType, timeStart) => {
  const weekCommencingDate = getDayAfter(timeStart)
  const eventDate = dayjs.unix(timeStart)

  // @todo refactor
  switch (weekType) {
    case WeekTypes.nothing:
    case WeekTypes.fixture:
    case WeekTypes.vets:
    case WeekTypes.fred0:
    case WeekTypes.fred1:
    case WeekTypes.fred2:
    case WeekTypes.fred3:
    case WeekTypes.div:
    case WeekTypes.catchup:
      return weekCommencingDate
    case WeekTypes.presentation:
    case WeekTypes.agm:
    case WeekTypes.closedCompetition:
      return eventDate
  }
}
