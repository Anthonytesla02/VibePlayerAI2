# VibePlay - AI-Powered Music Experience

## Overview
VibePlay is a music player application with AI-powered vibe detection features. Users can upload songs, play them, and get AI analysis of their listening mood.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack React Query + Custom hooks with localStorage
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
│   ├── MobileNav.tsx   # Bottom navigation (5 tabs)
│   ├── PlayerControls.tsx  # Music player controls
│   ├── PlaylistManager.tsx # Create/manage playlists
│   ├── SearchBar.tsx   # Song search component
│   ├── SongList.tsx    # Song library list with like/playlist options
│   ├── ThemeToggle.tsx # Light/dark mode toggle
│   ├── VibeDetector.tsx    # AI vibe analysis
│   └── WaveformVisualizer.tsx  # Audio visualization
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Supabase authentication
│   ├── useAudioPlayer.ts  # Audio playback + queue logic
│   ├── useFavorites.ts # Favorites management (localStorage)
│   ├── usePlaylists.ts # Playlist management (localStorage)
│   ├── useSongLibrary.ts  # Local song management
│   ├── useSongStorage.ts  # Supabase storage integration
│   └── useTheme.ts     # Light/dark theme switching
├── integrations/
│   └── supabase/       # Supabase client configuration
├── pages/
│   ├── Auth.tsx        # Login/signup page
│   ├── Index.tsx       # Main player page (5 tabs)
│   └── NotFound.tsx    # 404 page
└── types/
    └── music.ts        # TypeScript types (Song, Playlist, Vibe)

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
3. Set up environment variables in Codemagic (see CODEMAGIC_SETUP.md)
4. CodeMagic will use `codemagic.yaml` to build the APK
5. The APK will be available in the artifacts after build

### Codemagic Environment Variables Required
Create a group named `keystore_credentials` with:
- `CM_KEYSTORE_PASSWORD`: vibeplay123
- `CM_KEY_ALIAS`: vibeplay
- `CM_KEY_PASSWORD`: vibeplay123

### Local Android Scripts
- `npm run cap:build` - Build web app and sync to Android
- `npm run cap:sync` - Sync web assets to Android
- `npm run android:open` - Open Android project in Android Studio

## Deployment
Configured for static deployment with `npm run build` outputting to the `dist/` directory.

## Features
- User authentication (sign up/sign in)
- Music file upload and storage
- Audio playback with controls and queue support
- Song library management with search
- Like/favorite songs with dedicated Favorites tab
- Play All button for favorites
- Custom playlists/groups with unique theme colors
- Light/dark mode switching
- AI-powered vibe/mood detection
- Waveform visualization
- Settings page with library stats
- Responsive mobile-first design
- Custom app icon
- Android APK builds via CodeMagic

## Recent Changes (December 2024)
- Added custom app icon for Android
- Added search functionality to filter songs
- Implemented light/dark theme switching
- Added favorites system with heart icon and Play All
- Added playlist/groups feature with unique colors per playlist
- Updated audio player to support queue playback
- Added Settings tab with theme toggle and library stats
