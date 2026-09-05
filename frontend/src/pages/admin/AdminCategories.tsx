import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { FolderTree, Plus, Edit2, Trash2, X, Flame } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Flame');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Flame');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug || cat.id);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Flame');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editingCategory) {
        const idToUpdate = (editingCategory as any)._id || editingCategory.id;
        const updated = await categoryService.updateCategory(idToUpdate, {
          name,
          slug: generatedSlug,
          description,
          icon
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id || (c as any)._id === idToUpdate ? updated : c))
        );
        dispatch(
          addToast({
            type: 'success',
            title: 'Category Updated',
            message: `${name} updated successfully.`,
          })
        );
      } else {
        const created = await categoryService.createCategory({
          id: generatedSlug,
          name,
          slug: generatedSlug,
          description,
          icon
        });
        setCategories((prev) => [...prev, created]);
        dispatch(
          addToast({
            type: 'success',
            title: 'Category Created',
            message: `${name} added to menu categories.`,
          })
        );
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: err.message || 'Could not save category.',
        })
      );
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      const idToDelete = (cat as any)._id || cat.id;
      await categoryService.deleteCategory(idToDelete);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id && (c as any)._id !== idToDelete));
      dispatch(
        addToast({
          type: 'info',
          title: 'Category Deleted',
          message: `${cat.name} was removed.`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err.message || 'Could not delete category.',
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
            <FolderTree size={24} className="text-[#FF8A1F]" />
            Menu Category Management
          </h1>
          <p className="text-xs text-[#B8AAA0] mt-1">
            Organize live restaurant sections: Sajji, BBQ, Live Karahi, Rice, and Chef Specials.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal} leftIcon={<Plus size={16} />}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#B8AAA0]">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id || (cat as any)._id}
              className="p-5 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#FF8A1F]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#FF8A1F]">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold font-heading text-white text-sm">{cat.name}</h3>
                    <span className="text-[10px] text-[#FF8A1F] font-mono">/{cat.slug || cat.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg bg-white/5 text-[#B8AAA0] hover:text-white hover:bg-white/10"
                    title="Edit Category"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg bg-white/5 text-[#B8AAA0] hover:text-rose-400 hover:bg-rose-950/30"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#B8AAA0] line-clamp-2">
                {cat.description || 'Traditional wood-fire recipe collection.'}
              </p>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#B8AAA0]">
                <span>Key: <strong className="text-white">{cat.id}</strong></span>
                <span className="text-emerald-400 font-semibold">MongoDB Synced</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-[#120B08] border border-[#FF8A1F]/40 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#FF8A1F]/20">
              <h3 className="text-base font-bold font-heading text-white">
                {editingCategory ? 'Edit Menu Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded bg-[#1A100C] text-[#B8AAA0] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Mutton Shinwari Karahi"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[#B8AAA0] block mb-1">URL Slug / Key *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. karahi"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief summary of dishes under this category..."
                  className="w-full p-3 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
