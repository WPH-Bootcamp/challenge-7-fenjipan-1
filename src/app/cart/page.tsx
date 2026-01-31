"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import CartPage from "@/views/cartPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  );
}
