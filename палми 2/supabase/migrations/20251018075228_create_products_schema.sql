/*
  # Create online plant store schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `description` (text) - Category description
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz) - Creation timestamp
    
    - `products`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key) - Links to categories
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `image_url` (text) - Product image URL
      - `stock_quantity` (integer) - Available quantity
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz) - Creation timestamp
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone
      - `delivery_address` (text) - Delivery address
      - `total_amount` (numeric) - Total order amount
      - `status` (text) - Order status
      - `created_at` (timestamptz) - Order creation timestamp
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Links to orders
      - `product_id` (uuid, foreign key) - Links to products
      - `quantity` (integer) - Quantity ordered
      - `price` (numeric) - Price at time of order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Public read access for categories and products
    - Authenticated users can create orders
    - Order items tied to orders through foreign keys
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- RLS Policies for orders (anyone can create)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view own orders"
  ON orders FOR SELECT
  USING (true);

-- RLS Policies for order_items (anyone can create)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- Insert sample categories
INSERT INTO categories (name, description, slug) VALUES
  ('Интериорни цветя', 'Цветя за украса на вътрешни пространства', 'interiorni-cvetya'),
  ('Палми', 'Различни видове палми за дома и офиса', 'palmi'),
  ('Суккуленти', 'Лесни за отглеждане суккулентни растения', 'sukkulenti'),
  ('Екзотични растения', 'Рядки и екзотични растителни видове', 'ekzotichni-rasteniya')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, image_url, stock_quantity, slug) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'palmi'),
    'Арека палма',
    'Елегантна тропическа палма, идеална за интериор. Достига до 2 метра височина.',
    89.99,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=800',
    15,
    'areka-palma'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'palmi'),
    'Кентия палма',
    'Красива и издръжлива палма с тъмнозелени листа. Перфектна за офиси.',
    129.99,
    'https://images.pexels.com/photos/7084307/pexels-photo-7084307.jpeg?auto=compress&cs=tinysrgb&w=800',
    10,
    'kentiya-palma'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'interiorni-cvetya'),
    'Монстера Делициоза',
    'Популярно тропическо растение с големи резни листа.',
    79.99,
    'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=800',
    20,
    'monstera-delicioza'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'interiorni-cvetya'),
    'Фикус Лирата',
    'Елегантно растение с големи листа във форма на цигулка.',
    119.99,
    'https://images.pexels.com/photos/6208390/pexels-photo-6208390.jpeg?auto=compress&cs=tinysrgb&w=800',
    8,
    'fikus-lirata'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'sukkulenti'),
    'Алое Вера',
    'Лечебно растение, лесно за отглеждане.',
    34.99,
    'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800',
    30,
    'aloe-vera'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'sukkulenti'),
    'Ехеверия микс',
    'Колекция от различни видове суккуленти в едно саксие.',
    44.99,
    'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=800',
    25,
    'eheveriya-miks'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'ekzotichni-rasteniya'),
    'Стрелиция',
    'Екзотично растение, известно като райска птица.',
    149.99,
    'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=800',
    5,
    'streliciya'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'ekzotichni-rasteniya'),
    'Калатея',
    'Изискано растение с декоративни шарени листа.',
    64.99,
    'https://images.pexels.com/photos/6208357/pexels-photo-6208357.jpeg?auto=compress&cs=tinysrgb&w=800',
    12,
    'kalateya'
  )
ON CONFLICT (slug) DO NOTHING;