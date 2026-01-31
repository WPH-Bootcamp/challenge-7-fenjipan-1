import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
} from "@/services/api";
import type {
  AddToCartPayload,
  UpdateCartPayload,
  ApiError,
  ApiResponse,
  CartResponse,
  CartMenu,
  CartRestaurant,
} from "@/types/api";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Extended payload for optimistic updates (includes menu/restaurant info for UI)
export interface AddToCartOptimisticPayload extends AddToCartPayload {
  menu: CartMenu;
  restaurant: CartRestaurant;
}

// React Query hook for server-synced cart
export function useServerCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    staleTime: 60 * 1000, // 1 minute
    enabled: isAuthenticated, // Only fetch when authenticated
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartOptimisticPayload) => {
      // Only send required fields to API
      const { restaurantId, menuId, quantity } = payload;
      return addToCartApi({ restaurantId, menuId, quantity });
    },
    onMutate: async (newItem) => {
      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous value for rollback
      const previousCart = queryClient.getQueryData<ApiResponse<CartResponse>>(["cart"]);

      // Optimistically update the cache
      queryClient.setQueryData<ApiResponse<CartResponse>>(["cart"], (old) => {
        if (!old) {
          // Create new cart structure if none exists
          return {
            success: true,
            data: {
              cart: [
                {
                  restaurant: newItem.restaurant,
                  items: [
                    {
                      id: -Date.now(), // Temporary ID (negative to distinguish)
                      menu: newItem.menu,
                      quantity: newItem.quantity,
                      itemTotal: newItem.menu.price * newItem.quantity,
                    },
                  ],
                  subtotal: newItem.menu.price * newItem.quantity,
                },
              ],
              summary: {
                totalItems: newItem.quantity,
                totalPrice: newItem.menu.price * newItem.quantity,
                restaurantCount: 1,
              },
            },
          };
        }

        const cartData = { ...old.data };
        const existingGroupIndex = cartData.cart.findIndex(
          (group) => group.restaurant.id === newItem.restaurantId
        );

        if (existingGroupIndex >= 0) {
          // Restaurant exists in cart
          const group = { ...cartData.cart[existingGroupIndex] };
          const existingItemIndex = group.items.findIndex(
            (item) => item.menu.id === newItem.menuId
          );

          if (existingItemIndex >= 0) {
            // Item exists - increment quantity
            const items = [...group.items];
            const item = { ...items[existingItemIndex] };
            item.quantity += newItem.quantity;
            item.itemTotal = item.menu.price * item.quantity;
            items[existingItemIndex] = item;
            group.items = items;
          } else {
            // New item in existing restaurant
            group.items = [
              ...group.items,
              {
                id: -Date.now(),
                menu: newItem.menu,
                quantity: newItem.quantity,
                itemTotal: newItem.menu.price * newItem.quantity,
              },
            ];
          }

          // Recalculate subtotal
          group.subtotal = group.items.reduce((sum, item) => sum + item.itemTotal, 0);
          cartData.cart = [...cartData.cart];
          cartData.cart[existingGroupIndex] = group;
        } else {
          // New restaurant group
          cartData.cart = [
            ...cartData.cart,
            {
              restaurant: newItem.restaurant,
              items: [
                {
                  id: -Date.now(),
                  menu: newItem.menu,
                  quantity: newItem.quantity,
                  itemTotal: newItem.menu.price * newItem.quantity,
                },
              ],
              subtotal: newItem.menu.price * newItem.quantity,
            },
          ];
        }

        // Recalculate summary
        cartData.summary = {
          totalItems: cartData.cart.reduce(
            (sum, group) => sum + group.items.reduce((s, i) => s + i.quantity, 0),
            0
          ),
          totalPrice: cartData.cart.reduce((sum, group) => sum + group.subtotal, 0),
          restaurantCount: cartData.cart.length,
        };

        return { ...old, data: cartData };
      });

      return { previousCart };
    },
    onError: (error: AxiosError<ApiError>, _newItem, context) => {
      // Rollback to previous state on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      const message = error.response?.data?.message ?? "Failed to add to cart";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Item added to cart");
    },
    onSettled: () => {
      // Always refetch after mutation to ensure server state sync
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCartPayload }) =>
      updateCartItem(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<ApiResponse<CartResponse>>(["cart"]);

      queryClient.setQueryData<ApiResponse<CartResponse>>(["cart"], (old) => {
        if (!old) return old;

        const cartData = { ...old.data };
        let found = false;

        cartData.cart = cartData.cart.map((group) => {
          const itemIndex = group.items.findIndex((item) => item.id === id);
          if (itemIndex === -1) return group;

          found = true;
          const newGroup = { ...group };
          const items = [...newGroup.items];
          const item = { ...items[itemIndex] };

          item.quantity = payload.quantity;
          item.itemTotal = item.menu.price * payload.quantity;
          items[itemIndex] = item;
          newGroup.items = items;
          newGroup.subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);

          return newGroup;
        });

        if (found) {
          cartData.summary = {
            totalItems: cartData.cart.reduce(
              (sum, group) => sum + group.items.reduce((s, i) => s + i.quantity, 0),
              0
            ),
            totalPrice: cartData.cart.reduce((sum, group) => sum + group.subtotal, 0),
            restaurantCount: cartData.cart.length,
          };
        }

        return { ...old, data: cartData };
      });

      return { previousCart };
    },
    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      const message = error.response?.data?.message ?? "Failed to update cart";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeFromCartApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<ApiResponse<CartResponse>>(["cart"]);

      queryClient.setQueryData<ApiResponse<CartResponse>>(["cart"], (old) => {
        if (!old) return old;

        const cartData = { ...old.data };

        // Remove item and filter out empty restaurant groups
        cartData.cart = cartData.cart
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== id),
            subtotal: group.items
              .filter((item) => item.id !== id)
              .reduce((sum, i) => sum + i.itemTotal, 0),
          }))
          .filter((group) => group.items.length > 0);

        // Recalculate summary
        cartData.summary = {
          totalItems: cartData.cart.reduce(
            (sum, group) => sum + group.items.reduce((s, i) => s + i.quantity, 0),
            0
          ),
          totalPrice: cartData.cart.reduce((sum, group) => sum + group.subtotal, 0),
          restaurantCount: cartData.cart.length,
        };

        return { ...old, data: cartData };
      });

      return { previousCart };
    },
    onError: (error: AxiosError<ApiError>, _id, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      const message = error.response?.data?.message ?? "Failed to remove item";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCartApi,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<ApiResponse<CartResponse>>(["cart"]);

      // Optimistically clear the cart
      queryClient.setQueryData<ApiResponse<CartResponse>>(["cart"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            cart: [],
            summary: {
              totalItems: 0,
              totalPrice: 0,
              restaurantCount: 0,
            },
          },
        };
      });

      return { previousCart };
    },
    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      const message = error.response?.data?.message ?? "Failed to clear cart";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Cart cleared");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
