import { getConnection } from '@/lib/database'

export default async function (yearId, ignoreExistingFixtures = false) {
  if (yearId === undefined || yearId === null) {
    throw new Error('yearId is required')
  }

  const connection = await getConnection()

  // Check if the year exists in the database
  const [years] = await connection.execute(`
      select ty.id, ty.name
      from tennisYear ty
          where ty.id = :yearId
    `, {
    yearId
  })

  if (years.length === 0) {
    connection.release()

    throw new Error(`Year with ID ${yearId} does not exist`)
  }

  // Check if the year has fixtures and if so, throw an error, but allow this to be bypassed after confirmation
  if (!ignoreExistingFixtures) {
    const [fixtures] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM tennisFixture
      WHERE yearId = :yearId
    `, {
      yearId
    })

    if (fixtures[0].count > 0) {
      connection.release()

      throw new Error(`Year with ID ${yearId} already has fixtures. Use 'ignoreExistingFixtures' to bypass this check.`)
    }
  }

  // Generate the fixtures by looking at the teams per division

  // Get all the divisions for the year
  const [divisions] = await connection.execute(`
    SELECT id, name
    FROM tennisDivision
    WHERE yearId = :yearId
  `, {
    yearId
  })

  // Get all the teams for the year
  const [teams] = await connection.execute(`
    SELECT id, name, divisionId
    FROM tennisTeam
    WHERE yearId = :yearId
  `, {
    yearId
  })

  // Remove all the existing fixtures and encounters
  await connection.execute(`
    DELETE FROM tennisFixture
    WHERE yearId = :yearId
  `, {
    yearId
  })

  await connection.execute(`
    DELETE FROM tennisEncounter
    WHERE yearId = :yearId
  `, {
    yearId
  })

  // Generate fixtures for each division
  for (const division of divisions) {
    const divisionTeams = teams.filter(team => team.divisionId === division.id)

    // Generate fixtures for each team in the division
    for (let i = 0; i < divisionTeams.length; i++) {
      for (let j = 0; j < divisionTeams.length; j++) {
        const homeTeam = divisionTeams[i]
        const awayTeam = divisionTeams[j]

        // Create a fixture if the teams are not the same
        if (homeTeam.id !== awayTeam.id) {
          await connection.execute(`
            INSERT INTO tennisFixture (yearId, teamIdLeft, teamIdRight)
            VALUES (:yearId, :teamIdLeft, :teamIdRight)
          `, {
            yearId,
            teamIdLeft: homeTeam.id,
            teamIdRight: awayTeam.id
          })
        }
      }
    }
  }

  connection.release()

  return {
  }
}
