import { MenuItem } from '../models/MenuItem.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, featured, available } = req.query;
    const filter = {};

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } }
      ];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Menu items retrieved', items);
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await MenuItem.findById(id);
    }

    if (!item) {
      item = await MenuItem.findOne({ slug: id.toLowerCase() });
    }

    if (!item) {
      return sendError(res, 404, 'Culinary item not found.');
    }

    return sendSuccess(res, 200, 'Menu item retrieved', item);
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      originalPrice,
      serving,
      prepTime,
      spiceLevel,
      featured,
      available,
      isSpecial,
      tags,
      ingredients,
      addOns
    } = req.body;

    let imageUrl = req.body.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
    let publicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'three-flames/menu');
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    // Generate unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await MenuItem.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients || [];
    const parsedAddOns = typeof addOns === 'string' ? JSON.parse(addOns) : addOns || [];

    const newItem = await MenuItem.create({
      name,
      slug,
      category,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: imageUrl,
      imagePublicId: publicId,
      serving: serving || '1-2 Persons',
      prepTime: prepTime || '25-30 mins',
      spiceLevel: spiceLevel || 'Medium',
      featured: featured === 'true' || featured === true,
      available: available !== undefined ? (available === 'true' || available === true) : true,
      isSpecial: isSpecial === 'true' || isSpecial === true,
      tags: parsedTags,
      ingredients: parsedIngredients,
      addOns: parsedAddOns
    });

    return sendSuccess(res, 201, 'Menu item created successfully', newItem);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return sendError(res, 404, 'Menu item not found.');
    }

    const updates = { ...req.body };

    if (req.file) {
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'three-flames/menu');
      updates.image = uploadResult.secure_url;
      updates.imagePublicId = uploadResult.public_id;
    }

    if (updates.tags && typeof updates.tags === 'string') {
      try { updates.tags = JSON.parse(updates.tags); } catch { updates.tags = updates.tags.split(','); }
    }
    if (updates.ingredients && typeof updates.ingredients === 'string') {
      try { updates.ingredients = JSON.parse(updates.ingredients); } catch { updates.ingredients = updates.ingredients.split(','); }
    }
    if (updates.addOns && typeof updates.addOns === 'string') {
      try { updates.addOns = JSON.parse(updates.addOns); } catch { /* ignore */ }
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);

    const updated = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    return sendSuccess(res, 200, 'Menu item updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return sendError(res, 404, 'Menu item not found.');
    }

    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    await MenuItem.findByIdAndDelete(id);
    return sendSuccess(res, 200, 'Menu item deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return sendError(res, 404, 'Menu item not found.');
    }

    item.available = !item.available;
    await item.save();

    return sendSuccess(res, 200, `Item marked as ${item.available ? 'In Stock' : 'Sold Out'}`, item);
  } catch (error) {
    next(error);
  }
};
