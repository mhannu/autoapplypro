import { storage } from "./storage";
import type { InsertUser, InsertJob } from "@shared/schema";

// Sample user data
const sampleUsers: InsertUser[] = [
  {
    email: "demo@example.com",
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    isAdmin: false
  },
  {
    email: "admin@example.com", 
    firstName: "Jane",
    lastName: "Admin",
    title: "System Administrator",
    isAdmin: true
  }
];

// Sample job data
const sampleJobs: InsertJob[] = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp Inc",
    description: "We're looking for an experienced software engineer to join our team. You'll work on cutting-edge web applications using React, Node.js, and cloud technologies.",
    requirements: ["JavaScript", "React", "Node.js", "AWS", "5+ years experience"],
    location: "San Francisco, CA",
    salary: "$120,000 - $180,000",
    jobType: "Full-time",
    source: "company_website",
    externalId: "tc_001"
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    description: "Join our fast-growing startup as a Frontend Developer. Build beautiful, responsive user interfaces and work directly with our design team.",
    requirements: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    location: "New York, NY",
    salary: "$80,000 - $120,000", 
    jobType: "Full-time",
    source: "job_board",
    externalId: "sx_002"
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd",
    description: "We need a versatile full-stack developer comfortable with both frontend and backend technologies. Experience with modern frameworks preferred.",
    requirements: ["JavaScript", "Python", "React", "Django", "PostgreSQL"],
    location: "Austin, TX",
    salary: "$90,000 - $140,000",
    jobType: "Full-time",
    source: "job_board", 
    externalId: "ds_003"
  },
  {
    title: "DevOps Engineer",
    company: "CloudFirst Technologies",
    description: "Help us scale our infrastructure and improve our deployment processes. Experience with containerization and cloud platforms required.",
    requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    location: "Seattle, WA",
    salary: "$110,000 - $160,000",
    jobType: "Full-time",
    source: "company_website",
    externalId: "cf_004"
  },
  {
    title: "React Developer",
    company: "Modern Web Co",
    description: "Build modern web applications using React and related technologies. Work with a talented team in a collaborative environment.",
    requirements: ["React", "JavaScript", "HTML", "CSS", "Git"],
    location: "Remote",
    salary: "$70,000 - $110,000",
    jobType: "Full-time",
    source: "job_board",
    externalId: "mw_005"
  }
];

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with sample data...");
    
    // Check if we already have users
    const existingUsers = await storage.getUserCount();
    if (existingUsers > 0) {
      console.log("✅ Database already has data, skipping seed");
      return;
    }

    // Create sample users
    for (const userData of sampleUsers) {
      await storage.createUser(userData);
    }
    console.log(`👥 Created ${sampleUsers.length} users`);

    // Create demo profile for first user
    await storage.createProfile({
      userId: 1,
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
      experience: [
        {
          title: "Software Engineer",
          company: "Previous Company",
          duration: "2020 - Present",
          achievements: [
            "Developed 5+ web applications using React and Node.js",
            "Improved application performance by 40%",
            "Led a team of 3 junior developers"
          ],
          description: "Full-stack development of web applications"
        }
      ],
      education: [
        {
          degree: "Bachelor of Computer Science",
          school: "University of Technology",
          year: "2019"
        }
      ]
    });
    console.log("📋 Created demo profile");

    // Create sample jobs
    for (const jobData of sampleJobs) {
      await storage.createJob(jobData);
    }
    console.log(`💼 Created ${sampleJobs.length} jobs`);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}