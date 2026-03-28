## Product analysis

- PRD & end-to-end flow audit: [`docs/PRD_FLOW_AUDIT.md`](docs/PRD_FLOW_AUDIT.md)
- Production hardening checklist: [`docs/PRODUCTION_HARDENING_CHECKLIST.md`](docs/PRODUCTION_HARDENING_CHECKLIST.md)
- Release notes: [`CHANGELOG.md`](CHANGELOG.md)

## Packaging

Untuk distribusi komersial, buat file ZIP secara lokal (jangan commit binary ke git/PR):

```sh
zip -r realtime-service-buddy-commercial-ready.zip . -x "node_modules/*" ".git/*"
