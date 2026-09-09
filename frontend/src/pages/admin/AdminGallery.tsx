import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { GalleryItem } from '../../types';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { Image as ImageIcon, Plus, Trash2, X, Upload, Check } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGallery();
      setGallery(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!imageFile && !imageUrl.trim())) {
      dispatch(addToast({ type: 'error', title: 'Missing Info', message: 'Please provide title and an image.' }));
      return;
    }

    setUploading(true);
    try {
      let payload: any;
      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('image', imageFile);
        payload = formData;
      } else {
        payload = {
          title,
          category,
          description,
          image: imageUrl
        };
      }

      const created = await adminService.createGalleryItem(payload);
      setGallery((prev) => [created, ...prev]);
      dispatch(
        addToast({
          type: 'success',
          title: 'Photo Added',
          message: `${title} has been uploaded to restaurant gallery.`,
        })
      );
      setIsModalOpen(false);
      setTitle('');
      setImageFile(null);
      setImagePreview('');
      setImageUrl('');
      setDescription('');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: err.message || 'Could not upload gallery photo.',
        })
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle}" from the gallery?`)) return;
    try {
      await adminService.deleteGalleryItem(id);
      setGallery((prev) => prev.filter((item) => item.id !== id && (item as any)._id !== id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Photo Removed',
          message: `${itemTitle} was removed from the gallery.`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err.message || 'Could not delete photo.',
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
            <ImageIcon size={24} className="text-[#C97845]" />
            Restaurant Visual Showcase
          </h1>
          <p className="text-xs text-[#BDB1A5] mt-1">
            Manage photo memories, rooftop ambiance, charcoal pits, and guest moments. Powered by Cloudinary.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={16} />}>
          Upload Photo
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#BDB1A5]">Loading gallery photos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {gallery.map((item) => {
            const itemId = (item as any)._id || item.id;
            return (
              <div
                key={itemId}
                className="group relative rounded-2xl bg-[#28221D] border border-[#51463D] overflow-hidden shadow-lg hover:border-[#51463D] transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#28221D]/80 backdrop-blur-md border border-[#51463D] text-[10px] font-bold uppercase text-[#C97845]">
                    {item.category}
                  </span>

                  <button
                    onClick={() => handleDelete(itemId, item.title)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-rose-400 hover:bg-rose-950/80 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-[11px] text-[#BDB1A5] line-clamp-2 mt-0.5">{item.description}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#51463D] flex items-center justify-between text-[10px] text-[#BDB1A5]">
                    <span>Cloudinary Storage</span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-[#28221D] border border-[#51463D] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#51463D]">
              <h3 className="text-base font-bold font-heading text-white">Upload New Photo</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded bg-[#332B25] text-[#BDB1A5] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[#BDB1A5] block mb-1">Photo Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sizzling Charcoal Tikka Skewers"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#332B25] border border-[#51463D] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[#BDB1A5] block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#332B25] border border-[#51463D] text-white focus:outline-none"
                >
                  <option value="food">Food & Delicacies</option>
                  <option value="restaurant">Restaurant & Dining</option>
                  <option value="ambiance">Wood-Fire Ambiance</option>
                  <option value="events">Celebrations & Rooftop</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-[#BDB1A5] block mb-1">Select File (Cloudinary)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-[#BDB1A5] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C97845]/10 file:text-[#C97845] hover:file:bg-[#C97845]/20 cursor-pointer"
                />
              </div>

              {imagePreview && (
                <div className="relative h-32 rounded-xl overflow-hidden border border-[#51463D]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="font-bold uppercase text-[#BDB1A5] block mb-1">Or Direct Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#332B25] border border-[#51463D] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[#BDB1A5] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief story or background behind the picture..."
                  className="w-full p-3 rounded-xl bg-[#332B25] border border-[#51463D] text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={uploading}>
                  {uploading ? 'Uploading to Cloudinary...' : 'Upload Photo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
