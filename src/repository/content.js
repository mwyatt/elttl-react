import { getConnection } from '@/lib/database'

export async function getPressByTitleLikeAndPublishedAfter (titleFragment, datePublished) {
  const connection = await getConnection()

  const [contents] = await connection.execute(`
  select * from content 
           where type = 'press'
             and title like :title
             and timePublished > :timePublished;
  `, {
    title: `%${titleFragment}%`,
    timePublished: datePublished.unix()
  })

  connection.release()

  return contents
}
