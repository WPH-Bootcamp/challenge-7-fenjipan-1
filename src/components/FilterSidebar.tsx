'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Checkbox } from '@/ui/checkbox';

interface FilterSidebarProps {
  onDistanceChange?: (distances: string[]) => void;
  onPriceChange?: (min: number | null, max: number | null) => void;
  onRatingChange?: (ratings: number[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({
  onDistanceChange,
  onPriceChange,
  onRatingChange,
  isOpen = true,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [selectedDistances, setSelectedDistances] = useState<string[]>([
    'nearby',
  ]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const handleDistanceToggle = (distance: string) => {
    const newDistances = selectedDistances.includes(distance)
      ? selectedDistances.filter((d) => d !== distance)
      : [...selectedDistances, distance];

    setSelectedDistances(newDistances);
    onDistanceChange?.(newDistances);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    const min = value ? parseFloat(value) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    onPriceChange?.(min, max);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = value ? parseFloat(value) : null;
    onPriceChange?.(min, max);
  };

  const handleRatingToggle = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];

    setSelectedRatings(newRatings);
    onRatingChange?.(newRatings);
  };

  const filterContent = (
    <>
      {/* Filter Header & Distance */}
      <div className='flex flex-col gap-2.5 px-4'>
        <h2 className='text-base leading-7.5 font-extrabold text-gray-950'>
          FILTER
        </h2>

        {/* Distance Filters */}
        <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
          Distance
        </h3>
        <div className='flex flex-col gap-2.5'>
          {[
            { id: 'nearby', label: 'Nearby' },
            { id: '1km', label: 'Within 1 km' },
            { id: '3km', label: 'Within 3 km' },
            { id: '5km', label: 'Within 5 km' },
          ].map((distance) => (
            <div key={distance.id} className='flex items-center gap-2'>
              <Checkbox
                id={`${isMobile ? 'mobile-' : ''}${distance.id}`}
                checked={selectedDistances.includes(distance.id)}
                onCheckedChange={() => handleDistanceToggle(distance.id)}
                className='data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 h-5 w-5 rounded-md border-gray-800'
              />
              <label
                htmlFor={`${isMobile ? 'mobile-' : ''}${distance.id}`}
                className='cursor-pointer text-base leading-7.5 font-normal tracking-[-0.32px] text-gray-950'
              >
                {distance.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className='my-6 h-px w-full bg-gray-200' />

      {/* Price Filters */}
      <div className='flex flex-col gap-2.5 px-4'>
        <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
          Price
        </h3>
        <div className='flex flex-col gap-2.5'>
          <div className='flex items-center gap-2 rounded-lg border border-gray-300 p-2'>
            <div className='flex h-9.5 w-9.5 items-center justify-center rounded bg-gray-100'>
              <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
                Rp
              </span>
            </div>
            <input
              type='number'
              placeholder='Minimum Price'
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className='flex-1 text-base leading-7.5 font-normal tracking-[-0.32px] text-gray-950 placeholder:text-gray-500 focus:outline-none'
            />
          </div>
          <div className='flex items-center gap-2 rounded-lg border border-gray-300 p-2'>
            <div className='flex h-9.5 w-9.5 items-center justify-center rounded bg-gray-100'>
              <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
                Rp
              </span>
            </div>
            <input
              type='number'
              placeholder='Maximum Price'
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className='flex-1 text-base leading-7.5 font-normal tracking-[-0.32px] text-gray-950 placeholder:text-gray-500 focus:outline-none'
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='my-6 h-px w-full bg-gray-200' />

      {/* Rating Filters */}
      <div className='flex flex-col gap-2.5 px-4'>
        <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
          Rating
        </h3>
        <div className='flex flex-col'>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className='flex h-11.5 items-center gap-2 px-2'>
              <Checkbox
                id={`${isMobile ? 'mobile-' : ''}rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
                className='data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 h-5 w-5 rounded-md border-gray-800'
              />
              <label
                htmlFor={`${isMobile ? 'mobile-' : ''}rating-${rating}`}
                className='flex cursor-pointer items-center gap-0.5'
              >
                <Star className='h-6 w-6 fill-[#fdb022] text-[#fdb022]' />
                <span className='text-base leading-7.5 font-normal tracking-[-0.32px] text-gray-950'>
                  {rating}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Mobile drawer version
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div className='fixed inset-0 z-40 bg-black/50' onClick={onClose} />
        )}

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-74.5 transform bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-4 right-[-40px] flex h-8 w-8 items-center justify-center rounded-full bg-white'
          >
            <X className='h-4 w-4 text-gray-950' />
          </button>

          <div className='h-full overflow-y-auto'>{filterContent}</div>
        </aside>
      </>
    );
  }

  // Desktop sidebar version
  return (
    <aside className='hidden w-full max-w-66.5 shrink-0 rounded-xl bg-white py-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] md:block'>
      {filterContent}
    </aside>
  );
}
