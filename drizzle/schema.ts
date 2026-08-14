import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const calculationHistory = mysqlTable("calculation_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  expression: varchar("expression", { length: 512 }).notNull(),
  result: varchar("result", { length: 256 }).notNull(),
  calculatedAt: timestamp("calculatedAt").defaultNow().notNull(),
}, (table) => ({
  userDateIdx: index("calculation_history_user_date_idx").on(table.userId, table.calculatedAt),
}));

export type CalculationHistory = typeof calculationHistory.$inferSelect;
export type InsertCalculationHistory = typeof calculationHistory.$inferInsert;