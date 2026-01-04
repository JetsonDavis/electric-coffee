# Docker Setup Guide

## Overview

The Electric Coffee application is fully dockerized with persistent storage for the SQLite database using Docker volumes.

## Architecture

- **Frontend**: React with Vite (port 3005)
- **Backend**: Express API (port 3001)
- **Database**: SQLite stored in external volume at `./data/videos.db`
- **Thumbnails**: Stored in external volume at `./public/thumbnails`

## Quick Start

```bash
# Build the image
docker build -t electric-coffee .

# Run the container with volume mounts
docker run -d \
  -p 3005:3005 \
  -p 3001:3001 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  electric-coffee

# View logs
docker logs -f electric-coffee

# Stop and remove the container
docker stop electric-coffee
docker rm electric-coffee
```

The application will be available at:
- **Frontend**: http://localhost:3005
- **Backend API**: http://localhost:3001

## Persistent Storage

### Database Volume

The SQLite database is stored in `./data/videos.db` on your host machine. This directory is mounted as a volume in the container at `/app/server/data`.

**Benefits:**
- Database persists across container restarts
- Easy to backup (just copy the `./data` directory)
- Can be shared between containers
- Database can be accessed directly from the host

### Thumbnails Volume

Video thumbnails are stored in `./public/thumbnails` and mounted at `/app/public/thumbnails` in the container.

## Data Management

### Backup Database

```bash
# Create a backup
cp -r ./data ./data-backup-$(date +%Y%m%d)
```

### Restore Database

```bash
# Stop the container
docker-compose down

# Restore from backup
cp -r ./data-backup-20240103 ./data

# Restart the container
docker-compose up -d
```

### Reset Database

```bash
# Stop the container
docker stop electric-coffee
docker rm electric-coffee

# Remove the database
rm -rf ./data

# Restart (will create fresh database with default data)
docker run -d \
  -p 3005:3005 \
  -p 3001:3001 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  electric-coffee
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs electric-coffee

# Rebuild from scratch
docker stop electric-coffee
docker rm electric-coffee
docker build --no-cache -t electric-coffee .
docker run -d \
  -p 3005:3005 \
  -p 3001:3001 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  electric-coffee
```

### Database permissions issues

```bash
# Fix permissions on data directory
chmod -R 755 ./data
```

### Port already in use

If ports 3005 or 3001 are already in use, change the host ports:

```bash
docker run -d \
  -p 8080:3005 \
  -p 8081:3001 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  electric-coffee
```

Then access at http://localhost:8080

## File Structure

```
phillipe/
├── Dockerfile              # Container definition
├── .dockerignore          # Files to exclude from image
├── data/                  # SQLite database (volume mount)
│   └── videos.db
├── public/
│   └── thumbnails/        # Video thumbnails (volume mount)
└── server/
    ├── database.js        # Database with volume support
    └── index.js           # Express API server
```

## Notes

- The database file is automatically created on first run
- Default video data is seeded if the database is empty
- Both frontend and backend run in the same container
- The container serves the built production frontend
- Database persists in the `./data` directory on your host machine
