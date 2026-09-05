import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    image: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
