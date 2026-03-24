# Use Node.js base image
FROM node:20-slim

# Install system dependencies
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY --chown=node:node package*.json ./
RUN npm install --production

# Copy backend source code
COPY --chown=node:node . .

# Use the existing 'node' user for running the application
USER node
ENV PATH="/home/node/.local/bin:$PATH"

# Expose port (Hugging Face Spaces default)
EXPOSE 7860

# Set environment variables
ENV PORT=7860
ENV YT_DLP_PATH=/usr/local/bin/yt-dlp
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# Start the application
CMD ["npm", "start"]