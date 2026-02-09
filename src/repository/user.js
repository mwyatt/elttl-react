import { getConnection } from '@/lib/database'

export async function getUserById (id) {
  const connection = await getConnection()

  const [users] = await connection.execute(`
  select * from user 
           where id = :id
  `, {
    id
  })

  connection.release()

  if (!users.length) return null

  return users[0]
}
