# RBAC + Tenant Isolation Test Matrix

Tujuan: memastikan role-by-id dan tenant isolation benar-benar berjalan (deny by default).

## Test identities
- Tenant A: `admin_a`, `cashier_a`, `technician_a`
- Tenant B: `admin_b`, `cashier_b`, `technician_b`

## Expected global rules
- User Tenant A tidak pernah bisa baca/tulis data Tenant B.
- `admin`: manage luas.
- `cashier`: fokus customer/payment/inventory.
- `technician`: fokus service units.

## Core test cases

### Customers
1. `technician_a` INSERT customer tenant A => ALLOW
2. `technician_a` UPDATE customer tenant A => DENY
3. `cashier_a` UPDATE customer tenant A => ALLOW
4. `cashier_a` SELECT customer tenant B => DENY

### Service Units
1. `technician_a` INSERT service_units tenant A => ALLOW
2. `technician_a` UPDATE service_units tenant A => ALLOW
3. `cashier_a` UPDATE service_units tenant A => DENY
4. `admin_b` SELECT service_units tenant A => DENY

### Payments
1. `cashier_a` INSERT payment tenant A => ALLOW
2. `technician_a` INSERT payment tenant A => DENY
3. `cashier_a` SELECT payment tenant B => DENY

### Inventory
1. `cashier_a` UPDATE inventory tenant A => ALLOW
2. `technician_a` UPDATE inventory tenant A => DENY
3. `admin_b` SELECT inventory tenant A => DENY

## SQL harness pattern
Gunakan dua session token berbeda (Tenant A/B), lalu uji query di atas dan pastikan hasil ALLOW/DENY sesuai ekspektasi.

## Exit criteria
- 100% test case pass.
- Tidak ada query lintas tenant yang lolos.
- Tidak ada role privilege escalation dari client metadata.
