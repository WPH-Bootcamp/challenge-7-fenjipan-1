'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageGallery } from '@/components/RestaurantDetail/ImageGallery';
import { RestaurantInfo } from '@/components/RestaurantDetail/RestaurantInfo';
import { MenuSection } from '@/components/RestaurantDetail/MenuSection';
import { ReviewsSection } from '@/components/RestaurantDetail/ReviewsSection';
import { FloatingCartBar } from '@/components/RestaurantDetail/FloatingCartBar';
import { Skeleton } from '@/ui/skeleton';
import { useRestaurantDetail } from '@/services/queries';

interface RestaurantDetailPageProps {
  id: number;
}

export default function RestaurantDetailPage({
  id,
}: RestaurantDetailPageProps) {
  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    error: restaurantError,
  } = useRestaurantDetail(id);

  if (isRestaurantLoading) {
    return (
      <div className='min-h-screen bg-white'>
        <Navbar variant='solid' />
        <div className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-20 lg:px-30'>
          <Skeleton className='mb-4 h-60 w-full rounded-2xl md:mb-6 md:h-100 md:rounded-3xl' />
          <Skeleton className='mb-4 h-10 w-2/3 md:h-12' />
          <Skeleton className='h-6 w-1/3 md:h-8' />
        </div>
      </div>
    );
  }

  if (restaurantError || !restaurantData) {
    return (
      <div className='min-h-screen bg-white'>
        <Navbar variant='solid' />
        <div className='mx-auto max-w-360 px-4 py-10 md:px-8 md:py-20 lg:px-30'>
          <p className='text-center text-lg text-gray-600 md:text-xl'>
            Failed to load restaurant details
          </p>
        </div>
      </div>
    );
  }

  const restaurant = restaurantData.data;

  return (
    <div className='min-h-screen bg-white pb-24'>
      <Navbar variant='solid' />
      <div className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-20 lg:px-30'>
        <ImageGallery images={restaurant.images} />
        <RestaurantInfo restaurant={restaurant} />
        <MenuSection
          menus={restaurant.menus}
          restaurant={{
            id: restaurant.id,
            name: restaurant.name,
            logo: restaurant.logo,
          }}
        />
        <ReviewsSection
          reviews={restaurant.reviews}
          restaurantStar={restaurant.star}
          isLoading={false}
        />
      </div>
      <Footer />
      <FloatingCartBar />
    </div>
  );
}
