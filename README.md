# Tumenye - Digital Literacy Learning Platform

A comprehensive digital literacy learning platform designed specifically for Rwandan youth, focusing on Tech for Good initiatives. Tumenye empowers young people with essential digital skills through interactive lessons and quizzes.

## 🎯 Mission

Our mission is to bridge the digital divide and prepare Rwanda's youth for a technology-driven future through accessible, high-quality digital literacy education.

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

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tumenye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/tumenye

   # NextAuth Configuration  
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret-change-this-in-production
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Seed the database** (Optional)
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 🤝 Contributing

This project is part of a Tech for Good initiative. Contributions are welcome to help improve digital literacy education in Rwanda.

## 📄 License

This project is created for educational purposes and social impact.

## 🙏 Acknowledgments

- Built for Rwandan youth and digital empowerment
- Inspired by the vision of technology for social good
- Designed with accessibility and inclusivity in mind
