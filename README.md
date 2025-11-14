# 🚑 MediMine — Backend API

Backend untuk aplikasi **MediMine**, sebuah AI Assistant kesehatan yang membantu pengguna mendapatkan informasi medis secara cepat, aman, dan mudah dipahami.  
Backend ini menyediakan layanan autentikasi, integrasi AI (OpenAI), serta penyimpanan riwayat pencarian medis melalui Supabase.

---

## 🚀 Live Demo (Frontend)

🔗 **https://medimine-frontend.vercel.app/**

---

## 📁 Struktur Proyek

```bash
backend/
├── src/
│   ├── controllers/
│   │   ├── aiController.ts          # Logika integrasi OpenAI
│   │   └── authController.ts        # Login & Register
│   ├── lib/
│   │   └── openai.ts                # Konfigurasi OpenAI
│   ├── middlewares/
│   │   ├── authMiddleware.ts        # JWT auth handler
│   │   └── upload.ts                # Upload handler
│   ├── routes/
│   │   ├── aiRoute.ts               # Route untuk AI API
│   │   └── authRoute.ts             # Route untuk autentikasi
│   ├── utils/
│   │   └── supabase.ts              # Koneksi Supabase
│   └── index.ts                     # Entry point Express server
├── .env                             # Environment variables
├── .dockerignore
├── Dockerfile
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## 🧠 Fitur Utama

- **AI Assistant Medis** - Menggunakan OpenAI untuk memberikan jawaban medis yang aman, informatif, dan mudah dipahami.
- **Autentikasi JWT** - Sistem login–register aman berbasis JSON Web Token.
- **Riwayat Pencarian Medis** - Setiap pertanyaan user disimpan ke database Supabase.
- **Arsitektur Modular** - Controller, route, middleware, dan utils dipisah agar mudah di-maintain dan dikembangkan.
- **Docker Support** - Backend dapat dijalankan dengan container deployment yang ringan & scalable.

---

## 🛠 Teknologi yang Digunakan

| Teknologi          | Fungsi |
|--------------------|--------|
| **Node.js + Express** | Backend REST API |
| **TypeScript**        | Penulisan kode lebih aman & maintainable |
| **OpenAI API**        | AI untuk respons medis |
| **Supabase**          | Database & penyimpanan riwayat |
| **JWT**               | Sistem autentikasi aman |
| **Docker**            | Deploy dalam container |

---

## 👤 Peran Saya

Sebagai Backend Developer, saya:

- Membangun API menggunakan **Express + TypeScript**
- Mengembangkan logika AI terintegrasi dengan **OpenAI**
- Mengimplementasikan **autentikasi JWT**
- Menghubungkan backend dengan database **Supabase**
- Membuat sistem penyimpanan & pengambilan **history medis**
- Mendesain struktur backend yang **modular, scalable, dan clean**

---

## 🔥 Tantangan

- Menjaga agar jawaban AI relevan tetapi tetap aman untuk konteks medis
- Optimasi penyimpanan history agar cepat dan efisien
- Melindungi endpoint penting menggunakan autentikasi
- Menangani beban permintaan AI yang tinggi dengan performa optimal

---

## ✅ Solusi

- Menggunakan **prompt khusus** untuk menjaga agar jawaban AI tetap aman
- Mengintegrasikan Supabase dengan **query optimal**
- Menggunakan **middleware proteksi JWT** untuk endpoint sensitif
- Memisahkan logika ke **controller, route, dan util** agar maintainability meningkat

---

## 🔗 Endpoint Utama

### 🔐 **Auth API**
| Method | Endpoint          | Deskripsi |
|--------|-------------------|-----------|
| POST   | `/auth/register`  | Registrasi user |
| POST   | `/auth/login`     | Login user & menghasilkan JWT |

### 🧠 **AI Medical API**
| Method | Endpoint        | Deskripsi |
|--------|-----------------|-----------|
| POST   | `/ai/ask`       | Kirim pertanyaan → proses OpenAI → simpan ke Supabase |
| GET    | `/ai/history`   | Mengambil riwayat pencarian user |

---

## 🧩 Cara Menjalankan Proyek

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Server berjalan di :
http://localhost:8081
```



