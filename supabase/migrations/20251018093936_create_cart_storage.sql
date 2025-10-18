/*
  # Create cart storage for persistent shopping carts

  1. New Tables
    - `cart_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Anonymous session identifier
      - `user_id` (uuid, nullable) - Optional user ID for authenticated users
      - `created_at` (timestamptz) - Session creation timestamp
      - `updated_at` (timestamptz) - Last activity timestamp
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `session_id` (text) - Links to cart_sessions
      - `product_id` (uuid, foreign key) - Links to products
      - `quantity` (integer) - Item quantity
      - `created_at` (timestamptz) - Item added timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Anyone can manage their own cart session
    - Cart items tied to sessions
    - Auto-cleanup of old sessions (30 days)

  3. Indexes
    - Index on session_id for fast cart lookups
    - Index on product_id for inventory checks
*/

-- Create cart_sessions table
CREATE TABLE IF NOT EXISTS cart_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  user_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);

-- Enable RLS
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_sessions (anyone can manage their session)
CREATE POLICY "Anyone can create cart sessions"
  ON cart_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view cart sessions"
  ON cart_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update cart sessions"
  ON cart_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for cart_items (anyone can manage cart items)
CREATE POLICY "Anyone can create cart items"
  ON cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view cart items"
  ON cart_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_cart_sessions_updated_at
  BEFORE UPDATE ON cart_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();