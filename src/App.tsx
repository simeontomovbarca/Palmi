import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Category, Product } from './lib/supabase';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category_id === selectedCategory));
    }
  }, [selectedCategory, products]);

  const loadData = async () => {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (categoriesData) setCategories(categoriesData);
    if (productsData) setProducts(productsData);

    setLoading(false);
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    await addToCart(product, quantity);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = async (formData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
  }) => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...formData,
        total_amount: total,
        status: 'pending'
      })
      .select()
      .maybeSingle();

    if (orderError || !orderData) {
      throw new Error('Failed to create order');
    }

    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error('Failed to create order items');
    }

    clearCart();
    setIsCheckoutOpen(false);
    setOrderSuccess(true);

    setTimeout(() => {
      setOrderSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Header cartItemCount={itemCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        {orderSuccess && (
          <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg">✓ Поръчката е приета успешно!</p>
            <p className="text-sm mt-1">Ще се свържем с вас скоро за потвърждение.</p>
          </div>
        )}

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Зареждане...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">Няма налични продукти в тази категория</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {isCartOpen && (
        <Cart
          cart={cart}
          total={total}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          cart={cart}
          total={total}
          onClose={() => setIsCheckoutOpen(false)}
          onSubmit={handleSubmitOrder}
        />
      )}
    </div>
  );
}

export default App;
