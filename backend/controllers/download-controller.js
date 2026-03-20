const { spawn } = require('child_process');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

// Set the ffmpeg path from environment or default to system ffmpeg
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';
ffmpeg.setFfmpegPath(FFMPEG_PATH);

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

const downloadController = {
    download: (req, res) => {
        const { url, format_id, aspect_ratio, title } = req.query;

        if (!url) {
            return res.status(400).send('URL is required');
        }

        const fileName = `${title || 'video'}.mp4`;
        res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.header('Content-Type', 'video/mp4');

        // Arguments for yt-dlp
        const args = [
            '-f', format_id || 'bestvideo+bestaudio/best',
            '-o', '-', // Output to stdout
            '--no-playlist',
            '--no-warnings',
            '--force-ipv4',
            '--no-check-certificate',
            '--geo-bypass',
            '--referer', 'https://www.youtube.com/',
            '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            '--add-header', 'Accept-Language: en-US,en;q=0.9',
            url
        ];

        console.log(`Starting download for: ${url} with format: ${format_id}`);
        const ytDlpProcess = spawn(YT_DLP_PATH, args);

        ytDlpProcess.on('error', (err) => {
            console.error('Failed to start yt-dlp for download:', err);
            if (!res.headersSent) {
                res.status(500).send('Failed to start download process');
            }
        });

        if (aspect_ratio && aspect_ratio !== 'original') {
            console.log(`Applying aspect ratio: ${aspect_ratio}`);
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
                default:
                    vf = '';
            }

            const ffmpegCommand = ffmpeg(ytDlpProcess.stdout);
            
            if (vf) {
                ffmpegCommand.videoFilters(vf);
            }

            ffmpegCommand
                .format('mp4')
                .on('error', (err) => {
                    console.error('FFmpeg error:', err.message);
                    if (!res.headersSent) {
                        res.status(500).send('Error processing video');
                    }
                })
                .pipe(res, { end: true });

            ytDlpProcess.stderr.on('data', (data) => {
                console.error(`yt-dlp stderr: ${data}`);
            });
        } else {
            // Just pipe directly
            ytDlpProcess.stdout.pipe(res);
            
            ytDlpProcess.stderr.on('data', (data) => {
                // Not necessarily an error, but log it
                // console.log(`yt-dlp progress/info: ${data}`);
            });

            ytDlpProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`yt-dlp download process exited with code ${code}`);
                }
            });
        }

        // Cleanup on client close
        req.on('close', () => {
            ytDlpProcess.kill();
        });
    }
};

module.exports = downloadController;
