import { Task } from '@/schema/taskSchema'
import TaskCard from './task-card'

interface ViewtasksProps {
  tasks: Task[]
}

const Viewtasks = ({ tasks }: ViewtasksProps) => {
  const columns = {
    todo: tasks.filter((task) => task.status === 'todo'),
    inprogress: tasks.filter((task) => task.status === 'inprogress'),
    done: tasks.filter((task) => task.status === 'done'),
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      {Object.entries(columns).map(([columnId, columnTasks]) => (
        <div key={columnId} className="flex flex-col gap-4">
          <h3 className="font-semibold capitalize text-muted-foreground">
            {columnId === 'inprogress' ? 'In Progress' : columnId}
            <span className="ml-2 text-xs">({columnTasks.length})</span>
          </h3>

          <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-2 min-h-[200px]">
            {columnTasks.length > 0 ? (
              columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-muted-foreground/25 text-sm text-muted-foreground">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
export default Viewtasks