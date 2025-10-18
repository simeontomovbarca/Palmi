import { ShoppingCart, Leaf } from 'lucide-react';

type HeaderProps = {
  cartItemCount: number;
  onCartClick: () => void;
};

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Зелен Рай</h1>
              <p className="text-sm text-emerald-100">Вашият магазин за растения</p>
            </div>
          </div>

          <button
            onClick={onCartClick}
            className="relative bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Количка</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
