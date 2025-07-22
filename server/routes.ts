import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProfileSchema, insertResumeSchema, insertApplicationSchema } from "@shared/schema";
import { generateResume, extractProfile, generateCoverLetter, matchJobs } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock authentication for now - in production, implement proper JWT auth
  const mockAuth = (req: any, res: any, next: any) => {
    // For demo purposes, always use user ID 1
    req.userId = 1;
    next();
  };

  // User routes
  app.get("/api/user/profile", mockAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const profile = await storage.getUserProfile(req.userId);
      res.json({ user, profile });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Profile Agent - Extract and parse profile data
  app.post("/api/profile/extract", mockAuth, async (req: any, res) => {
    try {
      const { linkedinData, resumeText } = req.body;
      
      const extractedProfile = await extractProfile(linkedinData || resumeText);
      
      // Create or update profile
      const existingProfile = await storage.getUserProfile(req.userId);
      let profile;
      
      if (existingProfile) {
        profile = await storage.updateProfile(req.userId, {
          linkedinData: extractedProfile,
          skills: extractedProfile.skills,
          experience: extractedProfile.experience,
          education: extractedProfile.education
        });
      } else {
        profile = await storage.createProfile({
          userId: req.userId,
          linkedinData: extractedProfile,
          skills: extractedProfile.skills,
          experience: extractedProfile.experience,
          education: extractedProfile.education
        });
      }

      // Log activity
      await storage.createActivity({
        userId: req.userId,
        type: "profile_extracted",
        description: "Profile data extracted and processed"
      });

      res.json(profile);
    } catch (error) {
      console.error("Error extracting profile:", error);
      res.status(500).json({ message: "Failed to extract profile data" });
    }
  });

  // Resume Agent - Generate and manage resumes
  app.get("/api/resumes", mockAuth, async (req: any, res) => {
    try {
      const resumes = await storage.getUserResumes(req.userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.post("/api/resumes/generate", mockAuth, async (req: any, res) => {
    try {
      const { jobTitle, jobDescription } = req.body;
      
      const profile = await storage.getUserProfile(req.userId);
      if (!profile) {
        return res.status(400).json({ message: "Profile not found. Please extract profile first." });
      }

      const resumeContent = await generateResume(profile, jobTitle, jobDescription);
      
      const resume = await storage.createResume({
        userId: req.userId,
        title: `${jobTitle} Resume`,
        content: resumeContent,
        atsScore: Math.floor(Math.random() * 20) + 80 // Mock ATS score
      });

      // Log token usage
      await storage.createTokenUsage({
        userId: req.userId,
        agent: "resume-agent",
        operation: "generate_resume",
        tokensUsed: 1500,
        cost: "0.03"
      });

      // Log activity
      await storage.createActivity({
        userId: req.userId,
        type: "resume_generated",
        description: `Generated resume for ${jobTitle} position`
      });

      res.json(resume);
    } catch (error) {
      console.error("Error generating resume:", error);
      res.status(500).json({ message: "Failed to generate resume" });
    }
  });

  app.put("/api/resumes/:id", mockAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const resume = await storage.updateResume(parseInt(id), updateData);

      await storage.createActivity({
        userId: req.userId,
        type: "resume_updated",
        description: `Updated resume: ${resume.title}`
      });

      res.json(resume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", mockAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteResume(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Job Match Agent - Find relevant jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { search, limit } = req.query;
      let jobs;
      
      if (search) {
        jobs = await storage.searchJobs(search as string);
      } else {
        jobs = await storage.getJobs(limit ? parseInt(limit as string) : undefined);
      }
      
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs/match", mockAuth, async (req: any, res) => {
    try {
      const profile = await storage.getUserProfile(req.userId);
      if (!profile) {
        return res.status(400).json({ message: "Profile not found" });
      }

      const jobs = await storage.getJobs(20);
      const matchedJobs = await matchJobs(profile, jobs);

      // Save job matches
      for (const match of matchedJobs) {
        await storage.createJobMatch({
          userId: req.userId,
          jobId: match.jobId,
          matchScore: match.score,
          matchReasons: match.reasons
        });
      }

      // Log token usage
      await storage.createTokenUsage({
        userId: req.userId,
        agent: "job-match-agent",
        operation: "match_jobs",
        tokensUsed: 800,
        cost: "0.016"
      });

      const jobMatches = await storage.getUserJobMatches(req.userId);
      res.json(jobMatches);
    } catch (error) {
      console.error("Error matching jobs:", error);
      res.status(500).json({ message: "Failed to match jobs" });
    }
  });

  app.get("/api/job-matches", mockAuth, async (req: any, res) => {
    try {
      const jobMatches = await storage.getUserJobMatches(req.userId);
      res.json(jobMatches);
    } catch (error) {
      console.error("Error fetching job matches:", error);
      res.status(500).json({ message: "Failed to fetch job matches" });
    }
  });

  // Cover Letter Agent - Generate personalized cover letters
  app.post("/api/cover-letters/generate", mockAuth, async (req: any, res) => {
    try {
      const { jobId, resumeId } = req.body;
      
      const job = await storage.getJob(jobId);
      const resume = await storage.getResume(resumeId);
      
      if (!job || !resume) {
        return res.status(400).json({ message: "Job or resume not found" });
      }

      const coverLetter = await generateCoverLetter(resume, job);

      // Log token usage
      await storage.createTokenUsage({
        userId: req.userId,
        agent: "cover-letter-agent",
        operation: "generate_cover_letter",
        tokensUsed: 600,
        cost: "0.012"
      });

      res.json({ coverLetter });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  // Application Agent - Submit applications
  app.get("/api/applications", mockAuth, async (req: any, res) => {
    try {
      const applications = await storage.getUserApplications(req.userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", mockAuth, async (req: any, res) => {
    try {
      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        userId: req.userId,
        appliedAt: new Date()
      });

      const application = await storage.createApplication(applicationData);

      // Update resume usage count
      const resume = await storage.getResume(applicationData.resumeId);
      if (resume) {
        await storage.updateResume(resume.id, {
          usageCount: (resume.usageCount || 0) + 1
        });
      }

      await storage.createActivity({
        userId: req.userId,
        type: "application_submitted",
        description: `Application submitted for ${req.body.jobTitle || 'position'}`
      });

      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/stats", mockAuth, async (req: any, res) => {
    try {
      const applications = await storage.getUserApplications(req.userId);
      const resumes = await storage.getUserResumes(req.userId);
      const jobMatches = await storage.getUserJobMatches(req.userId);
      
      const responses = applications.filter(app => app.status === 'responded').length;
      const interviews = applications.filter(app => app.status === 'interview').length;

      res.json({
        applicationsSent: applications.length,
        responses,
        interviews,
        resumeCount: resumes.length,
        jobMatches: jobMatches.length
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/activities", mockAuth, async (req: any, res) => {
    try {
      const activities = await storage.getUserActivities(req.userId, 10);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Admin routes
  app.get("/api/admin/metrics", async (req, res) => {
    try {
      const [
        totalUsers,
        applicationsSent,
        totalTokenUsage,
        successRate
      ] = await Promise.all([
        storage.getUserCount(),
        storage.getApplicationCount(),
        storage.getTotalTokenUsage(),
        storage.getSuccessRate()
      ]);

      res.json({
        totalUsers,
        applicationsSent,
        totalTokenUsage,
        successRate: successRate.toFixed(1)
      });
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      res.status(500).json({ message: "Failed to fetch admin metrics" });
    }
  });

  app.get("/api/admin/token-usage", async (req, res) => {
    try {
      const tokenStats = await storage.getTokenUsageStats();
      res.json(tokenStats);
    } catch (error) {
      console.error("Error fetching token usage stats:", error);
      res.status(500).json({ message: "Failed to fetch token usage stats" });
    }
  });

  app.get("/api/admin/recent-users", async (req, res) => {
    try {
      const recentUsers = await storage.getRecentUsers(5);
      res.json(recentUsers);
    } catch (error) {
      console.error("Error fetching recent users:", error);
      res.status(500).json({ message: "Failed to fetch recent users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
