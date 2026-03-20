const express = require('express');
const dns = require('dns');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
    frameguard: false, // Allow embedding in Hugging Face iframes
    contentSecurityPolicy: false, // Disable CSP for easier integration in Spaces
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AnyDown API is running',
        version: '1.0.0',
        endpoints: {
            analyze: '/api/analyze',
            download: '/api/download'
        }
    });
});

app.get('/debug-dns', (req, res) => {
    const hosts = ['google.com', 'youtube.com', 'music.youtube.com', 'github.com'];
    const results = {};
    
    let completed = 0;
    hosts.forEach(host => {
        dns.lookup(host, (err, address, family) => {
            results[host] = err ? { error: err.message, code: err.code } : { address, family };
            completed++;
            if (completed === hosts.length) {
                res.json({ 
                    results, 
                    timestamp: new Date().toISOString(),
                    node_version: process.version,
                    platform: process.platform
                });
            }
        });
    });
});

app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Listening on 0.0.0.0:${PORT}`);
});
