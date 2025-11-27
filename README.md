# Tumenye - Digital Literacy Learning Platform

A comprehensive digital literacy learning platform designed specifically for Rwandan youth, focusing on Tech for Good initiatives. Tumenye empowers young people with essential digital skills through interactive lessons and quizzes.

## 🎯 Mission

Our mission is to bridge the digital divide and prepare Rwanda's youth for a technology-driven future through accessible, high-quality digital literacy education.

## 🌐 Live Demo

**🚀 [View Live Application](https://tumenye-aoco.vercel.app/)**

Experience Tumenye in action! The live demo includes:
- Full learning platform with interactive modules
- Admin dashboard for user management
- Progress tracking and achievement system
- Mobile-responsive design

## ✨ Features

### Core Learning Modules
- **Microsoft Word Basics**: Document creation and editing fundamentals
- **Excel for Beginners**: Spreadsheet skills and basic calculations  
- **Email Communication**: Professional email writing and management
- **Online Safety & Critical Thinking**: Digital literacy and security awareness

### Platform Features
- 🔐 **Secure Authentication**: Email/password login with NextAuth.js
- 📊 **Progress Tracking**: Visual dashboard showing learning progress
- 🎯 **Interactive Quizzes**: 3-5 multiple choice questions per lesson
- 📱 **Mobile-First Design**: Responsive design with Tailwind CSS
- 🏆 **Achievement System**: Track completed modules and lessons
- 💾 **Progress Persistence**: MongoDB database for user progress
- 👥 **Admin Dashboard**: Complete user management and analytics
- 🎚️ **Role-Based Access**: Automatic admin/student role redirection
- 📈 **Individual Goals**: Personal goal setting system for each user

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Complete Setup Guide

Follow these steps **exactly** to get the project running on your machine.

### Prerequisites

Before starting, ensure you have these installed:

1. **Node.js 18 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` (should show v18.x.x or higher)
   - Verify npm: `npm --version`

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **MongoDB Atlas Account** (Recommended) OR Local MongoDB
   - Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/hasby-umutoniwabo/Tumenye.git

# Navigate to the project directory
cd Tumenye
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**Wait for all packages to install completely before proceeding.**

### Step 3: Database Setup (Choose ONE option)

#### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Cluster**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Click "Build a Database" → Choose "FREE" tier
   - Select a cloud provider and region
   - Create cluster (takes 1-3 minutes)

2. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**
   - Go to "Databases" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<username>` with your database username

#### Option B: Local MongoDB

1. **Install MongoDB Community Server**
   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS
   - Start MongoDB service

2. **Your connection string will be:**
   ```
   mongodb://localhost:27017/tumenye
   ```

### Step 4: Environment Variables Setup

1. **Create environment file**
   ```bash
   # In the project root directory, create .env.local file
   touch .env.local
   ```

2. **Add environment variables**
   
   Open `.env.local` file and add these variables:

   ```env
   # Database Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tumenye
   # Replace with your actual MongoDB connection string
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret-change-this-in-production
   ```

   **Important**: 
   - Replace `MONGODB_URI` with your actual connection string
   - Generate a random secret for `NEXTAUTH_SECRET` (32+ characters)

### Step 5: Start the Application

1. **Run the development server**
   ```bash
   npm run dev
   ```

2. **Verify the server started**
   - You should see: "✓ Ready in X.Xs"
   - The app will be available at: `http://localhost:3000`

### Step 6: First-Time Setup

1. **Open your browser**
   - Navigate to: `http://localhost:3000`
   - You should see the Tumenye landing page

2. **Create Admin Account**
   - Open a new terminal/command prompt
   - Run: `curl -X POST http://localhost:3000/api/create-admin`
   - This creates an admin user with credentials:
     - Email: `admin@tumenye.rw`
     - Password: `admin123`

3. **Create Demo Users** (Optional)
   - Run: `curl -X POST http://localhost:3000/api/create-demo-users`
   - This creates 5 demo users for testing

### Step 7: Test the Application

1. **Test Admin Login**
   - Go to: `http://localhost:3000/auth/signin`
   - Login with: `admin@tumenye.rw` / `admin123`
   - Should redirect to: `http://localhost:3000/admin`
   - Verify admin dashboard loads with user statistics

2. **Test Student Registration**
   - Go to: `http://localhost:3000/auth/signup`
   - Create a new student account
   - Login and verify redirect to: `http://localhost:3000/dashboard`

3. **Test Learning Modules**
   - Navigate to "Modules" from the student dashboard
   - Try opening a lesson and taking a quiz

### Step 8: Verify Everything Works

✅ **Checklist - All these should work:**
- [ ] Home page loads at `http://localhost:3000`
- [ ] User registration works
- [ ] Student login redirects to `/dashboard`
- [ ] Admin login redirects to `/admin`
- [ ] Learning modules are accessible
- [ ] Admin can view all users in `/admin/users`
- [ ] Individual user details load correctly
- [ ] Progress tracking works
- [ ] Goal setting system functions

## 🎮 Demo Account

For testing purposes, you can use:
- **Email**: demo@tumenye.rw
- **Password**: demo123

## 📚 Learning Modules Structure

Each module contains:
- **Interactive Lessons**: Text-based content with rich formatting
- **Quizzes**: 3-5 multiple choice questions to test understanding
- **Progress Tracking**: Visual indicators of completion status
- **Sequential Learning**: Lessons unlock as previous ones are completed

## 🎨 Design System

### Color Palette
- **Primary Blue**: #3b82f6 (Tumenye Blue)
- **Light Blue**: #dbeafe (Tumenye Light Blue)
- **Background**: Light blue and white theme
- **Typography**: Inter font family

### UI Principles
- Clean, friendly interface
- Mobile-first responsive design
- Accessible components
- Consistent spacing and typography

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages  
│   ├── modules/           # Learning modules
│   ├── dashboard/         # User dashboard
│   └── api/              # API routes
├── components/            # Reusable UI components
├── lib/                  # Utility functions and configs
├── models/               # MongoDB/Mongoose models
└── data/                 # Static module content
```

## 🔧 Key Components

- **Navigation**: Responsive header with user authentication
- **ModuleCard**: Interactive cards displaying module information
- **ProgressBar**: Visual progress indicators
- **Quiz System**: Interactive multiple-choice questions
- **Dashboard**: Comprehensive progress tracking

## 🚀 Production Deployment (Vercel)

Follow these steps to deploy to production:

### Prerequisites for Production
1. ✅ Local development working (complete Step 1-8 above)
2. ✅ MongoDB Atlas account and cluster
3. ✅ GitHub account
4. ✅ Vercel account (free at [vercel.com](https://vercel.com))

### Production Deployment Steps

#### Step 1: Prepare for Production

1. **Ensure MongoDB Atlas is configured**
   - Your cluster should allow connections from anywhere (0.0.0.0/0)
   - Database user has read/write permissions
   - Connection string is working locally

2. **Update environment for production**
   - Your `.env.local` should have the Atlas connection string
   - Generate a strong `NEXTAUTH_SECRET` (32+ random characters)

#### Step 2: Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Ready for production deployment"
   
   # Push to main branch
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Import Project"
   - Connect your GitHub account
   - Select the "Tumenye" repository
   - Click "Import"

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tumenye
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-production-secret-32-characters-minimum
   ```
   
   **Important**: 
   - Replace `NEXTAUTH_URL` with your actual Vercel app URL
   - Use a different, strong secret for production

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Vercel will provide your live URL

#### Step 3: Production Setup

1. **Create Admin Account**
   ```bash
   curl -X POST https://your-app.vercel.app/api/create-admin
   ```

2. **Create Demo Users** (Optional)
   ```bash
   curl -X POST https://your-app.vercel.app/api/create-demo-users
   ```

3. **Test Production Deployment**
   - Visit your Vercel URL
   - Test admin login: `admin@tumenye.rw` / `admin123`
   - Verify admin dashboard works
   - Test student registration and login
   - Verify all features work in production

### Production Credentials

**Admin Access:**
- URL: `https://your-app.vercel.app/admin`
- Email: `admin@tumenye.rw`
- Password: `admin123`

**Demo Students:**
- `jean@tumenye.rw` / `demo123`
- `marie@tumenye.rw` / `demo123`
- `david@tumenye.rw` / `demo123`
- `grace@tumenye.rw` / `demo123`
- `samuel@tumenye.rw` / `demo123`

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Issue**: `npm install` fails
- **Solution**: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again
- **Command**: `rm -rf node_modules package-lock.json && npm install`

**Issue**: "MongooseServerSelectionError" 
- **Solution**: Check MongoDB Atlas network access settings
- **Fix**: Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas

**Issue**: "No users found" in admin interface
- **Solution**: Create demo users using the API
- **Fix**: `curl -X POST http://localhost:3000/api/create-demo-users`

**Issue**: Admin login doesn't redirect to `/admin`
- **Solution**: Clear browser cache and ensure admin user exists
- **Fix**: Run `curl -X POST http://localhost:3000/api/create-admin`

**Issue**: Port 3000 already in use
- **Solution**: Kill existing processes or use different port
- **Fix**: `pkill -f "next dev"` then `npm run dev` again

**Issue**: Environment variables not loading
- **Solution**: Ensure `.env.local` is in project root and restart server
- **Fix**: Restart development server with `npm run dev`

### Getting Help

If you encounter issues not covered here:

1. Check that all prerequisites are installed correctly
2. Ensure MongoDB connection string is correct
3. Verify all environment variables are set
4. Try restarting the development server
5. Check the browser console for error messages
6. Check terminal output for server errors

## 🎯 Demo Account Credentials

### For Testing/Demo Purposes

**Admin Account:**
- Email: `admin@tumenye.rw`
- Password: `admin123`
- Access: Full admin dashboard with user management

**Student Demo Accounts:**
- Email: `jean@tumenye.rw`, Password: `demo123`
- Email: `marie@tumenye.rw`, Password: `demo123`
- Email: `david@tumenye.rw`, Password: `demo123`
- Email: `grace@tumenye.rw`, Password: `demo123`
- Email: `samuel@tumenye.rw`, Password: `demo123`

## 🤝 Contributing

This project is part of a Tech for Good initiative. Contributions are welcome to help improve digital literacy education in Rwanda.

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write clean, readable code
- Test thoroughly before submitting PRs
- Maintain accessibility standards

## 📄 License

This project is created for educational purposes and social impact in Rwanda.

## � Documentation

### Software Requirements Specification (SRS)
- **SRS Document**: [View Complete SRS](https://docs.google.com/document/d/1AfxA-Wv42jKdis8PhQ3jETAi5PaWSbGvofpS_UO5EwA/edit?usp=sharing)
- Contains detailed functional requirements, system architecture, and technical specifications
- Includes user stories, acceptance criteria, and system design documentation

## �🙏 Acknowledgments

- Built for Rwandan youth and digital empowerment
- Inspired by the vision of technology for social good
- Designed with accessibility and inclusivity in mind
- Focused on bridging the digital divide in Rwanda

---

## 🎉 Success!

If you've followed all steps correctly, you should now have:
- ✅ A fully functional Tumenye platform
- ✅ Admin dashboard with user management
- ✅ Student learning interface with progress tracking
- ✅ Individual goal setting system
- ✅ Role-based authentication and navigation
- ✅ Complete MongoDB integration
- ✅ Production-ready deployment

**Welcome to Tumenye - Empowering Rwandan Youth Through Digital Literacy! 🇷🇼**
