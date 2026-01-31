// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Cache times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "done",
  CANCELLED: "cancelled",
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  TRANSFER: "transfer",
  EWALLET: "ewallet",
} as const;

// Food types
export const FOOD_TYPES = {
  FOOD: "food",
  DRINK: "drink",
} as const;

// Filter options
export const DISTANCE_OPTIONS = [
  { value: "nearby", label: "Nearby" },
  { value: "1", label: "< 1 km" },
  { value: "3", label: "< 3 km" },
  { value: "5", label: "< 5 km" },
] as const;

export const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name" },
] as const;

export const RATING_OPTIONS = [
  { value: 4, label: "4+ Stars" },
  { value: 3, label: "3+ Stars" },
  { value: 2, label: "2+ Stars" },
  { value: 1, label: "1+ Stars" },
] as const;
