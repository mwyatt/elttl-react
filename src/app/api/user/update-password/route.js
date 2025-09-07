import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import Environments from '@/constants/Environments'

export async function GET (request) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === Environments.LIVE) {
    return NextResponse.json(
      'This endpoint is not available in the live environment',
      { status: StatusCodes.FORBIDDEN }
    )
  }

  const connection = await getConnection()
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')
  const password = searchParams.get('password')
  let theHash
  const saltRounds = 10

  await bcrypt.hash(password, saltRounds).then(function (hash) {
    theHash = hash
  })

  const response = await connection.execute(`
      UPDATE user
      SET password = :password
      WHERE email = :email
  `, {
    email,
    password: theHash
  })

  bcrypt.compare(password, theHash, async function (err, result) {
    console.log({
      password,
      theHash,
      result
    })
  })

    connection.release()

  return NextResponse.json(
    `user ${email} had password salted, hashed and updated in the db.`,
    { status: StatusCodes.OK }
  )
}
