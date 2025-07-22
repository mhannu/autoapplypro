// Environment configuration
export const ENABLE_ADS = import.meta.env.VITE_ENABLE_ADS === "true";

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// OpenAI Configuration
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Application Constants
export const APP_NAME = "AutoApply Pro";
export const APP_DESCRIPTION = "Smart job application assistant powered by AI agents";

// Agent Types
export const AGENT_TYPES = {
  PROFILE: "profile-agent",
  RESUME: "resume-agent", 
  JOB_MATCH: "job-match-agent",
  COVER_LETTER: "cover-letter-agent",
  APPLICATION: "application-agent",
  AUTH: "auth-agent",
  DASHBOARD: "dashboard-agent"
} as const;

// Application Status Types
export const APPLICATION_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  RESPONDED: "responded", 
  INTERVIEW: "interview",
  REJECTED: "rejected",
  ACCEPTED: "accepted"
} as const;

// Resume Templates
export const RESUME_TEMPLATES = {
  SOFTWARE_ENGINEER: "software-engineer",
  DATA_SCIENTIST: "data-scientist",
  PRODUCT_MANAGER: "product-manager",
  DESIGNER: "designer",
  MARKETING: "marketing",
  SALES: "sales"
} as const;
