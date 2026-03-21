const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

const ytDlpService = {
    /**
     * Get common yt-dlp arguments
     * @returns {Array}
     */
    getCommonArgs: () => {
        const args = [
            '--no-playlist',
            '--no-warnings',
            '--force-ipv4',
            '--no-check-certificate',
            '--geo-bypass',
            '--referer', 'https://www.youtube.com/',
            '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            '--add-header', 'Accept-Language: en-US,en;q=0.9',
            '--add-header', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            '--extractor-args', 'youtube:player_client=web,default;youtube:player_skip=webpage,configs',
        ];

        // Add cookies if available
        if (process.env.YT_DLP_COOKIES_PATH) {
            const cookiesPath = path.isAbsolute(process.env.YT_DLP_COOKIES_PATH) 
                ? process.env.YT_DLP_COOKIES_PATH 
                : path.join(__dirname, '..', process.env.YT_DLP_COOKIES_PATH);
            args.push('--cookies', cookiesPath);
        } else if (process.env.YT_DLP_USE_BROWSER_COOKIES) {
            args.push('--cookies-from-browser', process.env.YT_DLP_USE_BROWSER_COOKIES);
        }

        return args;
    },

    /**
     * Get video metadata using yt-dlp
     * @param {string} url 
     * @returns {Promise<Object>}
     */
    getMetadata: (url) => {
        return new Promise((resolve, reject) => {
            const args = [
                '--dump-json',
                ...ytDlpService.getCommonArgs(),
                url
            ];
            
            console.log(`Executing yt-dlp with args: ${args.join(' ')}`);
            const child = spawn(YT_DLP_PATH, args);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (err) => {
                console.error('Failed to start yt-dlp:', err);
                reject(new Error(`Failed to start yt-dlp: ${err.message}`));
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    console.error(`yt-dlp process exited with code ${code}`);
                    console.error(`stderr: ${stderr}`);
                    return reject(new Error(`Failed to extract video metadata: ${stderr || 'Check the URL.'}`));
                }

                try {
                    const json = JSON.parse(stdout);
                    resolve(json);
                } catch (e) {
                    reject(new Error('Failed to parse video metadata.'));
                }
            });
        });
    },

    /**
     * Get available formats for a video
     * @param {Object} metadata 
     * @returns {Array}
     */
    extractFormats: (metadata) => {
        if (!metadata.formats) return [];

        const formats = metadata.formats.map(f => {
            // Determine resolution string
            let resolution = f.resolution;
            if (!resolution && f.width && f.height) {
                resolution = `${f.width}x${f.height}`;
            }

            return {
                format_id: f.format_id,
                extension: f.ext,
                resolution: resolution || f.format_note || 'Unknown',
                filesize: f.filesize || f.filesize_approx || 0,
                quality: f.format_note,
                vcodec: f.vcodec,
                acodec: f.acodec,
                url: f.url,
                is_video: f.vcodec !== 'none',
                is_audio: f.acodec !== 'none' && f.vcodec === 'none'
            };
        });

        // Add a "Best Quality" virtual format for video
        const bestVideo = {
            format_id: 'bestvideo+bestaudio/best',
            extension: 'mp4',
            resolution: 'Best Quality (1080p+)',
            filesize: 0, // Will be determined during download
            quality: 'Highest Available',
            is_video: true,
            is_audio: false,
            is_virtual: true
        };

        // Filter and sort
        const videoFormats = formats
            .filter(f => f.is_video && (f.extension === 'mp4' || f.extension === 'webm' || f.extension === 'm4a'))
            .sort((a, b) => (b.filesize || 0) - (a.filesize || 0));

        const audioFormats = formats
            .filter(f => f.is_audio)
            .sort((a, b) => (b.filesize || 0) - (a.filesize || 0));

        // Group by resolution to avoid duplicates and take the best extension
        const uniqueVideo = [];
        const seenRes = new Set();
        
        // Add virtual best first
        uniqueVideo.push(bestVideo);
        seenRes.add(bestVideo.resolution);

        for (const f of videoFormats) {
            if (!seenRes.has(f.resolution)) {
                uniqueVideo.push(f);
                seenRes.add(f.resolution);
            }
        }

        return [...uniqueVideo, ...audioFormats.slice(0, 5)]; // Limit audio to top 5
    }
};

module.exports = ytDlpService;
