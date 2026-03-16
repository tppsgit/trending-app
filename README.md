# Trending Stocks Mobile App

A React Native (Expo) mobile application that displays the top 20 trending stocks, powered by an Express.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo Go app on your phone (for testing)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API will be running at `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

## 📱 Features

- **Top 20 Trending Stocks** - View the most active stocks
- **Real-time Data** - Pull to refresh for latest prices
- **Stock Details** - Tap any stock for detailed information
- **Beautiful Dark UI** - Modern, eye-friendly design
- **Cross-platform** - Works on iOS, Android, and Web

## 🌐 Free Hosting Deployment

### Deploy Backend to Render (Free)

1. Create account at [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo or upload code
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `ALPHA_VANTAGE_API_KEY`
5. Deploy (free tier available)

After deployment, update `frontend/src/config/api.js`:
```javascript
const PROD_API_URL = 'https://trending-stocks-api.onrender.com'; // Replace with your Render URL
const USE_PRODUCTION = true;
```

### Deploy Frontend with Expo (Free)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure project:
```bash
cd frontend
eas build:configure
```

4. Build for preview (free):
```bash
# Android APK (free, no Play Store account needed)
eas build --platform android --profile preview

# iOS Simulator build (free)
eas build --platform ios --profile preview
```

5. For web deployment (free via Netlify/Vercel):
```bash
npx expo export --platform web
# Deploy the 'dist' folder to Netlify or Vercel
```

## 📁 Project Structure

```
trending-app/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   ├── .env               # Environment variables
│   └── render.yaml        # Render deployment config
├── frontend/
│   ├── App.js             # Main app entry
│   ├── app.json           # Expo configuration
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js     # API configuration
│   │   └── screens/
│   │       ├── TrendingListScreen.js
│   │       └── StockDetailScreen.js
│   └── assets/
└── README.md
```

## 🔧 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/trending` | Get top 20 trending stocks |
| `GET /api/stock/:symbol` | Get single stock details |
| `GET /api/live/:symbol` | Get live data (uses API quota) |

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=3000
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

## 📝 Notes

- Alpha Vantage free tier: 5 API calls/minute, 500 calls/day
- Backend uses caching to minimize API calls
- Demo mode uses simulated data to avoid rate limits

## 🆓 Free Services Used

- **Backend Hosting**: Render (free tier)
- **Frontend Building**: Expo (free)
- **Stock Data**: Alpha Vantage (free tier)
- **Web Hosting**: Netlify/Vercel (free tier)

## 📄 License

MIT License
