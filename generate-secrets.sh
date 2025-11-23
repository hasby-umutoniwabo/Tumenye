#!/bin/bash

# Generate secure environment variables for production

echo "🔐 Generating secure environment variables for Tumenye..."
echo ""

# Generate NEXTAUTH_SECRET
SECRET=$(openssl rand -base64 32 2>/dev/null || node -p "require('crypto').randomBytes(32).toString('base64')" 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(32))" 2>/dev/null)

echo "Copy these environment variables to your deployment platform:"
echo "=================================================="
echo ""
echo "NEXTAUTH_SECRET=$SECRET"
echo "NEXTAUTH_URL=https://your-app-name.vercel.app"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tumenye?retryWrites=true&w=majority"
echo "ADMIN_EMAIL=admin@tumenye.rw"
echo "ADMIN_PASSWORD=$(openssl rand -base64 16 2>/dev/null || node -p "require('crypto').randomBytes(16).toString('base64')" 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(16))" 2>/dev/null)"
echo ""
echo "=================================================="
echo "⚠️  Save these values securely!"
echo "📋 Add them to your Vercel/Netlify environment variables"
