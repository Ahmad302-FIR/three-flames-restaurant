import { GalleryImage } from '../models/GalleryImage.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all' && category !== 'All Photos') {
      filter.category = new RegExp(category, 'i');
    }

    const items = await GalleryImage.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Gallery items retrieved', items);
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, featured, description } = req.body;
    let imageUrl = req.body.image;
    let publicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'three-flames/gallery');
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    if (!imageUrl) {
      return sendError(res, 400, 'Gallery image file or image URL is required.');
    }

    const item = await GalleryImage.create({
      title,
      category: category || 'restaurant',
      image: imageUrl,
      publicId,
      featured: featured === 'true' || featured === true,
      description: description || ''
    });

    return sendSuccess(res, 201, 'Gallery image added successfully', item);
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findById(id);

    if (!item) {
      return sendError(res, 404, 'Gallery item not found.');
    }

    const updates = { ...req.body };

    if (req.file) {
      if (item.publicId) {
        await deleteFromCloudinary(item.publicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'three-flames/gallery');
      updates.image = uploadResult.secure_url;
      updates.publicId = uploadResult.public_id;
    }

    const updated = await GalleryImage.findByIdAndUpdate(id, updates, { new: true });
    return sendSuccess(res, 200, 'Gallery item updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await GalleryImage.findById(id);

    if (!item) {
      return sendError(res, 404, 'Gallery item not found.');
    }

    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }

    await GalleryImage.findByIdAndDelete(id);
    return sendSuccess(res, 200, 'Gallery item deleted successfully');
  } catch (error) {
    next(error);
  }
};
