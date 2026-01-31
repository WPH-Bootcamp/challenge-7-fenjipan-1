'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileSidebar } from '@/components/Profile';
import { OrderStatusTabs, OrderCard } from '@/components/Orders';
import { ReviewModal } from '@/components/ReviewModal';
import { Skeleton } from '@/ui/skeleton';
import { useMyOrders } from '@/services/queries';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('done');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);
  const [selectedRestaurantName, setSelectedRestaurantName] =
    useState<string>('');
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  const { data: ordersResponse, isLoading } = useMyOrders(activeStatus, 1, 20);
  const orders = ordersResponse?.data?.orders || [];

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;

    return orders.filter((order) => {
      return order.restaurants?.some((restaurantGroup) =>
        restaurantGroup.restaurant.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [orders, searchQuery]);

  const handleGiveReview = (
    transactionId: string,
    restaurantId: number,
    menuIds: number[]
  ) => {
    const order = orders.find((o) => o.transactionId === transactionId);
    if (order) {
      const restaurant = order.restaurants?.find(
        (r) => r.restaurant.id === restaurantId
      );

      setSelectedTransactionId(transactionId);
      setSelectedRestaurantId(
        restaurantId || order.restaurants?.[0]?.restaurant?.id || 0
      );
      setSelectedRestaurantName(
        restaurant?.restaurant?.name ||
          order.restaurants?.[0]?.restaurant?.name ||
          'Restaurant'
      );
      setSelectedMenuIds(menuIds);
      setReviewModalOpen(true);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navbar variant='solid' />

      <main className='mx-auto max-w-360 px-4 py-12 lg:px-30'>
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-[266px_1fr]'>
          {/* Sidebar */}
          <ProfileSidebar activeItem='my-orders' />

          {/* Main Content */}
          <div className='flex flex-col gap-5'>
            {/* Header */}
            <h1 className='text-[32px] leading-10.5 font-extrabold text-gray-950'>
              My Orders
            </h1>

            {/* Content Container */}
            <div className='flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
              {/* Search Bar */}
              <div className='flex h-11 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2'>
                <Search className='h-5 w-5 shrink-0 text-gray-600' />
                <input
                  type='text'
                  placeholder='Search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 text-sm leading-7 font-normal tracking-[-0.28px] text-gray-950 placeholder:text-gray-600 focus:outline-none'
                />
              </div>

              {/* Status Tabs */}
              <OrderStatusTabs
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
              />

              {/* Orders List */}
              <div className='flex flex-col gap-5'>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className='rounded-2xl bg-white p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'
                    >
                      <div className='mb-3 flex items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-lg' />
                        <Skeleton className='h-5 w-32' />
                      </div>
                      <div className='flex items-center gap-4'>
                        <Skeleton className='h-16 w-16 rounded-xl' />
                        <div className='flex flex-col gap-1'>
                          <Skeleton className='h-4 w-24' />
                          <Skeleton className='h-5 w-32' />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onGiveReview={handleGiveReview}
                    />
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
                    <p className='text-lg font-semibold text-gray-600'>
                      No orders found
                    </p>
                    <p className='mt-2 text-sm text-gray-500'>
                      {searchQuery
                        ? 'Try changing the search query'
                        : 'No orders with this status yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      {selectedTransactionId && selectedRestaurantId !== null && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedTransactionId(null);
            setSelectedRestaurantId(null);
            setSelectedRestaurantName('');
            setSelectedMenuIds([]);
          }}
          restaurantName={selectedRestaurantName}
          transactionId={selectedTransactionId}
          restaurantId={selectedRestaurantId}
          menuIds={selectedMenuIds}
        />
      )}
    </div>
  );
}
