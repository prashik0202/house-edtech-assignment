import { NextResponse } from 'next/server'
import { db } from '@/database'
import { tasks } from '@/database/db-schema/tasks'
import { eq, and } from 'drizzle-orm'
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * PATCH → update task
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const { title, description, status } = await req.json()

  const [updatedTask] = await db
    .update(tasks)
    .set({
      title,
      description,
      status,
    })
    .where(
      and(
        eq(tasks.id, id),
        eq(tasks.userId, user.userId)
      )
    )
    .returning()

  if (!updatedTask) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(updatedTask)
}

/**
 * DELETE → delete task
 */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const [deletedTask] = await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.id, id),
        eq(tasks.userId, user.userId)
      )
    )
    .returning()

  if (!deletedTask) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Task deleted' })
}
