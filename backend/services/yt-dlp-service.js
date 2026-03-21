const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

const ytDlpService = {
    /**
     * Get video metadata using yt-dlp
     * @param {string} url 
     * @returns {Promise<Object>}
     */
    getMetadata: (url) => {
        return new Promise((resolve, reject) => {
            const args = [
                '--dump-json',
                '--no-playlist', // Disable playlist expansion entirely
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

            args.push(url);
            
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

        return metadata.formats.map(f => ({
            format_id: f.format_id,
            extension: f.ext,
            resolution: f.resolution,
            filesize: f.filesize || f.filesize_approx,
            quality: f.format_note,
            vcodec: f.vcodec,
            acodec: f.acodec,
            url: f.url,
            is_video: f.vcodec !== 'none',
            is_audio: f.acodec !== 'none' && f.vcodec === 'none'
        })).filter(f => f.extension === 'mp4' || f.is_audio);
    }
};

module.exports = ytDlpService;
