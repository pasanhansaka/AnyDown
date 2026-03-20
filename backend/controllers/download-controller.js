const { spawn } = require('child_process');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

// Set the ffmpeg path for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

const downloadController = {
    download: (req, res) => {
        const { url, format_id, aspect_ratio, title } = req.query;

        if (!url) {
            return res.status(400).send('URL is required');
        }

        const fileName = `${title || 'video'}.mp4`;
        res.header('Content-Disposition', `attachment; filename="${fileName}"`);

        // Arguments for yt-dlp
        const args = [
            '-f', format_id || 'bestvideo+bestaudio/best',
            '-o', '-', // Output to stdout
            '--no-playlist',
            '--no-warnings',
            url
        ];

        const ytDlpProcess = spawn(YT_DLP_PATH, args);

        if (aspect_ratio && aspect_ratio !== 'original') {
            // Use ffmpeg to change aspect ratio
            let vf = '';
            switch (aspect_ratio) {
                case '16:9':
                    vf = 'crop=ih*16/9:ih';
                    break;
                case '9:16':
                    vf = 'crop=ih*9/16:ih';
                    break;
                case '1:1':
                    vf = 'crop=ih:ih';
                    break;
                case '4:3':
                    vf = 'crop=ih*4/3:ih';
                    break;
            }

            const ffmpegProcess = ffmpeg(ytDlpProcess.stdout)
                .videoFilters(vf)
                .format('mp4')
                .on('error', (err) => {
                    console.error('FFmpeg error:', err.message);
                })
                .pipe(res, { end: true });

            ytDlpProcess.stderr.on('data', (data) => {
                console.error(`yt-dlp stderr: ${data}`);
            });
        } else {
            // Just pipe directly
            ytDlpProcess.stdout.pipe(res);
            
            ytDlpProcess.stderr.on('data', (data) => {
                console.error(`yt-dlp stderr: ${data}`);
            });

            ytDlpProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`yt-dlp process exited with code ${code}`);
                }
            });
        }
    }
};

module.exports = downloadController;
