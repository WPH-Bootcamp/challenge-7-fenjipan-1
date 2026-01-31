'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/ui/button';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    date: string;
    paymentMethod: string;
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
  };
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  orderDetails,
}: PaymentSuccessModalProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSeeOrders = () => {
    onClose();
    router.push('/orders');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[428px] mx-4 rounded-2xl bg-white shadow-lg">
        {/* Logo Header */}
        <div className="flex flex-row items-center justify-center gap-3 pt-6 pb-0">
          <div className="relative h-10 w-10">
            <Image
              src="/images/foody-logo.svg"
              alt="Foody Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[32px] leading-10 font-extrabold text-gray-950">
            Foody
          </span>
        </div>

        {/* Ticket Card */}
        <div className="relative mx-4 mt-5 overflow-visible rounded-2xl bg-gray-50 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]">
          {/* Success Icon and Message */}
          <div className="flex flex-col items-center gap-0.5 px-5 pt-5 pb-0 text-center">
            <div className="bg-accent-green flex h-16 w-16 items-center justify-center rounded-full">
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </div>
            <h2 className="mt-0.5 text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950">
              Payment Success
            </h2>
            <p className="text-sm leading-7 font-normal tracking-[-0.28px] text-gray-950">
              Your payment has been successfully processed.
            </p>
          </div>

          {/* Top divider with decorative notches */}
          <div className="relative my-4 flex items-center">
            <div className="absolute -left-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]" />
            <div className="h-px w-full bg-gray-200" />
            <div className="absolute -right-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]" />
          </div>

          {/* Order Details */}
          <div className="flex flex-col gap-4 px-5">
            <div className="flex items-center justify-between">
              <span className="text-base leading-[30px] font-medium tracking-[-0.48px] text-gray-950">
                Date
              </span>
              <span className="text-base leading-[30px] font-semibold tracking-[-0.32px] text-gray-950">
                {orderDetails.date}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base leading-[30px] font-medium tracking-[-0.48px] text-gray-950">
                Payment Method
              </span>
              <span className="text-base leading-[30px] font-semibold tracking-[-0.32px] text-gray-950">
                {orderDetails.paymentMethod}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="flex items-center justify-between">
              <span className="text-base leading-[30px] font-medium tracking-[-0.48px] text-gray-950">
                Price ({orderDetails.itemCount} items)
              </span>
              <span className="text-base leading-[30px] font-semibold tracking-[-0.32px] text-gray-950">
                {formatPrice(orderDetails.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base leading-[30px] font-medium tracking-[-0.48px] text-gray-950">
                Delivery Fee
              </span>
              <span className="text-base leading-[30px] font-semibold tracking-[-0.32px] text-gray-950">
                {formatPrice(orderDetails.deliveryFee)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base leading-[30px] font-medium tracking-[-0.48px] text-gray-950">
                Service Fee
              </span>
              <span className="text-base leading-[30px] font-semibold tracking-[-0.32px] text-gray-950">
                {formatPrice(orderDetails.serviceFee)}
              </span>
            </div>
          </div>

          {/* Bottom divider with decorative notches */}
          <div className="relative my-4 flex items-center">
            <div className="absolute -left-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]" />
            <div className="h-px w-full bg-gray-200" />
            <div className="absolute -right-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]" />
          </div>

          {/* Total and Button */}
          <div className="px-5 pb-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg leading-8 font-normal text-gray-950">
                Total
              </span>
              <span className="text-lg leading-8 font-extrabold tracking-[-0.36px] text-gray-950">
                {formatPrice(orderDetails.total)}
              </span>
            </div>

            {/* Button */}
            <Button
              onClick={handleSeeOrders}
              className="bg-primary-600 text-gray-25 hover:bg-primary-600/90 h-12 w-full rounded-full text-base leading-[30px] font-bold tracking-[-0.32px]"
            >
              See My Orders
            </Button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
}
