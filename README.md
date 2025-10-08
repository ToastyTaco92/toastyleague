# Toast League

A Next.js tournament management platform built for gaming leagues and competitions.

## Features

- **Division Management**: Create and manage tournament divisions
- **Player Registration**: Handle player signups and entries
- **Match Scheduling**: Generate round-robin schedules
- **Score Reporting**: Track match results and disputes
- **Standings**: Calculate win-loss records and point differentials
- **Admin Dashboard**: Comprehensive tournament management tools

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Railway
- **Authentication**: NextAuth.js (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Railway account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ToastyTaco92/toastyleague.git
   cd toastyleague
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your database connection:
   
   **For Local Development:**
   ```env
   # Option 1: Local PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/toastyleague"
   
   # Option 2: Railway PostgreSQL (use PUBLIC connection string)
   # Get from Railway dashboard > PostgreSQL service > Variables > DATABASE_PUBLIC_URL
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
   
   NEXTAUTH_URL="http://localhost:3001"
   NEXTAUTH_SECRET="your-secret-key"
   AUTH_TRUST_HOST=true
   ```
   
   **⚠️ Important:** Never use `postgres.railway.internal` URLs locally - they only work inside Railway's network.

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Debug environment variables (optional)**
   ```bash
   npm run debug:env
   ```
   This will show your environment variables with sensitive data masked for security.

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) to see the application.

## Deployment

This application is designed to run on **Railway**.

### Railway Deployment

1. **Connect your GitHub repository** to Railway
2. **Add a PostgreSQL service** in Railway
3. **Set environment variables** in your Railway service:
   - `DATABASE_URL`: Automatically provided by Railway (uses internal hostname)
   - `NEXTAUTH_URL`: Your Railway app URL (e.g., `https://your-app.railway.app`)
   - `NEXTAUTH_SECRET`: A secure random string
   - `AUTH_TRUST_HOST`: `true`
   
   **Note:** Railway automatically provides the correct `DATABASE_URL` with internal hostname. Do not manually set this variable.

4. **Deploy**: Railway will automatically deploy from your GitHub repository

The application will automatically:
- Install dependencies
- Generate Prisma client (`postinstall` script)
- Build the Next.js application
- Run database migrations (`migrate:deploy` with fallback to `db push`)
- Start the server

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: Player accounts and authentication
- **Season**: Tournament seasons
- **League**: Game-specific leagues within seasons
- **Division**: Tournament divisions with entry limits
- **Entry**: Player registrations for divisions
- **Match**: Scheduled matches between entries
- **Evidence**: Match evidence and dispute documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
