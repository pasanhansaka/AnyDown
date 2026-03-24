const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
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

        const ytDlpService = require('../services/yt-dlp-service');
        const isAudioOnly = format_id && 
            (format_id.includes('audio') || ['140', '251'].includes(format_id)) && 
            !format_id.includes('video');
             
        const extension = isAudioOnly ? 'mp3' : 'mp4';
        const safeTitle = (title || 'video').replace(/[/\\?%*:|"<>]/g, '-');
        const fileName = `${safeTitle}.${extension}`;
        
        // Temporary file paths
        const tempId = Math.random().toString(36).substring(7);
        const tempDir = os.tmpdir();
        const downloadTemplate = path.join(tempDir, `anydown_${tempId}.%(ext)s`);
        const outputPath = path.join(tempDir, `anydown_final_${tempId}.${extension}`);

        console.log(`Starting download for: ${url} with format: ${format_id}`);

        // Arguments for yt-dlp
        const args = [
            '-f', format_id || 'bestvideo+bestaudio/best',
            '-o', downloadTemplate,
            '--no-part', // Avoid .part files for simpler handling
            ...ytDlpService.getCommonArgs(),
            url
        ];

        // Specific handling for quality/merging
        if (!isAudioOnly) {
            args.push('--merge-output-format', 'mp4');
        } else {
            args.push('--extract-audio', '--audio-format', 'mp3');
        }

        const ytDlpProcess = spawn(YT_DLP_PATH, args);

        let stderr = '';
        ytDlpProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        ytDlpProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp failed with code ${code}: ${stderr}`);
                if (!res.headersSent) {
                    res.status(500).send(`Download failed: ${stderr.split('\n')[0]}`);
                }
                return;
            }

            // Find the actual downloaded file
            const files = fs.readdirSync(tempDir);
            const downloadedFile = files.find(f => f.startsWith(`anydown_${tempId}`));
            
            if (!downloadedFile) {
                console.error('Downloaded file not found in temp directory');
                if (!res.headersSent) {
                    res.status(500).send('Internal server error: downloaded file lost');
                }
                return;
            }

            const downloadPath = path.join(tempDir, downloadedFile);

            try {
                if (aspect_ratio && aspect_ratio !== 'original' && !isAudioOnly) {
                    console.log(`Applying aspect ratio: ${aspect_ratio}`);
                    
                    let arValue = 16/9;
                    switch (aspect_ratio) {
                        case '9:16': arValue = 9/16; break;
                        case '1:1': arValue = 1/1; break;
                        case '4:3': arValue = 4/3; break;
                        case '21:9': arValue = 21/9; break;
                        default: arValue = 16/9;
                    }

                    // Robust crop filter: crop='min(iw, ih*AR)':'min(ih, iw/AR)'
                    const vf = `crop='min(iw, ih*${arValue})':'min(ih, iw/${arValue})'`;

                    ffmpeg(downloadPath)
                        .videoFilters(vf)
                        .output(outputPath)
                        .on('end', () => {
                            res.download(outputPath, fileName, (err) => {
                                // Cleanup
                                [downloadPath, outputPath].forEach(p => {
                                    if (fs.existsSync(p)) fs.unlinkSync(p);
                                });
                            });
                        })
                        .on('error', (err) => {
                            console.error('FFmpeg error:', err.message);
                            if (!res.headersSent) {
                                res.status(500).send('Error processing video aspect ratio');
                            }
                            if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
                        })
                        .run();
                } else {
                    // Send the file directly
                    console.log(`Sending file: ${downloadPath}`);
                    res.download(downloadPath, fileName, (err) => {
                        // Cleanup
                        if (fs.existsSync(downloadPath)) {
                            // Only unlink if it's the temp file, not the original (though they are all temp here)
                            fs.unlinkSync(downloadPath);
                        }
                    });
                }
            } catch (error) {
                console.error('Final processing error:', error);
                if (!res.headersSent) {
                    res.status(500).send('Final processing failed');
                }
                if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
            }
        });

        // Cleanup on client close
        req.on('close', () => {
            if (ytDlpProcess.exitCode === null) {
                ytDlpProcess.kill();
            }
        });
    }
};

module.exports = downloadController;
