"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/avatar";
import { Skeleton } from "@/ui/skeleton";
import type { ReviewDetail } from "@/types/api";
import dayjs from "dayjs";

interface ReviewsSectionProps {
  reviews: ReviewDetail[];
  restaurantStar: number;
  isLoading?: boolean;
}

export function ReviewsSection({
  reviews,
  restaurantStar,
  isLoading,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  if (isLoading) {
    return (
      <div className="mb-6 md:mb-10">
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 md:mb-10">
      <h2 className="mb-3 text-lg font-extrabold text-gray-950 md:mb-4 md:text-2xl">
        Review
      </h2>

      {/* Rating Summary */}
      <div className="mb-4 flex items-center gap-1.5 md:mb-6 md:gap-2">
        <Star className="h-4 w-4 fill-[#fdb022] text-[#fdb022] md:h-5 md:w-5" />
        <span className="text-sm font-semibold text-gray-950 md:text-lg">
          {restaurantStar.toFixed(1)}
        </span>
        <span className="text-xs text-gray-600 md:text-sm">
          ({reviews.length} Ulasan)
        </span>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No reviews yet</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          {reviews.length > 5 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="rounded-full border border-gray-300 px-8 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-50 md:text-base"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewDetail;
}

function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name || "Anonymous";
  const userAvatar = review.user?.avatar || undefined;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      {/* User Info Row */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0 md:h-12 md:w-12">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary-600 text-sm text-white md:text-base">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-gray-950 md:text-base">
            {userName}
          </h4>
          <p className="text-xs text-gray-600 md:text-sm">
            {dayjs(review.createdAt).format("D MMMM YYYY, HH:mm")}
          </p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex gap-0.5 md:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 md:h-5 md:w-5 ${
              star <= review.star
                ? "fill-[#fdb022] text-[#fdb022]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-sm leading-6 text-gray-700 md:text-base md:leading-7">
        {review.comment}
      </p>
    </div>
  );
}
