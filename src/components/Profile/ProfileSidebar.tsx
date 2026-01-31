'use client';

import { MapPin, FileText, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  activeItem?: 'delivery-address' | 'my-orders';
}

export function ProfileSidebar({ activeItem }: ProfileSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil');
    router.push('/');
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    {
      id: 'delivery-address',
      label: 'Delivery Address',
      icon: MapPin,
      onClick: () => router.push('/profile/delivery-address'),
    },
    {
      id: 'my-orders',
      label: 'My Orders',
      icon: FileText,
      onClick: () => router.push('/orders'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <div className='w-full max-w-66.5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
      {/* User Profile */}
      <button
        onClick={() => router.push('/profile')}
        className='mb-5 flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80'
      >
        <div className='bg-primary-600 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full'>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='h-full w-full object-cover'
            />
          ) : (
            <span className='text-base font-bold text-white'>
              {user?.name ? getInitials(user.name) : 'U'}
            </span>
          )}
        </div>
        <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
          {user?.name || 'User'}
        </span>
      </button>

      {/* Navigation */}
      <nav className='flex flex-col gap-1'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-950 hover:bg-gray-100'
              }`}
            >
              <Icon className='h-5 w-5' strokeWidth={2} />
              <span className='text-base leading-7.5 font-medium tracking-[-0.32px]'>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
