'use server'

import { redirect } from 'next/navigation'
import { adminApiFetch } from '@/constants/url'

export async function update (prevState, formData) {
  const id = formData.get('id')
  const payload = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    divisionId: formData.get('divisionId')
  }

  const response = await adminApiFetch(`/team/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const { affectedRows } = await response.json()

  // @todo remove
  console.log({ affectedRows })

  redirect(`/admin/team/${id}`)
}
