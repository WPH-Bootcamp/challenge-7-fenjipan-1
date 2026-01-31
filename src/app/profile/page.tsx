'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileSidebar } from '@/components/Profile';
import { Button } from '@/ui/button';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/services/queries';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: {
      name?: string;
      email?: string;
      phone?: string;
      avatar?: File;
    } = {};

    // Only include changed fields
    if (name !== user?.name) payload.name = name;
    if (email !== user?.email) payload.email = email;
    if (phone !== user?.phone) payload.phone = phone;
    if (avatarFile) payload.avatar = avatarFile;

    // Only update if there are changes
    if (Object.keys(payload).length > 0) {
      updateProfile.mutate(payload, {
        onSuccess: () => {
          setIsEditing(false);
          setAvatarFile(null);
        },
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
    }
    setIsEditing(false);
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

  const hasChanges =
    name !== (user?.name || '') ||
    email !== (user?.email || '') ||
    phone !== (user?.phone || '') ||
    avatarFile !== null;

  return (
    <div className='min-h-screen bg-white'>
      <Navbar variant='solid' />

      <main className='mx-auto max-w-360 px-4 py-12 lg:px-30'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]'>
          {/* Sidebar */}
          <ProfileSidebar />

          {/* Main Content */}
          <div className='flex max-w-131 flex-col gap-6'>
            {/* Header */}
            <h1 className='text-[32px] leading-10.5 font-extrabold text-gray-950'>
              Profile
            </h1>

            {/* Profile Card */}
            {isEditing ? (
              // Edit Mode
              <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'
              >
                <div className='flex flex-col gap-3'>
                  {/* Avatar */}
                  <button
                    type='button'
                    onClick={handleAvatarClick}
                    className='group bg-primary-600 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full'
                  >
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt={name || 'User'}
                        fill
                        className='object-cover'
                        unoptimized={!avatarPreview?.includes('cloudinary.com')}
                      />
                    ) : (
                      <span className='text-2xl font-bold text-white'>
                        {name ? getInitials(name) : 'U'}
                      </span>
                    )}
                    <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Camera className='h-6 w-6 text-white' />
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />

                  {/* Name Input */}
                  <div className='flex items-center justify-between'>
                    <label className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Name
                    </label>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='focus:border-primary-600 w-1/2 rounded-lg border border-gray-300 px-3 py-1 text-right text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950 focus:outline-none'
                    />
                  </div>

                  {/* Email Input */}
                  <div className='flex items-center justify-between'>
                    <label className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='focus:border-primary-600 w-1/2 rounded-lg border border-gray-300 px-3 py-1 text-right text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950 focus:outline-none'
                    />
                  </div>

                  {/* Phone Input */}
                  <div className='flex items-center justify-between'>
                    <label className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Nomor Handphone
                    </label>
                    <input
                      type='tel'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='focus:border-primary-600 w-1/2 rounded-lg border border-gray-300 px-3 py-1 text-right text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950 focus:outline-none'
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                  <Button
                    type='button'
                    onClick={handleCancelEdit}
                    className='h-11 flex-1 rounded-full border border-gray-300 bg-white text-base leading-7.5 font-bold tracking-[-0.32px] text-gray-950 hover:bg-gray-100'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={updateProfile.isPending || !hasChanges}
                    className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 h-11 flex-1 rounded-full text-base leading-7.5 font-bold tracking-[-0.32px] disabled:opacity-50'
                  >
                    {updateProfile.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            ) : (
              // View Mode
              <div className='flex flex-col rounded-2xl bg-white p-5 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]'>
                <div className='flex flex-col gap-3'>
                  {/* Avatar */}
                  <div className='bg-primary-600 relative h-16 w-16 overflow-hidden rounded-full'>
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt={name || 'User'}
                        fill
                        className='object-cover'
                        unoptimized={!avatarPreview?.includes('cloudinary.com')}
                      />
                    ) : (
                      <span className='flex h-full w-full items-center justify-center text-2xl font-bold text-white'>
                        {name ? getInitials(name) : 'U'}
                      </span>
                    )}
                  </div>

                  {/* Name Row */}
                  <div className='flex items-center justify-between'>
                    <span className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Name
                    </span>
                    <span className='text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950'>
                      {user?.name || '-'}
                    </span>
                  </div>

                  {/* Email Row */}
                  <div className='flex items-center justify-between'>
                    <span className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Email
                    </span>
                    <span className='text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950'>
                      {user?.email || '-'}
                    </span>
                  </div>

                  {/* Phone Row */}
                  <div className='flex items-center justify-between'>
                    <span className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
                      Nomor Handphone
                    </span>
                    <span className='text-base leading-7.5 font-semibold tracking-[-0.32px] text-gray-950'>
                      {user?.phone || '-'}
                    </span>
                  </div>
                </div>

                {/* Update Profile Button */}
                <Button
                  type='button'
                  onClick={() => setIsEditing(true)}
                  className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 mt-5 h-11 w-full rounded-full text-base leading-7.5 font-bold tracking-[-0.32px]'
                >
                  Update Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
