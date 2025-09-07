import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

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

  const [advertisementsSecondary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'small-primary'
  `)

  const commonLinks = {
    prePractice: { name: 'Prepaid Practice Scheme', url: '/prepaid-practice-scheme' },
    competitions: { name: 'Competitions', url: '/competitions' },
    resultArchive: { name: 'Results Archive', url: '/result' },
    contactUs: { name: 'Contact Us', url: '/contact-us' },
    townTeams: { name: 'Town Teams', url: '/page/town-teams' },
    lancsCountyTTAssoc: {
      name: 'Lancashire County TT Assoc',
      url: 'https://lancashirecounty.ttleagues.com/page/affiliationtolancashirecountytta',
      target: '_blank'
    },

    // @todo get assets - sftp could be easiest method to store initially
    // would be ideal to allow updating of these for logged in users
    gdpr: { name: 'GDPR', url: '/GDPR-2018-2019.pdf', target: '_blank' },
    diciplineProcedure: { name: 'Code of Conduct', url: '/code-of-conduct' },
    safeguardingPolicy: { name: 'Safeguarding Policy', url: '/safeguarding-guidance-2020.pdf', target: '_blank' }
  }

  connection.release()

  return NextResponse.json({
    // headLinks: [
    //   commonLinks.prePractice,
    //   commonLinks.resultArchive,
    //   commonLinks.contactUs,
    //   commonLinks.townTeams,
    //   commonLinks.lancsCountyTTAssoc,
    //   commonLinks.gdpr,
    //   commonLinks.diciplineProcedure,
    //   commonLinks.safeguardingPolicy
    // ],
    footLinks: [
      { area: 1, name: 'Coaching & Sessions', url: '/sessions' },
      { area: 1, ...commonLinks.prePractice },
      { area: 1, ...commonLinks.competitions },
      { area: 1, name: 'Schools', url: '/schools' },
      { area: 1, name: 'Constitution & Rules', url: '/constitution-and-rules' },
      // { area: 1, ...commonLinks.townTeams },
      { area: 2, ...commonLinks.lancsCountyTTAssoc },
      { area: 2, ...commonLinks.gdpr },
      { area: 2, ...commonLinks.diciplineProcedure },
      { area: 2, ...commonLinks.safeguardingPolicy },
      { area: 2, ...commonLinks.contactUs }
    ],
    menuPrimary: [
      {
        name: 'The League',
        url: '/',
        children: [
          { name: 'Download Handbook', url: '/handbook-2024-2025.pdf', target: '_blank' },
          { name: 'Press Releases', url: '/press' },
          commonLinks.competitions,
          { name: 'Contact us', url: '/contact-us' }
        ]
      },
      {
        name: 'Results', url: '/result', children: divisionsChildren
      }
    ],
    advertisementsSecondary
  }, { status: StatusCodes.OK })
}
