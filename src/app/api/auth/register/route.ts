import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { signToken } from '@/lib/jwt'
import { users } from '@/database/db-schema'
import { db } from '@/database'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    
    const { name, email, password } = await req.json()
  
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
  
    const existingUser = await db.select().from(users).where(eq( email, users.email));
  
    if(existingUser[0]) {
      return NextResponse.json({ message: "User already exists, please login"}, { status: 403 });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10)
  
    const newUser = {
      name,
      email,
      password: hashedPassword,
    }
  
    const createdUser = await db.insert(users).values({
      email: newUser.email,
      name: newUser.name,
      password: newUser.password
    }).returning();
  
    const user = createdUser[0];
  
    const token = signToken({ userId: user.id, email: user.email, name: user.name })
  
    const response = NextResponse.json({ 
      message: 'Registered successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, 
    { 
      status : 200 
    });
    response.cookies.set('token', token, { httpOnly: true })
  
    return response;
  } catch (error : any) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}