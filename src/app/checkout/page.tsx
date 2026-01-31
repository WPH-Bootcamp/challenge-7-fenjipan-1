"use client";

import { Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import CheckoutPage from "@/views/checkoutPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutPage />
      </Suspense>
    </ProtectedRoute>
  );
}
