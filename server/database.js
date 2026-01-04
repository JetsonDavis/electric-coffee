import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use data directory for persistent storage (Docker volume mount point)
const dataDir = join(__dirname, 'data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch (err) {
  // Directory already exists
}

const db = new Database(join(dataDir, 'videos.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vimeo_url TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    display_order INTEGER NOT NULL
  )
`);

const insertDefaultData = db.prepare(`
  INSERT INTO videos (vimeo_url, title, artist, description, thumbnail, display_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const count = db.prepare('SELECT COUNT(*) as count FROM videos').get();

if (count.count === 0) {
  const defaultVideos = [
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 1", artist: "Artist Name 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 1 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 2", artist: "Artist Name 2", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 2 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 3", artist: "Artist Name 3", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 3 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 4", artist: "Artist Name 4", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 4 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 5", artist: "Artist Name 5", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 5 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 6", artist: "Artist Name 6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 6 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 7", artist: "Artist Name 7", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 7 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 8", artist: "Artist Name 8", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 8 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 9", artist: "Artist Name 9", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 9 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 10", artist: "Artist Name 10", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 10 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 11", artist: "Artist Name 11", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 11 },
    { vimeoUrl: "https://vimeo.com/148751763", title: "Video Title 12", artist: "Artist Name 12", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", thumbnail: "https://via.placeholder.com/300x225", order: 12 },
  ];

  for (const video of defaultVideos) {
    insertDefaultData.run(video.vimeoUrl, video.title, video.artist, video.description, video.thumbnail, video.order);
  }
}

export const getAllVideos = () => {
  return db.prepare('SELECT * FROM videos ORDER BY display_order').all();
};

export const updateVideo = (id, title, artist, description) => {
  const stmt = db.prepare('UPDATE videos SET title = ?, artist = ?, description = ? WHERE id = ?');
  return stmt.run(title, artist, description, id);
};

export default db;
