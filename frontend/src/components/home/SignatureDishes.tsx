import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../types';
import { menuService } from '../../services/menuService';
import { FoodCard } from '../menu/FoodCard';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { FoodCardSkeleton } from '../common/LoadingSkeleton';
import { ArrowRight } from 'lucide-react';

export const SignatureDishes: React.FC = () => {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignatureDishes = async () => {
      try {
        const allItems = await menuService.getMenuItems({ featured: true });
        setDishes(allItems.slice(0, 6));
      } catch (err) {
        console.error('Failed to load signature dishes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSignatureDishes();
  }, []);

  return (
    <section className="py-20 bg-[#1C1815] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="CHEF RECOMMENDATIONS"
          title="SIGNATURE FLAVORS"
          subtitle="Made for the flame. Crafted for the taste. Discover our most celebrated Pakistani specialties."
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dishes.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link to="/menu">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              EXPLORE FULL MENU (20+ ITEMS)
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
