import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { tasks } from './tasks'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  password: varchar('password', { length: 255 }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}))
