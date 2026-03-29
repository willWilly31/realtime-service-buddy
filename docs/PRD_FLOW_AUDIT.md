# PRD & End-to-End Flow Audit

## Scope
Dokumen ini mengecek kesesuaian antara:
- **PRD implisit** (fitur yang terlihat dari UI + schema database),
- **Flow front-end** (routing, auth gate, dashboard, list unit),
- **Flow back-end** (Supabase Auth, RLS, relasi tabel, realtime).

## 1) Product Goal (PRD Ringkas)
Berdasarkan kode saat ini, produk ini adalah sistem manajemen servis HP untuk:
1. login/registrasi user teknisi,
2. melihat dashboard operasional,
3. melihat daftar unit servis,
4. sinkron data unit servis secara realtime,
5. menyimpan data inti bisnis: customer, unit service, payment, inventory, activity log.

## 2) Flow End-to-End Saat Ini

### A. Authentication flow
1. User membuka `/auth`.
2. User bisa **Daftar** (`supabase.auth.signUp`) dengan metadata `full_name` dan `role`.
3. Trigger database `handle_new_user` membuat record di `public.profiles` setelah akun auth dibuat.
4. User **Login** (`supabase.auth.signInWithPassword`) lalu diarahkan ke `/`.
5. Route private dibungkus `ProtectedRoute` yang cek `getSession()` dan subscribe `onAuthStateChange`.

✅ Core auth flow sudah tersambung front ke back.

### B. Dashboard flow
1. User authenticated masuk ke `/`.
2. `Index` me-render `Dashboard`.
3. Dashboard saat ini dominan memakai **mock data/static visual cards**, belum query realtime dari database.

⚠️ Dashboard belum mencerminkan data operasional real dari backend.

### C. Unit Service flow
1. User masuk menu `/units`.
2. Halaman load data `service_units` beserta relasi `customers` dan `profiles`.
3. Data diurutkan `created_at DESC`.
4. Frontend subscribe channel realtime `postgres_changes` untuk tabel `service_units`.
5. Saat ada perubahan, frontend melakukan `loadUnits()` ulang.

✅ Flow read + realtime untuk unit service sudah jalan.

⚠️ Tombol **Unit Baru** belum memiliki aksi create, sehingga flow create/update dari UI belum end-to-end.

## 3) Mapping Front ↔ Back

### Front-end yang sudah terhubung backend
- Auth (signup/signin/session guard).
- Fetch list service unit + relasi customer/technician.
- Realtime update service_units.

### Backend yang sudah siap tapi belum dieksploitasi penuh di UI
- Tabel `payments`, `inventory`, `service_parts`, `activity_logs`.
- Struktur role (`admin`, `technician`, `cashier`) di profiles.
- Menu sidebar ke `/cashflow`, `/inventory`, `/technicians`, `/aging`, `/analytics`, `/settings` (route belum tersedia di router).

## 4) Gap terhadap PRD operasional

### Gap P0 (krusial)
1. **Menu vs Route mismatch**: sidebar punya banyak menu, tetapi router baru punya `/`, `/units`, `/auth`.
2. **Create flow belum ada**: belum ada form check-in unit baru + create customer + create service unit.
3. **Dashboard belum data-driven**: metrik dan tabel masih mock.
4. **Type safety belum optimal**: state `units` menggunakan `any[]`.

### Gap P1 (penting)
1. **Role-based authorization di UI** belum diterapkan (menu/aksi per role).
2. **Flow payment** belum tersedia dari UI meski tabel backend siap.
3. **Flow inventory & part usage** belum tersedia dari UI.
4. **Activity logging otomatis** belum terlihat dipakai di layer aplikasi.

### Gap P2 (nice to have)
1. Empty states/CTA sudah ada, tapi belum mengarahkan ke wizard action nyata.
2. Belum ada observability sederhana (error boundary, analytics event) untuk flow kritikal.

## 5) Rekomendasi Implementasi (Front-to-Back)

### Sprint 1 (stabilisasi alur inti)
1. Implement route nyata sesuai sidebar atau sembunyikan menu yang belum siap.
2. Tambah **Create Unit flow**:
   - input customer (reuse jika sudah ada),
   - input unit + keluhan,
   - set status awal `pending`,
   - generate `service_number` konsisten.
3. Refactor dashboard agar query data real (count by status, today check-in, pending payment).
4. Ganti `any[]` menjadi typed rows dari `Database` Supabase.

### Sprint 2 (operasional kasir & teknisi)
1. Implement payment flow (DP/full/remaining).
2. Implement update status unit + timeline activity log.
3. Implement inventory deduction saat part dipakai (`service_parts`).
4. Terapkan role gating di UI + guard endpoint/query berdasarkan role.

## 6) Definition of Done (DoD) yang disarankan
- User teknisi dapat check-in unit baru dari UI hingga terlihat realtime di list unit.
- Dashboard metrik mengambil data asli dari DB.
- Payment tercatat dan mempengaruhi status pembayaran unit.
- Inventory berkurang saat part dipakai di service order.
- Semua menu aktif memiliki route/page valid; menu yang belum aktif disembunyikan.

## 7) Kesimpulan
Arsitektur dasar sudah **benar arah**: auth, schema bisnis, RLS, dan realtime sudah tersedia. Namun end-to-end masih **parsial** karena UI baru mencakup auth + read units. Prioritas terdekat adalah menutup gap antara menu, route, dan write-flow utama (create unit, payment, inventory) agar PRD operasional benar-benar terpenuhi dari front ke back.
