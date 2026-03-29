# Tenant Provisioning (No Default Leakage)

## Goal
Setiap user baru harus masuk tenant yang benar melalui invite terkontrol, bukan hanya fallback default.

## Flow
1. Admin tenant membuat invite (`email`, `role`, optional `expires_at`).
2. User daftar/login dengan email yang sama.
3. Trigger `handle_new_user` mencari invite `pending` aktif:
   - jika ketemu: profile dibuat dengan `tenant_id` + `role` dari invite, lalu invite jadi `claimed`.
   - jika tidak ketemu: fallback ke default tenant + technician (safety net).

## SQL API
Gunakan function:
- `public.create_tenant_invite(p_email, p_role, p_expires_at)`

## Security notes
- Hanya admin tenant bisa create invite.
- Invite dibatasi per status (`pending/claimed/expired/revoked`).
- Email distandarisasi lower-case.
