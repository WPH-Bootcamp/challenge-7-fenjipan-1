"use client";

import Image from "next/image";
import { Button } from "@/ui/button";
import type { Order } from "@/types/api";

interface OrderCardProps {
  order: Order;
  onGiveReview?: (transactionId: string, restaurantId: number, menuIds: number[]) => void;
}

export function OrderCard({ order, onGiveReview }: OrderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const showReviewButton = order.status?.toLowerCase() === "done";

  // Get the first restaurant (or handle multiple restaurants if needed)
  const firstRestaurant = order.restaurants?.[0];

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]">
      {/* Restaurant Header */}
      <div className="flex items-center gap-2">
        <div className="relative h-6 w-6 shrink-0 overflow-hidden">
          <Image
            src={
              firstRestaurant?.restaurant.logo ||
              "/images/restaurant-placeholder.svg"
            }
            alt={firstRestaurant?.restaurant.name || "Restaurant"}
            fill
            className="object-cover"
            unoptimized={
              !firstRestaurant?.restaurant.logo?.includes("cloudinary.com")
            }
          />
        </div>
        <h3 className="text-base font-bold leading-[30px] tracking-[-0.32px] text-gray-950">
          {firstRestaurant?.restaurant.name || "Restaurant"}
          {order.restaurants &&
            order.restaurants.length > 1 &&
            ` +${order.restaurants.length - 1} more`}
        </h3>
      </div>

      {/* Order Items - Show all items from all restaurants */}
      <div className="flex flex-col gap-4">
        {order.restaurants?.map((restaurantGroup) =>
          restaurantGroup.items.map((item) => (
            <div
              key={`${restaurantGroup.restaurant.id}-${item.menuId}`}
              className="flex items-center gap-4"
            >
              {/* Food Image */}
              <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
                <Image
                  src={item.image || "/images/restaurant-placeholder.svg"}
                  alt={item.menuName}
                  fill
                  className="object-cover"
                  unoptimized={!item.image?.includes("cloudinary.com")}
                />
              </div>
              {/* Food Details */}
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-7 tracking-[-0.28px] text-gray-950">
                  {item.menuName}
                </span>
                <span className="text-base font-extrabold leading-[30px] tracking-[-0.32px] text-gray-950">
                  {item.quantity} x {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total and Action */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-7 text-gray-950">
            Total
          </span>
          <span className="text-lg font-extrabold leading-8 tracking-[-0.36px] text-gray-950">
            {formatPrice(order.pricing.totalPrice)}
          </span>
        </div>
        {showReviewButton && onGiveReview && (
          <Button
            onClick={() => {
              // Collect all menu IDs from the first restaurant's items if available
              const menuIds = firstRestaurant?.items?.map((item) => item.menuId) || [];
              const restaurantId = firstRestaurant?.restaurant?.id || 0;
              onGiveReview(order.transactionId, restaurantId, menuIds);
            }}
            className="h-12 w-[160px] rounded-full bg-primary-600 text-base font-bold leading-[30px] tracking-[-0.32px] text-gray-25 hover:bg-primary-600/90"
          >
            Give Review
          </Button>
        )}
      </div>
    </div>
  );
}
