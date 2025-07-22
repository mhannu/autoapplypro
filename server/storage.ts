import { 
  users, profiles, resumes, jobs, applications, jobMatches, tokenUsage, activities,
  type User, type InsertUser, type Profile, type InsertProfile,
  type Resume, type InsertResume, type Job, type InsertJob,
  type Application, type InsertApplication, type JobMatch, type InsertJobMatch,
  type TokenUsage, type InsertTokenUsage, type Activity, type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getUserProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile>;
  
  // Resume operations
  getUserResumes(userId: number): Promise<Resume[]>;
  getResume(id: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;
  
  // Job operations
  getJobs(limit?: number): Promise<Job[]>;
  searchJobs(query: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Application operations
  getUserApplications(userId: number): Promise<(Application & { job: Job; resume: Resume })[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;
  
  // Job match operations
  getUserJobMatches(userId: number): Promise<(JobMatch & { job: Job })[]>;
  createJobMatch(jobMatch: InsertJobMatch): Promise<JobMatch>;
  markJobMatchViewed(id: number): Promise<void>;
  
  // Token usage operations
  createTokenUsage(tokenUsage: InsertTokenUsage): Promise<TokenUsage>;
  getUserTokenUsage(userId: number): Promise<TokenUsage[]>;
  getTokenUsageStats(): Promise<{ agent: string; totalTokens: number; totalCost: number }[]>;
  
  // Activity operations
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Admin operations
  getUserCount(): Promise<number>;
  getApplicationCount(): Promise<number>;
  getTotalTokenUsage(): Promise<number>;
  getSuccessRate(): Promise<number>;
  getRecentUsers(limit?: number): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: number, profileData: Partial<InsertProfile>): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async getUserResumes(userId: number): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.userId, userId), eq(resumes.isActive, true)))
      .orderBy(desc(resumes.updatedAt));
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values(resume).returning();
    return newResume;
  }

  async updateResume(id: number, resumeData: Partial<InsertResume>): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({ ...resumeData, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: number): Promise<void> {
    await db.update(resumes).set({ isActive: false }).where(eq(resumes.id, id));
  }

  async getJobs(limit = 50): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
  }

  async searchJobs(query: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.isActive, true),
          ilike(jobs.title, `%${query}%`)
        )
      )
      .orderBy(desc(jobs.createdAt))
      .limit(20);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getUserApplications(userId: number): Promise<(Application & { job: Job; resume: Resume })[]> {
    return await db
      .select()
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(resumes, eq(applications.resumeId, resumes.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt))
      .then(rows => 
        rows.map(row => ({
          ...row.applications,
          job: row.jobs,
          resume: row.resumes
        }))
      );
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set({ ...applicationData, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async getUserJobMatches(userId: number): Promise<(JobMatch & { job: Job })[]> {
    return await db
      .select()
      .from(jobMatches)
      .innerJoin(jobs, eq(jobMatches.jobId, jobs.id))
      .where(eq(jobMatches.userId, userId))
      .orderBy(desc(jobMatches.matchScore))
      .limit(20)
      .then(rows =>
        rows.map(row => ({
          ...row.job_matches,
          job: row.jobs
        }))
      );
  }

  async createJobMatch(jobMatch: InsertJobMatch): Promise<JobMatch> {
    const [newJobMatch] = await db.insert(jobMatches).values(jobMatch).returning();
    return newJobMatch;
  }

  async markJobMatchViewed(id: number): Promise<void> {
    await db.update(jobMatches).set({ isViewed: true }).where(eq(jobMatches.id, id));
  }

  async createTokenUsage(tokenUsageData: InsertTokenUsage): Promise<TokenUsage> {
    const [newTokenUsage] = await db.insert(tokenUsage).values(tokenUsageData).returning();
    return newTokenUsage;
  }

  async getUserTokenUsage(userId: number): Promise<TokenUsage[]> {
    return await db
      .select()
      .from(tokenUsage)
      .where(eq(tokenUsage.userId, userId))
      .orderBy(desc(tokenUsage.createdAt))
      .limit(100);
  }

  async getTokenUsageStats(): Promise<{ agent: string; totalTokens: number; totalCost: number }[]> {
    return await db
      .select({
        agent: tokenUsage.agent,
        totalTokens: sql<number>`sum(${tokenUsage.tokensUsed})`.as('totalTokens'),
        totalCost: sql<number>`sum(${tokenUsage.cost})`.as('totalCost')
      })
      .from(tokenUsage)
      .groupBy(tokenUsage.agent)
      .orderBy(desc(sql`sum(${tokenUsage.tokensUsed})`));
  }

  async getUserActivities(userId: number, limit = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result.count;
  }

  async getApplicationCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(applications);
    return result.count;
  }

  async getTotalTokenUsage(): Promise<number> {
    const [result] = await db.select({ 
      total: sql<number>`sum(${tokenUsage.tokensUsed})` 
    }).from(tokenUsage);
    return result.total || 0;
  }

  async getSuccessRate(): Promise<number> {
    const [total] = await db.select({ count: sql<number>`count(*)` }).from(applications);
    const [successful] = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.status, 'interview'));
    
    return total.count > 0 ? (successful.count / total.count) * 100 : 0;
  }

  async getRecentUsers(limit = 10): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
