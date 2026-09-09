import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MenuItem, Category } from '../types';
import { menuService } from '../services/menuService';
import { FoodCard } from '../components/menu/FoodCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { FoodCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import {
  Search,
  SlidersHorizontal,
  X,
  Flame,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpice, setSelectedSpice] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(5500);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, items] = await Promise.all([
          menuService.getCategories(),
          menuService.getMenuItems(),
        ]);
        setCategories(cats);
        setMenuItems(items);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSpice('all');
    setPriceRange(5500);
    setOnlyFeatured(false);
    setOnlyAvailable(true);
    setSortBy('recommended');
    searchParams.delete('cat');
    setSearchParams(searchParams);
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category Filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
        // Spice Filter
        if (selectedSpice !== 'all' && item.spiceLevel !== selectedSpice) {
          return false;
        }
        // Price Range
        if (item.price > priceRange) {
          return false;
        }
        // Featured
        if (onlyFeatured && !item.featured) {
          return false;
        }
        // Availability
        if (onlyAvailable && !item.available) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    menuItems,
    selectedCategory,
    searchQuery,
    selectedSpice,
    priceRange,
    onlyFeatured,
    onlyAvailable,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#1C1815] pt-28 pb-20 text-[#F3EDE5]">
      {/* Top Banner */}
      <div className="relative py-12 bg-gradient-to-b from-[#28221D] to-[#1C1815] border-b border-[#C97845]/15 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            badgeText="OUR COMPLETE CULINARY REPERTOIRE"
            title="AUTHENTIC FOOD MENU"
            subtitle="Explore our charcoal-roasted Sajji, sizzling Desi Ghee Karahi, juicy Seekh Kebabs, and Peshawari heritage specials."
            className="mb-6"
          />

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mt-6">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C97845]"
            />
            <input
              type="text"
              placeholder="Search dishes (e.g. Sajji, Karahi, Seekh Kebab, Pulao...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#332B25] border border-[#C97845]/30 text-[#F3EDE5] placeholder-[#BDB1A5] focus:outline-none focus:border-[#C97845] shadow-xl text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BDB1A5] hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle & Quick Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-[#28221D] border border-[#C97845]/20">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#332B25] border border-[#C97845]/30 text-sm font-semibold text-[#C97845]"
          >
            <Filter size={16} />
            <span>Filters & Categories</span>
          </button>

          <span className="text-xs text-[#BDB1A5]">
            Showing <strong className="text-white">{filteredItems.length}</strong> items
          </span>
        </div>

        {/* Main Grid: Sidebar + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#28221D] p-6 rounded-2xl border border-[#C97845]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#C97845]/15">
              <h3 className="font-bold font-heading text-lg text-[#F3EDE5] flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#C97845]" />
                Filters
              </h3>
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#D6A15D] hover:text-[#C97845] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Categories List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] mb-3">
                Categories
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      selectedCategory === cat.id
                        ? 'bg-[#332B25] text-[#C97845] font-bold border border-[#C97845]/30'
                        : 'text-[#BDB1A5] hover:text-white hover:bg-[#332B25]/50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-[#51463D]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5]">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-[#C97845]">
                  Rs. {priceRange.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={5500}
                step={100}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#C97845] cursor-pointer"
              />
            </div>

            {/* Spice Level */}
            <div className="pt-4 border-t border-[#51463D]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] mb-2.5">
                Spice Level
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'Mild', 'Medium', 'Hot'].map((spice) => (
                  <button
                    key={spice}
                    onClick={() => setSelectedSpice(spice)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSpice === spice
                        ? 'bg-[#C97845]/20 text-[#C97845] border border-[#C97845]/40'
                        : 'bg-[#332B25] text-[#BDB1A5] hover:text-white'
                    }`}
                  >
                    {spice === 'all' ? 'All Spices' : spice}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-[#51463D] space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-[#F3EDE5] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="rounded border-[#C97845]/40 text-[#C97845] focus:ring-[#C97845] bg-[#332B25]"
                />
                <span>Featured Specials Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#F3EDE5] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded border-[#C97845]/40 text-[#C97845] focus:ring-[#C97845] bg-[#332B25]"
                />
                <span>In Stock & Ready</span>
              </label>
            </div>
          </aside>

          {/* Product Items Area */}
          <main className="lg:col-span-9">
            {/* Header / Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#C97845]/15">
              <div className="text-sm text-[#BDB1A5]">
                Showing <span className="font-bold text-white">{filteredItems.length}</span> signature dishes
                {selectedCategory !== 'all' && (
                  <span className="ml-1 text-[#C97845]">in {selectedCategory.toUpperCase()}</span>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#BDB1A5]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#332B25] border border-[#C97845]/30 text-[#F3EDE5] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C97845]"
                >
                  <option value="recommended">Featured / Chef Picks</option>
                  <option value="rating">Highest Rated (★ 5.0)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Dishes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <FoodCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <EmptyState
                title="No Dishes Matched Your Filter"
                description="Try adjusting your search query, spice preference, or selecting another category."
                actionText="Reset Filters"
                onAction={resetAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((dish) => (
                  <FoodCard key={dish.id} item={dish} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#28221D] border-t border-[#C97845]/40 p-6 rounded-t-3xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#C97845]/20">
              <h3 className="text-lg font-bold font-heading text-white">Menu Categories & Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg bg-[#332B25] text-[#BDB1A5] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-[#BDB1A5] uppercase tracking-wider mb-2">Category</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#C97845] text-black font-bold'
                        : 'bg-[#332B25] text-[#F3EDE5] border border-[#51463D]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Apply Filters ({filteredItems.length} Dishes)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
