import { api } from "./axios";
import type {
  ApiResponse,
  CreatedReview,
  UpdatedReview,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewsResponse,
  RestaurantReviewsResponse,
} from "@/types/api";

// Get current user's reviews
export async function getMyReviews(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<ReviewsResponse>>(
    `/api/review/my-reviews?${params}`
  );
  return res.data;
}

// Get reviews for a specific restaurant
export async function getRestaurantReviews(
  restaurantId: number,
  page: number = 1,
  limit: number = 10
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<RestaurantReviewsResponse>>(
    `/api/review/restaurant/${restaurantId}?${params}`
  );
  return res.data;
}

// Create a new review (per transaction)
export async function createReview(payload: CreateReviewPayload) {
  const res = await api.post<ApiResponse<{ review: CreatedReview }>>(
    "/api/review",
    payload
  );
  return res.data;
}

// Update a review (user can only update their own review)
export async function updateReview(id: number, payload: UpdateReviewPayload) {
  const res = await api.put<ApiResponse<{ review: UpdatedReview }>>(
    `/api/review/${id}`,
    payload
  );
  return res.data;
}

// Delete a review (user can only delete their own review)
export async function deleteReview(id: number) {
  const res = await api.delete<ApiResponse<null>>(
    `/api/review/${id}`
  );
  return res.data;
}
