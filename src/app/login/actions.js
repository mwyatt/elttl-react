'use server'

import { getConnection } from '@/lib/database'
import { createSession, deleteSession } from '../lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'

export async function login (prevState, formData) {
  const connection = await getConnection()

  const [users] = await connection.execute(`
      SELECT id, email, password
      FROM user
      WHERE email = :email
  `, {
    email: formData.get('email')
  })

  if (users.length === 0) {
    return {
      errors: {
        email: ['Invalid email or password']
      }
    }
  }

  const user = users[0]
  let compareResult

  await bcrypt.compare(formData.get('password'), user.password).then(function (result) {
    compareResult = result
  })

  if (compareResult === true) {
    await createSession(user.id)
    redirect('/admin')
    return
  }

  return {
    errors: {
      email: ['Invalid email or password']
    }
  }
}

export async function logout () {
  await deleteSession()
  redirect('/login')
}
