import mongoose from 'mongoose';

const addOnSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    serving: {
      type: String,
      default: '1-2 Persons'
    },
    prepTime: {
      type: String,
      default: '25-30 mins'
    },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      default: 'Medium'
    },
    available: {
      type: Boolean,
      default: true,
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    isSpecial: {
      type: Boolean,
      default: false
    },
    tags: [{ type: String, trim: true }],
    ingredients: [{ type: String, trim: true }],
    addOns: [addOnSchema]
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

menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
