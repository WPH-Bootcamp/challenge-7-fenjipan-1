'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartRestaurantGroup } from '@/components/Cart/CartRestaurantGroup';
import { Skeleton } from '@/ui/skeleton';
import {
  useServerCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from '@/services/queries';

export default function CartPage() {
  const router = useRouter();
  const { data: cartResponse, isLoading } = useServerCart();
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeFromCart } = useRemoveFromCart();

  // Cart is already grouped by restaurant from API
  const groupedCart = cartResponse?.data?.cart || [];
  const summary = cartResponse?.data?.summary || {
    totalItems: 0,
    totalPrice: 0,
    restaurantCount: 0,
  };

  const handleIncrement = (id: number) => {
    // Find the item across all restaurant groups
    let currentItem = null;
    for (const group of groupedCart) {
      const item = group.items.find((i) => i.id === id);
      if (item) {
        currentItem = item;
        break;
      }
    }

    if (currentItem) {
      updateCartItem({
        id,
        payload: { quantity: currentItem.quantity + 1 },
      });
    }
  };

  const handleDecrement = (id: number) => {
    // Find the item across all restaurant groups
    let currentItem = null;
    for (const group of groupedCart) {
      const item = group.items.find((i) => i.id === id);
      if (item) {
        currentItem = item;
        break;
      }
    }

    if (currentItem) {
      if (currentItem.quantity > 1) {
        updateCartItem({
          id,
          payload: { quantity: currentItem.quantity - 1 },
        });
      } else {
        removeFromCart(id);
      }
    }
  };

  const handleCheckout = (restoId: number) => {
    // Navigate to checkout page for specific restaurant
    router.push(`/checkout?resto=${restoId}`);
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navbar variant='solid' />

      <main className='mx-auto max-w-360 px-4 py-4 md:px-8 md:py-12 lg:px-80'>
        <div className='mx-auto max-w-200'>
          <h1 className='mb-18.5 text-[32px] leading-10.5 font-extrabold text-gray-950'>
            My Cart
          </h1>

          {isLoading ? (
            <div className='flex flex-col gap-5'>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'
                >
                  <Skeleton className='mb-5 h-8 w-48' />
                  <Skeleton className='mb-5 h-20 w-full' />
                  <Skeleton className='mb-5 h-20 w-full' />
                  <Skeleton className='h-12 w-full' />
                </div>
              ))}
            </div>
          ) : groupedCart.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
              <p className='mb-2 text-xl font-semibold text-gray-600'>
                Your cart is empty
              </p>
              <p className='text-base text-gray-500'>
                Add items from restaurants to get started
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              {groupedCart.map((group) => (
                <CartRestaurantGroup
                  key={group.restaurant.id}
                  restaurant={group.restaurant}
                  items={group.items}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onCheckout={handleCheckout}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
