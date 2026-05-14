# HireFlow AI

HireFlow AI is an AI-powered recruitment screening platform built with Next.js. Recruiters can publish jobs, candidates can apply to open roles, and the platform can start an AI voice interview through Bolna. Completed interview webhooks are evaluated with Gemini and shown to recruiters as structured candidate scores, summaries, strengths, weaknesses, recommendations, and transcripts.

## Features

- Google authentication with NextAuth.
- Role-based entry for candidates and recruiters.
- Recruiter dashboard with hiring metrics, recent jobs, and recent applications.
- Job creation and job applicant management.
- Candidate job board and application form.
- Duplicate application prevention per candidate and job.
- Bolna voice call trigger after application submission.
- Bolna webhook endpoint for completed interview data.
- Gemini-powered interview evaluation.
- Prisma/PostgreSQL persistence for users, jobs, applications, and interviews.

## Tech Stack

- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS
- NextAuth 5 beta
- Prisma 7
- PostgreSQL
- Bolna AI voice calls
- Google Gemini evaluation via `@google/genai`

## Project Structure

```text
src/
  app/
    api/
      [...nextauth]/route.ts          # NextAuth route handlers
      applications/route.ts           # Candidate application endpoint
      bolna/webhook/route.ts          # Bolna interview webhook endpoint
      jobs/route.ts                   # Recruiter job creation endpoint
    candidate/dashboard/              # Candidate job list and job detail pages
    recruiter/dashboard/              # Recruiter dashboard, jobs, applications
    layout.tsx                        # Root layout, metadata, auth provider, navbar
    page.tsx                          # Landing page
  components/
    ApplyForm.tsx                     # Candidate application form
    Navbar.tsx                        # Auth-aware navigation
    auth-buttons.tsx                  # Landing page login actions
    providers/auth-provider.tsx       # NextAuth session provider
  lib/
    auth.ts                           # NextAuth configuration and role assignment
    bolna.ts                          # Bolna call creation logic
    evaluate.ts                       # Gemini candidate evaluation logic
    prisma.ts                         # Prisma client
  types/
    next-auth.d.ts                    # NextAuth session/JWT type extensions
prisma/
  schema.prisma                       # Database schema
  migrations/                         # Prisma migrations
```

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database
- Google OAuth application
- Bolna account, agent, and outbound phone number
- Gemini API key

## Environment Variables

Create a `.env` file in the project root. You can start from `.env.example`.

```env
AUTH_SECRET=replace_with_a_strong_secret

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

BOLNA_API_KEY=your_bolna_api_key
BOLNA_AGENT_ID=your_bolna_agent_id
BOLNA_FROM_PHONE_NUMBER=+911234567890
BOLNA_API_BASE=https://api.bolna.ai

GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
```

For local Google OAuth, add this callback URL in the Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

For production, replace `localhost:3000` with your deployed domain.

## Installation

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Generates the Prisma client and builds the production app.

```bash
npm run start
```

Starts the production server after a build.

## User Roles

The app has two roles:

- `USER`: candidate access.
- `ADMIN`: recruiter access.

The first login decides the role using the `login_role` cookie:

- Candidate login sets `login_role=USER`.
- Recruiter login sets `login_role=ADMIN`.

After the first login, the selected role is saved on the `User` record and added to the JWT/session.

## Main Routes

| Route                                    | Description                                             |
| ---------------------------------------- | ------------------------------------------------------- |
| `/`                                      | Landing page with candidate and recruiter login actions |
| `/candidate/dashboard`                   | Candidate job board                                     |
| `/candidate/dashboard/[slug]`            | Candidate job details and application form              |
| `/recruiter/dashboard`                   | Recruiter overview dashboard                            |
| `/recruiter/dashboard/jobs`              | Recruiter job management                                |
| `/recruiter/dashboard/jobs/create`       | Create a new job                                        |
| `/recruiter/dashboard/jobs/[id]`         | View applicants for a job                               |
| `/recruiter/dashboard/applications/[id]` | Review candidate application and AI interview result    |

## API Routes

### `POST /api/jobs`

Creates a new job. Requires an authenticated recruiter (`ADMIN`) session.

Expected body:

```json
{
  "title": "Senior Full Stack Developer",
  "description": "Role responsibilities and requirements...",
  "location": "Hyderabad, India",
  "employmentType": "FULL_TIME",
  "experienceLevel": "MID",
  "salaryMin": 800000,
  "salaryMax": 1500000
}
```

### `POST /api/applications`

Creates a candidate application and starts a Bolna interview call.

Expected body:

```json
{
  "jobId": "job_id",
  "fullName": "John Doe",
  "phone": "+919876543210",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "portfolioUrl": "https://johndoe.dev"
}
```

The logged-in user's email is used as the application email.

### `POST /api/bolna/webhook`

Receives Bolna webhook data after an interview. The route:

1. Reads the `execution_id`.
2. Reads the transcript from `transcript` or `conversation_transcript`.
3. Finds the application by `recipient_phone_number`.
4. Creates or updates the related interview.
5. Stores the transcript and raw webhook payload.
6. Sends the transcript and job description to Gemini.
7. Saves score, summary, strengths, weaknesses, and recommendation.
8. Updates application status to `SHORTLISTED` or `REJECTED`.

Configure this endpoint in Bolna as:

```text
https://your-domain.com/api/bolna/webhook
```

For local webhook testing, expose your local server with a tunneling tool and use:

```text
https://your-tunnel-url/api/bolna/webhook
```

## Database Models

The Prisma schema includes:

- `User`: authenticated users with optional `USER` or `ADMIN` role.
- `Account` and `Session`: NextAuth persistence models.
- `Job`: recruiter-created job postings.
- `JobApplication`: candidate applications linked to users and jobs.
- `Interview`: Bolna/Gemini interview result linked to one application.

Important constraints:

- Job slugs are unique.
- A candidate can apply only once per job through `@@unique([jobId, userId])`.
- Each application can have one interview.
- Each Bolna execution ID is unique.

## Screening Flow

1. A recruiter logs in and creates a job.
2. A candidate logs in and opens the candidate dashboard.
3. The candidate selects a job and submits the application form.
4. The app saves the application and calls Bolna using the candidate phone number.
5. The application status changes to `SCREENING`.
6. Bolna sends the completed interview webhook to `/api/bolna/webhook`.
7. The app stores the transcript and sends it to Gemini for evaluation.
8. The recruiter reviews the AI score, summary, transcript, strengths, weaknesses, and recommendation.

## Deployment Notes

Before deploying:

- Set all environment variables in the hosting provider.
- Use a production PostgreSQL database.
- Run Prisma migrations against the production database.
- Set the Google OAuth callback URL to the production domain.
- Set the Bolna webhook URL to the production domain.
- Update `metadataBase`, Open Graph URL, and any placeholder domain values in `src/app/layout.tsx`.

Build command:

```bash
npm run build
```

Start command:

```bash
npm run start
```

## Development Notes

- Prisma client output is configured in `prisma/schema.prisma` as `src/generated/prisma`.
- The project uses Prisma's PostgreSQL adapter from `@prisma/adapter-pg`.
- Recruiter-only job creation is enforced in `src/app/api/jobs/route.ts`.
- AI evaluation expects Gemini to return strict JSON.
- Current AI score UI displays the saved `aiScore`; the prompt asks Gemini for a 1-10 score.
