import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity,
  updateNotes,
  clearCart as clearCartAction,
  toggleCart,
  openCart,
  closeCart,
} from "./cartSlice";

// Redux-based local cart hook (for UI state)
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,

    addItem: (
      menuItem: {
        id: string;
        name: string;
        price: number;
        image: string;
        description: string;
        category: string;
        rating: number;
        isAvailable: boolean;
      },
      quantity?: number,
      notes?: string
    ) => dispatch(addToCartAction({ menuItem, quantity, notes })),

    removeItem: (id: string) => dispatch(removeFromCartAction(id)),

    setQuantity: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),

    setNotes: (id: string, notes: string) =>
      dispatch(updateNotes({ id, notes })),

    clear: () => dispatch(clearCartAction()),

    toggle: () => dispatch(toggleCart()),

    open: () => dispatch(openCart()),

    close: () => dispatch(closeCart()),
  };
};
