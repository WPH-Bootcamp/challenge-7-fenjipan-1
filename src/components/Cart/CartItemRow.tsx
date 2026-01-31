'use client';

import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/types/api';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
}: CartItemRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='flex items-center justify-between'>
      {/* Left: Image and Details */}
      <div className='flex items-center gap-4.25'>
        <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-xl'>
          <Image
            src={item.menu?.image || '/images/restaurant-placeholder.jpg'}
            alt={item.menu?.foodName || 'Food item'}
            fill
            className='object-cover'
          />
        </div>
        <div className='flex w-22.75 flex-col text-gray-950'>
          <p className='text-base leading-7.5 font-medium tracking-[-0.48px]'>
            {item.menu?.foodName || 'Food Name'}
          </p>
          <p className='text-lg leading-8 font-extrabold tracking-[-0.36px]'>
            {formatPrice(item.menu?.price || 0)}
          </p>
        </div>
      </div>

      {/* Right: Quantity Controls */}
      <div className='flex items-center gap-4 py-6'>
        <button
          onClick={() => onDecrement(item.id)}
          className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100'
          aria-label='Decrease quantity'
        >
          <Minus className='h-6 w-6 text-gray-950' />
        </button>
        <span className='w-8 text-center text-lg leading-8 font-semibold tracking-[-0.36px] text-gray-950'>
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrement(item.id)}
          className='bg-primary-600 hover:bg-primary-600/90 flex h-10 w-10 items-center justify-center rounded-full transition-colors'
          aria-label='Increase quantity'
        >
          <Plus className='h-6 w-6 text-white' />
        </button>
      </div>
    </div>
  );
}
