# Admin Page Setup Guide

## Overview

The application now includes an admin page where you can edit video titles, artist names, and descriptions. All changes are persisted to a SQLite database.

## Architecture

- **Frontend**: React with Vite (runs on port 5173)
- **Backend**: Express API server (runs on port 8005)
- **Database**: SQLite (`server/videos.db`)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

You have two options:

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev:all
```

**Option B: Run separately in two terminals**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 3. Access the Application

- **Main Page**: http://localhost:5173/
- **Admin Page**: http://localhost:5173/admin

## Features

### Main Page (/)
- Displays the sizzle reel video by default
- Shows a list of 12 videos with thumbnails
- Click any thumbnail to play that video in the main player
- All data is fetched from the database

### Admin Page (/admin)
- Identical layout to the main page
- Click "Edit" button on any video to modify:
  - Video Title
  - Artist Name
  - Description
- Changes are saved to the SQLite database
- Click "Save" to persist changes or "Cancel" to discard
- Link to return to the public page

## Database Schema

```sql
CREATE TABLE videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vimeo_url TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  display_order INTEGER NOT NULL
)
```

## API Endpoints

- `GET /api/videos` - Fetch all videos
- `PUT /api/videos/:id` - Update a video's title, artist, and description

## File Structure

```
phillipe/
├── server/
│   ├── index.js          # Express API server
│   ├── database.js       # SQLite database setup and queries
│   └── videos.db         # SQLite database (created automatically)
├── src/
│   ├── App.jsx           # Router setup
│   ├── VideoFirstPage.jsx # Main public page
│   ├── AdminPage.jsx     # Admin page with edit functionality
│   └── ...
└── package.json
```

## Notes

- The database is automatically created with 12 sample videos on first run
- Video thumbnails currently use placeholder images
- The sizzle reel URL is hardcoded as the initial video: https://vimeo.com/1151293346
- All edits made in the admin page are immediately reflected on the main page after refresh
