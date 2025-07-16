
-- Create enum types for user roles and product forms
CREATE TYPE user_role AS ENUM ('admin', 'business_owner', 'assistant');
CREATE TYPE product_form AS ENUM ('boxes', 'pcs', 'dozen', 'bag', 'rolls', 'meters', 'kg');

-- Create users table (extends Supabase auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'business_owner',
  name TEXT NOT NULL,
  business_name TEXT,
  location TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  form product_form NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assistants table (relationship between business owners and assistants)
CREATE TABLE public.assistants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_access UUID[] DEFAULT ARRAY[]::UUID[],
  is_active BOOLEAN DEFAULT true,
  is_muted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assistant_id, business_owner_id)
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  quantity_change INTEGER DEFAULT 0,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_registrations table for admin approvals
CREATE TABLE public.business_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for stores table
CREATE POLICY "Business owners can manage their stores" ON public.stores
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Assistants can view assigned stores" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assistants a
      WHERE a.assistant_id = auth.uid() 
      AND a.is_active = true
      AND id = ANY(a.store_access)
    )
  );

-- Create RLS policies for products table
CREATE POLICY "Business owners can manage their products" ON public.products
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Assistants can view and update products in assigned stores" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assistants a
      WHERE a.assistant_id = auth.uid() 
      AND a.is_active = true
      AND store_id = ANY(a.store_access)
    )
  );

CREATE POLICY "Assistants can update product quantities" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.assistants a
      WHERE a.assistant_id = auth.uid() 
      AND a.is_active = true
      AND a.is_muted = false
      AND store_id = ANY(a.store_access)
    )
  );

-- Create RLS policies for assistants table
CREATE POLICY "Business owners can manage their assistants" ON public.assistants
  FOR ALL USING (auth.uid() = business_owner_id);

CREATE POLICY "Assistants can view their assignments" ON public.assistants
  FOR SELECT USING (auth.uid() = assistant_id);

-- Create RLS policies for activity_logs table
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view assistant activities" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assistants a
      WHERE a.business_owner_id = auth.uid()
      AND a.assistant_id = activity_logs.user_id
    )
  );

CREATE POLICY "Users can insert their own activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for business_registrations table
CREATE POLICY "Admins can manage business registrations" ON public.business_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'business_owner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log product activities
CREATE OR REPLACE FUNCTION public.log_product_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.quantity != NEW.quantity THEN
    INSERT INTO public.activity_logs (
      user_id, action, product_id, store_id, 
      quantity_change, previous_quantity, new_quantity,
      details
    ) VALUES (
      auth.uid(),
      CASE 
        WHEN NEW.quantity > OLD.quantity THEN 'Product restocked'
        ELSE 'Product removed'
      END,
      NEW.id,
      NEW.store_id,
      NEW.quantity - OLD.quantity,
      OLD.quantity,
      NEW.quantity,
      jsonb_build_object(
        'product_name', NEW.name,
        'color', NEW.color,
        'category', NEW.category
      )
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (
      user_id, action, product_id, store_id,
      quantity_change, new_quantity,
      details
    ) VALUES (
      auth.uid(),
      'Product added',
      NEW.id,
      NEW.store_id,
      NEW.quantity,
      NEW.quantity,
      jsonb_build_object(
        'product_name', NEW.name,
        'color', NEW.color,
        'category', NEW.category
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for product activity logging
CREATE TRIGGER log_product_changes
  AFTER INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.log_product_activity();

-- Create indexes for better performance
CREATE INDEX idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_owner_id ON public.products(owner_id);
CREATE INDEX idx_assistants_business_owner_id ON public.assistants(business_owner_id);
CREATE INDEX idx_assistants_assistant_id ON public.assistants(assistant_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs(timestamp);
CREATE INDEX idx_activity_logs_store_id ON public.activity_logs(store_id);
