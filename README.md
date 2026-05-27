# AI Dungeon Master Assistant

An AI-powered dungeon master assistant built with Next.js, Tailwind CSS, Prisma, and OpenAI.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon in production, Docker locally)
- **ORM**: Prisma
- **AI Provider**: OpenAI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) (for local database)
- [Git](https://git-scm.com/)

### Local Development Setup

**1. Clone the repo**

```bash
git clone git@github-personal:rjortega-dev/ai-dungeon-master-assistant.git
cd ai-dungeon-master-assistant
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Then open `.env` and fill in your `OPENAI_API_KEY`.

**4. Start the local database**

```bash
docker compose up -d
```

This starts a local PostgreSQL database in a Docker container running in the background. You need Docker installed and running before this step. The `-d` flag runs it in detached mode so it doesn't block your terminal.

**5. Push the Prisma schema to your local database**

```bash
npx prisma db push
```

This creates all the database tables locally based on the Prisma schema.

**6. Seed the database with test data**

```bash
npx prisma db seed
```

This populates your local database with sample data so you have something to work with.

**7. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Contributing

- Never push directly to `main`
- Always open a PR
- At least one approval required before merging
- The person who opens the PR cannot merge their own PR
