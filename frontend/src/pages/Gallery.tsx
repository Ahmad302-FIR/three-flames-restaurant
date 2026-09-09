import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { adminService } from '../services/adminService';
import { GalleryItem } from '../types';
import { X, ZoomIn, Flame } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await adminService.getGallery();
        setGalleryItems(data);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'sajji', label: 'Flame Sajji' },
    { id: 'bbq', label: 'Charcoal BBQ' },
    { id: 'karahi', label: 'Karahi & Handi' },
    { id: 'restaurant', label: 'Dining & Ambiance' },
  ];

  const filteredItems = galleryItems.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#1C1815] pt-28 pb-20 text-[#F3EDE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="VISUAL FEAST"
          title="AHMED KHAN GALLERY"
          subtitle="Explore the glowing embers, rooftop sunsets, sizzling platters, and joyful family gatherings in Peshawar."
        />

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2.5 my-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#C97845] to-[#C97845] text-black shadow-lg shadow-[#C97845]/20 scale-105'
                  : 'bg-[#28221D] text-[#BDB1A5] hover:text-white border border-[#51463D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActiveItem(photo)}
              className="group relative rounded-2xl overflow-hidden bg-[#28221D] border border-[#51463D] hover:border-[#51463D] cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#C97845]/20 transition-all duration-300 h-64"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] uppercase font-bold text-[#C97845] tracking-wider">
                  {photo.category}
                </span>
                <h4 className="text-sm font-bold font-heading text-white">{photo.title}</h4>
                <p className="text-[11px] text-[#BDB1A5] line-clamp-1">{photo.description}</p>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                  <ZoomIn size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div
              className="fixed inset-0"
              onClick={() => setActiveItem(null)}
            />
            <div className="relative z-10 max-w-4xl w-full rounded-3xl bg-[#28221D] border border-[#51463D] overflow-hidden shadow-2xl">
              <div className="relative max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full max-h-[70vh] object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-[#C97845] transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 bg-[#332B25] border-t border-[#51463D] flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-[#C97845] tracking-wider">
                    {activeItem.category}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">{activeItem.title}</h3>
                  <p className="text-xs text-[#BDB1A5] mt-1">{activeItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
