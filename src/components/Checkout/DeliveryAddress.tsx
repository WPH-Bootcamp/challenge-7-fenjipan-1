'use client';

import { MapPin } from 'lucide-react';
import { Button } from '@/ui/button';

interface DeliveryAddressProps {
  address: {
    street: string;
    phone: string;
  };
  onChangeAddress?: () => void;
}

export function DeliveryAddress({
  address,
  onChangeAddress,
}: DeliveryAddressProps) {
  return (
    <div className='flex flex-col gap-5.25 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg'>
            <MapPin className='h-5 w-5 text-white' />
          </div>
          <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
            Delivery Address
          </h3>
        </div>
        <p className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
          {address.street}
        </p>
        <p className='text-base leading-7.5 font-medium tracking-[-0.48px] text-gray-950'>
          {address.phone}
        </p>
      </div>
      <Button
        onClick={onChangeAddress}
        variant='outline'
        className='h-10 w-30 rounded-full border-gray-300 text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'
      >
        Change
      </Button>
    </div>
  );
}
