import { api } from "./axios";
import type {
  ApiResponse,
  CheckoutPayload,
  CheckoutResponse,
  OrdersResponse,
} from "@/types/api";

// Checkout / create order directly from menu items (not from cart)
export async function checkout(payload: CheckoutPayload) {
  const res = await api.post<ApiResponse<CheckoutResponse>>(
    "/api/order/checkout",
    payload
  );
  return res.data;
}

// Get user's orders (grouped by transaction)
export async function getMyOrders(
  status: string = "done",
  page: number = 1,
  limit: number = 10
) {
  const params = new URLSearchParams();
  params.append("status", status);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await api.get<ApiResponse<OrdersResponse>>(
    `/api/order/my-order?${params}`
  );
  return res.data;
}
