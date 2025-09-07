import { getConnection } from '@/lib/database'

export async function getCurrentYear () {
  const connection = await getConnection()

  const [currentYears] = await connection.execute(`
    select ty.id, ty.name
from options o
inner join tennisYear ty on ty.id = o.value
where o.name = 'year_id'

  `)

  connection.release()

  return currentYears[0]
}

export async function getYearDivisionId (yearName, divisionSlug) {
  const connection = await getConnection()

  const [yearDivisionIds] = await connection.execute(`
      SELECT td.id AS divisionId,
             ty.id AS yearId
      FROM tennisDivision td
               LEFT JOIN tennisYear ty ON ty.id = td.yearId
      WHERE ty.name = ?
        AND td.name = ?
  `, [yearName, divisionSlug])

  connection.release()

  if (yearDivisionIds.length === 0) {
    return
  }

  return yearDivisionIds[0]
}
