# LiniAksara

LiniAksara adalah platform kreatif untuk menikmati dan mengelola konten lintas media: novel/komik, film/video, serta aktivitas komunitas kreator. Proyek ini dibangun dengan Next.js (App Router) dan terintegrasi dengan Supabase untuk autentikasi serta data.

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

## Teknologi Utama

- Next.js 15 (App Router) dengan React 19 dan dev server Turbopack.
- Supabase:
  - Auth di client dengan `@supabase/auth-helpers-nextjs`.
  - Middleware untuk proteksi route dan redirect berbasis sesi di `src/middleware.ts`.
- Tailwind CSS v4 untuk styling.
- Next/Image untuk optimasi gambar dan remote image domain yang dikonfigurasi di `next.config.ts`.
- Ikon: `lucide-react`, `react-icons`, dan FontAwesome React.
- TypeScript untuk type-safety, dengan alias `@/*` (lihat `tsconfig.json`).

File penting:
- <mcfile name="next.config.ts" path="/Users/ryokhrisna/data/coding/liniaksara/next.config.ts"></mcfile>
- <mcfile name="middleware.ts" path="/Users/ryokhrisna/data/coding/liniaksara/src/middleware.ts"></mcfile>
- <mcfile name="supabase.ts" path="/Users/ryokhrisna/data/coding/liniaksara/src/config/supabase.ts"></mcfile>
- <mcfile name="HomeTemplate.tsx" path="/Users/ryokhrisna/data/coding/liniaksara/src/components/templates/HomeTemplate.tsx"></mcfile>
- <mcfile name="ComicDetailTemplate.tsx" path="/Users/ryokhrisna/data/coding/liniaksara/src/components/templates/ComicDetailTemplate.tsx"></mcfile>

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

## Persiapan Lingkungan

1. Pastikan Node.js LTS terbaru terpasang.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env.local` di root proyek dan isi variabel berikut:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   (Ganti dengan kredensial Supabase Anda)
4. Opsional: Terapkan migrasi SQL jika menggunakan Supabase lokal:
   - Jalankan file di `supabase/migrations/20230813_create_creator_stats.sql` untuk statistik kreator.

## Menjalankan Secara Lokal

- Mode pengembangan:
  ```bash
  npm run dev
  ```
  Buka http://localhost:3000 di browser.

- Build dan production:
  ```bash
  npm run build
  npm start
  ```

- Linting:
  ```bash
  npm run lint
  ```

Script yang tersedia (lihat `package.json`):
- `dev`: next dev menggunakan Turbopack.
- `build`: next build.
- `start`: next start.
- `lint`: next lint.
