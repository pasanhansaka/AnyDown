# AnyDown — Universal Social Media Downloader 🚀

> Download videos and audio from YouTube, Facebook, Instagram, and TikTok with a single click.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)
![Engine](https://img.shields.io/badge/Engine-yt--dlp%20%2B%20FFmpeg-FF0000?style=flat-square)
![License](https://img.shields.io/badge/License-Personal%20Use-blue?style=flat-square)

---

## ✨ Features

- **Multi-Platform Support** — Download from YouTube, Facebook, Instagram, and TikTok
- **Smart Platform Detection** — Automatically detects the platform and adapts the UI theme
- **Video & Audio Downloads** — Supports both full video and MP3 audio extraction
- **Aspect Ratio Conversion** — Convert to Horizontal, Vertical, or Square during download (powered by FFmpeg)
- **Download History** — Tracks recent downloads locally in the browser
- **Premium UI** — Glassmorphism design, dark mode, and smooth animations (Framer Motion)
- **PWA Ready** — Installable as a Progressive Web App on desktop and mobile
- **High Performance** — Fast processing via `yt-dlp` under the hood

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js |
| Engine | `yt-dlp`, `ffmpeg` |
| Deployment | GitHub Pages (Frontend) + Hugging Face Spaces / Render (Backend) |

---

## 🚀 Deployment

This project is designed to be deployed in two parts:

### Frontend - GitHub Pages
The frontend is deployed to GitHub Pages using the built-in deployment script:
1. Update `frontend/.env` to point `VITE_API_BASE_URL` to your Vercel backend deployment URL.
2. Run `npm run deploy` to build and publish the frontend.

### Backend - Vercel
The backend is configured to be deployed on Vercel:
1. Create a new project on Vercel and import your repository.
2. Set the **Root Directory** to `backend` in the project settings.
3. Deploy! Vercel will automatically compile the Express serverless functions using `backend/vercel.json`.
4. Once deployed, copy your backend Vercel URL and update `VITE_API_BASE_URL` in the frontend config to `https://your-vercel-backend.vercel.app/api`.


---

## 📁 Project Structure

```
AnyDown/
├── frontend/          # React + Vite frontend
├── backend/           # Express.js API server
├── dist/              # Production build output (for GitHub Pages)
├── package.json       # Root scripts (install:all, deploy, dev)
└── .gitignore
```

## 📄 License

This project is for personal use. Please review the applicable platform terms of service before use.

---

## ⚖️ License

Private. Copyright © 2026 **Thorn Solution**. All Rights Reserved.
