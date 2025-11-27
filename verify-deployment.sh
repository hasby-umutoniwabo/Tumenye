#!/bin/bash

# Deployment Verification Script for Tumenye Platform
# Run this script after deploying to Vercel to verify everything works

echo "🚀 Tumenye Platform - Deployment Verification"
echo "============================================="

# Check if VERCEL_URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Vercel app URL"
    echo "Usage: ./verify-deployment.sh https://your-app.vercel.app"
    exit 1
fi

VERCEL_URL=$1

echo ""
echo "🔍 Testing deployment at: $VERCEL_URL"
echo ""

# Test 1: Home page
echo "1. Testing home page..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/")
if [ "$response" -eq 200 ]; then
    echo "   ✅ Home page: OK"
else
    echo "   ❌ Home page: Failed ($response)"
fi

# Test 2: Create admin endpoint
echo "2. Testing admin creation endpoint..."
response=$(curl -s -X POST "$VERCEL_URL/api/create-admin")
if [[ $response == *"admin@tumenye.rw"* ]]; then
    echo "   ✅ Admin creation: OK"
else
    echo "   ❌ Admin creation: Failed"
fi

# Test 3: Create demo users endpoint
echo "3. Testing demo users creation..."
response=$(curl -s -X POST "$VERCEL_URL/api/create-demo-users")
if [[ $response == *"Demo users created successfully"* ]]; then
    echo "   ✅ Demo users: OK"
else
    echo "   ❌ Demo users: Failed"
fi

# Test 4: Auth pages
echo "4. Testing authentication pages..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/auth/signin")
if [ "$response" -eq 200 ]; then
    echo "   ✅ Sign in page: OK"
else
    echo "   ❌ Sign in page: Failed ($response)"
fi

response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/auth/signup")
if [ "$response" -eq 200 ]; then
    echo "   ✅ Sign up page: OK"
else
    echo "   ❌ Sign up page: Failed ($response)"
fi

echo ""
echo "📋 Manual Testing Steps:"
echo "========================"
echo ""
echo "🔐 Admin Login Testing:"
echo "   1. Go to: $VERCEL_URL/auth/signin"
echo "   2. Use credentials:"
echo "      Email: admin@tumenye.rw"
echo "      Password: admin123"
echo "   3. Should redirect to: $VERCEL_URL/admin"
echo ""
echo "👥 Admin Dashboard Testing:"
echo "   1. Check admin dashboard displays user statistics"
echo "   2. Click 'View All Users →' button"
echo "   3. Verify users table shows demo users"
echo "   4. Click 'View Details →' for any user"
echo "   5. Verify user details page loads correctly"
echo ""
echo "🎓 Student Login Testing:"
echo "   1. Go to: $VERCEL_URL/auth/signin"
echo "   2. Use any demo user credentials:"
echo "      Email: jean@tumenye.rw"
echo "      Password: demo123"
echo "   3. Should redirect to: $VERCEL_URL/dashboard"
echo ""
echo "🌐 Public Access Testing:"
echo "   1. Visit: $VERCEL_URL (without logging in)"
echo "   2. Check landing page displays correctly"
echo "   3. Verify sign up and sign in links work"
echo ""
echo "✨ Deployment verification complete!"
echo "   Your Tumenye platform should be ready for demo!"
