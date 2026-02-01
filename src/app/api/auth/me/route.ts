import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const payload = verifyToken(token) as {
      userId: string
      email: string,
      name: string,
    }

    return NextResponse.json({
      message: "User Sucessfully fetched",
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name
      },
    })
  } catch {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 })
  }
}
