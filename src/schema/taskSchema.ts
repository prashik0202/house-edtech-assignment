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

  completed: z.boolean().optional(),
})

export const createTaskSchema = taskBaseSchema.pick({
  title: true,
  description: true,
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof createTaskSchema>
export type Task = CreateTaskInput & {
  id: string,
  completed: boolean
}
