import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  slug: string;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status?: string;
  created_at?: string;
};

export type OrderItem = {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at?: string;
};
