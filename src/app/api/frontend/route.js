import { NextResponse } from 'next/server'
import {getConnection} from "@/lib/database";

export async function GET(request) {
  const connection = await getConnection()

  const [currentYears] = await connection.query(`
      SELECT id, name
      FROM tennisYear
      WHERE id = 12
  `);
  const currentYear = currentYears[0]

  const [divisions] = await connection.execute(`
      SELECT name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id]);


  let divisionsChildren = []

  divisions.forEach((division) => {
    divisionsChildren.push({
      name: division.name,
      url: `/result/${currentYear.name}/${division.name.toLowerCase()}`,
      children: [
        {name: 'League Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}`},
        {name: 'Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit`},
        {name: 'Doubles Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit-doubles`},
      ]
    })
  })

  return NextResponse.json({
      headLinks: [
        {name: 'Prepaid Practice Scheme', url: '/page/pepaid-practice-scheme'},
        {name: 'Results Archive', url: '/results'},
        {name: 'Contact Us', url: '/contact-us'},
        {name: 'Town Teams', url: '/contact-us'},
        {name: 'Lancashire County TT Assoc', url: '/contact-us'},
        {name: 'GDPR', url: '/contact-us'},
        {name: 'Code of Conduct', url: '/contact-us'},
        {name: 'Safeguarding Policy', url: '/contact-us'},
      ],
      footLinks: [
        {area: 1, name: 'Coaching', url: '/page/pepaid-practice-scheme'},
        {area: 1, name: 'Schools', url: '/results'},
        {area: 1, name: 'Summer League', url: '/contact-us'},
        {area: 1, name: 'Fred Holden Cup', url: '/contact-us'},
        {area: 1, name: 'Local Clubs', url: '/contact-us'},
        {area: 1, name: 'Rules', url: '/contact-us'},
        {area: 2, name: 'Prepaid Practice Scheme', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Results Archive', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Contact Us', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Town Teams', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Lancashire County TT Assoc', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'GDPR', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Code of Conduct', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Safeguarding Policy', url: '/page/pepaid-practice-scheme'},
      ],
      menuPrimary: [
        {
          name: 'The League', url: '/', children: [
            {name: 'Handbook', url: '/asset/elttl-handbook.pdf'},
            {name: 'Fixtures', url: '/asset/league-fixtures-2023-2024.xlsx'},
            {name: 'Press Releases', url: '/press'},
            {name: 'Competitions', url: '/page/competitions'},
            {name: 'Contact us', url: '/contact-us'},
          ]
        },
        {
          name: 'Results', url: '/results', children: divisionsChildren
        }
      ],
    }, { status: 200 });
}