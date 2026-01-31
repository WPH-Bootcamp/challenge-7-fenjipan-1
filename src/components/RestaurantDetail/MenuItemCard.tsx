"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/ui/button";
import {
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useServerCart,
} from "@/services/queries";
import type { Menu, CartRestaurant } from "@/types/api";

interface MenuItemCardProps {
  menu: Menu;
  restaurant: CartRestaurant;
}

export function MenuItemCard({ menu, restaurant }: MenuItemCardProps) {
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateCartItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const { data: cartData } = useServerCart();

  // Find the cart item for this menu (if it exists)
  const cartItem = cartData?.data?.cart
    ?.find((group) => group.restaurant.id === restaurant.id)
    ?.items.find((item) => item.menu.id === menu.id);

  const quantity = cartItem?.quantity ?? 0;
  const cartItemId = cartItem?.id;

  // Check if the cart item has a real server ID (positive) vs temp optimistic ID (negative)
  const hasRealCartItemId = cartItemId !== undefined && cartItemId > 0;

  // Disable controls while any mutation is pending or if item only has temp ID
  const isPending = isAdding || isUpdating || isRemoving;
  const isDecrementDisabled = isPending || !hasRealCartItemId;

  const handleAdd = () => {
    addToCart({
      restaurantId: restaurant.id,
      menuId: menu.id,
      quantity: 1,
      menu: {
        id: menu.id,
        foodName: menu.foodName,
        price: menu.price,
        type: menu.type,
        image: menu.image,
      },
      restaurant,
    });
  };

  const handleIncrement = () => {
    if (hasRealCartItemId) {
      // Update existing cart item with real server ID
      updateCartItem({
        id: cartItemId,
        payload: { quantity: quantity + 1 },
      });
    } else {
      // Add new item (or item only has temp ID, add again to sync)
      handleAdd();
    }
  };

  const handleDecrement = () => {
    // Only allow decrement if we have a real server ID
    if (!hasRealCartItemId || quantity <= 0) return;

    if (quantity === 1) {
      // Remove item when quantity would become 0
      removeFromCart(cartItemId);
    } else {
      // Decrease quantity
      updateCartItem({
        id: cartItemId,
        payload: { quantity: quantity - 1 },
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md md:rounded-2xl md:border md:border-gray-200">
      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-100 md:aspect-auto md:h-45">
        <Image
          src={menu.image || "/images/restaurant-placeholder.jpg"}
          alt={menu.foodName}
          fill
          className="rounded-xl object-cover md:rounded-none"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 py-2 md:gap-2 md:p-4">
        <h3 className="truncate text-xs font-semibold text-gray-950 md:text-base">
          {menu.foodName}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-950 md:text-lg">
            {formatPrice(menu.price)}
          </span>

          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isPending}
              className="h-6 rounded-full bg-primary-600 px-3 text-[10px] font-bold hover:bg-primary-600/90 md:h-8 md:px-4 md:text-xs md:font-semibold"
            >
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-2">
              <button
                onClick={handleDecrement}
                disabled={isDecrementDisabled}
                aria-label="Decrease quantity"
                className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 md:h-6 md:w-6"
              >
                <Minus className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
              <span className="w-5 text-center font-(--font-nunito) text-xs md:w-6 md:text-sm">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={isPending}
                aria-label="Increase quantity"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-600/90 disabled:opacity-50 md:h-6 md:w-6"
              >
                <Plus className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
