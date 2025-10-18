import type { Category } from '../lib/supabase';

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Категории</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Всички
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
