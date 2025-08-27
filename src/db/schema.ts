import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Enums for better type safety
export const companyTypeEnum = pgEnum("company_type", [
  "MNC", 
  "YC_STARTUP", 
  "INDIAN_UNICORN", 
  "WELL_FUNDED_STARTUP",
  "EARLY_STAGE_STARTUP",
  "PUBLIC_COMPANY",
  "OTHER"
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "APPLIED",
  "REJECTED",
  "PROCEEDED"
]);

export const ReachoutMethodEnum = pgEnum("reachout_method", [
  "LINKEDIN_INMAIL",
  "EMAIL",
  "OTHER"
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
  currentRound: varchar("current_round", { length: 100 }), // "HR Round", "Technical Round 1", etc.
  finalVerdict: text("final_verdict"), // Final outcome details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reachout_methods = pgTable("reachout_methods", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  method: ReachoutMethodEnum("method").notNull(),
  personContacted: varchar("person_contacted", { length: 255 }),
  contactInfo: varchar("contact_info", { length: 255 }), 
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
export type ReachoutMethod = typeof reachout_methods.$inferSelect;
export type NewReachoutMethod = typeof reachout_methods.$inferInsert;
export interface ApplicationWithReachout extends Application {
  reachoutMethods?: ReachoutMethod[];
}

