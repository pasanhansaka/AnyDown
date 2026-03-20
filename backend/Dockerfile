# Use Node.js base image
FROM node:20-slim

# Install system dependencies
# Use root for installation
USER root
# Install yt-dlp and other tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pip for better compatibility
RUN pip3 install --no-cache-dir yt-dlp --break-system-packages


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

# Ensure yt-dlp is in a standard location if pip installed it elsewhere
RUN ln -sf $(which yt-dlp) /usr/local/bin/yt-dlp

# Start the application
CMD ["npm", "start"]
