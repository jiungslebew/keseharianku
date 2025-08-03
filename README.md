# Keseharianku - Aplikasi Rutinitas Harian

Aplikasi web sederhana untuk mengelola rutinitas ibadah dan aktivitas sehari-hari.

## Fitur Utama

- 📿 **Jadwal Sholat**: Pengingat waktu sholat lima waktu
- 🛁 **Rutinitas Harian**: Jadwal mandi dan aktivitas sehari-hari  
- 📊 **Statistik Progress**: Tracking progress harian
- ⏰ **Pengingat**: Countdown untuk aktivitas berikutnya
- 🔐 **Sistem Login**: Autentikasi pengguna yang aman

## Cara Menggunakan

1. Buka `index.html` di browser
2. Klik "Masuk" untuk login atau "Daftar" untuk registrasi
3. Gunakan salah satu akun demo berikut:
   - Email: `ahmad@example.com`, Password: `password123`
   - Email: `siti@example.com`, Password: `siti123`
   - Email: `budi@example.com`, Password: `budi456`
4. Setelah login berhasil, Anda akan diarahkan ke dashboard
5. Klik pada item jadwal untuk menandai sebagai selesai/belum selesai

## Struktur File

- `index.html` - Halaman landing page
- `login.html` - Halaman login
- `register.html` - Halaman registrasi
- `dashboard.html` - Dashboard utama setelah login
- `styles.css` - Styling untuk semua halaman
- `script.js` - JavaScript untuk landing page
- `auth.js` - Logic autentikasi dan validasi
- `dashboard.js` - Functionality dashboard

## Perbaikan yang Telah Dilakukan

✅ **Masalah login yang tidak bisa masuk** - Diperbaiki dengan:
- Validasi email dan password yang proper
- Pesan error yang jelas untuk kredensial salah
- Sistem autentikasi yang robust

✅ **Redirect ke landing page saat login** - Diperbaiki dengan:
- Proper session management menggunakan localStorage
- Pencegahan akses unauthorized ke dashboard
- Handling back button yang benar
- Clear browser history saat logout

## Teknologi yang Digunakan

- HTML5
- CSS3 (dengan responsive design)
- Vanilla JavaScript
- localStorage untuk data persistence
