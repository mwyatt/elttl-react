import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import { StatusCodes } from 'http-status-codes'
import { ContentTypes } from '@/constants/Content'
import { getUniqueSlugFromTitle } from '@/lib/content'
import ContentStatus from '@/constants/ContentStatus'

export async function GET (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const isCreate = id === 'create'
  let news = []

  if (isCreate) {
    news = [
      {
        id: 'create',
        title: '',
        slug: '',
        html: '',
        timePublished: '',
        status: '',
        userId: ''
      }
    ]
  } else {
    [news] = await connection.execute(`
      SELECT
        id,
        title,
        slug,
        html,
        timePublished,
        status,
        userId
        FROM content c
          WHERE c.type = :contentType
          and c.id = :id
    `, {
      id,
      contentType: ContentTypes.PRESS
    })
  }

  connection.release()

  return NextResponse.json({
    newsArticle: news[0]
  }, { status: StatusCodes.OK })
}

export async function PUT (request, { params }) {
  const connection = await getConnection()
  const { id } = await params
  const { newsArticle } = await request.json()
  const isCreate = id === 'create'
  let affectedNewsArticleId = id
  let response = []

  const slug = await getUniqueSlugFromTitle(affectedNewsArticleId, newsArticle.title)

  if (isCreate) {
    [response] = await connection.execute(`
         INSERT INTO content (title, slug, html, timePublished, userId, type, status)
         VALUES (:title, :slug, :html, :timePublished, :userId, :type, :status)
    `, {
      ...newsArticle,
      type: ContentTypes.PRESS,
      slug,
      timePublished: Math.floor(Date.now() / 1000),
      status: ContentStatus.PUBLISHED
    })
    affectedNewsArticleId = response.insertId
  } else {
    [response] = await connection.execute(`
         UPDATE content
         SET 
             title = :title,
             slug = :slug,
             html = :html,
             status = :status
        WHERE id = :id
    `, {
      ...newsArticle,
      id,
      slug
    })
  }

  const [news] = await connection.execute(`
      SELECT
id, title, slug, html, timePublished, status, userId
        FROM content c
          WHERE c.id = :id
    `, {
    id: affectedNewsArticleId
  })

  connection.release()

  return NextResponse.json({
    message: isCreate ? 'News article created successfully!' : 'News article updated successfully!',
    newsArticle: news[0],
    affectedRows: response.affectedRows
  }, { status: StatusCodes.OK })
}
