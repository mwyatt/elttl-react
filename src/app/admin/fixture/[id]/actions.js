'use server'

import { redirect } from 'next/navigation'
import {adminApiFetch} from '@/constants/url'

export async function update (prevState, formData) {
  const fixtureId = formData.get('fixtureId')
  const payload = {
    encounterStruct: JSON.parse(formData.get('encounterStruct')),
    playerStruct: JSON.parse(formData.get('playerStruct')),
  }

  const response = await adminApiFetch(`/fixture/${fixtureId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  await response.json()

  redirect(`/admin/fixture/${fixtureId}`)
}
