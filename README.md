# AutoApply Pro

A comprehensive AI-powered job hunting assistant platform that automates resume creation, job matching, and application tracking using specialized agents.

## Features

### 🤖 AI-Powered Agents
- **Profile Agent**: Extract and parse LinkedIn profiles or resume data
- **Resume Agent**: Generate tailored, ATS-optimized resumes 
- **Job Match Agent**: AI-powered job matching based on skills and preferences
- **Cover Letter Agent**: Create personalized cover letters automatically
- **Application Agent**: Automate job applications with tracking
- **Analytics Agent**: Track success rates and optimize strategies

### 📊 Dashboard & Analytics
- User dashboard with application tracking
- Admin panel with user management and analytics
- Real-time metrics and performance tracking
- Token usage monitoring for cost management

### 🎨 Modern UI/UX
- Responsive design with dark/light mode
- Mobile-first approach
- Professional landing page with features showcase
- Comprehensive footer with site navigation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Radix UI** components with shadcn/ui
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** with PostgreSQL
- **OpenAI API** integration for AI features
- **Neon Database** (serverless PostgreSQL)

### Database Schema
- Users with profile management
- Resume generation and storage
- Job postings and matching
- Application tracking
- Token usage monitoring
- Activity logging

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (or Neon Database)
- OpenAI API key

### Environment Variables
Create a `.env` file with:
```bash
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/autoapply-pro.git
cd autoapply-pro
```

2. Install dependencies
```bash
npm install
```

3. Push database schema
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate migrations

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── db.ts        # Database connection
│   ├── openai.ts    # AI integration
│   └── storage.ts   # Data layer
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database schema
└── package.json
```

## API Endpoints

### User Management
- `GET /api/user/profile` - Get user profile
- `POST /api/profile/extract` - Extract profile from LinkedIn/resume

### Resume Operations
- `GET /api/resumes` - List user resumes
- `POST /api/resumes/generate` - Generate new resume
- `GET /api/resumes/:id` - Get specific resume

### Job Matching
- `GET /api/job-matches` - Get matched jobs
- `POST /api/job-matches/find` - Find new matches

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application

### Admin (Admin access required)
- `GET /api/admin/metrics` - System metrics
- `GET /api/admin/users` - User management
- `GET /api/admin/token-usage` - API usage stats

## Deployment

The application is designed to run on a single port with both frontend and backend. 

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Ensure all environment variables are properly configured:
- `DATABASE_URL` for database connection
- `OPENAI_API_KEY` for AI functionality
- `NODE_ENV=production` for production optimizations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## Roadmap

- [ ] Real authentication system
- [ ] Email integration for notifications
- [ ] Advanced job search filters
- [ ] Interview scheduling
- [ ] Mobile app development
- [ ] Enterprise features