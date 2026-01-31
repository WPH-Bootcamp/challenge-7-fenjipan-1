'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PaymentOption {
  id: string;
  name: string;
  shortName: string;
}

const paymentOptions: PaymentOption[] = [
  { id: 'bni', name: 'Bank Negara Indonesia', shortName: 'BNI' },
  { id: 'bri', name: 'Bank Rakyat Indonesia', shortName: 'BRI' },
  { id: 'bca', name: 'Bank Central Asia', shortName: 'BCA' },
  { id: 'mandiri', name: 'Mandiri', shortName: 'MDR' },
];

interface PaymentMethodProps {
  selectedMethod?: string;
  onMethodChange?: (method: string) => void;
}

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) {
  const [selected, setSelected] = useState(selectedMethod || 'bni');

  const handleSelect = (methodId: string) => {
    setSelected(methodId);
    onMethodChange?.(methodId);
  };

  return (
    <div className='flex flex-col gap-4 px-5'>
      <h3 className='text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950'>
        Payment Method
      </h3>
      <div className='flex flex-col'>
        {paymentOptions.map((option, index) => (
          <div key={option.id}>
            <button
              onClick={() => handleSelect(option.id)}
              className='flex w-full items-center justify-center gap-2 py-2 transition-colors hover:bg-gray-50'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white'>
                <span className='text-[10px] font-bold text-gray-600'>
                  {option.shortName}
                </span>
              </div>
              <span className='flex-1 text-left text-base leading-7.5 font-normal tracking-[-0.32px] text-gray-950'>
                {option.name}
              </span>
              <div
                className={`h-6 w-6 rounded-full ${
                  selected === option.id
                    ? 'border-primary-600 bg-primary-600 border-[2.4px]'
                    : 'border-[2.4px] border-gray-800'
                } flex items-center justify-center`}
              >
                {selected === option.id && (
                  <div className='h-2.5 w-2.5 rounded-full bg-white' />
                )}
              </div>
            </button>
            {index < paymentOptions.length - 1 && (
              <div className='h-px w-full bg-gray-200' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
