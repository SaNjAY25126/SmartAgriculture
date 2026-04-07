-- SUPABASE SCHEMA FOR SMART AGRICULTURE MANAGEMENT SYSTEM

-- 1. Profiles Table (Stores user metadata)
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- Removed REFERENCES auth.users to allow simulation seeding
  username TEXT UNIQUE,
  role TEXT DEFAULT 'farmer',
  name TEXT,
  village TEXT,
  phone TEXT,
  land_area TEXT,
  email TEXT,
  password TEXT, -- WARNING: Storing plain-text passwords is highly insecure. For simulation only.
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER DEFAULT 0,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  farmer_name TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  quantity INTEGER NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Crop Plans Table
CREATE TABLE crop_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  season TEXT,
  area TEXT,
  expected_yield TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Water Records Table
CREATE TABLE water_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  source TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_records ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RELAX RLS FOR DEMO/SIMULATION MODE
-- ==========================================
-- These policies allow the 'public' (anon) role to perform all actions
-- to support the simulation mode where users might not be in Supabase Auth.
-- IMPORTANT: In a production app, these should be restricted to authenticated users.

CREATE POLICY "Profiles: Public access" ON profiles FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Products: Public access" ON products FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Orders: Public access" ON orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Crop Plans: Public access" ON crop_plans FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Water Records: Public access" ON water_records FOR ALL TO public USING (true) WITH CHECK (true);

-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role, password, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    NEW.raw_user_meta_data->>'password', -- Capturing password from metadata
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- SEED DATA FOR SIMULATION
-- ==========================================

-- 1. Seed Profiles (Note: In a real app, these would link to auth.users)
-- We use fixed UUIDs for consistent seeding
INSERT INTO profiles (id, username, role, name, village, phone, land_area, email, password) VALUES
('00000000-0000-0000-0000-000000000001', 'admin_user', 'admin', 'System Administrator', 'Central Hub', '9998887776', 'N/A', 'admin@smartagri.com', 'admin123'),
('00000000-0000-0000-0000-000000000002', 'dealer_north', 'dealer', 'North Fertilizer Co.', 'North Sector', '8887776665', 'N/A', 'dealer1@smartagri.com', 'dealer123'),
('00000000-0000-0000-0000-000000000003', 'dealer_south', 'dealer', 'South Agri Supplies', 'South Sector', '7776665554', 'N/A', 'dealer2@smartagri.com', 'dealer456'),
('00000000-0000-0000-0000-000000000004', 'farmer_ram', 'farmer', 'Ram Singh', 'Green Village', '6665554443', '10', 'ram@farm.com', 'ram123'),
('00000000-0000-0000-0000-000000000005', 'farmer_shyam', 'farmer', 'Shyam Kumar', 'River Valley', '5554443332', '15', 'shyam@farm.com', 'shyam123'),
('00000000-0000-0000-0000-000000000006', 'farmer_anita', 'farmer', 'Anita Devi', 'Hill Top', '4443332221', '8', 'anita@farm.com', 'anita123'),
('00000000-0000-0000-0000-000000000007', 'farmer_vijay', 'farmer', 'Vijay Pratap', 'Green Village', '3332221110', '12', 'vijay@farm.com', 'vijay123'),
('00000000-0000-0000-0000-000000000008', 'farmer_meena', 'farmer', 'Meena Kumari', 'River Valley', '2221110009', '5', 'meena@farm.com', 'meena123'),
('00000000-0000-0000-0000-000000000009', 'farmer_rahul', 'farmer', 'Rahul Sharma', 'Hill Top', '1110009998', '20', 'rahul@farm.com', 'rahul123'),
('00000000-0000-0000-0000-000000000010', 'farmer_geeta', 'farmer', 'Geeta Patil', 'Green Village', '0009998887', '7', 'geeta@farm.com', 'geeta123');

-- 2. Seed 20 Products
INSERT INTO products (name, price, quantity, description, category) VALUES
('Urea Premium', 450, 150, 'High nitrogen fertilizer for rapid growth.', 'Nitrogenous'),
('DAP Gold', 1200, 80, 'Excellent source of phosphorus and nitrogen.', 'Phosphatic'),
('MOP Standard', 850, 120, 'Potassium rich for disease resistance.', 'Potassic'),
('NPK 19-19-19', 1500, 40, 'Balanced nutrition for all crops.', 'Complex'),
('Organic Compost', 300, 300, 'Natural soil conditioner.', 'Organic'),
('Zinc Sulphate', 600, 25, 'Essential micronutrient for crops.', 'Micronutrient'),
('Boron 20%', 750, 15, 'Improves flowering and fruit setting.', 'Micronutrient'),
('Magnesium Sulphate', 400, 60, 'Corrects magnesium deficiency.', 'Secondary'),
('Sulphur 80% WDG', 550, 45, 'Fungicidal and nutrient properties.', 'Secondary'),
('Ammonium Phosphate', 1100, 30, 'Dual nutrient source.', 'Complex'),
('Calcium Nitrate', 950, 20, 'Water soluble calcium and nitrogen.', 'Secondary'),
('Potassium Nitrate', 1300, 10, 'High quality potassium source.', 'Potassic'),
('Bio-Fertilizer Azotobacter', 250, 100, 'Nitrogen fixing bacteria.', 'Bio-Fertilizer'),
('Phosphate Solubilizing Bacteria', 250, 100, 'Improves P availability.', 'Bio-Fertilizer'),
('Neem Cake', 350, 200, 'Natural pesticide and fertilizer.', 'Organic'),
('Vermicompost', 400, 150, 'Rich in organic matter.', 'Organic'),
('Single Super Phosphate', 500, 90, 'Cost effective P source.', 'Phosphatic'),
('Liquid Seaweed Extract', 800, 50, 'Growth stimulant.', 'Organic'),
('Humic Acid Liquid', 700, 40, 'Improves soil structure.', 'Organic'),
('Chelated Iron', 900, 12, 'Corrects iron chlorosis.', 'Micronutrient');

-- 3. Seed 3 Initial Orders
INSERT INTO orders (farmer_id, farmer_name, product_id, product_name, quantity, total_price, status) VALUES
('00000000-0000-0000-0000-000000000004', 'farmer_ram', (SELECT id FROM products WHERE name = 'Urea Premium'), 'Urea Premium', 2, 900, 'completed'),
('00000000-0000-0000-0000-000000000005', 'farmer_shyam', (SELECT id FROM products WHERE name = 'DAP Gold'), 'DAP Gold', 1, 1200, 'processing'),
('00000000-0000-0000-0000-000000000006', 'farmer_anita', (SELECT id FROM products WHERE name = 'NPK 19-19-19'), 'NPK 19-19-19', 3, 4500, 'pending');

-- 4. Seed 5 Water Records for each Farmer (7 farmers)
INSERT INTO water_records (farmer_id, amount, source, date)
SELECT 
  p.id, 
  (random() * 2000 + 500)::int, 
  (ARRAY['Canal', 'Tube Well', 'Rainwater', 'River'])[floor(random() * 4 + 1)],
  NOW() - (interval '1 day' * generate_series(1, 5))
FROM profiles p
WHERE p.role = 'farmer';
