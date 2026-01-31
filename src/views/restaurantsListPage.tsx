'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Skeleton } from '@/ui/skeleton';
import { useRestaurants } from '@/services/queries';

export default function RestaurantsListPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([
    'nearby',
  ]);
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // Use API filters for server-side filtering
  const { data: restaurantsResponse, isLoading } = useRestaurants({
    priceMin: priceRange.min ?? undefined,
    priceMax: priceRange.max ?? undefined,
    rating:
      selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
    page: 1,
    limit: 20,
  });

  const restaurants = restaurantsResponse?.data?.restaurants || [];

  const handleRestaurantClick = (id: number) => {
    router.push(`/restaurant/${id}`);
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navbar variant='solid' />

      <main className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-12 lg:px-30'>
        <h1 className='mb-6 text-2xl leading-10.5 font-extrabold text-gray-950 md:mb-18.5 md:text-[32px]'>
          All Restaurant
        </h1>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className='mb-4 flex w-full items-center justify-between rounded-xl bg-white p-3 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] md:hidden'
        >
          <span className='text-sm font-extrabold text-gray-950'>FILTER</span>
          <SlidersHorizontal className='h-5 w-5 text-gray-950' />
        </button>

        {/* Mobile Filter Drawer */}
        <FilterSidebar
          isMobile
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onDistanceChange={setSelectedDistances}
          onPriceChange={(min, max) => setPriceRange({ min, max })}
          onRatingChange={setSelectedRatings}
        />

        <div className='flex gap-10 md:gap-10'>
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            onDistanceChange={setSelectedDistances}
            onPriceChange={(min, max) => setPriceRange({ min, max })}
            onRatingChange={setSelectedRatings}
          />

          {/* Restaurant Grid */}
          <div className='flex-1'>
            {isLoading ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-2 rounded-2xl bg-white p-3 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] md:gap-3 md:p-4'
                  >
                    <Skeleton className='h-22.5 w-22.5 rounded-xl md:h-30 md:w-30' />
                    <div className='flex flex-1 flex-col gap-2'>
                      <Skeleton className='h-5 w-3/4 md:h-6' />
                      <Skeleton className='h-4 w-1/4 md:h-5' />
                      <Skeleton className='h-4 w-1/2 md:h-5' />
                    </div>
                  </div>
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className='text-lg font-semibold text-gray-600 md:text-xl'>
                  No restaurants found
                </p>
                <p className='mt-2 text-sm font-(--font-nunito) text-gray-500 md:text-base'>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-5 md:gap-y-5'>
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    showDistance
                    distance={restaurant.distance || 2.4}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
