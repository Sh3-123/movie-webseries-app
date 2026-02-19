# Movie & Web Series Management App

A full-stack web application inspired by Netflix, allowing users to browse, search, and manage watched/saved lists of movies and web series.

## Features

- **Netflix-inspired UI**: Dark theme, responsive design, smooth animations.
- **Authentication**: Secure login and registration with JWT.
- **Movie & Series Data**: Data fetched from OMDb API via secure backend proxy.
- **Search & Filter**: Search by title, popular genres (Action, Comedy, etc.).
- **Details Page**: View plot, cast, ratings. Collapsible seasons and episodes for series.
- **User Lists**: Add to "Watched" or "My List" (Saved).
- **Backend**: Node.js, Express, MySQL (Aiven).
- **Frontend**: React, Vite, Framer Motion.

## Project Structure

```
movie-webseries-app/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components (Nav, Banner, Row)
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page components (Home, Login, Details, etc.)
│   │   ├── App.jsx         # Main router
│   │   └── index.css       # Global styles
│   ├── index.html
│   └── package.json
├── server/                 # Node.js Backend
│   ├── config/             # (Optional) Config files
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes (auth, movies, user)
│   ├── db.js               # Database connection & Schema creation
│   ├── index.js            # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
├── config.md               # Configuration reference
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL Database (Aiven credentials prodivded)
- OMDb API Key

### 1. Backend Setup
1. Navigate to `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create `.env` file (already created automatically based on config.md):
   ```
   PORT=5000
   OMDB_API_KEY=your_key
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   DB_PORT=...
   DB_SSL=REQUIRED
   ```
4. Start the server:
   ```bash
   node index.js
   ```
   The server runs on http://localhost:5000. It will automatically create necessary database tables on first run.

### 2. Frontend Setup
1. Navigate to `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on http://localhost:5173.

## Deployment Instructions

### Backend
- Deploy the `server` folder to a Node.js hosting service (e.g., Heroku, Render, AWS Beanstalk).
- Set environment variables in the dashboard of your hosting provider matching the `.env` file.
- Ensure the database allows connections from the deployment IP (Aiven usually allows public access with secure credentials).

### Frontend
- Build the project:
  ```bash
  npm run build
  ```
- Deploy the `dist` folder to a static host (e.g., Vercel, Netlify, AWS S3).
- **Important**: Update API calls in frontend to point to your deployed backend URL instead of `localhost:5000`. You can use `.env` variable `VITE_API_URL`.

## Database
The application uses Aiven MySQL. The schema includes:
- `users`: User credentials.
- `watched`: Movies/Series marked as watched.
- `saved`: Movies/Series saved for later.
- `watched_episodes` & `watched_seasons`: (Future implementation/Schema ready)

Enjoy!
