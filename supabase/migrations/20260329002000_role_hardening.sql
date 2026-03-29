-- ===================================
-- ROLE HARDENING (Core RBAC by user_id)
-- ===================================

-- 1) Helper function to read role from profiles by auth user id
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.role
  FROM public.profiles p
  WHERE p.user_id = auth.uid()
  LIMIT 1;
$$;

-- 2) Do not trust role from client metadata during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    'technician'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) Harden customers write policies
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;

CREATE POLICY "Role-based insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND public.current_user_role() IN ('admin', 'cashier', 'technician')
  );

CREATE POLICY "Role-based update customers"
  ON public.customers FOR UPDATE
  USING (public.current_user_role() IN ('admin', 'cashier'));

-- 4) Harden service_units write policies
DROP POLICY IF EXISTS "Authenticated users can update service units" ON public.service_units;
DROP POLICY IF EXISTS "Authenticated users can insert service units" ON public.service_units;

CREATE POLICY "Role-based insert service units"
  ON public.service_units FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND public.current_user_role() IN ('admin', 'cashier', 'technician')
  );

CREATE POLICY "Role-based update service units"
  ON public.service_units FOR UPDATE
  USING (public.current_user_role() IN ('admin', 'technician'));

-- 5) Harden payments write policies
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON public.payments;

CREATE POLICY "Role-based insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND public.current_user_role() IN ('admin', 'cashier')
  );

-- 6) Harden inventory management policies
DROP POLICY IF EXISTS "Authenticated users can manage inventory" ON public.inventory;

CREATE POLICY "Role-based manage inventory"
  ON public.inventory FOR ALL
  USING (public.current_user_role() IN ('admin', 'cashier'));
