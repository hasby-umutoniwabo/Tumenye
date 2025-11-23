# 🚀 Quick Deployment Guide for Tumenye

## ⚡ Fastest Deployment (5 minutes)

### Step 1: MongoDB Atlas Setup (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Sign up (free)
2. Create cluster → Choose "Free" tier
3. Create database user: 
   - Username: `tumenye-user`
   - Password: Generate strong password
4. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
5. Copy connection string (looks like):
   ```
   mongodb+srv://tumenye-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Vercel (3 minutes)
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import your GitHub repository
4. Add these Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://tumenye-user:<your-password>@cluster0.xxxxx.mongodb.net/tumenye?retryWrites=true&w=majority
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-long-random-secret-at-least-32-chars
   ADMIN_EMAIL=admin@tumenye.rw
   ADMIN_PASSWORD=your-secure-admin-password
   ```

5. Click "Deploy"

### Step 3: Access Your App
Your app will be available at: **https://your-project-name.vercel.app**

---

## 🎯 Recommended URLs

After deployment, you can share these links:

**Student Access:**
- Main app: `https://tumenye.vercel.app`
- Student signup: `https://tumenye.vercel.app/auth/signup`
- Learning modules: `https://tumenye.vercel.app/modules`

**Admin Access:**
- Admin login: `https://tumenye.vercel.app/auth/signin` (use ADMIN_EMAIL/ADMIN_PASSWORD)
- Dashboard: `https://tumenye.vercel.app/dashboard`

**For Sharing:**
- QR Code: Generate one pointing to your main URL
- Short link: Use bit.ly or similar to create: `bit.ly/learn-tumenye`

---

## 📱 Making it Mobile-Friendly

Add these meta tags to `src/app/layout.tsx` for better mobile experience:

```tsx
export const metadata = {
  title: 'Tumenye - Digital Literacy for Rwandan Youth',
  description: 'Interactive learning platform for essential digital skills',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}
```

---

## 🔗 Example Production URLs

**For demonstration:**
- `https://tumenye-demo.vercel.app`
- `https://learn-tumenye.vercel.app`
- `https://digital-literacy-rw.vercel.app`

**For production (with custom domain):**
- `https://tumenye.rw`
- `https://learn.tumenye.rw`
- `https://app.tumenye.rw`

---

## 💡 Post-Deployment Tips

1. **Test Everything:**
   - Student registration
   - Lesson completion
   - Progress tracking
   - Admin panel

2. **Share Links:**
   ```
   📚 Learn Digital Skills: https://your-app.vercel.app
   👥 For Teachers: Use admin@tumenye.rw
   📱 Mobile friendly - works on any device
   ```

3. **Monitor Usage:**
   - Vercel provides analytics
   - Check MongoDB Atlas for data growth
   - Monitor for errors in Vercel dashboard

---

## ⚡ Alternative: One-Click Deploy

Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/tumenye)

---

## 🆘 Troubleshooting

**Common Issues:**
- Build fails? Check TypeScript errors with `npm run type-check`
- Database not connecting? Verify MONGODB_URI format
- Auth not working? Check NEXTAUTH_URL matches your domain
- 500 errors? Check Vercel function logs

**Quick Fixes:**
```bash
# Test locally first
npm run build
npm run start

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

---

Your Tumenye app is now live and accessible to students worldwide! 🌍
