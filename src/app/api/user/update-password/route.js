import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/database'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'

export async function GET (request) {
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
      UPDATE user SET password = :password
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

  return NextResponse.json(
    `user ${email} had password salted, hashed and updated in the db, affecting ${response.affectedRows} row(s)`,
    { status: StatusCodes.OK }
  )
}
