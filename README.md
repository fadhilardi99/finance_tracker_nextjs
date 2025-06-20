# Finance Tracker

Aplikasi pencatatan keuangan pribadi berbasis Next.js dan Firebase.

## Fitur Utama

- **Autentikasi**: Daftar & login dengan email/password (Firebase Auth)
- **Tambah Transaksi**: Catat pemasukan & pengeluaran dengan kategori, deskripsi, dan tanggal
- **Statistik**: Lihat total pemasukan, pengeluaran, dan saldo
- **Daftar Transaksi Bulanan**: Navigasi antar bulan, lihat detail transaksi dalam bentuk tabel
- **Recent Transactions**: Tampilkan 5 transaksi terakhir
- **Grafik & Ringkasan**: (opsional, jika diaktifkan)

## Fitur Lengkap

- **Autentikasi Aman**: Daftar, login, dan logout dengan email & password.
- **Tambah Transaksi**: Input pemasukan/pengeluaran dengan kategori, deskripsi, dan tanggal.
- **Statistik Real-time**: Lihat total pemasukan, pengeluaran, dan saldo secara otomatis.
- **Daftar Transaksi Bulanan**: Navigasi antar bulan, lihat detail transaksi dalam bentuk tabel.
- **Recent Transactions**: Tampilkan 5 transaksi terakhir.
- **Pencarian & Filter**: (opsional, jika diimplementasikan)
- **Grafik Visualisasi**: (opsional, jika diimplementasikan)
- **Responsive Design**: Tampilan optimal di desktop & mobile.

## Screenshot

### Dashboard

![Dashboard Screenshot](public/screenshot-dashboard.png)

### Form Tambah Transaksi

![Add Transaction Form](public/screenshot-add-transaction.png)

> **Catatan:** Ganti nama file screenshot sesuai file yang kamu upload ke folder `public/`.

## Demo Online

Coba aplikasi versi demo di: [https://finance-tracker-demo.vercel.app](https://finance-tracker-demo.vercel.app)

## Setup & Instalasi

### 1. Clone Repository

```bash
# Ganti URL sesuai repo Anda
git clone <repo-url>
cd finance_tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root folder, lalu isi dengan konfigurasi Firebase Anda:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Contoh:**
>
> ```
> NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDBa..."
> NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="finance-xxxx.firebaseapp.com"
> ...
> ```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Akses di [http://localhost:3000](http://localhost:3000)

## Konfigurasi Firestore

- Pastikan sudah membuat **Firestore Database** di Firebase Console.
- Atur **Firestore Rules** agar hanya user yang login yang bisa akses datanya:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /transactions/{transactionId} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

- Jika muncul error `The query requires an index`, klik link yang muncul di error tersebut untuk membuat index di Firebase Console.

## Struktur Folder

```
finance_tracker/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── public/
├── .env.local
├── package.json
└── ...
```

## Lisensi

MIT

## Kontribusi

Pull request sangat diterima! Untuk perubahan besar, silakan buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

1. Fork repo ini
2. Buat branch fitur: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -am 'Tambah fitur baru'`
4. Push ke branch: `git push origin fitur-baru`
5. Buka Pull Request

## Kontak & Dukungan

Jika ada pertanyaan, bug, atau saran fitur, silakan buka [issue](https://github.com/username/finance_tracker/issues) atau hubungi saya di [email@example.com].
