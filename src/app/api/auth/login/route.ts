import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { signToken } from '@/lib/jwt'
import { users } from '@/database/db-schema'
import { db } from '@/database'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existingUser = await db.select().from(users).where(eq( email, users.email));

  if(!existingUser.length) {
    return NextResponse.json({ message: "User does not exists, please Login"}, { status: 404 });
  }

  const user = existingUser[0]

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid email or password' },{ status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name })

  const res = NextResponse.json({
    message: 'Logged in successfully', 
    data: {
      id: user.id,
      email: user.email,
      name: user.name
    } 
  }, 
  { 
    status : 200 
  })
  res.cookies.set('token', token, { httpOnly: true })

  return res
}