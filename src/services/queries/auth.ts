import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiResponse,
  ApiError,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
  UpdateProfilePayload,
} from "@/types/api";
import { AxiosError } from "axios";
import { loginUser, registerUser, getProfile, updateProfile } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useLogin() {
  const { login } = useAuth();

  return useMutation<
    ApiResponse<AuthResponse>,
    AxiosError<ApiError>,
    LoginPayload
  >({
    mutationFn: (payload) => loginUser(payload),

    onSuccess: (data) => {
      login(data.data.token, data.data.user);
      toast.success("Login Berhasil");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ?? error.message ?? "Login Gagal";
      toast.error(message);
    },
  });
}

export function useRegister() {
  const { login } = useAuth();

  return useMutation<
    ApiResponse<AuthResponse>,
    AxiosError<ApiError>,
    RegisterPayload
  >({
    mutationFn: (payload) => registerUser(payload),

    onSuccess: (data) => {
      login(data.data.token, data.data.user);
      toast.success("Registrasi Berhasil");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ?? error.message ?? "Registrasi Gagal";
      toast.error(message);
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation<ApiResponse<User>, AxiosError<ApiError>, UpdateProfilePayload>({
    mutationFn: (payload) => updateProfile(payload),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      await refreshUser();
      toast.success("Profil berhasil diperbarui");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ?? error.message ?? "Gagal memperbarui profil";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("token");
    queryClient.clear();
    toast.success("Logout berhasil");
  };
}
