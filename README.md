# StockMonitor: Unified Asset Tracker
## A Cross-Market Portfolio Dashboard for the Global Investor

**🎯 1. Problem Statement**
Retail investors in India who track both NSE (India) and NYSE/NASDAQ (US) stocks suffer from "Dashboard Fatigue." Most platforms are region-locked, forcing users to switch between multiple apps to see their total market exposure. StockMonitor provides a unified, minimalist bridge that tracks global assets in a single view, solving the fragmentation problem for high-growth portfolios.

**🎯2. Tech Stack**
Frontend: React (Vite)

Styling: Custom CSS (Dark-themed, minimalist UI)

Backend: Node.js / Express (Proxy server for API security & CORS handling)

BaaS (Backend as a Service): Firebase

Authentication: Google Social Login

Database: Firestore (Real-time NoSQL persistence)

Data Source: EODHD Real-Time Financial API

**🛠️ 3. Key Features & Requirements**
This project fulfills the following Entrepreneurship (ENT) Term Project mandates:

✅ Authentication: Secure Firebase Auth integration with Protected Routes.

✅ Real-Time Data: Dynamic fetching of live US prices and last-closing prices for Indian markets.

✅ Full CRUD Lifecycle:

Create: Users can add any ticker (e.g., AAPL.US, RELIANCE.NSE) to their watchlist.

Read: Watchlist is synced across devices via Firestore.

Delete: Real-time removal of assets from the tracking grid.

✅ Responsive UI: Optimized for desktop and mobile viewing (tested on Motorola mobile devices).

**🏗️ 4. Project Architecture**
src/services/stockApi.js: Managed the fallback logic for market-closed scenarios (handling $N/A errors for NSE stocks).

src/pages/Dashboard.jsx: Implemented Lifting State Up and useEffect hooks for real-time synchronization between the database and the UI.

server.js: A proxy server to hide sensitive API keys and bypass CORS restrictions.