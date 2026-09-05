import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartAddOn, OrderType } from '../../types';

interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
}

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  selectedZoneFee: number;
  appliedCoupon: AppliedCoupon | null;
  specialInstructions: string;
}

const loadCartFromStorage = (): CartState => {
  try {
    const saved = localStorage.getItem('tf_cart_v1');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load cart from storage', e);
  }
  return {
    items: [],
    orderType: 'delivery',
    selectedZoneFee: 150,
    appliedCoupon: null,
    specialInstructions: '',
  };
};

const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem('tf_cart_v1', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save cart to storage', e);
  }
};

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        menuItemId: string;
        name: string;
        price: number;
        image: string;
        category: string;
        serving: string;
        quantity: number;
        selectedAddOns?: CartAddOn[];
        specialInstructions?: string;
      }>
    ) => {
      const { menuItemId, name, price, image, category, serving, quantity, selectedAddOns = [], specialInstructions } = action.payload;
      
      // Calculate add-on cost
      const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
      const singleUnitPrice = price + addOnsTotal;
      
      // Generate composite ID based on item and selected add-ons
      const addOnIds = selectedAddOns.map(a => a.id).sort().join('-');
      const cartItemId = `${menuItemId}${addOnIds ? `_${addOnIds}` : ''}`;
      
      const existingItemIndex = state.items.findIndex(item => item.id === cartItemId);
      
      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].itemTotal = state.items[existingItemIndex].quantity * singleUnitPrice;
        if (specialInstructions) {
          state.items[existingItemIndex].specialInstructions = specialInstructions;
        }
      } else {
        state.items.push({
          id: cartItemId,
          menuItemId,
          name,
          price: singleUnitPrice,
          image,
          category,
          serving,
          quantity,
          selectedAddOns,
          specialInstructions,
          itemTotal: singleUnitPrice * quantity,
        });
      }
      
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
          item.itemTotal = item.price * quantity;
        }
      }
      saveCartToStorage(state);
    },
    
    setOrderType: (state, action: PayloadAction<OrderType>) => {
      state.orderType = action.payload;
      if (action.payload === 'pickup' || action.payload === 'dine-in') {
        state.selectedZoneFee = 0;
      }
      saveCartToStorage(state);
    },
    
    setSelectedZoneFee: (state, action: PayloadAction<number>) => {
      state.selectedZoneFee = action.payload;
      saveCartToStorage(state);
    },
    
    applyCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.appliedCoupon = action.payload;
      saveCartToStorage(state);
    },
    
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      saveCartToStorage(state);
    },
    
    setSpecialInstructions: (state, action: PayloadAction<string>) => {
      state.specialInstructions = action.payload;
      saveCartToStorage(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.specialInstructions = '';
      saveCartToStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setOrderType,
  setSelectedZoneFee,
  applyCoupon,
  removeCoupon,
  setSpecialInstructions,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
