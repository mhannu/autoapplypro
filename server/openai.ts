import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "" 
});

interface ExtractedProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    title: string;
    summary: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
}

interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    title: string;
    summary: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
}

interface JobMatch {
  jobId: number;
  score: number;
  reasons: string[];
}

export async function extractProfile(profileData: string): Promise<ExtractedProfile> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional profile extraction expert. Extract structured profile information from LinkedIn data, resume text, or other professional profiles. 

Return a JSON object with the following structure:
{
  "personalInfo": {
    "name": "Full name",
    "email": "email address",
    "phone": "phone number",
    "title": "professional title",
    "summary": "professional summary"
  },
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Start - End dates",
      "achievements": ["achievement 1", "achievement 2"],
      "description": "Job description"
    }
  ],
  "education": [
    {
      "degree": "Degree type and major",
      "school": "School name",
      "year": "Graduation year",
      "gpa": "GPA if available"
    }
  ]
}

If information is missing, use empty strings or empty arrays as appropriate.`
        },
        {
          role: "user",
          content: `Extract profile information from this data: ${profileData}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const extractedData = JSON.parse(response.choices[0].message.content || "{}");
    return extractedData as ExtractedProfile;
  } catch (error) {
    console.error("Error extracting profile:", error);
    throw new Error("Failed to extract profile data");
  }
}

export async function generateResume(profile: any, jobTitle: string, jobDescription?: string): Promise<ResumeContent> {
  try {
    const profileContext = `
    Name: ${profile.linkedinData?.personalInfo?.name || "Professional"}
    Skills: ${profile.skills?.join(", ") || "Various technical skills"}
    Experience: ${JSON.stringify(profile.experience || [])}
    Education: ${JSON.stringify(profile.education || [])}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert resume writer. Generate a tailored, ATS-optimized resume for the given job title and profile information. 

Create a professional resume that:
1. Highlights relevant skills and experience for the target role
2. Uses action verbs and quantifiable achievements
3. Is optimized for ATS (Applicant Tracking Systems)
4. Has a clear, professional format
5. Emphasizes transferable skills when direct experience is limited

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "name": "Full name",
    "email": "email@example.com", 
    "phone": "(555) 123-4567",
    "title": "Professional title matching the target role",
    "summary": "2-3 sentence professional summary highlighting key qualifications"
  },
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name", 
      "duration": "MM/YYYY - MM/YYYY",
      "achievements": [
        "Quantified achievement with metrics",
        "Impact-focused accomplishment",
        "Relevant responsibility"
      ],
      "description": "Brief role description"
    }
  ],
  "education": [
    {
      "degree": "Degree and Major",
      "school": "University Name",
      "year": "YYYY"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Generate a resume for a ${jobTitle} position using this profile data:
          
          ${profileContext}
          
          ${jobDescription ? `Job Description: ${jobDescription}` : ""}
          
          Tailor the resume to highlight relevant experience and skills for this specific role.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const resumeData = JSON.parse(response.choices[0].message.content || "{}");
    return resumeData as ResumeContent;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume");
  }
}

export async function generateCoverLetter(resume: any, job: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional cover letter writer. Write a compelling, personalized cover letter that:

1. Shows genuine interest in the specific role and company
2. Highlights 2-3 most relevant qualifications from the resume
3. Demonstrates knowledge of the company/role
4. Explains why you're a great fit
5. Includes a strong call to action
6. Maintains a professional yet personable tone
7. Is concise (3-4 paragraphs, under 400 words)

Format as a complete cover letter with proper business letter structure.`
        },
        {
          role: "user",
          content: `Write a cover letter for this job application:

Job: ${job.title} at ${job.company}
Location: ${job.location || "Not specified"}
Job Description: ${job.description || "No description provided"}

Candidate Resume Summary:
Name: ${resume.content?.personalInfo?.name || "Candidate"}
Title: ${resume.content?.personalInfo?.title || "Professional"}
Key Skills: ${resume.content?.skills?.slice(0, 5).join(", ") || "Various skills"}
Recent Experience: ${resume.content?.experience?.[0]?.title || "Professional experience"} at ${resume.content?.experience?.[0]?.company || "Previous company"}

Write a compelling cover letter that connects the candidate's background to this specific opportunity.`
        }
      ]
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function matchJobs(profile: any, jobs: any[]): Promise<JobMatch[]> {
  try {
    const profileSkills = profile.skills?.join(", ") || "";
    const profileExperience = profile.experience ? JSON.stringify(profile.experience) : "";
    
    const jobsList = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      requirements: job.requirements?.join(", ") || "",
      description: job.description || ""
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: `You are an expert job matching AI. Analyze the candidate's profile and score how well they match each job opportunity.

For each job, provide:
1. A match score between 0.0 and 1.0 (1.0 = perfect match)
2. Specific reasons why they match or don't match
3. Consider: skills alignment, experience level, job requirements, career trajectory

Return a JSON array with this structure:
[
  {
    "jobId": 1,
    "score": 0.85,
    "reasons": ["Strong Python skills match requirements", "5 years experience aligns with senior role", "Previous fintech experience relevant"]
  }
]

Score factors:
- 0.9-1.0: Excellent match, highly qualified
- 0.7-0.89: Good match, mostly qualified  
- 0.5-0.69: Moderate match, some gaps
- 0.3-0.49: Weak match, significant gaps
- 0.0-0.29: Poor match, not qualified`
        },
        {
          role: "user",
          content: `Match this candidate profile against the job opportunities:

CANDIDATE PROFILE:
Skills: ${profileSkills}
Experience: ${profileExperience}

JOBS TO MATCH:
${JSON.stringify(jobsList, null, 2)}

Provide match scores and reasons for each job.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "[]");
    return Array.isArray(result) ? result : result.matches || [];
  } catch (error) {
    console.error("Error matching jobs:", error);
    throw new Error("Failed to match jobs");
  }
}

export async function optimizeResumeForATS(resumeContent: any, jobDescription: string): Promise<{
  optimizedContent: ResumeContent;
  atsScore: number;
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: `You are an ATS (Applicant Tracking System) optimization expert. Analyze the resume and job description to:

1. Optimize keyword usage for ATS scanning
2. Improve formatting for better ATS parsing
3. Suggest improvements for higher match rates
4. Calculate an estimated ATS score (0-100)

Return JSON with this structure:
{
  "optimizedContent": { /* optimized resume with same structure as input */ },
  "atsScore": 85,
  "suggestions": [
    "Add more relevant keywords from job description",
    "Use bullet points for better parsing",
    "Include specific metrics and numbers"
  ]
}`
        },
        {
          role: "user",
          content: `Optimize this resume for ATS based on the job description:

RESUME CONTENT:
${JSON.stringify(resumeContent, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Provide optimized content, ATS score, and improvement suggestions.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      optimizedContent: result.optimizedContent || resumeContent,
      atsScore: result.atsScore || 75,
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error("Error optimizing resume for ATS:", error);
    throw new Error("Failed to optimize resume for ATS");
  }
}
