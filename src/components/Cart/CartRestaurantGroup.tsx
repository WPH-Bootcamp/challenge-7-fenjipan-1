'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { CartItemRow } from './CartItemRow';
import type { CartItem } from '@/types/api';

interface CartRestaurantGroupProps {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onCheckout: (restoId: number) => void;
}

export function CartRestaurantGroup({
  restaurant,
  items,
  onIncrement,
  onDecrement,
  onCheckout,
}: CartRestaurantGroupProps) {
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + (item.menu?.price || 0) * item.quantity,
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRestaurantClick = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
      {/* Restaurant Header */}
      <button
        onClick={handleRestaurantClick}
        className='flex items-center gap-2'
      >
        <div className='relative h-8 w-8 shrink-0 overflow-hidden'>
          <Image
            src={restaurant.logo || '/images/restaurant-placeholder.jpg'}
            alt={restaurant.name}
            fill
            className='object-cover'
          />
        </div>
        <h3 className='text-lg leading-8 font-bold tracking-[-0.54px] text-gray-950'>
          {restaurant.name}
        </h3>
        <ChevronRight className='h-6 w-6 text-gray-950' />
      </button>

      {/* Cart Items */}
      <div className='flex flex-col gap-5'>
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ))}
      </div>

      {/* Dashed Divider */}
      <div className='h-px w-full border-t border-dashed border-gray-300' />

      {/* Total and Checkout */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-col pb-1'>
          <p className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
            Total
          </p>
          <p className='text-xl leading-8.5 font-extrabold text-gray-950'>
            {formatPrice(total)}
          </p>
        </div>
        <Button
          onClick={() => onCheckout(restaurant.id)}
          className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 h-12 w-32.5 rounded-full text-base leading-7.5 font-bold tracking-[-0.32px]'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
