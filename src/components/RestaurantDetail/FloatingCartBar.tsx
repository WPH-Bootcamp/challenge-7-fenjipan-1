'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/ui/button';
import { useServerCart } from '@/services/queries';

export function FloatingCartBar() {
  const router = useRouter();
  const { data: cartResponse } = useServerCart();

  const totalItems = cartResponse?.data?.summary?.totalItems || 0;
  const totalPrice = cartResponse?.data?.summary?.totalPrice || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className='fixed right-0 bottom-0 left-0 z-50 bg-white shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
      <div className='mx-auto flex max-w-360 items-center justify-between px-4 py-4 md:px-8 lg:px-30'>
        {/* Cart Info */}
        <div className='flex flex-col gap-0.5'>
          <div className='flex items-center gap-2'>
            <ShoppingBag className='h-5 w-5 text-gray-950 md:h-6 md:w-6' />
            <span className='text-sm leading-7.5 font-normal tracking-[-0.32px] text-gray-950 md:text-base'>
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <span className='text-lg leading-8.5 font-extrabold text-gray-950 md:text-xl'>
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={() => router.push('/checkout')}
          className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 h-11 rounded-full px-8 text-base leading-7.5 font-bold tracking-[-0.32px] md:h-12 md:w-32.5'
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
