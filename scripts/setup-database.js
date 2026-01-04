import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
const dataDir = join(__dirname, '..', 'server', 'data');
const dbPath = join(dataDir, 'videos.db');

console.log('================================================');
console.log('Electric Coffee - Database Setup');
console.log('================================================');
console.log(`Database path: ${dbPath}`);
console.log('');

// Create data directory if it doesn't exist
try {
  mkdirSync(dataDir, { recursive: true });
  console.log('✓ Data directory created/verified');
} catch (err) {
  console.log('✓ Data directory already exists');
}

// Create database
const db = new Database(dbPath);
console.log('✓ Database connection established');

// Create table
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
console.log('✓ Videos table created');

// Check if data already exists
const count = db.prepare('SELECT COUNT(*) as count FROM videos').get();

if (count.count === 0) {
  console.log('');
  console.log('Inserting default video data...');
  
  // Insert default data
  const insert = db.prepare(`
    INSERT INTO videos (vimeo_url, title, artist, description, thumbnail, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const videos = [
    {
      vimeo_url: 'https://vimeo.com/1151293346',
      title: 'Electric Coffee Sizzle Reel',
      artist: 'Various Artists',
      description: 'A compilation showcasing the vibrant coffee house scene of 1994 Los Angeles.',
      thumbnail: '/thumbnails/video-1-1151296094.jpg',
      display_order: 1
    },
    {
      vimeo_url: 'https://vimeo.com/1151296083',
      title: 'Live Performance at The Grind',
      artist: 'The Acoustic Collective',
      description: 'An intimate acoustic set captured at one of LA\'s most beloved coffee houses.',
      thumbnail: '/thumbnails/video-2-1151296083.jpg',
      display_order: 2
    },
    {
      vimeo_url: 'https://vimeo.com/1151301093',
      title: 'Poetry Night Special',
      artist: 'Local Poets',
      description: 'Spoken word performances that defined the era\'s creative expression.',
      thumbnail: '/thumbnails/video-3-1151301093.jpg',
      display_order: 3
    },
    {
      vimeo_url: 'https://vimeo.com/1151301070',
      title: 'Jazz Fusion Evening',
      artist: 'The Coffee House Quartet',
      description: 'Experimental jazz meets coffee culture in this memorable performance.',
      thumbnail: '/thumbnails/video-4-1151301070.jpg',
      display_order: 4
    },
    {
      vimeo_url: 'https://vimeo.com/1151305470',
      title: 'Open Mic Highlights',
      artist: 'Various Artists',
      description: 'The best moments from weekly open mic nights across LA coffee houses.',
      thumbnail: '/thumbnails/video-7-1151305470.jpg',
      display_order: 5
    },
    {
      vimeo_url: 'https://vimeo.com/1151296070',
      title: 'Behind the Scenes',
      artist: 'Production Crew',
      description: 'A look at how this volunteer-run show captured the essence of the scene.',
      thumbnail: '/thumbnails/video-11-1151296070.jpg',
      display_order: 6
    },
    {
      vimeo_url: 'https://vimeo.com/1151296062',
      title: 'The Scene Documentary',
      artist: 'Documentary Team',
      description: 'Exploring the cultural impact of LA\'s independent coffee house movement.',
      thumbnail: '/thumbnails/video-12-1151296062.jpg',
      display_order: 7
    }
  ];

  const insertMany = db.transaction((videos) => {
    for (const video of videos) {
      insert.run(
        video.vimeo_url,
        video.title,
        video.artist,
        video.description,
        video.thumbnail,
        video.display_order
      );
    }
  });

  insertMany(videos);
  console.log(`✓ Inserted ${videos.length} default videos`);
} else {
  console.log('');
  console.log(`✓ Database already contains ${count.count} video(s)`);
  console.log('  Skipping default data insertion');
}

db.close();

console.log('');
console.log('================================================');
console.log('✓ Database setup complete!');
console.log('================================================');
console.log('');
console.log('Database location: server/data/videos.db');
console.log('');
console.log('To view data:');
console.log('  sqlite3 server/data/videos.db "SELECT * FROM videos;"');
console.log('');
console.log('To reset database:');
console.log('  rm server/data/videos.db && npm run setup-db');
console.log('================================================');
