'use client';

import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskInput, createTaskSchema, Task } from '@/schema/taskSchema';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TaskFormInterface {
  trigger: React.ReactNode;
  mode: "create" | "update";
  task?: Task
}

const TaskForm = ({ trigger, mode, task } : TaskFormInterface) => {

  const router = useRouter()
  const [open, setOpen] = useState(false);

  const { register, formState: { isLoading, errors, isDirty }, reset, handleSubmit } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task ? task.title : "",
      description: task ? task.description : ""
    }
  });

  const handleCreateTask = async(data: CreateTaskInput) => {
    try {

      if(mode === 'create') {
        const response = await fetch('/api/tasks', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if(response.ok) {
          toast.success("Task Created Successfully");
        }
        return;
      }

      const response = await fetch(`/api/tasks/${task?.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if(response.ok) {
        toast.success("Task Updated Successfully");
      }
    } catch (error) {
      if(mode === 'create') {
        toast.error("unable to create Task")
      } else {
        toast.error("unable to update Task")
      }
    } finally {
      reset()
      setOpen(false);
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='w-fit' asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create your task' : 'Update your task'}</DialogTitle>
        </DialogHeader>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(handleCreateTask)}>
          <div className='flex flex-col gap-1'>
            <Label>Title</Label>
            <Input
              type="text"
              {...register("title")}
            />
            {errors.title && ( <span className="text-sm text-destructive">{errors.title?.message}</span>)}
          </div>
          <div className='flex flex-col gap-1'>
            <Label>Description</Label>
            <Input
              type="text"
              {...register("description")}
            />
            {errors.description && ( <span className="text-sm text-destructive">{errors.description?.message}</span>)}
          </div>
          <Button disabled={isLoading || !isDirty}>{mode === 'create' ? 'Create' : 'Update'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskForm