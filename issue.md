# Task: Implementasi Fitur Login dan Session Management

## 📌 Tujuan
Mengimplementasikan fitur autentikasi (Login) untuk entitas User dan manajemen session menggunakan UUID. Dokumen ini dibuat sebagai panduan langkah demi langkah (step-by-step) untuk diimplementasikan oleh junior programmer atau AI assistant.

---

## 🗄️ 1. Pembuatan Skema Database (Drizzle ORM)

Kita perlu membuat tabel baru bernama `sessions` untuk menyimpan data token sesi login pengguna.

**Spesifikasi Tabel `sessions`:**
- `id`: integer, primary key, auto increment
- `token`: varchar(255), not null (akan menyimpan UUID)
- `user_id`: integer, foreign key yang merujuk ke tabel `users` (id)
- `created_at`: timestamp, default current_timestamp, not null
- `updated_at`: timestamp, default current_timestamp on update current_timestamp, not null

**Langkah Implementasi:**
1. Buat atau perbarui file skema database (misal di `src/db/schema/sessions.ts` atau gabungkan di skema yang ada) dan definisikan tabel `sessions`.
2. Pastikan Anda menambahkan relasi *foreign key* `user_id` yang merujuk ke tabel `users`.
3. Daftarkan skema tersebut agar dikenali oleh Drizzle.
4. Jalankan perintah migrasi untuk memperbarui database:
   ```bash
   bun run db:generate
   bun run db:push
   ```

---

## 📁 2. Struktur Folder & File

Pastikan kode diletakkan pada folder yang tepat sesuai prinsip *separation of concerns* (memisahkan *routes* dan *services*). Gunakan atau perbarui file yang sudah ada:

- **`src/routes/users-route.ts`**: Menangani HTTP routing (Elysia), schema body, dan HTTP status code.
- **`src/services/users-service.ts`**: Menangani logika bisnis inti aplikasi (interaksi database, verifikasi password, dan pembuatan token).

---

## ⚙️ 3. Implementasi Business Logic (Service)

**Lokasi file:** `src/services/users-service.ts`

**Tugas:**
Buat fungsi baru untuk memvalidasi kredensial login dan membuat record session di database.

**Langkah Implementasi:**
1. Buat fungsi `loginUser({ email, password })`.
2. **Pengecekan User:** Lakukan query (select) ke tabel `users` berdasarkan `email` yang diinput. Jika user tidak ditemukan, *throw error* (misal: `new Error("Email atau password salah")`).
3. **Pengecekan Password:** Jika user ditemukan, bandingkan `password` input dengan hash yang ada di database menggunakan utilitas bcrypt (contoh di Bun: `Bun.password.verify()`). Jika hasil tidak cocok, *throw error* yang sama.
4. **Pembuatan Token:** Jika kredensial valid, *generate* sebuah UUID baru (misal menggunakan `crypto.randomUUID()`).
5. **Simpan Session:** Insert (simpan) token UUID tersebut beserta `user_id` ke dalam tabel `sessions`.
6. Kembalikan nilai token UUID tersebut (sebagai string) dari fungsi `loginUser`.

---

## 🌐 4. Implementasi API Routing (ElysiaJS)

**Lokasi file:** `src/routes/users-route.ts`

**Tugas:**
Mendefinisikan endpoint API untuk proses login.

**Spesifikasi Endpoint Login:**
- **Method:** `POST`
- **Path:** `/api/users/login`
- **Request Body (JSON):**
  ```json
  {
      "email" : "rizal@example.com",
      "password" : "rahasia"
  }
  ```
- **Response Sukses (Status 200):**
  ```json
  {
      "data" : "d51197c3-30ed-4fb1-a75d-f1e18dc44f2d"
  }
  ```
  *(Catatan: nilai string `data` berisi UUID aktual yang digenerate)*
- **Response Error (Status 400/401):**
  ```json
  {
      "data" : "Email atau password salah"
  }
  ```

**Langkah Implementasi:**
1. Buka `src/routes/users-route.ts`.
2. Tambahkan *chaining method* `.post('/login', async ({ body, set }) => { ... })` ke *instance* router `usersRoute`.
3. Gunakan blok `try...catch` di dalam *handler*.
4. Pada blok `try`, panggil fungsi `loginUser(body)`. Jika sukses, *return* `{ data: token }`.
5. Pada blok `catch`, evaluasi tipe error. Jika error karena kredensial tidak valid, ubah status HTTP menjadi 400 (melalui `set.status = 400`), lalu kembalikan JSON `{ data: "Email atau password salah" }`.
6. Validasi tipe request body menggunakan standar skema bawaan Elysia (`t.Object`).

---

## ✅ Kriteria Selesai (Acceptance Criteria)
- [ ] Tabel `sessions` berhasil terbentuk dan berelasi *(Foreign Key)* ke tabel `users`.
- [ ] Jika dikirim `POST` ke `/api/users/login` dengan kredensial yang valid, sistem merespons format JSON `{ "data": "<UUID>" }`.
- [ ] Session login (UUID beserta User ID terkait) berhasil tersimpan ke dalam tabel `sessions` di setiap kali proses login sukses.
- [ ] Jika kredensial *(email/password)* salah atau *email* tidak terdaftar, endpoint dengan konsisten menolak dan merespons `{ "data": "Email atau password salah" }`.
- [ ] Pemisahan kode logic di `users-service.ts` dan logic HTTP di `users-route.ts` ditaati.
