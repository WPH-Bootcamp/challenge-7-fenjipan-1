'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Restaurant } from '@/types/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  showDistance?: boolean;
  distance?: number; // in kilometers
}

export function RestaurantCard({
  restaurant,
  onClick,
  showDistance = false,
  distance,
}: RestaurantCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className='flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-all hover:shadow-lg'
    >
      {/* Image */}
      <div className='relative h-22.5 w-22.5 shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-30 md:w-30'>
        <Image
          src={
            imgError
              ? '/images/restaurant-placeholder.svg'
              : restaurant.logo || '/images/restaurant-placeholder.svg'
          }
          alt={restaurant.name}
          fill
          className='object-cover'
          onError={() => setImgError(true)}
          unoptimized={!restaurant.logo?.includes('cloudinary.com')}
        />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col items-start gap-0.5'>
        {/* Name */}
        <h3 className='text-left text-base leading-8 font-extrabold tracking-[-0.36px] text-gray-950 md:text-lg'>
          {restaurant.name}
        </h3>

        {/* Rating */}
        <div className='flex items-center gap-1'>
          <Star className='h-6 w-6 fill-[#fdb022] text-[#fdb022]' />
          <span className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
            {restaurant.star.toFixed(1)}
          </span>
        </div>

        {/* Location */}
        <div className='flex items-center gap-1.5 text-gray-950'>
          <span className='text-base leading-7.5 font-normal tracking-[-0.32px]'>
            {restaurant.place}
          </span>
          {showDistance && distance && (
            <>
              <span className='h-0.5 w-0.5 rounded-full bg-gray-950' />
              <span className='text-base leading-7.5 font-normal tracking-[-0.32px]'>
                {distance.toFixed(1)} km
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
