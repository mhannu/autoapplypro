import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  title: varchar("title", { length: 200 }),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles table
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  linkedinData: jsonb("linkedin_data"),
  skills: text("skills").array(),
  experience: jsonb("experience"),
  education: jsonb("education"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resumes table
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: jsonb("content").notNull(),
  atsScore: integer("ats_score"),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  description: text("description"),
  requirements: text("requirements").array(),
  location: varchar("location", { length: 200 }),
  salary: varchar("salary", { length: 100 }),
  jobType: varchar("job_type", { length: 50 }),
  source: varchar("source", { length: 100 }),
  externalId: varchar("external_id", { length: 200 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  resumeId: integer("resume_id").references(() => resumes.id).notNull(),
  coverLetter: text("cover_letter"),
  status: varchar("status", { length: 50 }).default("pending"),
  appliedAt: timestamp("applied_at"),
  responseAt: timestamp("response_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job matches table
export const jobMatches = pgTable("job_matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  matchScore: decimal("match_score", { precision: 3, scale: 2 }),
  matchReasons: text("match_reasons").array(),
  isViewed: boolean("is_viewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Token usage tracking
export const tokenUsage = pgTable("token_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  agent: varchar("agent", { length: 50 }).notNull(),
  operation: varchar("operation", { length: 100 }).notNull(),
  tokensUsed: integer("tokens_used").notNull(),
  cost: decimal("cost", { precision: 8, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activities table for tracking user actions
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  resumes: many(resumes),
  applications: many(applications),
  jobMatches: many(jobMatches),
  tokenUsage: many(tokenUsage),
  activities: many(activities),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const resumeRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
  applications: many(applications),
}));

export const jobRelations = relations(jobs, ({ many }) => ({
  applications: many(applications),
  jobMatches: many(jobMatches),
}));

export const applicationRelations = relations(applications, ({ one }) => ({
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  resume: one(resumes, { fields: [applications.resumeId], references: [resumes.id] }),
}));

export const jobMatchRelations = relations(jobMatches, ({ one }) => ({
  user: one(users, { fields: [jobMatches.userId], references: [users.id] }),
  job: one(jobs, { fields: [jobMatches.jobId], references: [jobs.id] }),
}));

export const tokenUsageRelations = relations(tokenUsage, ({ one }) => ({
  user: one(users, { fields: [tokenUsage.userId], references: [users.id] }),
}));

export const activityRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

// Schema validations
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobMatchSchema = createInsertSchema(jobMatches).omit({
  id: true,
  createdAt: true,
});

export const insertTokenUsageSchema = createInsertSchema(tokenUsage).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertJobMatch = z.infer<typeof insertJobMatchSchema>;
export type JobMatch = typeof jobMatches.$inferSelect;

export type InsertTokenUsage = z.infer<typeof insertTokenUsageSchema>;
export type TokenUsage = typeof tokenUsage.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
