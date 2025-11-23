# Tumenye Deployment Guide

## Prerequisites
1. GitHub account
2. Vercel account (free at vercel.com)
3. MongoDB Atlas account (free at mongodb.com)

## Step 1: Set up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific IPs)
5. Get your connection string (should look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
   ```

## Step 2: Deploy to Vercel

### Method A: GitHub Integration (Recommended)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_URL`: https://your-app-name.vercel.app
   - `NEXTAUTH_SECRET`: A long, random secret (generate one at https://generate-secret.vercel.app/32)
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD`: Your secure admin password

6. Click "Deploy"

### Method B: Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   ```

## Step 3: Alternative Deployment Platforms

### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway
1. Connect GitHub repo to Railway
2. Add environment variables
3. Railway will auto-deploy

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Add environment variables

## Step 4: Custom Domain (Optional)
1. Purchase a domain (e.g., tumenye.rw)
2. In Vercel dashboard, go to your project settings
3. Add custom domain
4. Update DNS records as instructed

## Step 5: Post-Deployment Checklist
- [ ] Database connection working
- [ ] Authentication working
- [ ] All API endpoints responding
- [ ] Admin panel accessible
- [ ] Student registration working
- [ ] Progress tracking functional
- [ ] SSL certificate active (https://)

## Environment Variables Reference
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-32-character-secret
ADMIN_EMAIL=admin@tumenye.rw
ADMIN_PASSWORD=your-secure-password
```

## Monitoring and Maintenance
1. Set up error monitoring (Sentry)
2. Configure analytics (Google Analytics)
3. Regular database backups
4. Monitor performance (Vercel Analytics)

## Custom URL Examples
After deployment, your app will be available at:
- Vercel: https://tumenye.vercel.app
- Custom domain: https://tumenye.rw
- Or: https://learn.tumenye.rw

## Support
For issues with deployment, check:
1. Vercel deployment logs
2. Browser console for client errors
3. Database connection in MongoDB Atlas
4. Environment variables are correctly set
