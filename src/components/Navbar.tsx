'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, FileText, LogOut } from 'lucide-react';
import { useServerCart } from '@/services/queries';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  variant?: 'transparent' | 'solid';
}

export function Navbar({ variant = 'transparent' }: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cartResponse } = useServerCart();
  const isTransparent = variant === 'transparent';

  const totalItems = cartResponse?.data?.summary?.totalItems || 0;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      className={`flex h-16 w-full items-center justify-between px-4 md:h-20 md:px-8 lg:px-30 ${
        isTransparent ? 'absolute top-0 left-0 z-50' : 'bg-white shadow-sm'
      }`}
    >
      {/* Logo */}
      <Link href='/' className='flex items-center gap-2 md:gap-3.75'>
        <div className='relative h-7 w-7 md:h-10.5 md:w-10.5'>
          <Image
            src='/images/foody-logo.svg'
            alt='Foody Logo'
            fill
            className='object-contain'
          />
        </div>
        <span
          className={`hidden text-[32px] leading-10.5 font-extrabold md:block ${
            isTransparent ? 'text-white' : 'text-gray-950'
          }`}
        >
          Foody
        </span>
      </Link>

      {/* Right section */}
      <div className='flex items-center gap-3 md:gap-4'>
        {/* Cart */}
        <button
          onClick={() => router.push('/cart')}
          className='relative'
          aria-label='Open cart'
        >
          <ShoppingBag
            className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-gray-950'}`}
          />
          {totalItems > 0 && (
            <span className='bg-primary-600 absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white'>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>

        {/* User / Auth */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-4 focus:outline-none'>
                <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 md:h-12 md:w-12'>
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className='object-cover'
                      unoptimized={!user.avatar?.includes('cloudinary.com')}
                    />
                  ) : (
                    <div className='bg-primary-600 flex h-full w-full items-center justify-center text-sm font-bold text-white'>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span
                  className={`hidden text-lg leading-8 font-semibold tracking-[-0.36px] md:block ${
                    isTransparent ? 'text-white' : 'text-gray-950'
                  }`}
                >
                  {user.name}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-49.25 rounded-2xl border-none p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'
            >
              {/* User Header */}
              <div className='flex items-center gap-2 pb-3'>
                <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200'>
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className='object-cover'
                      unoptimized={!user.avatar?.includes('cloudinary.com')}
                    />
                  ) : (
                    <div className='bg-primary-600 flex h-full w-full items-center justify-center text-sm font-bold text-white'>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className='text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950'>
                  {user.name}
                </span>
              </div>

              <DropdownMenuSeparator className='mx-0 bg-gray-200' />

              {/* Menu Items */}
              <div className='flex flex-col gap-3 pt-3'>
                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className='flex cursor-pointer items-center gap-2 p-0 focus:bg-transparent'
                >
                  <MapPin className='h-5 w-5 text-gray-950' />
                  <span className='text-sm leading-7 font-medium text-gray-950'>
                    Delivery Address
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push('/orders')}
                  className='flex cursor-pointer items-center gap-2 p-0 focus:bg-transparent'
                >
                  <FileText className='h-5 w-5 text-gray-950' />
                  <span className='text-sm leading-7 font-medium text-gray-950'>
                    My Orders
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className='flex cursor-pointer items-center gap-2 p-0 focus:bg-transparent'
                >
                  <LogOut className='h-5 w-5 text-gray-950' />
                  <span className='text-sm leading-7 font-medium text-gray-950'>
                    Logout
                  </span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className='flex items-center gap-2 md:gap-3'>
            <Link href='/login'>
              <Button
                variant='outline'
                size='sm'
                className={`h-8 rounded-full px-3 text-xs md:h-10 md:px-4 md:text-sm ${
                  isTransparent
                    ? 'border-white bg-transparent text-white hover:bg-white/10 hover:text-white'
                    : 'border-gray-300 text-gray-950'
                }`}
              >
                Sign In
              </Button>
            </Link>
            <Link href='/login' className='hidden md:block'>
              <Button className='hover:bg-primary-600/90 bg-primary-600 rounded-full'>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
