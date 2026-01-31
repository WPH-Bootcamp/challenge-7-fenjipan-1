'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/ui/button';
import { useCreateReview } from '@/services/queries';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  transactionId: string;
  restaurantId: number;
  menuIds?: number[];
}

export function ReviewModal({
  isOpen,
  onClose,
  restaurantName,
  transactionId,
  restaurantId,
  menuIds,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }

    createReview(
      {
        transactionId,
        restaurantId,
        star: rating,
        comment,
        menuIds,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setRating(0);
    setComment('');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50' onClick={handleClose} />

      {/* Content */}
      <div className='relative z-10 mx-4 w-full max-w-109.75 rounded-2xl bg-white shadow-lg'>
        <div className='flex flex-col px-6 py-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl leading-9 font-extrabold text-gray-950'>
              Give Review
            </h2>
            <button
              onClick={handleClose}
              className='flex h-6 w-6 items-center justify-center text-gray-950 transition-colors hover:text-gray-700'
            >
              <X className='h-6 w-6' strokeWidth={2} />
            </button>
          </div>

          {/* Rating Section */}
          <div className='mt-6 flex flex-col items-center'>
            <p className='text-base leading-7.5 font-medium tracking-[-0.32px] text-gray-950'>
              Give Rating
            </p>
            <div className='flex items-center justify-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className='transition-transform hover:scale-110'
                >
                  <Star
                    className={`h-12.25 w-12.25 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-accent-yellow text-accent-yellow'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Please share your thoughts about our service!'
            className='focus:border-primary-600 focus:ring-primary-600 mt-6 h-58.75 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base leading-7.5 tracking-[-0.32px] text-gray-950 placeholder:text-gray-500 focus:ring-1 focus:outline-none'
          />

          {/* Submit Button */}
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className='bg-primary-600 text-gray-25 hover:bg-primary-600/90 mt-6 h-12 w-full rounded-full text-base leading-7.5 font-bold tracking-[-0.32px] disabled:opacity-50'
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
