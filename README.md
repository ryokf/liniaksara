# LiniAksara

LiniAksara is a modern creative platform designed to host, share, and discover various types of creative content including comics, novels, videos, and community activities. Built with Next.js 14 (App Router) and integrated with Supabase for authentication and data management.

## Project Overview

LiniAksara serves as a bridge between creators and consumers of digital content, focusing on:

- **Content Creation & Distribution**: Supporting various content types from comics to videos
- **Creator Community**: Building meaningful connections between creators and their audience
- **Content Monetization**: Enabling creators to monetize their work through premium content
- **User Experience**: Delivering a personalized and engaging content discovery experience

## Key Features

### Social Features

- **Follow System**
  - Follow/Unfollow creators
  - Personalized feed based on followed creators
  - Real-time follow status updates
  - Optimistic UI updates for better UX

- **Profile Management**
  - Customizable user profiles
  - Works showcase
  - Follower/Following statistics
  - Activity feed

### Content Features

- **Multi-format Support**
  - Comics and Light Novels
  - Videos (Anime & Drama)
  - One-page Artworks & Fanart
  - Community Content

- **Reading & Viewing**
  - Built-in Comic Reader
  - PDF Reader for Novels
  - Video Player Integration
  - Free/Premium Content Management

### Creator Tools

- **Content Management**
  - Work Upload System
  - Chapter/Episode Management
  - Draft & Publish System
  - Cover Image Management

## Core Features

### Content Management
- **Multi-format Content Support**
  - Comics and Light Novels
  - Videos (Anime & Drama)
  - One-page Artworks & Fanart
  - Community Content

### User Experience
- **Personalized Feed**
  - Follow System for Creators
  - Personalized Content Feed
  - Popular Works Carousel
  - Top Creators Showcase

### Creator Tools
- **Content Publishing**
  - Work Upload System
  - Chapter/Episode Management
  - Draft & Publish System
  - Cover Image Management

### Community Features
- **Social Interaction**
  - Follow System
  - Like & Comment
  - Share Functionality
  - Creator Profiles

### Content Access
- **Reading & Viewing**
  - Built-in Comic Reader
  - PDF Reader for Novels
  - Video Player Integration
  - Free/Premium Content Management

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom Component System
  - Atoms
  - Molecules
  - Organisms
  - Templates
- **State Management**: React Context
- **Animation**: Framer Motion

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: REST API with Supabase Client

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Storage**: Supabase Storage

## Konsep Produk

- Multi-konten: menyajikan berbagai jenis karya (novel/komik, film/video).
- Pengalaman personal:
  - Halaman beranda berisi carousel karya populer, rekomendasi, daftar lanjutkan menonton/membaca, dan kreator teratas.
  - Perpustakaan pribadi (library) berdasarkan transaksi/aktivitas pengguna.
- Komunitas kreator: menampilkan kreator populer dan karya mereka.
- Detail konten kaya: halaman detail (contoh komik) menyajikan informasi, episode/season, dan aksi cepat (baca sekarang, simpan ke daftar).

Struktur folder utama:
- App Router di `src/app` untuk routing (beranda/home, comic, novel, movie, search, read, watch, dashboard/profile).
- Komponen terstruktur (atoms, molecules, organisms, templates) di `src/components` untuk UI yang modular.
- Layanan data di `src/services` untuk pemanggilan Supabase dan logika bisnis.
- Konteks autentikasi di `src/contexts` untuk mengelola state user sisi client.

## Technical Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI/UX**:
  - Tailwind CSS for styling
  - Component-based architecture (Atomic Design)
  - Framer Motion for animations
  - Dark mode support

- **State Management**:
  - React Context for global state
  - Optimistic updates
  - Real-time data synchronization

### Backend (Supabase)

- **Database**:
  - PostgreSQL with RLS policies
  - Structured content management
  - Social features schema
  - Transaction tracking

- **Authentication**:
  - Supabase Auth
  - Protected routes
  - Role-based access

- **Storage**:
  - Media file management
  - Content delivery
  - Asset optimization

### Key Technologies

- TypeScript for type safety
- Next.js Image optimization
- Supabase Auth Helpers
- Lucide React & FontAwesome icons

## Fitur Utama

- Beranda:
  - Hero carousel karya populer.
  - Carousel kategori (Novel/Komik dan Movie/Show).
  - Kreator teratas.
  - Library pengguna bila tersedia.
- Detail karya:
  - Halaman detail komik dengan cover, rating, genre, info kreator/publisher, dan daftar episode per season.
- Dashboard Profil:
  - Form editing profil (UI/UX, belum terhubung ke penyimpanan profil penuh).
- Proteksi route:
  - Public routes: `/`, `/login`, `/register`.
  - Pengguna tanpa sesi akan di-redirect ke `/` saat mengakses route terproteksi.
  - Pengguna yang sudah login diarahkan ke `/home` jika mengunjungi `/login` atau `/register`.

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── (auth)/        # Authentication routes
│   ├── dashboard/     # User dashboard
│   ├── home/         # Main feed
│   ├── profile/      # User profiles
│   ├── read/        # Content viewing
│   └── watch/       # Video content
├── components/       # UI Components
│   ├── atoms/       # Basic components
│   ├── molecules/   # Composite components
│   ├── organisms/   # Complex components
│   └── templates/   # Page layouts
├── services/        # API services
├── contexts/        # React contexts
├── types/          # TypeScript types
└── config/         # Configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ryokf/liniaksara.git
cd liniaksara
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Development

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Current Status

✅ Completed:
- Core authentication system
- Follow system implementation
- Basic content management
- Profile system
- Feed personalization

🚧 In Progress:
- Enhanced social features
- Content recommendation system
- Advanced creator tools

📅 Planned:
- Analytics dashboard
- Monetization features
- Advanced search capabilities

## License

This project is proprietary and all rights are reserved.
