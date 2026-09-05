import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '../../types';

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isReservationModalOpen: boolean;
  toasts: ToastMessage[];
  activeCategory: string;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isReservationModalOpen: false,
  toasts: [],
  activeCategory: 'all',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartDrawerOpen = action.payload;
    },
    toggleReservationModal: (state) => {
      state.isReservationModalOpen = !state.isReservationModalOpen;
    },
    setReservationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isReservationModalOpen = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'> & { id?: string }>) => {
      const id = action.payload.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      state.toasts.push({
        id,
        duration: 3500,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleReservationModal,
  setReservationModalOpen,
  setActiveCategory,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
