"use client";

import Image from "next/image";
import { MapPin, Star, Share2 } from "lucide-react";
import { Button } from "@/ui/button";
import type { Restaurant } from "@/types/api";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="mb-6 flex items-start justify-between md:mb-10">
      <div className="flex gap-3 md:gap-4">
        {/* Restaurant Logo */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white md:h-18 md:w-18 md:rounded-2xl">
          <Image
            src={restaurant.logo || "/images/restaurant-placeholder.jpg"}
            alt={restaurant.name}
            fill
            className="object-cover p-1.5 md:p-2"
          />
        </div>

        {/* Restaurant Details */}
        <div className="flex flex-col gap-0.5 md:gap-2">
          <h1 className="text-lg font-extrabold leading-7 text-gray-950 md:text-[32px] md:leading-10.5">
            {restaurant.name}
          </h1>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#fdb022] text-[#fdb022] md:h-5 md:w-5" />
            <span className="text-sm font-medium text-gray-950 md:text-base md:font-semibold">
              {restaurant.star.toFixed(1)}
            </span>
          </div>
          {/* Location */}
          <div className="flex items-center gap-1 text-gray-950">
            <span className="text-xs font-normal md:text-sm">
              {restaurant.place}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-gray-950" />
            <span className="text-xs font-normal md:text-sm">
              {restaurant.distance?.toFixed(1) || "0"} km
            </span>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <Button
        variant="outline"
        onClick={handleShare}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border-gray-300 px-3 md:h-10 md:gap-2 md:px-4"
      >
        <Share2 className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
        <span className="text-sm font-medium text-gray-700 md:text-base">
          Share
        </span>
      </Button>
    </div>
  );
}
