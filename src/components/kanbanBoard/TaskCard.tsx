'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "../ui/card";
import { ExternalLinkIcon, GripVertical, PenBox } from "lucide-react";
import { Button } from "../ui/button";
import TaskForm from "../tasks/task-form";
// import { taskService } from "@/services/taskService";
// import { usePlatform } from "@/context/PlatformContext";
import { Task } from "@/schema/taskSchema";
import DeleteTaskButton from "../tasks/delete-task";

const TaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  // const { dispatch } = usePlatform();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab py-2 active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="px-3 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-card font-medium dark:text-card-foreground">
              {task.title}
            </p>
            <p className="text-[11px] font-light">{task.description}</p>
          </div>
          <GripVertical className="h-4 w-4 text-white flex-shrink-0" />
        </div>
        <div className="flex justify-between gap-2 items-center">
          <div>
            <TaskForm 
              mode='update'
              trigger={
                <Button variant={"ghost"}><PenBox className='text-sky-400'/></Button>
              }
              task={task}
            />
            <DeleteTaskButton taskId={task.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
