import Kanban from '@/components/kanbanBoard/Kanban'
import TaskForm from '@/components/tasks/task-form'
import Viewtasks from '@/components/tasks/view-tasks'
import { Button } from '@/components/ui/button'
import { db } from '@/database'
import { tasks } from '@/database/db-schema'
import { getAuthUser } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const TaskPage = async () => {

  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  const userTasks = await db.select().from(tasks).where(eq(tasks.userId, user.userId));

  const formattedTasks = userTasks.map(task => ({
    ...task,
    description: task.description ?? undefined
  }));

  return (
    <div className='p-2 mt-10'>
      <div className='flex flex-col gap-1'>
        <TaskForm
          trigger={
            <Button className='w-fit'>Add New Task</Button>
          }
          mode='create'
        />
        <span className='text-sm text-muted-foreground'>you can create your task here by clicking on add new task button</span>
      </div>
      <div className='mt-5'>
        {/* <Viewtasks tasks={formattedTasks} /> */}
        <Kanban tasks={formattedTasks} />
      </div>
    </div>
  )
}

export default TaskPage