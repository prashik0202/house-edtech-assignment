import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { users } from './users'

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: varchar('title', { length: 255 }).notNull(),

  description: varchar('description', { length: 500 }),

  completed: boolean('completed').default(false).notNull(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}))
