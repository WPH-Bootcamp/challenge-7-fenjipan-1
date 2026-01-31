import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, MenuItem } from "../../types/menu";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ menuItem: MenuItem; quantity?: number; notes?: string }>
    ) => {
      const { menuItem, quantity = 1, notes } = action.payload;
      const existingItem = state.items.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        if (notes) existingItem.notes = notes;
      } else {
        state.items.push({
          id: `cart-${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          notes,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },

    updateNotes: (
      state,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const { id, notes } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.notes = notes;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateNotes,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
