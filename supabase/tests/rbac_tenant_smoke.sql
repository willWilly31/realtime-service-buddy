-- RBAC + Tenant Isolation Smoke Test
-- Run this in Supabase SQL editor using session/user context per test identity.

-- ------------------------------
-- PREP: locate sample IDs
-- ------------------------------
-- SELECT id, user_id, role, tenant_id FROM public.profiles ORDER BY created_at DESC;
-- SELECT id, tenant_id, name FROM public.customers LIMIT 5;
-- SELECT id, tenant_id, service_number FROM public.service_units LIMIT 5;
-- SELECT id, tenant_id, part_name FROM public.inventory LIMIT 5;

-- ===================================================================
-- TENANT A / TECHNICIAN
-- Expected:
-- - Can insert service_units in own tenant
-- - Cannot insert payments
-- - Cannot update inventory
-- ===================================================================

-- Example insert service unit (ALLOW)
-- INSERT INTO public.service_units (
--   service_number, customer_id, device_type, brand, model,
--   issue_description, created_by, tenant_id
-- ) VALUES (
--   'SRV-TEST-TECH-A-001', '<customer_id_tenant_a>', 'phone', 'Aura', 'A1',
--   'test issue', auth.uid(), public.current_tenant_id()
-- );

-- Example insert payment (DENY)
-- INSERT INTO public.payments (
--   service_unit_id, amount, payment_type, payment_method, created_by, tenant_id
-- ) VALUES (
--   '<service_unit_id_tenant_a>', 10000, 'dp', 'cash', auth.uid(), public.current_tenant_id()
-- );

-- ===================================================================
-- TENANT A / CASHIER
-- Expected:
-- - Can insert payment in own tenant
-- - Cannot update service_units
-- ===================================================================

-- INSERT payment (ALLOW)
-- INSERT INTO public.payments (
--   service_unit_id, amount, payment_type, payment_method, created_by, tenant_id
-- ) VALUES (
--   '<service_unit_id_tenant_a>', 10000, 'dp', 'cash', auth.uid(), public.current_tenant_id()
-- );

-- UPDATE service_units (DENY)
-- UPDATE public.service_units
-- SET status = 'completed'
-- WHERE id = '<service_unit_id_tenant_a>';

-- ===================================================================
-- TENANT B / ADMIN
-- Expected:
-- - Cross-tenant SELECT from tenant A should return 0 rows
-- ===================================================================

-- SELECT * FROM public.customers WHERE tenant_id <> public.current_tenant_id();
-- SELECT * FROM public.service_units WHERE tenant_id <> public.current_tenant_id();
-- SELECT * FROM public.payments WHERE tenant_id <> public.current_tenant_id();
-- SELECT * FROM public.inventory WHERE tenant_id <> public.current_tenant_id();

-- Exit rule:
-- - Every ALLOW scenario succeeds
-- - Every DENY scenario fails with RLS error
-- - Cross-tenant queries return zero rows
