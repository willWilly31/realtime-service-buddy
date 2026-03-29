-- ===================================
-- TENANT ISOLATION (Phase 2)
-- ===================================

-- 1) Tenants master table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view tenants" ON public.tenants;
CREATE POLICY "Authenticated users can view tenants"
  ON public.tenants FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 2) Ensure default tenant exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE slug = 'default') THEN
    INSERT INTO public.tenants (slug, name) VALUES ('default', 'Default Tenant');
  END IF;
END $$;

-- 3) Add tenant_id to profiles and core business tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.service_units ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- 4) Backfill tenant_id using default tenant
WITH default_tenant AS (
  SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1
)
UPDATE public.profiles p
SET tenant_id = dt.id
FROM default_tenant dt
WHERE p.tenant_id IS NULL;

UPDATE public.customers c
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE c.tenant_id IS NULL
  AND p.user_id = c.created_by;

UPDATE public.service_units s
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE s.tenant_id IS NULL
  AND p.user_id = s.created_by;

UPDATE public.payments pay
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE pay.tenant_id IS NULL
  AND p.user_id = pay.created_by;

UPDATE public.inventory i
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE i.tenant_id IS NULL
  AND p.user_id = i.created_by;

-- Fallback remaining nulls to default
WITH default_tenant AS (
  SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1
)
UPDATE public.customers c SET tenant_id = dt.id FROM default_tenant dt WHERE c.tenant_id IS NULL;
WITH default_tenant AS (
  SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1
)
UPDATE public.service_units s SET tenant_id = dt.id FROM default_tenant dt WHERE s.tenant_id IS NULL;
WITH default_tenant AS (
  SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1
)
UPDATE public.payments p SET tenant_id = dt.id FROM default_tenant dt WHERE p.tenant_id IS NULL;
WITH default_tenant AS (
  SELECT id FROM public.tenants WHERE slug = 'default' LIMIT 1
)
UPDATE public.inventory i SET tenant_id = dt.id FROM default_tenant dt WHERE i.tenant_id IS NULL;

-- 5) Enforce not null
ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.customers ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.service_units ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.payments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.inventory ALTER COLUMN tenant_id SET NOT NULL;

-- 6) Tenant helper function
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.tenant_id
  FROM public.profiles p
  WHERE p.user_id = auth.uid()
  LIMIT 1;
$$;

-- 7) update signup trigger: assign default tenant
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_tenant_id UUID;
BEGIN
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;

  INSERT INTO public.profiles (user_id, full_name, email, role, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    'technician',
    default_tenant_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8) Tighten SELECT policies by tenant
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
CREATE POLICY "Tenant users can view customers"
  ON public.customers FOR SELECT
  USING (tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Authenticated users can view service units" ON public.service_units;
CREATE POLICY "Tenant users can view service units"
  ON public.service_units FOR SELECT
  USING (tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Authenticated users can view payments" ON public.payments;
CREATE POLICY "Tenant users can view payments"
  ON public.payments FOR SELECT
  USING (tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory;
CREATE POLICY "Tenant users can view inventory"
  ON public.inventory FOR SELECT
  USING (tenant_id = public.current_tenant_id());

-- 9) tighten role policies with tenant guard
DROP POLICY IF EXISTS "Role-based insert customers" ON public.customers;
CREATE POLICY "Role+tenant insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'cashier', 'technician')
  );

DROP POLICY IF EXISTS "Role-based update customers" ON public.customers;
CREATE POLICY "Role+tenant update customers"
  ON public.customers FOR UPDATE
  USING (
    tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'cashier')
  );

DROP POLICY IF EXISTS "Role-based insert service units" ON public.service_units;
CREATE POLICY "Role+tenant insert service units"
  ON public.service_units FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'cashier', 'technician')
  );

DROP POLICY IF EXISTS "Role-based update service units" ON public.service_units;
CREATE POLICY "Role+tenant update service units"
  ON public.service_units FOR UPDATE
  USING (
    tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'technician')
  );

DROP POLICY IF EXISTS "Role-based insert payments" ON public.payments;
CREATE POLICY "Role+tenant insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'cashier')
  );

DROP POLICY IF EXISTS "Role-based manage inventory" ON public.inventory;
CREATE POLICY "Role+tenant manage inventory"
  ON public.inventory FOR ALL
  USING (
    tenant_id = public.current_tenant_id()
    AND public.current_user_role() IN ('admin', 'cashier')
  );

-- 10) indexes
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON public.customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_service_units_tenant_id ON public.service_units(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON public.payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant_id ON public.inventory(tenant_id);
