# Aura Service Buddy

Aplikasi manajemen service smartphone berbasis React + Supabase.

## Quick Start
## Product analysis

- PRD & end-to-end flow audit: [`docs/PRD_FLOW_AUDIT.md`](docs/PRD_FLOW_AUDIT.md)
- Production hardening checklist: [`docs/PRODUCTION_HARDENING_CHECKLIST.md`](docs/PRODUCTION_HARDENING_CHECKLIST.md)
- Release notes: [`CHANGELOG.md`](CHANGELOG.md)

## Packaging

Untuk distribusi komersial, buat file ZIP secara lokal (jangan commit binary ke git/PR):

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — jalankan development server.
- `npm run build` — build production.
- `npm run preview` — preview build.
- `npm run lint` — linting kode.

## Tech Stack

- Vite
- React + TypeScript
- Tailwind + shadcn/ui
- Supabase

## Branding & Favicon

- Favicon saat ini menggunakan `public/aura-logo.svg` via `index.html`.
- Untuk ganti ke logo brand kamu (misalnya logo Aura), replace file berikut dengan gambar baru:
  - `public/aura-logo.svg`

## Product docs

- PRD & flow audit: [`docs/PRD_FLOW_AUDIT.md`](docs/PRD_FLOW_AUDIT.md)
- Production hardening checklist: [`docs/PRODUCTION_HARDENING_CHECKLIST.md`](docs/PRODUCTION_HARDENING_CHECKLIST.md)
- RBAC + tenant test matrix: [`docs/RBAC_TENANT_TEST_MATRIX.md`](docs/RBAC_TENANT_TEST_MATRIX.md)
- SQL smoke test: [`supabase/tests/rbac_tenant_smoke.sql`](supabase/tests/rbac_tenant_smoke.sql)
- Tenant provisioning guide: [`docs/TENANT_PROVISIONING.md`](docs/TENANT_PROVISIONING.md)
- Changelog: [`CHANGELOG.md`](CHANGELOG.md)

## Packaging

Untuk distribusi, generate ZIP secara lokal (jangan commit binary ke repo):

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Product analysis

- PRD & end-to-end flow audit: [`docs/PRD_FLOW_AUDIT.md`](docs/PRD_FLOW_AUDIT.md)
- Production hardening checklist: [`docs/PRODUCTION_HARDENING_CHECKLIST.md`](docs/PRODUCTION_HARDENING_CHECKLIST.md)
- Release notes: [`CHANGELOG.md`](CHANGELOG.md)

## Packaging

Untuk distribusi komersial, buat file ZIP secara lokal (jangan commit binary ke git/PR):

```sh
zip -r realtime-service-buddy-commercial-ready.zip . -x "node_modules/*" ".git/*"
```
