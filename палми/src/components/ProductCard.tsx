import { ShoppingCart } from 'lucide-react';
import type { Product } from '../lib/supabase';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="relative h-64 overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-xl font-bold">Изчерпан</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-emerald-600 cursor-pointer" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-emerald-600">
              {product.price.toFixed(2)} лв
            </span>
            <p className="text-xs text-gray-500 mt-1">
              На склад: {product.stock_quantity}
            </p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Добави</span>
          </button>
        </div>
      </div>
    </div>
  );
}
