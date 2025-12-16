const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.YOUTUBE_API_PORT || 3001;

app.use(cors());
app.use(express.json());

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

app.get('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    
    res.json({
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      lengthSeconds: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      videoId: videoId
    });
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    res.status(500).json({ error: 'Failed to fetch video info. The video may be unavailable or restricted.' });
  }
});

app.get('/api/youtube/audio', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').trim();
    
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const audioStream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-f', 'mp3',
      '-ab', '192k',
      '-vn',
      'pipe:1'
    ]);

    audioStream.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(res);

    ffmpeg.stderr.on('data', (data) => {
      // FFmpeg logs progress to stderr
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to convert audio' });
      }
    });

    audioStream.on('error', (error) => {
      console.error('Stream error:', error);
      ffmpeg.kill();
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download audio stream' });
      }
    });

    req.on('close', () => {
      audioStream.destroy();
      ffmpeg.kill();
    });

  } catch (error) {
    console.error('Error streaming audio:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to extract audio. The video may be unavailable or restricted.' });
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`YouTube API server running on port ${PORT}`);
});
