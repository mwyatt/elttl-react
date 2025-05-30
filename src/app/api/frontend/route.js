import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'

export async function GET (request) {
  const connection = await getConnection()

  const [currentYears] = await connection.query(`
      SELECT id, name
      FROM tennisYear
      WHERE id = 12
  `)
  const currentYear = currentYears[0]

  const [divisions] = await connection.execute(`
      SELECT name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id])

  const divisionsChildren = []

  divisions.forEach((division) => {
    divisionsChildren.push({
      name: `${division.name} Division Overview`,
      url: `/result/${currentYear.name}/${division.name.toLowerCase()}`,
      children: [
        { name: 'League Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/league` },
        { name: 'Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit` },
        { name: 'Doubles Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/doubles-merit` }
      ]
    })
  })

  const commonLinks = {
    prePractice: { name: 'Prepaid Practice Scheme', url: '/page/pre-practice-scheme' },
    resultArchive: { name: 'Results Archive', url: '/result' },
    contactUs: { name: 'Contact Us', url: '/contact-us' },
    townTeams: { name: 'Town Teams', url: '/page/town-teams' },
    lancsCountyTTAssoc: { name: 'Lancashire County TT Assoc', url: 'https://lancashirecounty.ttleagues.com/page/affiliationtolancashirecountytta', target: '_blank' },

    // @todo get assets - shftp could be easiest method to store initially
    // would be ideal to allow updating of these for logged in users
    gdpr: { name: 'GDPR', url: '/GDPR-2018-2019.pdf', target: '_blank' },
    diciplineProcedure: { name: 'Code of Conduct', url: '/disciplinary-procedure.pdf', target: '_blank' },
    safeguardingPolicy: { name: 'Safeguarding Policy', url: '/safeguarding-guidance-2020.pdf', target: '_blank' }
  }

  return NextResponse.json({
    headLinks: [
      commonLinks.prePractice,
      commonLinks.resultArchive,
      commonLinks.contactUs,
      commonLinks.townTeams,
      commonLinks.lancsCountyTTAssoc,
      commonLinks.gdpr,
      commonLinks.diciplineProcedure,
      commonLinks.safeguardingPolicy
    ],
    footLinks: [
      { area: 1, name: 'Coaching', url: '/page/coaching' },
      { area: 1, name: 'Schools', url: '/page/schools' },
      { area: 1, name: 'Summer League', url: '/page/summer-league' },
      { area: 1, name: 'Fred Holden Cup', url: '/page/fred-holden-cup' },
      { area: 1, name: 'Local Clubs', url: '/page/local-clubs' },
      { area: 1, name: 'Rules', url: '/constitution-and-rules' },
      { area: 2, ...commonLinks.prePractice },
      { area: 2, ...commonLinks.resultArchive },
      { area: 2, ...commonLinks.contactUs },
      { area: 2, ...commonLinks.townTeams },
      { area: 2, ...commonLinks.lancsCountyTTAssoc },
      { area: 2, ...commonLinks.gdpr },
      { area: 2, ...commonLinks.diciplineProcedure },
      { area: 2, ...commonLinks.safeguardingPolicy }
    ],
    menuPrimary: [
      {
        name: 'The League',
        url: '/',
        children: [
          { name: 'Download Handbook', url: '/handbook-2024-2025.pdf', target: '_blank' },
          { name: 'Press Releases', url: '/press' },
          { name: 'Competitions', url: '/page/competitions' },
          { name: 'Contact us', url: '/contact-us' }
        ]
      },
      {
        name: 'Results', url: '/result', children: divisionsChildren
      }
    ]
  }, { status: 200 })
}
