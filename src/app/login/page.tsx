"use client";

import { GuestRoute } from "@/components/ProtectedRoute";
import LoginPage from "@/views/loginPage";

export default function Login() {
  return (
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  );
}
