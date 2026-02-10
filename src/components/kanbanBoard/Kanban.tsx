'use client';

import { useState, useEffect } from "react";
import type { Column } from "@/types/index";
import {
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { Task } from "@/schema/taskSchema";
import { usePlatform } from "@/context/platformContextProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { taskService } from "@/services/taskService";

const columns: Column[] = [
  { id: "todo", columnName: "Todo", status: "todo" },
  { id: "inprogress", columnName: "In Progress", status: "inprogress" },
  { id: "done", columnName: "Done", status: "done" },
];

const Kanban = ({ tasks }: { tasks: Task[] }) => {

  const router = useRouter()

  const {
    dispatch,
  } = usePlatform();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = optimisticTasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = optimisticTasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      // this update the task status at client side
      const updatedTasks = optimisticTasks.map((task) =>
        task.id === active.id ? { ...task, status: overColumn.status } : task
      );
      setOptimisticTasks(updatedTasks);
      dispatch({
        type: "SET_TASKS",
        payload: updatedTasks as Task[],
      });
      // after this we hit update status api
      const response = await fetch(`/api/tasks/${activeTask?.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: overColumn.status
        })
      });
      if (response.ok) {
        const updatedTask = await response.json();
        dispatch({
          type: "UPDATE_TASK",
          payload: updatedTask,
        });
        router.refresh()
      }
      return;
    }

    // Check if dropped on another task
    const overTask = optimisticTasks.find((task) => task.id === over.id);
    if (overTask) {
      let newTasks = [...optimisticTasks];
      // Update status to match the target task's status
      if (activeTask.status !== overTask.status) {
        newTasks = newTasks.map((task) =>
          task.id === active.id ? { ...task, status: overTask.status } : task
        );
      }

      // Reorder within the same status
      const oldIndex = newTasks.findIndex((task) => task.id === active.id);
      const newIndex = newTasks.findIndex((task) => task.id === over.id);
      console.log("drop over a task");

      const reorderedTasks = arrayMove(newTasks, oldIndex, newIndex);
      setOptimisticTasks(reorderedTasks);

      dispatch({
        type: "SET_TASKS",
        payload: reorderedTasks,
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      <DndContext
        id="kanban-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[650px]">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} tasks={optimisticTasks} />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Kanban;
