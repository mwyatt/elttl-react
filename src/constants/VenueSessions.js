import dayjs from 'dayjs'

const sessionVenues = [
  { id: 5, name: 'Hyndburn Leisure Centre', slug: 'hyndburn-leisure-centre' },
  { id: 14, name: 'St Peter\'s Sports Centre', slug: 'st-peters-sports-centre' },
  { id: 15, name: 'Sion Church', slug: 'sion-church' }
]

const sessionVenueIds = {
  hyndburn: 5,
  stpeters: 14,
  sionchurch: 15,
}
const batAndChatMorning = 'Bat and Chat 10:00 AM - 12:00 PM'
const hyndburnPracticeEvening = 'Practice 7:00 PM - 10:00 PM'

export const sessions = {
  1: {
    [sessionVenueIds.hyndburn]: [batAndChatMorning, hyndburnPracticeEvening],
  },
  2: {
    [sessionVenueIds.sionchurch]: [batAndChatMorning],
    [sessionVenueIds.hyndburn]: [hyndburnPracticeEvening],
  },
  3: {
    [sessionVenueIds.stpeters]: [batAndChatMorning],
    [sessionVenueIds.hyndburn]: [hyndburnPracticeEvening],
  },
  4: {
    [sessionVenueIds.hyndburn]: [batAndChatMorning, hyndburnPracticeEvening],
    [sessionVenueIds.stpeters]: [batAndChatMorning]
  },
  5: {
    [sessionVenueIds.hyndburn]: ['Junior Coaching 6:00 PM - 8:00 PM'],
  },
  6: {
    [sessionVenueIds.hyndburn]: ['Practice 10:00 AM - 12:00 PM'],
  },
}

export const getSessionVenue = (venueId) => {
  return sessionVenues.find(v => v.id === parseInt(venueId))
}

export const getTodaysVenueSessions = () => {
  const now = dayjs()
  const today = now.day()
  const todaySessions = sessions[today] || {}
  return Object.entries(todaySessions).map(([venueId, times]) => {
    return {
      venue: getSessionVenue(venueId),
      times: times
    }
  })
}
