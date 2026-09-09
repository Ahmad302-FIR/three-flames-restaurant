import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';
import { MenuItem } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Flame,
  Star,
  Upload,
} from 'lucide-react';

export const AdminMenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sajji');
  const [price, setPrice] = useState(1800);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [serving, setServing] = useState('2-3 Persons');
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot'>('Medium');
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenuItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('sajji');
    setPrice(1800);
    setDescription('');
    setImage('');
    setImageFile(null);
    setImagePreview('');
    setServing('2-3 Persons');
    setSpiceLevel('Medium');
    setFeatured(false);
    setAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setDescription(item.description);
    setImage(item.image);
    setImageFile(null);
    setImagePreview(item.image);
    setServing(item.serving);
    setSpiceLevel((item.spiceLevel as any) || 'Medium');
    setFeatured(!!item.featured);
    setAvailable(item.available);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    if (!editingItem && !imageFile) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Image Required',
          message: 'Please select a dish image from your computer to upload.',
        })
      );
      return;
    }

    setUploading(true);
    try {
      if (editingItem) {
        let payload: any;
        if (imageFile) {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('category', category);
          formData.append('price', String(price));
          formData.append('description', description);
          formData.append('serving', serving);
          formData.append('spiceLevel', spiceLevel);
          formData.append('featured', String(featured));
          formData.append('available', String(available));
          formData.append('image', imageFile);
          payload = formData;
        } else {
          payload = {
            name,
            category,
            price,
            description,
            image,
            serving,
            spiceLevel,
            featured,
            available,
          };
        }

        const updated = await menuService.updateMenuItem(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        dispatch(
          addToast({
            type: 'success',
            title: 'Dish Updated',
            message: `${updated.name} has been updated. Image saved to Cloudinary.`,
          })
        );
      } else {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', String(price));
        formData.append('description', description);
        formData.append('serving', serving);
        formData.append('spiceLevel', spiceLevel);
        formData.append('featured', String(featured));
        formData.append('available', String(available));
        formData.append('prepTime', '25-35 mins');
        formData.append('rating', '4.9');
        formData.append('reviewsCount', '1');
        formData.append('tags', JSON.stringify([category, 'charcoal', 'bbq']));
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const created = await menuService.createMenuItem(formData);
        setItems((prev) => [created, ...prev]);
        dispatch(
          addToast({
            type: 'success',
            title: 'New Dish Added',
            message: `${created.name} added to menu with Cloudinary image.`,
          })
        );
      }
      setIsModalOpen(false);
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: err.message || 'Could not save menu item.',
        })
      );
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    try {
      const updated = await menuService.updateMenuItem(item.id, {
        available: !item.available,
      });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      dispatch(
        addToast({
          type: updated.available ? 'success' : 'info',
          title: updated.available ? 'Dish Available' : 'Marked Out of Stock',
          message: `${item.name} status updated.`,
        })
      );
    } catch (e) {}
  };

  const handleDeleteItem = async (id: string, itemName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${itemName}" from the menu?`)) return;
    try {
      await menuService.deleteMenuItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Dish Removed',
          message: `${itemName} was deleted.`,
        })
      );
    } catch (e) {}
  };

  const filteredItems = items.filter((it) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <UtensilsCrossed size={24} className="text-[#B85C38]" />
            Menu Catalog Management
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Configure dish prices, descriptions, add-ons, availability, and featured flags.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus size={16} />}
        >
          Add New Dish
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search menu items by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#E8DED6]"
          />
        </div>
        <span className="text-xs text-[#6F6761]">
          Total: <strong className="text-[#25201D]">{filteredItems.length}</strong> items
        </span>
      </div>

      {/* Dishes Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EE] text-[#6F6761] font-bold uppercase tracking-wider text-[11px] border-b border-[#E8DED6]">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Serving</th>
                <th className="p-4">Spice</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DED6]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F3EE]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E8DED6] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-[#25201D] block text-sm">{item.name}</span>
                        {item.featured && (
                          <span className="text-[10px] text-[#B85C38] font-semibold">
                            ★ Featured Special
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 uppercase font-bold text-[#B85C38]">{item.category}</td>
                  <td className="p-4 font-bold text-[#25201D]">Rs. {item.price.toLocaleString()}</td>
                  <td className="p-4 text-[#6F6761]">{item.serving}</td>
                  <td className="p-4">🌶️ {item.spiceLevel || 'Medium'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStock(item)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        item.available
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {item.available ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-[#B85C38] transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-rose-400 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-xl w-full rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DED6]">
              <h3 className="text-lg font-bold font-heading text-[#25201D]">
                {editingItem ? 'Edit Culinary Dish' : 'Create New Menu Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                  Dish Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Peshawar Namak Mandi Tikka"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] font-medium focus:outline-none focus:border-[#B85C38]"
                  >
                    <option value="sajji" className="bg-[#FFFFFF] text-[#25201D]">Sajji Specialties</option>
                    <option value="bbq" className="bg-[#FFFFFF] text-[#25201D]">Charcoal BBQ Skewers</option>
                    <option value="karahi" className="bg-[#FFFFFF] text-[#25201D]">Shinwari & Handi</option>
                    <option value="rice" className="bg-[#FFFFFF] text-[#25201D]">Kabuli Pulao & Rice</option>
                    <option value="platters" className="bg-[#FFFFFF] text-[#25201D]">Family Platters</option>
                    <option value="sides" className="bg-[#FFFFFF] text-[#25201D]">Naan & Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                  Dish Image (Select from Computer / Gallery) *
                </label>
                
                <div className="border-2 border-dashed border-[#E8DED6] hover:border-[#E8DED6] transition-colors rounded-2xl p-4 bg-[#F7F3EE]/60 flex flex-col sm:flex-row items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E8DED6] flex-shrink-0 group">
                      <img src={imagePreview} alt="Dish Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white text-center font-bold px-1">
                        Selected Image
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed border-[#E8DED6] bg-[#FFFFFF] flex flex-col items-center justify-center text-[#6F6761] flex-shrink-0">
                      <Upload className="w-6 h-6 text-[#B85C38]/60 mb-1" />
                      <span className="text-[10px]">No file</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B85C38]/15 hover:bg-[#B85C38]/25 text-[#B85C38] border border-[#E8DED6] cursor-pointer font-bold text-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{imagePreview ? 'Change Image from Computer' : 'Choose Dish Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#6F6761]/80">
                      {imageFile
                        ? `Selected: ${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)`
                        : editingItem
                        ? 'Using current dish photo. Click above to replace it.'
                        : 'Select JPEG, PNG, or WEBP from your device. It will be uploaded to Cloudinary.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe secret marinades, coal roasting method, and taste profile..."
                  className="w-full p-3 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                    Serving Size
                  </label>
                  <input
                    type="text"
                    value={serving}
                    onChange={(e) => setServing(e.target.value)}
                    placeholder="e.g. 2-3 Persons / 1kg"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[#6F6761] block mb-1">
                    Spice Intensity
                  </label>
                  <select
                    value={spiceLevel}
                    onChange={(e: any) => setSpiceLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] font-medium focus:outline-none focus:border-[#B85C38]"
                  >
                    <option value="Mild" className="bg-[#FFFFFF] text-[#25201D]">Mild</option>
                    <option value="Medium" className="bg-[#FFFFFF] text-[#25201D]">Medium</option>
                    <option value="Hot" className="bg-[#FFFFFF] text-[#25201D]">Hot</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-[#F7F3EE] border-[#E8DED6] text-[#B85C38]"
                  />
                  <span>Mark as Chef Featured Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded bg-[#F7F3EE] border-[#E8DED6] text-[#B85C38]"
                  />
                  <span>Available in Kitchen Stock</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={uploading}>
                  {uploading ? 'Uploading to Cloudinary...' : (editingItem ? 'Save Changes' : 'Create Dish')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
