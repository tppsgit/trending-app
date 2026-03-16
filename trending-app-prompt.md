# Build Free Trending Mobile App

You are an expert mobile app developer. Your task is to create a complete mobile application using the trending-app-guide.md that displays top 20 trending items and can be built and hosted completely free.

## Requirements:
1. Follow the trending-app-guide.md exactly
2. Use free services for hosting (Render/Heroku for backend, Expo for frontend)
3. Implement all features from the guide
4. Ensure the app is fully functional and deployable
5. Use Alpha Vantage API for financial data (as indicated in the modified guide)

## Execution Steps:

### Phase 1: Backend Setup
1. Create the backend directory and initialize Node.js project
2. Install all required dependencies
3. Create the Express server with Alpha Vantage API integration
4. Update the data processing to handle financial time series data instead of Reddit data
5. Test the backend API endpoints locally
6. Prepare for free hosting on Render

### Phase 2: Frontend Setup
1. Initialize React Native project using Expo (for free building)
2. Install navigation and required dependencies
3. Create the trending list component adapted for financial data
4. Create the detail component for financial information
5. Implement proper navigation
6. Test the app in Expo Go

### Phase 3: Data Integration
1. Update the backend to properly process Alpha Vantage API response
2. Modify frontend components to display financial data (stock prices, changes, volumes)
3. Add proper error handling for API limits
4. Implement caching to reduce API calls

### Phase 4: Free Hosting Setup
1. Deploy backend to Render (free tier)
2. Configure Expo build settings for free deployment
3. Set up environment variables for production
4. Test the deployed application

### Phase 5: Final Polish
1. Add loading states and error handling
2. Implement pull-to-refresh functionality
3. Add search/filter capabilities
4. Optimize for performance
5. Ensure the app works on both iOS and Android

## Technical Specifications:

### Backend Changes Needed:
- Update API endpoint to handle Alpha Vantage time series data
- Transform financial data into trending format
- Add rate limiting and caching
- Implement proper error handling for API limits

### Frontend Changes Needed:
- Use Expo instead of plain React Native for free building
- Adapt UI for financial data display
- Add charts or visual indicators for price changes
- Implement proper date/time formatting

### Free Services to Use:
- **Backend**: Render (free tier)
- **Frontend**: Expo (free building and deployment)
- **API**: Alpha Vantage (free tier with limits)
- **Database**: Not needed for this simple app

## Expected Deliverables:
1. Fully functional mobile app code
2. Deployed backend API
3. Working Expo build
4. Complete setup instructions
5. Free hosting configuration

## Key Constraints:
- Must use only free services
- App must be buildable without paid Apple/Play Store accounts
- API usage must stay within free tier limits
- All features from the original guide must be implemented

Execute this step by step, creating all necessary files and configurations. Test each component before proceeding to the next phase.
