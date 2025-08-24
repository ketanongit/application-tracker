import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Enums for better type safety
export const companyTypeEnum = pgEnum("company_type", [
  "MNC", 
  "YC_STARTUP", 
  "INDIAN_UNICORN", 
  "WELLFOUND_STARTUP", 
  "EARLY_STAGE_STARTUP",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C",
  "PUBLIC_COMPANY",
  "OTHER"
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "APPLIED",
  "PENDING", 
  "REJECTED",
  "PROCEEDED"
]);

// Main applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  companyType: companyTypeEnum("company_type").notNull(),
  jobDescription: text("job_description"),
  applicationUrl: text("application_url"),
  status: applicationStatusEnum("status").default("APPLIED").notNull(),
  appliedDate: timestamp("applied_date").defaultNow().notNull(),
  notes: text("notes"),
  // For tracking progress if status is PROCEEDED
  currentRound: varchar("current_round", { length: 100 }), // "HR Round", "Technical Round 1", etc.
  finalVerdict: text("final_verdict"), // Final outcome details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Daily application counter table
export const dailyApplications = pgTable("daily_applications", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  plannedCount: integer("planned_count").notNull(),
  actualCount: integer("actual_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);

export const insertDailyApplicationSchema = createInsertSchema(dailyApplications);
export const selectDailyApplicationSchema = createSelectSchema(dailyApplications);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type DailyApplication = typeof dailyApplications.$inferSelect;
export type NewDailyApplication = typeof dailyApplications.$inferInsert;
