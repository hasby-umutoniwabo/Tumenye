#!/bin/bash

# Tumenye Deployment Script
echo "🚀 Preparing Tumenye for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Check for environment variables
echo "🔍 Checking environment setup..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Make sure to set up environment variables in your hosting platform."
fi

echo "📋 Deployment checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Build successful"
echo "3. 🔲 Set up MongoDB Atlas database"
echo "4. 🔲 Configure environment variables in hosting platform"
echo "5. 🔲 Deploy to hosting platform (Vercel/Netlify/etc.)"

echo ""
echo "🌐 Next steps:"
echo "1. Push code to GitHub: git push origin main"
echo "2. Connect repository to Vercel at https://vercel.com"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Your app will be available at: https://your-project-name.vercel.app"

echo ""
echo "🎉 Ready for deployment!"
