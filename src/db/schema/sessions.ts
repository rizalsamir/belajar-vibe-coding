import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),
  token: varchar("token", { length: 255 }).notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
