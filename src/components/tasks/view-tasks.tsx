
import { Task } from '@/schema/taskSchema';
import TaskCard from './task-card';

interface ViewtasksProps {
  tasks: Task[]
}
const Viewtasks = ({tasks} : ViewtasksProps ) => {

  return (
    <div>
      {tasks && tasks.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-5'>
          {tasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task}
            />
          ))}
        </div>
      ) : (
        <div className='w-full p-5 text-center mt-10'>
          <span className='text-xl'>No Task added yet! 🙁</span>
        </div>
      )}
    </div>
  )
}

export default Viewtasks