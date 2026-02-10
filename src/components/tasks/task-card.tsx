import { Task } from '@/schema/taskSchema'
import React from 'react'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { PenBox, Trash2 } from 'lucide-react'
import TaskForm from './task-form'
import TaskToggle from './task-toggle'
import DeleteTaskButton from './delete-task'

interface TaskCardProp {
  task: Task
}

const TaskCard = ({ task }: TaskCardProp) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TaskToggle
            taskId={task.id}
            status={task.status}
          />
          <CardTitle
            className={[
              'max-w-40 truncate',
              task.status === 'done' && 'line-through text-muted-foreground',
            ].filter(Boolean).join(' ')}
            title={task.title}
          >
            {task.title}
          </CardTitle>
        </div>
        <CardDescription>
          {task.description ? task.description : (
            <span className='font-sm text-muted-foreground italic'>No Description</span>
          )}
        </CardDescription>
        <CardAction>
          <DeleteTaskButton taskId={task.id} />
          <TaskForm
            mode='update'
            trigger={
              <Button variant={"ghost"}><PenBox className='text-sky-400' /></Button>
            }
            task={task}
          />
        </CardAction>
      </CardHeader>
    </Card>
  )
}

export default TaskCard