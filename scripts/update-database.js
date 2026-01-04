#!/usr/bin/env node

/**
 * Database Update Script
 * Updates video URLs and thumbnail paths in the database
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'server', 'videos.db'));

// Video data mapping
const videoUpdates = [
  { id: 1, vimeoUrl: 'https://vimeo.com/1151296094', thumbnail: '/thumbnails/video-1-1151296094.jpg' },
  { id: 2, vimeoUrl: 'https://vimeo.com/1151296083', thumbnail: '/thumbnails/video-2-1151296083.jpg' },
  { id: 3, vimeoUrl: 'https://vimeo.com/1151301093', thumbnail: '/thumbnails/video-3-1151301093.jpg' },
  { id: 4, vimeoUrl: 'https://vimeo.com/1151301070', thumbnail: '/thumbnails/video-4-1151301070.jpg' },
  { id: 7, vimeoUrl: 'https://vimeo.com/1151305470', thumbnail: '/thumbnails/video-7-1151305470.jpg' },
  { id: 8, vimeoUrl: 'https://vimeo.com/1151305523', thumbnail: null }, // Video still processing
  { id: 11, vimeoUrl: 'https://vimeo.com/1151296070', thumbnail: '/thumbnails/video-11-1151296070.jpg' },
  { id: 12, vimeoUrl: 'https://vimeo.com/1151296062', thumbnail: '/thumbnails/video-12-1151296062.jpg' }
];

console.log('🔄 Updating database with video URLs and thumbnails...\n');

const updateStmt = db.prepare('UPDATE videos SET vimeo_url = ?, thumbnail = ? WHERE id = ?');

for (const video of videoUpdates) {
  try {
    // Use placeholder if thumbnail is null
    const thumbnailPath = video.thumbnail || 'https://via.placeholder.com/300x225';
    const result = updateStmt.run(video.vimeoUrl, thumbnailPath, video.id);
    if (result.changes > 0) {
      console.log(`✅ Updated video ${video.id}:`);
      console.log(`   URL: ${video.vimeoUrl}`);
      console.log(`   Thumbnail: ${thumbnailPath}`);
      if (!video.thumbnail) {
        console.log(`   ⚠️  Note: Video not found on Vimeo, using placeholder`);
      }
      console.log('');
    } else {
      console.log(`⚠️  Video ${video.id} not found in database\n`);
    }
  } catch (error) {
    console.error(`❌ Error updating video ${video.id}: ${error.message}\n`);
  }
}

// Display all videos
console.log('📊 Current database contents:');
console.log('═'.repeat(80));

const allVideos = db.prepare('SELECT * FROM videos ORDER BY display_order').all();

allVideos.forEach(video => {
  console.log(`Video ${video.id}: ${video.title}`);
  console.log(`  URL: ${video.vimeo_url}`);
  console.log(`  Thumbnail: ${video.thumbnail}`);
  console.log('─'.repeat(80));
});

console.log(`\n✨ Database update complete! Total videos: ${allVideos.length}`);

db.close();
