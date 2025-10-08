# Railway Setup Guide

## 🚀 Deploying to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `toastyleague` repository
4. Railway will automatically detect it's a Next.js app

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. Copy the `DATABASE_URL` from the database service

### Step 4: Set Environment Variables
In your Railway project settings, add these environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://your-app-name.railway.app
NEXTAUTH_SECRET=your-secret-key-here
```

### Step 5: Deploy
1. Railway will automatically deploy when you push to main
2. Your app will be available at `https://your-app-name.railway.app`

### Step 6: Run Database Migrations
After deployment, run:
```bash
npx prisma migrate deploy
```

## 🎯 Why Railway is Better

- ✅ **Real persistent storage** (not serverless)
- ✅ **Built-in PostgreSQL database**
- ✅ **Automatic deployments** from GitHub
- ✅ **Free tier** available
- ✅ **No complex configuration**

## 🔧 Troubleshooting

If you have issues:
1. Check Railway logs in the dashboard
2. Make sure DATABASE_URL is set correctly
3. Run `npx prisma generate` if needed
4. Check that your app builds locally first

## 📱 Custom Domain

To use your custom domain `toastytacogaming.com`:
1. In Railway project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
