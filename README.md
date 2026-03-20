# AnyDown Downloader 🚀

A modern, production-grade web application to download videos and audio (MP3) from popular social media platforms.

## 🌟 Features

- **Multi-Platform Support**: YouTube, Facebook, Instagram, TikTok.
- **Smart Detection**: Automatically detects the platform and adjusts the UI theme.
- **Premium UI**: Modern SaaS-level design with Glassmorphism, dark mode, and smooth animations.
- **High Performance**: Lightning-fast processing using `yt-dlp`.
- **Advanced Options**: Change video aspect ratio during download (Horizontal, Vertical, Square).
- **History Tracking**: Keep track of your recent downloads locally.
- **PWA Support**: Installable as a progressive web app.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Engine**: `yt-dlp`, `ffmpeg`.

## 📦 Prerequisites

Ensure you have the following installed:

1. [Node.js](https://nodejs.org/) (v18+)
2. [Python](https://www.python.org/) (Required for `yt-dlp`)
3. [FFmpeg](https://ffmpeg.org/) (Required for aspect ratio conversion)
4. `yt-dlp`:
   ```bash
   pip install yt-dlp
   ```

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
YT_DLP_PATH=yt-dlp # Or full path to your yt-dlp.exe
FFMPEG_PATH=ffmpeg
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

## 🚀 Deployment Guide

### 1. Frontend (GitHub Pages)
This project uses the `gh-pages` package to deploy the frontend to a dedicated branch.

1. **Build and Deploy**:
   Run the following command from the root directory:
   ```bash
   npm run deploy
   ```
   This will build the frontend and push the `dist` folder to the `gh-pages` branch.

2. **GitHub Settings**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, ensure **Deploy from a branch** is selected.
   - Under **Branch**, select `gh-pages` and `/ (root)`.
   - Click **Save**.

3. **Verify**:
   The site should be live at `https://<your-username>.github.io/AnyDown/`.

### 2. Backend (Hosting - Card-Free)
To deploy the backend on Render for free **without a credit card**, follow these steps:

1. Create a **New Web Service** on Render.
2. Select your repository.
3. **Language**: Select `Node` (NOT Docker).
4. **Root Directory**: `backend`
5. **Build Command**: `npm install && pip install yt-dlp`
6. **Start Command**: `npm start`
7. **Instance Type**: Select **Free**.
8. **Environment Variables**: Add these in the "Environment" tab:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `YT_DLP_PATH`: `yt-dlp` (This will work after the `pip install` in Step 5).

### 3. Backend (Alternative - Hugging Face Spaces - Truly Card-Free)
Hugging Face Spaces is the best card-free way to host a Dockerized backend.

1.  Create a **New Space** on [Hugging Face](https://huggingface.co/new-space).
2.  **Name**: `anydown-api`
3.  **SDK**: Select **Docker** (NOT Streamlit or Gradio).
4.  **Template**: Choose **Blank**.
5.  **Visibility**: Public.
6.  **Upload Files**: Upload all files from your `backend/` folder directly to the Space's repository.
7.  Hugging Face will automatically build your Docker image and start the server on port `7860`.
8.  Your API URL will be: `https://<your-username>-<space-name>.hf.space/api` (e.g., `https://pasan-anydown-api.hf.space/api`).

## ⚖️ Legal Disclaimer

This tool is intended for personal use and for downloading content that you own or have explicit permission to download. The developers are not responsible for any misuse of this application.

