# VibePlay - AI-Powered Music Experience

## Overview
VibePlay is a music player application with AI-powered vibe detection features. Users can upload songs, play them, and get AI analysis of their listening mood.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack React Query
- **Backend**: Supabase (Auth, Database, Storage)
- **Animation**: Framer Motion
- **Mobile**: Capacitor 6 (Android)

## Project Structure
```
src/
├── components/          # UI components
│   ├── ui/             # shadcn/ui base components
│   ├── AlbumArt.tsx    # Album artwork display
│   ├── FileUpload.tsx  # Music file upload
│   ├── Header.tsx      # App header
│   ├── PlayerControls.tsx  # Music player controls
│   ├── SongList.tsx    # Song library list
│   ├── VibeDetector.tsx    # AI vibe analysis
│   └── WaveformVisualizer.tsx  # Audio visualization
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Supabase authentication
│   ├── useAudioPlayer.ts  # Audio playback logic
│   ├── useSongLibrary.ts  # Local song management
│   └── useSongStorage.ts  # Supabase storage integration
├── integrations/
│   └── supabase/       # Supabase client configuration
├── pages/
│   ├── Auth.tsx        # Login/signup page
│   ├── Index.tsx       # Main player page
│   └── NotFound.tsx    # 404 page
└── types/
    └── music.ts        # TypeScript types

android/                 # Capacitor Android project
codemagic.yaml          # CodeMagic CI/CD configuration
capacitor.config.ts     # Capacitor configuration
```

## Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon key
- `VITE_SUPABASE_PROJECT_ID`: Supabase project ID

## Running the Application
The app runs on port 5000 using `npm run dev`.

## Android Build (CodeMagic)
1. Push this repository to GitHub/GitLab/Bitbucket
2. Connect to CodeMagic.io
3. CodeMagic will use `codemagic.yaml` to build the APK
4. The APK will be available in the artifacts after build

### Local Android Scripts
- `npm run cap:build` - Build web app and sync to Android
- `npm run cap:sync` - Sync web assets to Android
- `npm run android:open` - Open Android project in Android Studio

## Deployment
Configured for static deployment with `npm run build` outputting to the `dist/` directory.

## Features
- User authentication (sign up/sign in)
- Music file upload and storage
- Audio playback with controls
- Song library management
- AI-powered vibe/mood detection
- Waveform visualization
- Responsive mobile-first design
- Android APK builds via CodeMagic
