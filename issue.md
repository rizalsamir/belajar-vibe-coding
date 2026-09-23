# Task: Implementasi CRUD dan Registrasi User

## 📌 Tujuan
Mengimplementasikan fitur CRUD (Create, Read, Update, Delete) untuk entitas User, dengan fokus utama pada endpoint registrasi user baru. Dokumen ini dibuat sebagai panduan langkah demi langkah (step-by-step) untuk diimplementasikan oleh junior programmer atau AI assistant.

---

## 🗄️ 1. Update Skema Database (Drizzle ORM)

Kita perlu memperbarui tabel `users` yang sudah ada agar sesuai dengan spesifikasi baru.

**Lokasi file:** `src/db/schema/users.ts`

**Spesifikasi Tabel `users`:**
- `id`: integer, primary key, auto increment
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (akan menyimpan hash dari bcrypt)
- `created_at`: timestamp, default current_timestamp, not null
- `updated_at`: timestamp, default current_timestamp on update current_timestamp, not null

**Langkah Implementasi:**
1. Buka file `src/db/schema/users.ts`.
2. Tambahkan kolom `password` menggunakan `varchar("password", { length: 255 }).notNull()`.
3. Tambahkan kolom `updatedAt` menggunakan `timestamp("updated_at").defaultNow().onUpdateNow().notNull()`.
4. Setelah skema diperbarui, jalankan perintah migrasi:
   ```bash
   bun run db:generate
   bun run db:push
   ```

---

## 📁 2. Struktur Folder & File

Kita akan menerapkan pemisahan tanggung jawab (separation of concerns) dengan memisahkan routing (Elysia) dan business logic.

Buat folder dan file berikut di dalam direktori `src/`:

```text
src/
├── routes/
│   └── users-route.ts    # Mengatur routing (endpoint, method, payload validation)
├── services/
│   └── users-service.ts  # Mengatur logic bisnis (database query, hashing password)
```

---

## ⚙️ 3. Implementasi Business Logic (Service)

**Lokasi file:** `src/services/users-service.ts`

**Tugas:**
Buat fungsi-fungsi CRUD dasar untuk berinteraksi dengan database menggunakan Drizzle ORM. Kita membutuhkan dependensi `bcryptjs` atau `bun:password` untuk hashing. Karena kita menggunakan Bun, disarankan menggunakan bawaan Bun yaitu `Bun.password`.

**Langkah Implementasi:**
1. Buat fungsi `registerUser(data)`.
   - Fungsi ini menerima input `name`, `email`, dan `password`.
   - **Pengecekan:** Query ke database (tabel `users`) apakah `email` sudah terdaftar.
   - Jika sudah terdaftar, lemparkan error (throw error) atau kembalikan status error.
   - Jika belum terdaftar:
     - Hash `password` (misal menggunakan `Bun.password.hash(password)`).
     - Simpan data user baru (name, email, hashed password) ke tabel `users`.
     - Kembalikan response sukses.
2. Buat juga fungsi dummy/skeleton untuk `getAllUsers()`, `getUserById(id)`, `updateUser(id, data)`, dan `deleteUser(id)`.

---

## 🌐 4. Implementasi API Routing (ElysiaJS)

**Lokasi file:** `src/routes/users-route.ts`

**Tugas:**
Mendefinisikan endpoint API untuk users.

**Spesifikasi Endpoint Registrasi:**
- **Method:** `POST`
- **Path:** `/api/users`
- **Request Body (JSON):**
  ```json
  {
      "name" : "rizal",
      "email" : "rizal@example.com",
      "password" : "rahasia"
  }
  ```
- **Response Sukses (Status 200/201):**
  ```json
  {
      "data" : "OK"
  }
  ```
- **Response Error (Status 400/409 - Email terdaftar):**
  ```json
  {
      "data" : "Email sudah terdaftar"
  }
  ```

**Langkah Implementasi:**
1. Import `Elysia` dari `"elysia"`.
2. Import fungsi `registerUser` dari `users-service.ts`.
3. Buat instance route baru: `export const usersRoute = new Elysia({ prefix: '/api/users' })`.
4. Tambahkan method `.post('/', async ({ body, set }) => { ... })`.
5. Di dalam handler, panggil `registerUser`.
6. Gunakan `try...catch`. 
   - Jika sukses, return `{ data: "OK" }`.
   - Jika catch error (karena email duplicate), set `set.status = 400` dan return `{ data: "Email sudah terdaftar" }`.
7. Tambahkan route lain (GET, PUT, DELETE) yang memanggil service CRUD lainnya.

---

## 🔌 5. Registrasi Route ke Main App

**Lokasi file:** `src/index.ts`

**Langkah Implementasi:**
1. Buka file `src/index.ts`.
2. Import `usersRoute` dari `src/routes/users-route.ts`.
3. Daftarkan route tersebut ke instance aplikasi utama menggunakan `.use(usersRoute)`.

---

## ✅ Kriteria Selesai (Acceptance Criteria)
- [ ] Skema database `users` sudah memiliki kolom `password` dan `updated_at`.
- [ ] Berhasil melakukan HTTP POST ke `/api/users` dengan body JSON yang valid dan mendapatkan response `{"data": "OK"}`.
- [ ] Jika melakukan HTTP POST kedua kalinya dengan email yang sama, sistem merespons dengan `{"data": "Email sudah terdaftar"}`.
- [ ] Password tersimpan di database dalam bentuk hash, bukan plain-text.
- [ ] Struktur folder `routes/` dan `services/` sudah digunakan dengan benar sesuai instruksi.
