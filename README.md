Weather Dashboard (Mini Project)

Objective	

Build a responsive weather application that provides real-time weather data and a 5-day forecast, with bonus features such as location detection, favorites, search history, unit conversion, compass direction, and dark mode.

---
Description

Weather Dashboard is a client–server capable mini project built with React (Vite) that delivers real-time weather insights using a live API. The interface is mobile-first, visually structured, and enhanced with animated weather icons and compass wind direction. The goal was to create a dashboard that is:
Fast to query (city search + geolocation lookup)
Persistent (favorites + search history stored locally)
Adaptive (dark/light theme + temperature unit toggle)
Informative (min/max forecast temperatures, humidity, wind speed, and direction)
Production-ready for sharing and deployment
The project was built to explore API integration, state management, responsive UI engineering, and deployment pipelines using Vercel and Render.


Live Deployment Links

Service| Link
Direct Link(added frontend and backend)-------< https://frontend-omega-five-82.vercel.app>
Frontend Link(only the UI )----------<https://frontend-omega-five-82.vercel.app>
Backend (Server)--------<https://todo-backend-euoz.onrender.com>

Core Features Implemented

- Search weather by city
- Display current weather data
- 5-day forecast
- Geolocation weather detection
- Temperature unit toggle (°C / °F)
- Favorite city marking (separate button)
- Search history tracking + Clear History button
- Compass direction for wind
- Dark mode support
- Responsive UI


Technologies Used

- React (Vite)
- CSS (Component-based stylesheets)
-  Framer Motion (for animation)
-  Lucide React Icons
-  OpenWeatherMap API
-  LocalStorage (favorites + search history + theme + unit)


 Setup Instructions

1.Clone the repository
git clone https://github.com/Aditya-Modak/weather-app.git
cd weather-app

2. Install dependencies
npm install

3. Configure environment variables in Vercel

Vercel -> Project Settings -> Environment Variables -> Add:
Key: VITE_API_KEY
Value: My_Api _Key

4. Run locally in development mode
npm run dev
This launches the app at:
http://localhost:5173

5. Build and deploy to production
npm run build
vercel --prod


Challenges Faced & Solutions

1. Environment Variable undefined in Build
Issue: Vite embeds import.meta.env only at build time. Local .env was not available on Vercel, causing:
appid=undefined → 401 Unauthorized from OpenWeather
Fix: Moved the API key into Vercel environment variables and ensured the build was triggered after setting it. Also validated that no accidental redeclared constants were overriding the key.


2. Duplicate Exports in weatherAPI.js

Issue: The file had been accidentally merged/pasted twice, causing:
Duplicated export 'getCurrentWeather'
Fix: Removed redeclared exports, cleaned the file, and verified imports were pointing to:
./services/weatherAPI.js (single source)

3. Forecast Min/Max Temperatures Showing Same Values

Issue: API returns 3-hour interval data. The app was incorrectly reading only one entry per day and reusing the same temperature for min/max.
Fix: Re-implemented daily grouping:
const temps = dayItems.map(i => i.main.temp);
Math.min(...temps), Math.max(...temps)
This now extracts true daily range instead of duplicating the same temperature.

4. JSX Component Crash Due to Missing Icons
Issue: UI was using icons like:
Calendar, MapPin, Thermometer, Trash2
but they were not imported, causing blank screens or React render crashes.
Fix: Imported all used icons explicitly from lucide-react.

 5. Render Failures During Deployment to GitHub
Issue: Remote branch had commits not present locally:
[rejected] main -->(fetch first)
Fix: Pulled remote safely and rebased:
git pull --rebase origin main
git push origin main
Screenshots

(Make sure you create a "screenshots/" folder and drop your actual images there)



Useful Links

- OpenWeather API Docs → https://openweathermap.org/api
- Vite Docs → https://vitejs.dev/guide/
- React Docs → https://react.dev/



Made with by 
-Aditya Modak(AMMO).
