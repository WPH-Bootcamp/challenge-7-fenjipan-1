'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/ui/skeleton';
import { PaymentSuccessModal } from '@/components/PaymentSuccessModal';
import {
  DeliveryAddress,
  CheckoutOrderItems,
  PaymentMethod,
  PaymentSummary,
} from '@/components/Checkout';
import {
  useServerCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useCheckout,
} from '@/services/queries';
import { toast } from 'sonner';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restoId = searchParams?.get('resto');
  const [paymentMethod, setPaymentMethod] = useState('bni');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deliveryAddress] = useState(
    'Jl. Sudirman No. 25, Jakarta Pusat, 10220'
  );
  const [phone] = useState('0812-3456-7890');

  const { data: cartResponse, isLoading } = useServerCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: checkoutMutation, isPending: isCheckingOut } = useCheckout();

  // Cart is already grouped by restaurant from API
  const groupedCart = cartResponse?.data?.cart || [];

  // Filter by restaurant if restoId is provided
  const restaurantGroup = useMemo(() => {
    if (!restoId) {
      return groupedCart[0] || null; // Return first restaurant group if no filter
    }
    return groupedCart.find((g) => g.restaurant.id === Number(restoId)) || null;
  }, [groupedCart, restoId]);

  // Calculate totals from the restaurant group
  const subtotal = restaurantGroup?.subtotal || 0;
  const deliveryFee = 10000; // Fixed delivery fee
  const serviceFee = 1000; // Fixed service fee
  const itemCount =
    restaurantGroup?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleIncrement = (id: number) => {
    const item = restaurantGroup?.items.find((i) => i.id === id);
    if (item) {
      updateCartItem({
        id,
        payload: { quantity: item.quantity + 1 },
      });
    }
  };

  const handleDecrement = (id: number) => {
    const item = restaurantGroup?.items.find((i) => i.id === id);
    if (item) {
      if (item.quantity > 1) {
        updateCartItem({
          id,
          payload: { quantity: item.quantity - 1 },
        });
      } else {
        removeFromCart(id);
      }
    }
  };

  const handleCheckout = async () => {
    if (!restaurantGroup) {
      toast.error('No items to checkout');
      return;
    }

    // Prepare checkout payload
    const payload = {
      restaurants: [
        {
          restaurantId: restaurantGroup.restaurant.id,
          items: restaurantGroup.items.map((item) => ({
            menuId: item.menu.id,
            quantity: item.quantity,
          })),
        },
      ],
      deliveryAddress,
      phone,
      paymentMethod: getPaymentMethodName(paymentMethod),
    };

    checkoutMutation(payload, {
      onSuccess: () => {
        setShowSuccessModal(true);
      },
    });
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      bni: 'BNI Bank Negara Indonesia',
      bri: 'BRI Bank Rakyat Indonesia',
      bca: 'BCA Bank Central Asia',
      mandiri: 'Mandiri',
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white'>
        <Navbar variant='solid' />
        <main className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-20 lg:px-30'>
          <Skeleton className='mb-4 h-9 w-32 md:mb-8 md:h-12 md:w-48' />
          <div className='grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[590px_1fr]'>
            <div className='space-y-4 md:space-y-5'>
              <Skeleton className='h-40 w-full rounded-2xl md:h-48' />
              <Skeleton className='h-56 w-full rounded-2xl md:h-64' />
            </div>
            <Skeleton className='h-80 w-full rounded-2xl md:h-96' />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!restaurantGroup) {
    return (
      <div className='min-h-screen bg-white'>
        <Navbar variant='solid' />
        <main className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-20 lg:px-30'>
          <h1 className='mb-4 text-2xl leading-9 font-extrabold text-gray-950 md:mb-8 md:text-[32px] md:leading-10.5'>
            Checkout
          </h1>
          <div className='flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] md:py-20'>
            <p className='mb-4 text-lg font-semibold text-gray-600 md:text-xl'>
              No items to checkout
            </p>
            <button
              onClick={() => router.push('/cart')}
              className='text-primary-600 text-sm font-(--font-nunito) hover:underline md:text-base'
            >
              Back to Cart
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <Navbar variant='solid' />

      <main className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-12 lg:px-55'>
        <div className='mx-auto max-w-250'>
          <h1 className='mb-16.5 text-[32px] leading-10.5 font-extrabold text-gray-950'>
            Checkout
          </h1>

          <div className='grid grid-cols-1 gap-5 lg:grid-cols-[590px_390px]'>
            {/* Left Column - becomes top section on mobile */}
            <div className='flex flex-col gap-5'>
              {/* Delivery Address */}
              <DeliveryAddress
                address={{
                  street: deliveryAddress,
                  phone: phone,
                }}
                onChangeAddress={() => {
                  toast.info('Change address feature coming soon');
                }}
              />

              {/* Order Items */}
              <CheckoutOrderItems
                restaurant={restaurantGroup.restaurant}
                items={restaurantGroup.items}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onAddItem={() => {
                  router.push(`/restaurant/${restaurantGroup.restaurant.id}`);
                }}
              />
            </div>

            {/* Right Column - Ticket-style card with Payment Method and Summary */}
            <div className='relative overflow-visible rounded-2xl bg-white py-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
              {/* Payment Method */}
              <PaymentMethod
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />

              {/* Dashed Divider with decorative notches */}
              <div className='relative my-4 flex items-center'>
                <div className='absolute -left-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]' />
                <div className='h-px w-full border-t border-dashed border-gray-300' />
                <div className='absolute -right-2.5 h-5 w-5 rounded-full bg-white shadow-[inset_0px_0px_10px_0px_rgba(203,202,202,0.25)]' />
              </div>

              {/* Payment Summary */}
              <PaymentSummary
                itemCount={itemCount}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                onCheckout={handleCheckout}
                isProcessing={isCheckingOut}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={{
          date: new Date().toLocaleString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          paymentMethod: getPaymentMethodName(paymentMethod),
          itemCount,
          subtotal,
          deliveryFee,
          serviceFee,
          total: subtotal + deliveryFee + serviceFee,
        }}
      />
    </div>
  );
}

export default CheckoutContent;
