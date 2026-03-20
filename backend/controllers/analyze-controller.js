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

        try {
            const metadata = await ytDlpService.getMetadata(url);
            
            // Map common fields across platforms
            const result = {
                title: metadata.title,
                thumbnail: metadata.thumbnail,
                duration: metadata.duration,
                platform: metadata.extractor_key,
                formats: ytDlpService.extractFormats(metadata),
                original_url: url
            };

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Analysis error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to analyze video'
            });
        }
    }
};

module.exports = analyzeController;
