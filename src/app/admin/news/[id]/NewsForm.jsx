'use client'

import { useRef, useState } from 'react'
import Feedback from '@/components/Feedback'
import FullLoader from '@/components/FullLoader'
import GeneralLink from '@/components/GeneralLink'
import Editor from '@/app/admin/news/[id]/Editor'
import ContentStatus from '@/constants/ContentStatus'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'

export default function NewsForm ({ cookie, newsArticle, user }) {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newsArticleData, setNewsArticleData] = useState(newsArticle)
  const isCreate = newsArticleData.id === 'create'
  const formRef = useRef(null)

  const contentStatuses = [
    { value: ContentStatus.UNPUBLISHED, label: 'Unpublished' },
    { value: ContentStatus.PUBLISHED, label: 'Published' }
  ]

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }
      }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: newsArticleData.html,
    immediatelyRender: false
  })

  const handleSubmit = async (event) => {
    setIsLoading(true)
    event.preventDefault()

    const response = await fetch(`/admin/api/news/${newsArticleData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authentication: cookie
      },
      body: JSON.stringify({
        newsArticle: {
          ...newsArticleData,
          html: editor.getHTML(),
          userId: user.id
        }
      })
    })

    const data = await response.json()

    setFeedbackMessage(data.message)
    setIsLoading(false)
    setNewsArticleData(data.newsArticle)
  }

  const handleChange = async (event) => {
    const { name, value } = event.target
    setNewsArticleData({
      ...newsArticleData,
      [name]: value
    })
  }

  return (
    <>
      <Feedback message={feedbackMessage} />
      <FullLoader isLoading={isLoading} />
      <GeneralLink className='bg-stone-500 text-white px-2 py-1' href='/admin/news'>
        Back
      </GeneralLink>
      <form className='flex flex-col gap-2 max-w-[1280px] mx-auto' ref={formRef} onSubmit={handleSubmit}>
        <input type='hidden' value={newsArticle.slug} />
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
            <div className='w-[200px]'>Title</div>
            <input className='border border-tertiary-500 p-2 w-full' type='text' onChange={handleChange} value={newsArticleData.title} name='title' required />
          </div>
          <Editor editor={editor} />
          {newsArticleData.id !== 'create' && (
            <div className='flex gap-4 items-center border-t border-t-stone-200 p-2'>
              <div className='w-[200px]'>Status</div>
              <select className='border border-tertiary-500 p-2' name='status' onChange={handleChange} value={newsArticleData.status} required>
                {contentStatuses.map((contentStatusSingle) => (
                  <option key={contentStatusSingle.value} value={contentStatusSingle.value}>
                    {contentStatusSingle.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className='flex justify-end'>
          <button
            disabled={isLoading}
            type='submit' className='w-32 bg-primary-500 border-b-orange-700 border-b-2 rounded px-3 py-2 text-white font-bold capitalize hover:bg-orange-600'
          >
            {isCreate ? 'Create' : 'Update'}
          </button>
        </div>
      </form>
    </>
  )
}
