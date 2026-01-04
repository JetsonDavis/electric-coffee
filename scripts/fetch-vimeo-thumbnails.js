#!/usr/bin/env node

/**
 * Vimeo Thumbnail Fetcher
 * Fetches thumbnail URLs from Vimeo videos using the oEmbed API
 */

import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Video URLs to process
const videos = [
  { id: 1, url: 'https://vimeo.com/1151296094' },
  { id: 2, url: 'https://vimeo.com/1151296083' },
  { id: 3, url: 'https://vimeo.com/1151301093' },
  { id: 4, url: 'https://vimeo.com/1151301070' },
  { id: 7, url: 'https://vimeo.com/1151305470' },
  { id: 8, url: 'https://vimeo.com/1151305523' },
  { id: 11, url: 'https://vimeo.com/1151296070' },
  { id: 12, url: 'https://vimeo.com/1151296062' }
];

/**
 * Fetch data from URL using https
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Download image from URL to file
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    import('fs').then(fsModule => {
      const file = fsModule.createWriteStream(filepath);

      https.get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      }).on('error', (err) => {
        fsModule.unlink(filepath, () => {});
        reject(err);
      });
    });
  });
}

/**
 * Get thumbnail URL from Vimeo oEmbed API
 */
async function getVimeoThumbnail(videoUrl) {
  const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;

  try {
    const response = await fetchUrl(oembedUrl);
    const data = JSON.parse(response);

    return {
      thumbnail_url: data.thumbnail_url,
      thumbnail_url_with_play_button: data.thumbnail_url_with_play_button,
      title: data.title,
      width: data.thumbnail_width,
      height: data.thumbnail_height
    };
  } catch (error) {
    throw new Error(`Failed to fetch thumbnail for ${videoUrl}: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎬 Fetching Vimeo thumbnails...\n');

  const results = [];
  const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');

  // Ensure thumbnails directory exists
  try {
    await fs.mkdir(thumbnailsDir, { recursive: true });
  } catch (error) {
    console.error('❌ Failed to create thumbnails directory:', error.message);
    process.exit(1);
  }

  // Process each video
  for (const video of videos) {
    try {
      console.log(`📹 Processing video ${video.id}...`);
      const thumbnailData = await getVimeoThumbnail(video.url);

      console.log(`  ✓ Title: ${thumbnailData.title}`);
      console.log(`  ✓ Thumbnail URL: ${thumbnailData.thumbnail_url}`);
      console.log(`  ✓ Size: ${thumbnailData.width}x${thumbnailData.height}`);

      // Download thumbnail
      const videoId = video.url.split('/').pop().split('?')[0];
      const filename = `video-${video.id}-${videoId}.jpg`;
      const filepath = path.join(thumbnailsDir, filename);

      console.log(`  ⬇️  Downloading to: ${filename}`);
      await downloadImage(thumbnailData.thumbnail_url, filepath);
      console.log(`  ✅ Downloaded successfully!\n`);

      results.push({
        video_id: video.id,
        vimeo_id: videoId,
        url: video.url,
        thumbnail_url: thumbnailData.thumbnail_url,
        thumbnail_file: filename,
        title: thumbnailData.title,
        dimensions: `${thumbnailData.width}x${thumbnailData.height}`
      });
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
      results.push({
        video_id: video.id,
        url: video.url,
        error: error.message
      });
    }
  }

  // Save results to JSON
  const resultsFile = path.join(thumbnailsDir, 'thumbnail-results.json');
  await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: ${resultsFile}`);

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`  Total videos: ${videos.length}`);
  console.log(`  Successful: ${results.filter(r => !r.error).length}`);
  console.log(`  Failed: ${results.filter(r => r.error).length}`);
}

// Run the script
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
