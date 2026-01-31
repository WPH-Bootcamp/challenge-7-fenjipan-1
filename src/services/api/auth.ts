import { api } from "./axios";
import type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
  UpdateProfilePayload,
} from "@/types/api";

// Login user
export async function loginUser(payload: LoginPayload) {
  const res = await api.post<ApiResponse<AuthResponse>>(
    "/api/auth/login",
    payload
  );
  return res.data;
}

// Register new user
export async function registerUser(payload: RegisterPayload) {
  const res = await api.post<ApiResponse<AuthResponse>>(
    "/api/auth/register",
    payload
  );
  return res.data;
}

// Get user profile
export async function getProfile() {
  const res = await api.get<ApiResponse<User>>("/api/auth/profile");
  return res.data;
}

// Update user profile (supports file upload for avatar)
export async function updateProfile(payload: UpdateProfilePayload) {
  const formData = new FormData();

  if (payload.name) formData.append("name", payload.name);
  if (payload.email) formData.append("email", payload.email);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  const res = await api.put<ApiResponse<User>>("/api/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
