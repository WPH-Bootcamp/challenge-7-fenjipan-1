'use client';

import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/ui/button';
import type { CartItem } from '@/types/api';

interface CheckoutOrderItemsProps {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onAddItem?: () => void;
}

export function CheckoutOrderItems({
  restaurant,
  items,
  onIncrement,
  onDecrement,
  onAddItem,
}: CheckoutOrderItemsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
      {/* Restaurant Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='relative h-8 w-8 shrink-0 overflow-hidden'>
            <Image
              src={restaurant.logo || '/images/restaurant-placeholder.jpg'}
              alt={restaurant.name}
              fill
              className='object-cover'
            />
          </div>
          <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
            {restaurant.name}
          </h3>
        </div>
        <Button
          onClick={onAddItem}
          variant='outline'
          className='h-10 w-30 rounded-full border-gray-300 text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'
        >
          Add item
        </Button>
      </div>

      {/* Cart Items */}
      <div className='flex flex-col gap-5'>
        {items.map((item) => (
          <div key={item.id} className='flex items-center justify-between'>
            {/* Left: Image and Details */}
            <div className='flex items-center gap-4'>
              <div className='relative h-15 w-15 shrink-0 overflow-hidden rounded-xl'>
                <Image
                  src={item.menu?.image || '/images/restaurant-placeholder.jpg'}
                  alt={item.menu?.foodName || 'Food item'}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col'>
                <p className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
                  {item.menu?.foodName || 'Food Name'}
                </p>
                <p className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
                  {formatPrice(item.menu?.price || 0)}
                </p>
              </div>
            </div>

            {/* Right: Quantity Controls */}
            <div className='flex items-center gap-4'>
              <button
                onClick={() => onDecrement(item.id)}
                className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100'
                aria-label='Decrease quantity'
              >
                <Minus className='h-5 w-5 text-gray-950' />
              </button>
              <span className='w-6 text-center text-lg leading-8 font-semibold tracking-[-0.36px] text-gray-950'>
                {item.quantity}
              </span>
              <button
                onClick={() => onIncrement(item.id)}
                className='bg-primary-600 hover:bg-primary-600/90 flex h-8 w-8 items-center justify-center rounded-full transition-colors'
                aria-label='Increase quantity'
              >
                <Plus className='h-5 w-5 text-white' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
