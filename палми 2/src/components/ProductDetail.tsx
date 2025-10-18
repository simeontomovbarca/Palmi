import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../lib/supabase';

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
};

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8 pt-0">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
                <span className="text-white text-2xl font-bold">Изчерпан</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h2>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <span className="text-5xl font-bold text-emerald-600">
                {product.price.toFixed(2)} лв
              </span>
              <p className="text-gray-500 mt-2">
                На склад: <span className="font-semibold">{product.stock_quantity}</span>
              </p>
            </div>

            {!isOutOfStock && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Количество:
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <span className="font-bold text-2xl text-gray-800 min-w-[3rem] text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Добави в количката</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
