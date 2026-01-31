'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRecommendedRestaurants, useRestaurants } from '@/services/queries';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/ui/skeleton';
import { Button } from '@/ui/button';
import type { RecommendedRestaurant, Restaurant } from '@/types/api';

const categories = [
  {
    name: 'All Restaurant',
    icon: '/images/category-allfood.png',
    href: '/restaurants',
  },
  {
    name: 'Nearby',
    icon: '/images/category-nearby.png',
    href: '/restaurants?filter=nearby',
  },
  {
    name: 'Discount',
    icon: '/images/category-discount.png',
    href: '/restaurants?filter=discount',
  },
  {
    name: 'Best Seller',
    icon: '/images/category-bestseller.png',
    href: '/restaurants?filter=bestseller',
  },
  {
    name: 'Delivery',
    icon: '/images/category-delivery.png',
    href: '/restaurants?filter=delivery',
  },
  {
    name: 'Lunch',
    icon: '/images/category-lunch.png',
    href: '/restaurants?filter=lunch',
  },
];

function RestaurantCard({
  restaurant,
}: {
  restaurant: RecommendedRestaurant | Restaurant;
}) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className='flex items-center gap-2 rounded-2xl bg-white p-3 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-shadow hover:shadow-md md:gap-3 md:p-4'
    >
      {/* Restaurant Logo */}
      <div className='relative h-22.5 w-22.5 shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-30 md:w-30'>
        <Image
          src={restaurant.logo || '/images/restaurant-placeholder.jpg'}
          alt={restaurant.name}
          fill
          className='object-cover'
        />
      </div>

      {/* Restaurant Info */}
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <h3 className='truncate text-base leading-7.5 font-extrabold text-gray-950 md:text-lg md:leading-8 md:tracking-[-0.36px]'>
          {restaurant.name}
        </h3>
        <div className='flex items-center gap-1'>
          <Star className='fill-accent-yellow text-accent-yellow h-6 w-6' />
          <span className='text-sm leading-7 font-medium text-gray-950 md:text-base md:leading-7.5 md:tracking-[-0.48px]'>
            {restaurant.star?.toFixed(1) || '0.0'}
          </span>
        </div>
        <div className='flex items-center gap-1.5 text-sm leading-7 font-normal tracking-[-0.28px] text-gray-950 md:text-base md:leading-7.5 md:tracking-[-0.32px]'>
          <span className='truncate'>{restaurant.place}</span>
          <span className='h-0.5 w-0.5 shrink-0 rounded-full bg-gray-950' />
          <span className='shrink-0'>
            {restaurant.distance?.toFixed(1) || '0'} km
          </span>
        </div>
      </div>
    </Link>
  );
}

function RestaurantCardSkeleton() {
  return (
    <div className='flex items-center gap-2 rounded-2xl bg-white p-3 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] md:gap-3 md:p-4'>
      <Skeleton className='h-22.5 w-22.5 shrink-0 rounded-xl md:h-30 md:w-30' />
      <div className='flex flex-1 flex-col gap-1'>
        <Skeleton className='h-5 w-3/4 md:h-6' />
        <Skeleton className='h-4 w-16 md:h-5' />
        <Skeleton className='h-4 w-1/2 md:h-5' />
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  // Use recommended API when logged in, regular restaurants API when not
  const {
    data: recommendedData,
    isLoading: isLoadingRecommended,
    isError: isRecommendedError,
  } = useRecommendedRestaurants(isAuthenticated);

  // Fallback to regular restaurants if not authenticated or if recommended fails
  const shouldUseFallback = !isAuthenticated || isRecommendedError;
  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useRestaurants(undefined, shouldUseFallback);

  const isLoading =
    isAuthenticated && !isRecommendedError
      ? isLoadingRecommended
      : isLoadingRestaurants;
  const restaurants =
    isAuthenticated && !isRecommendedError
      ? recommendedData?.data?.recommendations || []
      : restaurantsData?.data?.restaurants || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/restaurants?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative h-162 w-full md:h-175 lg:h-206.75'>
        {/* Background Image */}
        <div className='absolute inset-0'>
          <Image
            src='/images/hero-burger.png'
            alt='Hero Background'
            fill
            className='object-cover'
            priority
          />
          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-linear-to-b from-transparent from-60% to-black/80' />
        </div>

        {/* Navbar */}
        <Navbar variant='transparent' />

        {/* Hero Content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex w-full max-w-87.25 flex-col items-center gap-6 px-4 text-center text-white md:max-w-178 md:gap-10'>
            {/* Headlines */}
            <div className='flex flex-col gap-1 md:gap-2'>
              <h1 className='text-4xl leading-11 font-extrabold md:text-5xl md:leading-15'>
                Explore Culinary Experiences
              </h1>
              <p className='text-lg leading-8 font-bold tracking-[-0.54px] md:text-2xl md:leading-9 md:tracking-normal'>
                Search and refine your choice to discover the perfect
                restaurant.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className='w-full'>
              <div className='flex h-11 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2'>
                <Search className='h-5 w-5 text-gray-600' />
                <input
                  type='text'
                  placeholder='Search restaurants, food and drink'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 bg-transparent text-sm leading-7 font-normal tracking-[-0.28px] text-gray-950 placeholder:text-gray-600 focus:outline-none'
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='mx-auto w-full max-w-300 px-4 py-6 md:px-8 md:py-12 lg:px-0'>
        <div className='flex flex-wrap content-center items-center justify-center gap-5 md:justify-between'>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className='flex w-26.5 flex-col items-center gap-1 md:w-40.25 md:gap-1.5'
            >
              <div className='flex h-25 w-full items-center justify-center rounded-2xl bg-[#ffecec] p-2'>
                <div className='relative h-16.25 w-16.25'>
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    className='object-contain'
                  />
                </div>
              </div>
              <span className='text-center text-sm leading-7 font-bold tracking-[-0.28px] text-gray-950 md:text-lg md:leading-8 md:tracking-[-0.54px]'>
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section className='mx-auto w-full max-w-300 px-4 pt-6 pb-12 md:px-8 md:pt-0 md:pb-20 lg:px-0'>
        <div className='flex flex-col items-center gap-4 md:gap-8'>
          {/* Header */}
          <div className='flex w-full items-center justify-between'>
            <h2 className='text-2xl leading-9 font-extrabold text-gray-950 md:text-[32px] md:leading-10.5'>
              Recommended
            </h2>
            <Link
              href='/restaurants'
              className='text-primary-600 text-base leading-7.5 font-extrabold md:text-lg md:leading-8 md:tracking-[-0.36px]'
            >
              See All
            </Link>
          </div>

          {/* Restaurant Grid */}
          <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3'>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))
              : restaurants
                  .slice(0, 12)
                  .map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
          </div>

          {/* Show More Button */}
          {restaurants.length > 0 && (
            <Button
              variant='outline'
              className='h-12 w-32.5 rounded-full border-gray-300 text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'
              onClick={() => router.push('/restaurants')}
            >
              Show More
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
