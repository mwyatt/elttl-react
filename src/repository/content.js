import { getConnection } from '@/lib/database'

export async function getPressByTitleLikeAndPublishedAfter (titleFragment, datePublished) {
  const connection = await getConnection()

  const [contents] = await connection.execute(`
  select * from content 
           where type = 'press'
             and title like :title
             and timePublished > :timePublished
  order by timePublished desc
  `, {
    title: `%${titleFragment}%`,
    timePublished: datePublished.unix()
  })

  connection.release()

  return contents
}

export async function getPressBySlugLike (slug) {
  const connection = await getConnection()

  const [contents] = await connection.execute(`
  select * from content 
           where type = 'press'
             and slug like :slug
  `, {
    slug: `%${slug}%`
  })

  connection.release()

  return contents
}
