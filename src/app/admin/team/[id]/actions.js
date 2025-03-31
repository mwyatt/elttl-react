'use server'

import { redirect } from 'next/navigation'
import { adminApiUrl } from '@/constants/url'

export async function update (prevState, formData) {
  const id = formData.get('id')
  const payload = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    yearId: formData.get('yearId')
  }

  // if (formData.get('email') !== testUser.email || formData.get('password') !== testUser.password) {
  //   return {
  //     errors: {
  //       email: ["Invalid email or password"],
  //     },
  //   };
  // }

  const response = await fetch(`${adminApiUrl}/team/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const { ok } = await response.json()

  redirect('/admin/')
}
