import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Category } from '../../types';
import { menuService } from '../../services/menuService';
import { FoodCard } from '../menu/FoodCard';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { FoodCardSkeleton } from '../common/LoadingSkeleton';
import { ArrowRight, Flame } from 'lucide-react';

export const MenuPreview: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await menuService.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCategoryItems = async () => {
      setLoading(true);
      try {
        const fetched = await menuService.getMenuItems({
          category: selectedCategory,
        });
        setItems(fetched.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    loadCategoryItems();
  }, [selectedCategory]);

  return (
    <section className="py-20 bg-[#28221D] border-t border-[#51463D]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="SAVOR THE FLAME"
          title="EXPLORE OUR MENU"
          subtitle="From whole skewered Sajji to bubbling Shinwari Karahis, choose your favorite category."
        />

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#C97845] text-[#F3EDE5] shadow-md shadow-black/20 scale-105'
                  : 'bg-[#332B25] text-[#BDB1A5] hover:text-[#F3EDE5] hover:bg-[#3D332C] border border-[#51463D]'
              }`}
            >
              {selectedCategory === cat.id && <Flame size={14} className="fill-[#F3EDE5] text-[#F3EDE5]" />}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* View Full Menu Button */}
        <div className="mt-12 text-center">
          <Link to={`/menu?cat=${selectedCategory}`}>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={16} />}
            >
              VIEW ALL {selectedCategory !== 'all' ? selectedCategory.toUpperCase() : ''} DISHES
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
