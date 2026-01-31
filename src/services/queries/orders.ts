import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkout, getMyOrders } from "@/services/api";
import type { CheckoutPayload, ApiError } from "@/types/api";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Get user's orders with status filter and pagination
export function useMyOrders(
  status: string = "done",
  page: number = 1,
  limit: number = 10
) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["orders", status, page, limit],
    queryFn: () => getMyOrders(status, page, limit),
    staleTime: 60 * 1000,
    enabled: isAuthenticated, // Only fetch when authenticated
  });
}

// Create order (checkout)
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkout(payload),
    onSuccess: () => {
      // Invalidate all order queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Clear cart after successful checkout
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Order placed successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Failed to place order";
      toast.error(message);
    },
  });
}
