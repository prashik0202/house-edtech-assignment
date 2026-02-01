import { NextResponse } from 'next/server'
import { db } from '@/database'
import { tasks } from '@/database/db-schema/tasks'
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * POST → create new task
 */
export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login')
  }

  const { title, description } = await req.json()

  if (!title) {
    return NextResponse.json(
      { message: 'Title is required' },
      { status: 400 }
    )
  }

  const [task] = await db
    .insert(tasks)
    .values({
      title,
      description,
      userId: user.userId,
      completed: false
    })
    .returning()
  
  revalidatePath('/tasks')

  return NextResponse.json(task, { status: 201 })
}
