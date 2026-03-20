# Use Node.js base image
FROM node:20-slim

# Install system dependencies
# Use root for installation
USER root
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Use the existing 'node' user (UID 1000) instead of creating one
# This avoids the UID collision error
USER node
ENV PATH="/home/node/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
# Chown to 'node' user
COPY --chown=node package*.json ./
RUN npm install --production

# Copy backend source code
COPY --chown=node . .

# Expose port (Hugging Face Spaces default)
EXPOSE 7860

# Set environment variable for port and binary paths
ENV PORT=7860
ENV YT_DLP_PATH=/usr/local/bin/yt-dlp
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# Start the application
CMD ["npm", "start"]
