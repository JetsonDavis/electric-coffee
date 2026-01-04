# Database Setup Guide

## Overview

Electric Coffee uses SQLite for storing video metadata. The database file is included in the git repository with default video data.

## Quick Setup

### Initial Setup

The database file (`server/data/videos.db`) is already included in the repository with default data. When you clone the repo, the database is ready to use.

If you need to recreate or reset the database:

```bash
npm run setup-db
```

This will:
- Create the `server/data` directory if it doesn't exist
- Create the `videos.db` SQLite database
- Create the `videos` table with the proper schema
- Insert 7 default videos with metadata

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

## Default Data

The setup script includes 7 default videos:

1. **Electric Coffee Sizzle Reel** - A compilation showcasing the vibrant coffee house scene
2. **Live Performance at The Grind** - Acoustic set from a beloved coffee house
3. **Poetry Night Special** - Spoken word performances
4. **Jazz Fusion Evening** - Experimental jazz meets coffee culture
5. **Open Mic Highlights** - Best moments from weekly open mic nights
6. **Behind the Scenes** - How the volunteer-run show was produced
7. **The Scene Documentary** - Cultural impact of LA's coffee house movement

## Database Management

### View Database Contents

```bash
# Using sqlite3 command line
sqlite3 server/data/videos.db "SELECT * FROM videos;"

# Or open interactive shell
sqlite3 server/data/videos.db
```

### Reset Database

To completely reset the database to default state:

```bash
rm server/data/videos.db
npm run setup-db
```

### Backup Database

```bash
# Create a backup
cp server/data/videos.db server/data/videos.db.backup

# Or with timestamp
cp server/data/videos.db server/data/videos-$(date +%Y%m%d-%H%M%S).db
```

### Restore Database

```bash
# Restore from backup
cp server/data/videos.db.backup server/data/videos.db
```

## Git Repository

The database file is tracked in the git repository:
- **Tracked**: `server/data/videos.db` (initial database with default data)
- **Ignored**: Other files in `server/data/` directory
- **Ignored**: `data/` directory (used by Docker)

This means:
- The initial database is version controlled
- Local changes to the database are NOT tracked by git
- Each clone gets a fresh copy of the default database
- You can modify the database locally without affecting the repository

## Development Workflow

### Local Development

1. Clone the repository (database is included)
2. Run `npm install`
3. Run `npm run dev:all`
4. Access admin page at http://localhost:5173/admin to edit videos

### Adding New Videos

You can add videos through the admin interface or directly via SQL:

```bash
sqlite3 server/data/videos.db
```

```sql
INSERT INTO videos (vimeo_url, title, artist, description, thumbnail, display_order)
VALUES (
  'https://vimeo.com/VIDEO_ID',
  'Video Title',
  'Artist Name',
  'Video description',
  '/thumbnails/video-thumbnail.jpg',
  8
);
```

### Updating Video Metadata

Use the admin page at `/admin` or update directly:

```sql
UPDATE videos 
SET title = 'New Title', 
    artist = 'New Artist',
    description = 'New description'
WHERE id = 1;
```

## Docker Considerations

When running in Docker:
- The database is stored in a volume mount at `./data/videos.db`
- This allows the database to persist across container restarts
- The initial database from the repository is copied to the volume on first run
- Changes made through the admin panel persist in the volume

## Troubleshooting

### Database file not found

```bash
npm run setup-db
```

### Permission errors

```bash
chmod 644 server/data/videos.db
chmod 755 server/data
```

### Corrupted database

```bash
# Check database integrity
sqlite3 server/data/videos.db "PRAGMA integrity_check;"

# If corrupted, reset
rm server/data/videos.db
npm run setup-db
```

### Database locked

This happens when multiple processes try to access the database:
- Stop all running servers
- Check for zombie processes: `ps aux | grep node`
- Kill any hanging processes
- Restart the server

## Scripts

### setup-database.js

Located at `scripts/setup-database.js`, this script:
- Creates the database and schema
- Checks if data already exists
- Inserts default data only if database is empty
- Provides helpful output and instructions

### Usage

```bash
# Run via npm script
npm run setup-db

# Or directly
node scripts/setup-database.js
```

## Production Deployment

For production deployments:

1. The database file is included in the Docker image
2. On first run, it's copied to the persistent volume
3. All changes are saved to the volume, not the image
4. Backup the volume regularly for data safety

## Migration Strategy

If you need to update the schema in the future:

1. Create a migration script in `scripts/migrations/`
2. Run migrations before starting the server
3. Update the setup script to include new schema changes
4. Document the migration in this file

## Support

For database-related issues:
- Check the logs: `docker logs electric-coffee`
- Verify file permissions
- Ensure SQLite is properly installed
- Check disk space availability
