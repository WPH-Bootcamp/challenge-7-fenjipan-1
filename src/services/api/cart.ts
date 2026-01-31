import { api } from "./axios";
import type {
  ApiResponse,
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  CartItemWithRestaurant,
} from "@/types/api";

// Get user's cart (grouped by restaurant)
export async function getCart() {
  const res = await api.get<ApiResponse<CartResponse>>("/api/cart");
  return res.data;
}

// Add item to cart
export async function addToCart(payload: AddToCartPayload) {
  const res = await api.post<ApiResponse<{ cartItem: CartItemWithRestaurant }>>(
    "/api/cart",
    payload
  );
  return res.data;
}

// Update cart item quantity
export async function updateCartItem(id: number, payload: UpdateCartPayload) {
  const res = await api.put<ApiResponse<{ cartItem: CartItemWithRestaurant }>>(
    `/api/cart/${id}`,
    payload
  );
  return res.data;
}

// Remove item from cart
export async function removeFromCart(id: number) {
  const res = await api.delete<ApiResponse<null>>(
    `/api/cart/${id}`
  );
  return res.data;
}

// Clear entire cart
export async function clearCart() {
  const res = await api.delete<ApiResponse<null>>("/api/cart");
  return res.data;
}
