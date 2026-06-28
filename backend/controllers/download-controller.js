const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

// Set the ffmpeg path using @ffmpeg-installer/ffmpeg if available, otherwise fallback to system ffmpeg
let ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
try {
    const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
    if (ffmpegInstaller.path) {
        ffmpegPath = ffmpegInstaller.path;
        console.log(`Using @ffmpeg-installer/ffmpeg binary at: ${ffmpegPath}`);
    }
} catch (err) {
    console.log('Using system ffmpeg (failed to load @ffmpeg-installer/ffmpeg)');
}
ffmpeg.setFfmpegPath(ffmpegPath);

const downloadController = {
    download: async (req, res) => {
        const { url, format_id, aspect_ratio, title } = req.query;

        if (!url) {
            return res.status(400).send('URL is required');
        }

        const ytDlpService = require('../services/yt-dlp-service');
        const ytDlpPath = await ytDlpService.getYtDlpPath();
        const isAudioOnly = format_id && 
            (format_id.includes('audio') || ['140', '251', 'bestaudio'].some(v => format_id.includes(v))) && 
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

        // Intelligent format selection: If it's a specific video format, safely attempt to merge audio.
        let finalFormatId = format_id || 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best';
        if (!isAudioOnly && format_id && format_id !== 'bestvideo+bestaudio/best' && !format_id.includes('+')) {
            // Prioritize merging with an explicitly mp4-compatible audio stream (m4a/aac) 
            // to avoid corrupted MP4 file metadata (which causes 0 duration or unplayable files).
            finalFormatId = `${format_id}+bestaudio[ext=m4a]/${format_id}+bestaudio/${format_id}`;
            console.log(`Adjusted format string to ensure audio: ${finalFormatId}`);
        }

        // Arguments for yt-dlp
        const args = [
            '-f', finalFormatId,
            '-o', downloadTemplate,
            '--no-part', // Avoid .part files for simpler handling
            ...ytDlpService.getCommonArgs(),
            url
        ];

        // Specific handling for quality/merging
        if (!isAudioOnly) {
            args.push('--merge-output-format', 'mp4');
            // Ensure the MOOV atom is placed at the front to fix zero-duration issues on certain players
            args.push('--postprocessor-args', 'ffmpeg:-movflags +faststart');
        } else {
            args.push('--extract-audio', '--audio-format', 'mp3');
        }

        const ytDlpProcess = spawn(ytDlpPath, args);

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

            // Find the actual downloaded file (extension might vary based on yt-dlp merge output)
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
            const actualExtension = downloadedFile.split('.').pop() || extension;
            const actualFileName = `${safeTitle}.${actualExtension}`;

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
                    
                    // Final output filename should be .mp4 since we are transcoding it
                    const transcodedFileName = `${safeTitle}.mp4`;

                    ffmpeg(downloadPath)
                        .videoFilters(vf)
                        .videoCodec('libx264')
                        .outputOptions([
                            '-preset fast',           // Faster processing speed to avoid timeouts
                            '-crf 23',                // Sensible default for quality vs size
                            '-c:a aac',               // Transcode audio to AAC to ensure compatibility
                            '-b:a 128k',              // Audio bitrate
                            '-movflags +faststart'    // Optimize for web playback
                        ])
                        .output(outputPath)
                        .on('end', () => {
                            res.download(outputPath, transcodedFileName, (err) => {
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
                    res.download(downloadPath, actualFileName, (err) => {
                        // Cleanup
                        if (fs.existsSync(downloadPath)) {
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
