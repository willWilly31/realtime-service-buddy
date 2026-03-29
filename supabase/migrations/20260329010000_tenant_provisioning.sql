-- ===================================
-- TENANT PROVISIONING (Phase 3)
-- ===================================

-- 1) Invite table for explicit tenant assignment
CREATE TABLE IF NOT EXISTS public.tenant_user_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'technician', 'cashier')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired', 'revoked')),
  claimed_by UUID,
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email, status)
);

ALTER TABLE public.tenant_user_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant admins can manage invites" ON public.tenant_user_invites;
CREATE POLICY "Tenant admins can manage invites"
  ON public.tenant_user_invites FOR ALL
  USING (
    tenant_id = public.current_tenant_id()
    AND public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "Users can view own invites" ON public.tenant_user_invites;
CREATE POLICY "Users can view own invites"
  ON public.tenant_user_invites FOR SELECT
  USING (
    lower(email) = lower(auth.email())
    OR (tenant_id = public.current_tenant_id() AND public.current_user_role() = 'admin')
  );

-- 2) Harden handle_new_user to consume invite first (tenant + role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_tenant_id UUID;
  invite_record RECORD;
  assigned_role TEXT;
  assigned_tenant UUID;
BEGIN
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;

  SELECT i.id, i.tenant_id, i.role
  INTO invite_record
  FROM public.tenant_user_invites i
  WHERE lower(i.email) = lower(NEW.email)
    AND i.status = 'pending'
    AND (i.expires_at IS NULL OR i.expires_at > NOW())
  ORDER BY i.created_at DESC
  LIMIT 1;

  IF invite_record.id IS NOT NULL THEN
    assigned_role := invite_record.role;
    assigned_tenant := invite_record.tenant_id;

    UPDATE public.tenant_user_invites
    SET status = 'claimed', claimed_by = NEW.id, claimed_at = NOW()
    WHERE id = invite_record.id;
  ELSE
    assigned_role := 'technician';
    assigned_tenant := default_tenant_id;
  END IF;

  INSERT INTO public.profiles (user_id, full_name, email, role, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    assigned_role,
    assigned_tenant
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) Helper to create invites in controlled way
CREATE OR REPLACE FUNCTION public.create_tenant_invite(
  p_email TEXT,
  p_role TEXT,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS public.tenant_user_invites
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.tenant_user_invites;
BEGIN
  IF public.current_user_role() <> 'admin' THEN
    RAISE EXCEPTION 'only admin can create invite';
  END IF;

  INSERT INTO public.tenant_user_invites (tenant_id, email, role, expires_at, created_by)
  VALUES (public.current_tenant_id(), lower(trim(p_email)), p_role, p_expires_at, auth.uid())
  RETURNING * INTO v_invite;

  RETURN v_invite;
END;
$$;

-- 4) Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_invites_email ON public.tenant_user_invites(lower(email));
CREATE INDEX IF NOT EXISTS idx_tenant_invites_tenant_status ON public.tenant_user_invites(tenant_id, status);
