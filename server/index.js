import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllVideos, updateVideo } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/thumbnails', express.static(path.join(__dirname, '..', 'public', 'thumbnails')));

app.get('/api/videos', (req, res) => {
  try {
    const videos = getAllVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/videos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, description } = req.body;
    
    updateVideo(id, title, artist, description);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
