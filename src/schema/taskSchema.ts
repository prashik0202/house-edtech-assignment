import { z } from 'zod'

export const taskBaseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be under 255 characters'),

  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional(),

  status: z.enum(['todo', 'inprogress', 'done']).optional(),
})

export const createTaskSchema = taskBaseSchema.pick({
  title: true,
  description: true,
}).extend({
  status: z.enum(['todo', 'inprogress', 'done']).default('todo'),
})

export const updateTaskSchema = taskBaseSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof taskBaseSchema>
export type Task = {
  id: string
  title: string
  description?: string | null
  status: 'todo' | 'inprogress' | 'done'
  userId: string
  createdAt: Date
}
