<div align="center">

# 🎓 LKA-SK UNSRI
### Layanan Konsultasi Akademik - Sistem Komputer

**Menjembatani komunikasi antara mahasiswa dan Dosen Pembimbing Akademik secara digital, efisien, dan modern.**

</div>

---

## 📝 Tentang Proyek

**LKA-SK** adalah sebuah platform veb terpadu yang dirancang untuk memfasilitasi proses konsultasi akademik di lingkungan Program Studi Sistem Komputer, Universitas Sriwijaya. Aplikasi ini menggantikan proses manual yang memakan waktu dengan sistem digital yang terstruktur, memungkinkan mahasiswa untuk berinteraksi dengan Dosen Pembimbing Akademik (PA) mereka secara lebih mudah dan terdokumentasi dengan baik.

Proyek ini dibangun dengan arsitektur modern menggunakan **React (Vite) + TypeScript** di sisi frontend dan didukung oleh **Firebase** sebagai backend, mencakup autentikasi, database, dan layanan lainnya.

---

## ✨ Fitur Utama

Aplikasi ini memiliki dua peran utama dengan fitur yang disesuaikan untuk masing-masing kebutuhan:

### 👨‍💻 Untuk Mahasiswa

- **Dashboard Interaktif**: Ringkasan jadwal konsultasi mendatang dan status pertanyaan terakhir.
- **Booking Jadwal**: Melihat ketersediaan jadwal Dosen PA dan melakukan pemesanan slot konsultasi.
- **Konsultasi Teks**: Mengajukan pertanyaan atau masalah akademik kepada Dosen PA, lengkap dengan lampiran file.
- **Riwayat Konsultasi**: Semua pertanyaan dan jawaban terdokumentasi dengan rapi dan mudah diakses kembali.
- **Manajemen Profil**: Memperbarui data diri, kontak, foto profil, dan memilih Dosen PA.
- **Notifikasi Real-time**: Pemberitahuan untuk jadwal baru, jawaban pertanyaan, dan status booking.

### 👩‍🏫 Untuk Dosen

- **Dashboard Dosen**: Ringkasan cepat jumlah pertanyaan baru, booking jadwal, dan total mahasiswa bimbingan.
- **Manajemen Konsultasi**: Kotak masuk khusus untuk meninjau dan menjawab pertanyaan dari mahasiswa.
- **Manajemen Jadwal**: Membuat dan mengatur slot waktu yang tersedia untuk konsultasi.
- **Daftar Mahasiswa**: Melihat daftar mahasiswa bimbingan yang aktif melakukan konsultasi.
- **Manajemen Profil**: Memperbarui data diri dan kontak.

### 🎨 Fitur Umum

- **Autentikasi Aman**: Sistem login dan registrasi yang aman berbasis peran.
- **Tema Ganda**: Pilihan antara mode terang (light) dan gelap (dark) untuk kenyamanan visual.
- **Desain Responsif**: Tampilan yang optimal di berbagai perangkat, baik desktop maupun mobile.

---

## 🚀 Teknologi yang Digunakan

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase (Authentication, Cloud Firestore)
- **State Management**: React Hooks & Context API

---

## 🛠️ Panduan Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

**1. Clone Repository**
```bash
git clone https://github.com/username/repository-name.git
cd repository-name
```

**2. Instalasi Dependensi**
Pastikan Anda memiliki Node.js terinstal. Jalankan perintah berikut:
```bash
npm install
```

**3. Konfigurasi Environment Firebase**
- Buat sebuah proyek baru di [Firebase Console](https://console.firebase.google.com/).
- Daftarkan aplikasi web baru dan salin konfigurasi Firebase Anda.
- Buat file bernama `.env.local` di root direktori proyek.
- Isi file tersebut dengan kredensial Firebase Anda menggunakan format di bawah ini.

**4. Jalankan Proyek**
Setelah konfigurasi selesai, jalankan server development:
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

---

## 🔑 Konfigurasi Environment

File `.env.local` harus berisi variabel-variabel berikut. Ganti nilai placeholder dengan kredensial dari proyek Firebase Anda.

```
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="1:..."
VITE_FIREBASE_MEASUREMENT_ID="G-..."
```

---

<div align="center">

**Dikembangkan dengan ❤️ untuk kemajuan akademik.**

</div>