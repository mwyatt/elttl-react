import dayjs from 'dayjs'

export const getDayAfter = (timeStart) => {
  return dayjs.unix(timeStart).add(1, 'day')
}

export const formatDayWithSuffixOfMonth = (timeStart) => {
  const day = getDayAfter(timeStart).date()
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || ~~(day % 100 / 10) === 1) ? 0 : day % 10]
  return `${day}${suffix} of ${dayjs.unix(timeStart).format('MMMM')}`
}

export const isCurrentWeek = (weekTimeStart) => {
  const weekStart = dayjs.unix(weekTimeStart).startOf('week')
  const todayStart = dayjs().startOf('week')

  return weekStart.isSame(todayStart)
}
