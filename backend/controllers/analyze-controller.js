const ytDlpService = require('../services/yt-dlp-service');

const analyzeController = {
    analyze: async (req, res) => {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        const isYouTube = /youtube\.com|youtu\.be/.test(url);
        let oEmbedData = null;

        if (isYouTube) {
            console.log('Attempting oEmbed for YouTube metadata...');
            oEmbedData = await ytDlpService.getYouTubeOEmbed(url);
        }

        try {
            const metadata = await ytDlpService.getMetadata(url);
            
            // Handle collections (playlists/channels)
            if (metadata.is_collection) {
                const result = {
                    is_collection: true,
                    title: metadata.title || oEmbedData?.title || 'Collection',
                    thumbnail: metadata.thumbnail || oEmbedData?.thumbnail_url || (metadata.entries?.[0]?.thumbnail),
                    platform: metadata.extractor_key || metadata.platform || (isYouTube ? 'YouTube' : 'Unknown'),
                    entries: (metadata.entries || []).map(e => ({
                        id: e.id,
                        title: e.title,
                        url: e.url || `https://www.youtube.com/watch?v=${e.id}`, // Fallback for YT
                        thumbnail: e.thumbnail,
                        duration: e.duration,
                        uploader: e.uploader
                    })),
                    original_url: url
                };

                return res.status(200).json({
                    success: true,
                    data: result
                });
            }

            // Map common fields across platforms for single video
            const result = {
                title: metadata.title || oEmbedData?.title,
                thumbnail: metadata.thumbnail || oEmbedData?.thumbnail_url,
                duration: metadata.duration,
                platform: metadata.extractor_key || (isYouTube ? 'YouTube' : 'Unknown'),
                formats: ytDlpService.extractFormats(metadata),
                original_url: url
            };

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Analysis error:', error);
            
            // If yt-dlp failed but we have oEmbed data, return what we have (even without formats)
            // This allows the user to see the video details before trying a different approach
            if (oEmbedData) {
                return res.status(200).json({
                    success: true,
                    data: {
                        title: oEmbedData.title,
                        thumbnail: oEmbedData.thumbnail_url,
                        platform: 'YouTube (Restricted)',
                        formats: [],
                        original_url: url,
                        restricted: true,
                        message: 'Video metadata found, but download formats are currently restricted. Try adding cookies or using a different browser.'
                    }
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Failed to analyze video. YouTube might be blocking the request. Try adding cookies.'
            });
        }
    }
};

module.exports = analyzeController;
