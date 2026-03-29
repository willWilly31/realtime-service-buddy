# Production Hardening Checklist

Checklist ini untuk memastikan aplikasi siap produksi secara keamanan, reliabilitas, dan operasional.

## 1) Auth & Session
- [ ] Aktifkan email verification + password policy minimal 8 karakter.
- [ ] Aktifkan rate limiting login/sign-up di Supabase Auth.
- [ ] Tambahkan session timeout UX + forced re-auth pada aksi sensitif.
- [ ] Audit metadata role di signup agar tidak bisa di-escalate dari client.

## 2) RLS & Authorization
- [ ] Review semua policy `UPDATE` yang saat ini terlalu permissive (`auth.uid() IS NOT NULL`).
- [ ] Batasi akses berdasarkan relasi user/profile role (`admin`, `technician`, `cashier`).
- [ ] Tambahkan policy write granular untuk `payments`, `inventory`, `service_units`.
- [ ] Buat migration test SQL untuk negative-case authorization.

## 3) Logging & Audit Trail
- [ ] Semua perubahan status unit menulis ke `activity_logs`.
- [ ] Semua transaksi pembayaran menulis audit event immutable.
- [ ] Simpan correlation id/request id untuk trace antar modul.
- [ ] Siapkan dashboard error monitoring (Sentry/Logflare/OpenTelemetry).

## 4) Data Integrity
- [ ] Tambahkan unique/format constraint untuk nomor service yang konsisten.
- [ ] Tambahkan trigger validasi stok agar `inventory.quantity` tidak negatif saat part dipakai.
- [ ] Enforce referential integrity untuk technician assignment aktif.
- [ ] Backfill script untuk data lama yang belum sesuai schema terbaru.

## 5) Reliability & Performance
- [ ] Gunakan pagination server-side untuk list units, payments, inventory.
- [ ] Tambahkan index berdasarkan query paling sering (status+updated_at, payment_date, min_stock).
- [ ] Setup retry policy dan circuit breaker untuk request kritikal.
- [ ] Uji beban minimal 200 concurrent sessions untuk dashboard.

## 6) Release & Operations
- [ ] CI wajib: lint + typecheck + build + minimal integration tests.
- [ ] Gunakan environment separation (dev/staging/prod) + secret rotation schedule.
- [ ] Siapkan runbook incident (auth down, DB latency tinggi, realtime drop).
- [ ] Definisikan SLO: uptime, error rate, dan response time per modul.
