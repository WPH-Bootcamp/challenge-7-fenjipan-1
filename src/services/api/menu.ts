import { api } from "./axios";
import type {
  ApiResponse,
  RestaurantListResponse,
  NearbyRestaurantsResponse,
  RecommendedRestaurantsResponse,
  RestaurantDetail,
  RestaurantFilters,
} from "@/types/api";

// Get all restaurants with optional filters
export async function getRestaurants(filters?: RestaurantFilters) {
  const params = new URLSearchParams();

  if (filters?.location) params.append("location", filters.location);
  if (filters?.range) params.append("range", filters.range.toString());
  if (filters?.priceMin) params.append("priceMin", filters.priceMin.toString());
  if (filters?.priceMax) params.append("priceMax", filters.priceMax.toString());
  if (filters?.rating) params.append("rating", filters.rating.toString());
  if (filters?.category) params.append("category", filters.category);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const res = await api.get<ApiResponse<RestaurantListResponse>>(
    `/api/resto${params.toString() ? `?${params}` : ""}`
  );
  return res.data;
}

// Get nearby restaurants (requires user location to be set in profile)
export async function getNearbyRestaurants(range: number = 10, limit: number = 20) {
  const params = new URLSearchParams();
  params.append("range", range.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<NearbyRestaurantsResponse>>(
    `/api/resto/nearby?${params}`
  );
  return res.data;
}

// Get recommended restaurants
export async function getRecommendedRestaurants() {
  const res = await api.get<ApiResponse<RecommendedRestaurantsResponse>>(
    "/api/resto/recommended"
  );
  return res.data;
}

// Get best seller restaurants
export async function getBestSellerRestaurants(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<RestaurantListResponse>>(
    `/api/resto/best-seller?${params}`
  );
  return res.data;
}

// Search restaurants by name
export async function searchRestaurants(query: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams();
  params.append("q", query);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<RestaurantListResponse & { searchQuery: string }>>(
    `/api/resto/search?${params}`
  );
  return res.data;
}

// Get restaurant detail with menus and reviews
export async function getRestaurantDetail(
  id: number,
  limitMenu: number = 10,
  limitReview: number = 6
) {
  const params = new URLSearchParams();
  params.append("limitMenu", limitMenu.toString());
  params.append("limitReview", limitReview.toString());

  const res = await api.get<ApiResponse<RestaurantDetail>>(
    `/api/resto/${id}?${params}`
  );
  return res.data;
}
