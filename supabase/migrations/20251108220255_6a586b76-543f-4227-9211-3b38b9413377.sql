-- ===================================
-- DM REPAIR SERVICE MANAGEMENT SYSTEM
-- Production-Ready Database Schema
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- PROFILES TABLE
-- ===================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'technician' CHECK (role IN ('admin', 'technician', 'cashier')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===================================
-- CUSTOMERS TABLE
-- ===================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers"
  ON public.customers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ===================================
-- SERVICE UNITS TABLE
-- ===================================
CREATE TABLE public.service_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  imei TEXT,
  password TEXT,
  cosmetic_condition TEXT,
  issue_description TEXT NOT NULL,
  estimated_cost DECIMAL(12,2),
  final_cost DECIMAL(12,2),
  technician_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'waiting-parts', 'completed', 'cancelled', 'customer-confirmed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  checkin_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estimated_completion TIMESTAMPTZ,
  actual_completion TIMESTAMPTZ,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.service_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view service units"
  ON public.service_units FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert service units"
  ON public.service_units FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update service units"
  ON public.service_units FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ===================================
-- PAYMENTS TABLE
-- ===================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_unit_id UUID NOT NULL REFERENCES public.service_units(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('dp', 'full', 'remaining')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'qris', 'debit', 'credit')),
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view payments"
  ON public.payments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- ===================================
-- INVENTORY TABLE
-- ===================================
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit_price DECIMAL(12,2) NOT NULL,
  supplier TEXT,
  min_stock INTEGER DEFAULT 5,
  location TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage inventory"
  ON public.inventory FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ===================================
-- SERVICE PARTS TABLE (Parts used in service)
-- ===================================
CREATE TABLE public.service_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_unit_id UUID NOT NULL REFERENCES public.service_units(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_used DECIMAL(12,2) NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.service_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view service parts"
  ON public.service_parts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage service parts"
  ON public.service_parts FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ===================================
-- ACTIVITY LOGS TABLE
-- ===================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_unit_id UUID REFERENCES public.service_units(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===================================
-- TRIGGERS FOR UPDATED_AT
-- ===================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_units_updated_at
  BEFORE UPDATE ON public.service_units
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================================
-- TRIGGER FOR AUTO-CREATE PROFILE
-- ===================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'technician')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================
CREATE INDEX idx_service_units_customer ON public.service_units(customer_id);
CREATE INDEX idx_service_units_technician ON public.service_units(technician_id);
CREATE INDEX idx_service_units_status ON public.service_units(status);
CREATE INDEX idx_service_units_checkin_date ON public.service_units(checkin_date DESC);
CREATE INDEX idx_payments_service_unit ON public.payments(service_unit_id);
CREATE INDEX idx_service_parts_service_unit ON public.service_parts(service_unit_id);
CREATE INDEX idx_service_parts_inventory ON public.service_parts(inventory_id);
CREATE INDEX idx_activity_logs_service_unit ON public.activity_logs(service_unit_id);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);

-- ===================================
-- ENABLE REALTIME
-- ===================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_units;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;