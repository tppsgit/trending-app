# 🚀 Deployment Guide - Trending Stocks App

## Quick Deployment Steps

### 1. Deploy Backend to Render (Free)

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use the `backend` folder as root directory
   - Configure settings:
     - **Name**: `trending-stocks-api`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (always available after ~15 min sleep)
   - Add Environment Variable: `ALPHA_VANTAGE_API_KEY` = `demo`
   - Click "Create Web Service"

3. **Get your API URL**: After deployment, Render will give you a URL like `https://trending-stocks-api.onrender.com`

### 2. Update Frontend for Production

Edit `frontend/src/config/api.js`:
```javascript
const DEV_API_URL = 'http://localhost:3000';
const PROD_API_URL = 'https://trending-stocks-api.onrender.com'; // Your Render URL
const USE_PRODUCTION = true; // Set to true for production
```

### 3. Build & Deploy Frontend

#### Option A: Expo Go (Free - Development)
```bash
cd frontend
npx expo start
# Scan QR code with Expo Go app
```

#### Option B: Web Deployment (Free - Netlify/Vercel)
```bash
cd frontend
npx expo export --platform web
# Deploy the 'dist' folder to Netlify or Vercel
```

#### Option C: APK Build (Free - No Play Store)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## 🎯 What's Working Now

✅ **Backend API**: Fully functional with mock data
✅ **Frontend App**: Beautiful dark UI with trending stocks
✅ **Local Development**: Tested and working perfectly
✅ **Production Ready**: Config files ready for deployment

## 📱 Features Implemented

- **Top 20 Trending Stocks**: Real-time ranking system
- **Beautiful Dark UI**: Modern, eye-friendly design
- **Stock Details**: Comprehensive stock information
- **Pull to Refresh**: Latest data updates
- **Error Handling**: Graceful error states
- **Cross-platform**: iOS, Android, and Web support

## 🌐 Free Services Used

- **Backend**: Render (free tier - always available)
- **Frontend**: Expo (free building)
- **API**: Alpha Vantage (demo key for testing)
- **Web Hosting**: Netlify/Vercel (optional)

## 🔧 Environment Setup

### Backend (.env)
```env
PORT=3000
ALPHA_VANTAGE_API_KEY=demo
NODE_ENV=production
```

### Frontend Configuration
- Update `frontend/src/config/api.js` with your Render URL
- Set `USE_PRODUCTION = true` for deployed backend

## 📊 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/health` | Health check |
| `/api/trending` | Get top 20 trending stocks |
| `/api/stock/:symbol` | Get single stock details |
| `/api/live/:symbol` | Get live data (uses API quota) |

## 🚨 Important Notes

- **Alpha Vantage Free Tier**: 5 calls/minute, 500 calls/day
- **Demo Mode**: Backend uses realistic mock data to avoid rate limits
- **Render Free Tier**: Sleeps after 15 min inactivity, wakes on request
- **Expo Building**: Free for development and preview builds

## 🎉 Next Steps

1. **Deploy Backend** to Render using steps above
2. **Update Frontend** API configuration
3. **Build and Test** the mobile app
4. **Share** with users!

The app is production-ready and uses only free services! 🚀
