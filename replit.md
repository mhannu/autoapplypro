# AutoApply Pro - Replit Development Guide

## Overview

AutoApply Pro is a modular, production-grade full-stack web application that serves as a smart job-hunting assistant. The system automates resume creation, job matching, and application submission using specialized AI agents. Built with React, Express, PostgreSQL, and OpenAI integration, the application follows a modular architecture with distinct agents handling specific functionalities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest)

### January 22, 2025
- ✅ Implemented conditional navigation based on authentication status
- ✅ Added comprehensive footer with copyright and site links  
- ✅ Updated layout to include navbar and footer in App.tsx
- ✅ Created proper page structure with About, Contact, Testimonials sections
- ✅ Fixed navigation to only show Dashboard/Admin for authenticated users

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite with custom configuration
- **Theme System**: Context-based dark/light mode with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI API for content generation
- **Development**: Hot reload with Vite integration in development mode

### Agent-Based Architecture
The application implements a modular agent system:
1. **Profile Agent**: Extracts and parses LinkedIn/uploaded profile data
2. **Resume Agent**: Generates and manages ATS-optimized resumes
3. **Job Match Agent**: AI-powered job matching based on user profiles
4. **Cover Letter Agent**: Creates personalized cover letters
5. **Application Agent**: Automates job application submissions
6. **Auth Agent**: Handles authentication (currently mock implementation)
7. **Dashboard Agent**: Manages user and admin dashboards with analytics

## Key Components

### Database Schema
- **Users**: Core user information with admin flags
- **Profiles**: Extended user profiles with LinkedIn data, skills, experience, education
- **Resumes**: Generated resumes with content, ATS scores, and usage tracking
- **Jobs**: Job postings with company information and requirements
- **Applications**: Application tracking with status and submission details
- **Job Matches**: AI-generated job matches with compatibility scores
- **Token Usage**: OpenAI API usage tracking for cost management
- **Activities**: User activity logging for analytics

### Frontend Structure
- **Pages**: Landing, Dashboard, Admin, 404
- **Components**: Modular UI components with consistent design patterns
- **Layouts**: App-level navbar/footer layout with conditional navigation
- **Navigation**: Authentication-based menu visibility (Dashboard for users, Admin for admins)
- **Footer**: Comprehensive footer with copyright, company info, and site links
- **Theming**: CSS custom properties with dark/light mode support

### API Endpoints
- **Profile Management**: `/api/profile/extract`, `/api/user/profile`
- **Resume Operations**: `/api/resumes/*` (CRUD operations)
- **Job Matching**: `/api/job-matches`
- **Application Management**: `/api/applications`
- **Admin Analytics**: `/api/admin/*` endpoints

## Data Flow

### Profile Extraction Flow
1. User uploads LinkedIn data or resume text
2. Profile agent processes data using OpenAI
3. Extracted information stored in profiles table
4. User can review and edit extracted data

### Resume Generation Flow
1. User triggers resume generation for specific job
2. Resume agent combines profile data with job requirements
3. OpenAI generates optimized resume content
4. System calculates ATS compatibility score
5. Resume stored with metadata for future use

### Job Matching Flow
1. Job match agent analyzes user profile and preferences
2. System searches available jobs using compatibility algorithms
3. AI generates match scores and explanations
4. Matched jobs presented to user with ranking

### Application Flow
1. User selects job and resume combination
2. Cover letter agent generates personalized cover letter
3. Application agent prepares submission package
4. System tracks application status and follows up

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4 for content generation and analysis
- **Model Used**: gpt-4o (latest available model)
- **Functions**: Profile extraction, resume generation, job matching, cover letter creation

### Database
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **WebSocket Support**: Real-time capabilities for development
- **Migration Management**: Drizzle Kit for schema changes

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon system
- **Custom Components**: Built on top of shadcn/ui foundation

### Development Tools
- **Replit Integration**: Development environment optimization
- **Vite Plugins**: Development enhancements and error handling
- **TypeScript**: Full type safety across frontend and backend

### Advertisement System
- **Configurable Ads**: Environment variable controlled ad display
- **Ad Placement**: Banner, sidebar, mobile, and interstitial slots
- **Mock Implementation**: Placeholder components for development

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Full-stack hot reloading support
- **Environment Variables**: Database URL, OpenAI API key configuration
- **Development Logging**: Request/response logging with performance metrics

### Production Build
- **Frontend**: Vite production build with optimization
- **Backend**: ESBuild bundling for Node.js deployment
- **Database**: Automated migration system with Drizzle
- **Environment**: Production-specific configurations

### Scalability Considerations
- **Database**: Connection pooling with Neon's serverless architecture
- **API**: Stateless design for horizontal scaling
- **Caching**: Future Redis integration for performance optimization
- **Monitoring**: Token usage tracking for cost management

### Security
- **Authentication**: JWT-based system (currently mocked)
- **Data Validation**: Zod schema validation throughout
- **API Security**: Input sanitization and error handling
- **Environment**: Secure environment variable management