#!/bin/bash

echo "🚀 Trending Stocks App - Deployment Helper"
echo "=========================================="

# Check if backend is running
echo "📊 Checking backend status..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running locally"
else
    echo "❌ Backend is not running. Please start it first:"
    echo "   cd backend && npm start"
    exit 1
fi

# Check frontend dependencies
echo "📱 Checking frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Test build for web
echo "🌐 Testing web build..."
npx expo export --platform web --output-dir dist

if [ $? -eq 0 ]; then
    echo "✅ Web build successful! Check the 'dist' folder."
    echo "🔗 You can deploy this to Netlify or Vercel for free hosting."
else
    echo "❌ Web build failed"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Deploy backend to Render: https://render.com"
echo "2. Update frontend/src/config/api.js with your Render URL"
echo "3. Deploy web build to Netlify/Vercel or use Expo Go for mobile"
echo ""
echo "📖 Full guide: DEPLOYMENT.md"
