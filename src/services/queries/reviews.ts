import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyReviews,
  getRestaurantReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/api";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  ApiError,
} from "@/types/api";
import type { AxiosError } from "axios";
import { toast } from "sonner";

// Get current user's reviews
export function useMyReviews(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["my-reviews", page, limit],
    queryFn: () => getMyReviews(page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

// Get reviews for a specific restaurant
export function useRestaurantReviews(
  restaurantId: number,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ["reviews", "restaurant", restaurantId, page, limit],
    queryFn: () => getRestaurantReviews(restaurantId, page, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!restaurantId,
  });
}

// Create a new review (per transaction)
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_, variables) => {
      // Invalidate restaurant reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "restaurant", variables.restaurantId],
      });
      // Invalidate user's reviews
      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
      // Invalidate restaurant detail to update rating
      queryClient.invalidateQueries({
        queryKey: ["restaurant", variables.restaurantId],
      });
      toast.success("Review submitted successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Failed to submit review";
      toast.error(message);
    },
  });
}

// Update a review
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateReviewPayload;
      restaurantId: number;
    }) => updateReview(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "restaurant", variables.restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
      toast.success("Review updated successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Failed to update review";
      toast.error(message);
    },
  });
}

// Delete a review
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; restaurantId: number }) =>
      deleteReview(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "restaurant", variables.restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
      toast.success("Review deleted successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Failed to delete review";
      toast.error(message);
    },
  });
}
