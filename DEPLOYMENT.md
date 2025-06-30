# Deployment Instructions

## Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `lidar-scoring`
   - Description: "LIDAR Archaeological Scoring System - Multi-criteria analysis for archaeological features"
   - Set to Public
   - DO NOT initialize with README, .gitignore, or license

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lidar-scoring.git
   git push -u origin main
   ```

## Deploy to Vercel

### Option 1: Import from GitHub (Recommended)
1. Go to https://vercel.com/new
2. Import your `lidar-scoring` repository
3. Click "Deploy" (no configuration needed)

### Option 2: Deploy from CLI
```bash
npx vercel
```

## Your repository is ready!

All files have been committed and are ready to push. Just follow the steps above to:
1. Create the GitHub repository
2. Add the remote origin
3. Push to GitHub
4. Deploy to Vercel