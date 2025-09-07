import { getConnection } from '@/lib/database'
import { getCurrentYear } from '@/app/lib/year'

export default async function () {
  const connection = await getConnection()
  const currentYear = await getCurrentYear()

  const newYearName = parseInt(currentYear.name) + 1
  const newYearId = parseInt(currentYear.id) + 1

  await connection.execute(`
    INSERT INTO tennisYear (id, name, value)
    VALUES (:id, :name, '')
  `, {
    id: newYearId,
    name: newYearName
  })

  // Copy divisions
  await connection.execute(`
    INSERT INTO tennisDivision (id, name, yearId)
    SELECT id, name, :newYearId
    FROM tennisDivision
    WHERE yearId = :currentYearId
  `, {
    newYearId,
    currentYearId: currentYear.id
  })

  // Copy teams
  await connection.execute(`
    INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId)
    SELECT id, :newYearId, name, slug, homeWeekday, secretaryId, venueId, divisionId
    FROM tennisTeam
    WHERE yearId = :currentYearId
  `, {
    newYearId,
    currentYearId: currentYear.id
  })

  // Copy venues
  await connection.execute(`
    INSERT INTO tennisVenue (id, yearId, name, slug, location)
    SELECT id, :newYearId, name, slug, location
    FROM tennisVenue
    WHERE yearId = :currentYearId
  `, {
    newYearId,
    currentYearId: currentYear.id
  })

  // Copy players
  await connection.execute(`
    INSERT INTO tennisPlayer (id, yearId, nameFirst, nameLast, slug, \`rank\`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId)
    SELECT id, :newYearId, nameFirst, nameLast, slug, \`rank\`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId
    FROM tennisPlayer
    WHERE yearId = :currentYearId
  `, {
    newYearId,
    currentYearId: currentYear.id
  })

  // Update options table to point to the new year
  await connection.execute(`
    UPDATE options
    SET value = :newYearId
    WHERE name = 'year_id'
  `, {
    newYearId
  })

  connection.release()

  return {
    newYearId,
    newYearName
  }
}
