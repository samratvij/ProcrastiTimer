import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const timerSessions = pgTable("timer_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalSeconds: integer("total_seconds").notNull(),
  workSecondsRemaining: integer("work_seconds_remaining").notNull(),
  playSecondsRemaining: integer("play_seconds_remaining").notNull(),
  currentMode: text("current_mode").notNull(),
  isRunning: boolean("is_running").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTimerSessionSchema = createInsertSchema(timerSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;
export type TimerSession = typeof timerSessions.$inferSelect;

export const updateTimerSessionSchema = createInsertSchema(timerSessions).pick({
  workSecondsRemaining: true,
  playSecondsRemaining: true,
  currentMode: true,
  isRunning: true,
});

export type UpdateTimerSession = z.infer<typeof updateTimerSessionSchema>;
