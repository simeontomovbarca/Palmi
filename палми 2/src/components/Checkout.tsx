import { X } from 'lucide-react';
import { useState } from 'react';
import type { CartItem } from '../lib/supabase';

type CheckoutProps = {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onSubmit: (formData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
  }) => Promise<void>;
};

export function Checkout({ cart, total, onClose, onSubmit }: CheckoutProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Възникна грешка при обработка на поръчката. Моля, опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Финализиране на поръчка</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-emerald-700 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Вашата поръчка:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {(item.product.price * item.quantity).toFixed(2)} лв
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-800">Общо:</span>
                <span className="font-bold text-emerald-600 text-lg">
                  {total.toFixed(2)} лв
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Име и фамилия *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-semibold text-gray-700 mb-2">
                Имейл *
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Телефон *
              </label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-700 mb-2">
                Адрес за доставка *
              </label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Обработва се...' : 'Потвърди поръчката'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
