import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../lib/supabase';

type CartProps = {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  total: number;
};

export function Cart({ cart, onClose, onUpdateQuantity, onRemoveItem, onCheckout, total }: CartProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Вашата количка</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-emerald-700 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Количката е празна</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.product.name}</h3>
                    <p className="text-emerald-600 font-semibold text-lg mt-1">
                      {item.product.price.toFixed(2)} лв
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Общо:</p>
                    <p className="font-bold text-gray-800 text-xl">
                      {(item.product.price * item.quantity).toFixed(2)} лв
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-800">Общо:</span>
              <span className="text-3xl font-bold text-emerald-600">
                {total.toFixed(2)} лв
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Поръчай
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
