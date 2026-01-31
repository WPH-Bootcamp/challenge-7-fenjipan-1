'use client';

import { Button } from '@/ui/button';

interface PaymentSummaryProps {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  onCheckout?: () => void;
  isProcessing?: boolean;
}

export function PaymentSummary({
  itemCount,
  subtotal,
  deliveryFee,
  serviceFee,
  onCheckout,
  isProcessing,
}: PaymentSummaryProps) {
  const total = subtotal + deliveryFee + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='flex flex-col gap-4 px-5'>
      <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
        Payment Summary
      </h3>

      {/* Price breakdown */}
      <div className='flex items-center justify-between'>
        <span className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
          Price ({itemCount} items)
        </span>
        <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
          Delivery Fee
        </span>
        <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
          {formatPrice(deliveryFee)}
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
          Service Fee
        </span>
        <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
          {formatPrice(serviceFee)}
        </span>
      </div>

      {/* Total */}
      <div className='flex items-center justify-between'>
        <span className='text-lg leading-8 font-normal text-gray-950'>
          Total
        </span>
        <span className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
          {formatPrice(total)}
        </span>
      </div>

      {/* Buy Button */}
      <Button
        onClick={onCheckout}
        disabled={isProcessing}
        className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 h-12 w-full rounded-full text-base leading-7.5 font-bold tracking-[-0.32px]'
      >
        {isProcessing ? 'Processing...' : 'Buy'}
      </Button>
    </div>
  );
}
