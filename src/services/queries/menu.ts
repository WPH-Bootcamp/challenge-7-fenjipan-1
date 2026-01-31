import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getRestaurants,
  getNearbyRestaurants,
  getRecommendedRestaurants,
  getBestSellerRestaurants,
  searchRestaurants,
  getRestaurantDetail,
} from "@/services/api";
import type { RestaurantFilters } from "@/types/api";

// Get all restaurants with filters
export function useRestaurants(filters?: RestaurantFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: () => getRestaurants(filters),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// Get nearby restaurants (requires user location to be set)
export function useNearbyRestaurants(range: number = 10, limit: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: ["restaurants", "nearby", range, limit],
    queryFn: () => getNearbyRestaurants(range, limit),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// Get recommended restaurants (requires authentication)
export function useRecommendedRestaurants(enabled: boolean = true) {
  const query = useQuery({
    queryKey: ["restaurants", "recommended"],
    queryFn: getRecommendedRestaurants,
    staleTime: 5 * 60 * 1000,
    enabled,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Show toast error when authentication fails
  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError;
      if (error.response?.status === 401) {
        toast.error("You must login to see recommended restaurants");
      }
    }
  }, [query.error]);

  return query;
}

// Get best seller restaurants
export function useBestSellerRestaurants(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["restaurants", "bestseller", page, limit],
    queryFn: () => getBestSellerRestaurants(page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

// Search restaurants by name
export function useSearchRestaurants(query: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["restaurants", "search", query, page, limit],
    queryFn: () => searchRestaurants(query, page, limit),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}

// Get restaurant detail
export function useRestaurantDetail(
  id: number,
  limitMenu: number = 10,
  limitReview: number = 6
) {
  return useQuery({
    queryKey: ["restaurant", id, limitMenu, limitReview],
    queryFn: () => getRestaurantDetail(id, limitMenu, limitReview),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
