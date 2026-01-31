// Base API Response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: string[];
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
}

// Auth
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: File;
}

// Restaurant
export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  lat: number;
  long: number;
  logo: string;
  images: string[];
  category?: string;
  reviewCount?: number;
  menuCount?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  distance?: number;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  pagination: Pagination;
  filters?: {
    range: number | null;
    priceMin: number | null;
    priceMax: number | null;
    rating: number | null;
    category: string | null;
  };
}

export interface NearbyRestaurantsResponse {
  restaurants: Restaurant[];
}

// Recommended restaurant with sample menus (API returns camelCase)
export interface SampleMenu {
  id: number;
  foodName: string;
  price: number;
  type: "food" | "drink";
  image?: string;
}

export interface RecommendedRestaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  lat: number;
  long: number;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  sampleMenus: SampleMenu[];
  isFrequentlyOrdered: boolean;
  distance?: number;
}

export interface RecommendedRestaurantsResponse {
  recommendations: RecommendedRestaurant[];
  message: string;
}

// Menu (API returns camelCase)
export interface Menu {
  id: number;
  foodName: string;
  price: number;
  type: "food" | "drink";
  restoId: number;
  image?: string;
}

// Restaurant Detail
export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  lat: number;
  long: number;
  distance?: number;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: Menu[];
  reviews: ReviewDetail[];
}

// Cart (Raw schema)
export interface CartItemRaw {
  id: number;
  user_id: number;
  resto_id: number;
  menu_id: number;
  quantity: number;
}

// Cart (API response with expanded relations - returns camelCase)
export interface CartMenu {
  id: number;
  foodName: string;
  price: number;
  type: "food" | "drink";
  image?: string;
}

export interface CartRestaurant {
  id: number;
  name: string;
  logo: string;
}

export interface CartItem {
  id: number;
  menu: CartMenu;
  quantity: number;
  itemTotal: number;
}

// Response from POST/PUT cart (includes restaurant info)
export interface CartItemWithRestaurant {
  id: number;
  restaurant: CartRestaurant;
  menu: CartMenu;
  quantity: number;
  itemTotal: number;
}

export interface CartRestaurantGroup {
  restaurant: CartRestaurant;
  items: CartItem[];
  subtotal: number;
}

export interface CartResponse {
  cart: CartRestaurantGroup[];
  summary: {
    totalItems: number;
    totalPrice: number;
    restaurantCount: number;
  };
}

export interface AddToCartPayload {
  restaurantId: number;
  menuId: number;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

// Transaction / Order (Raw schema)
export interface TransactionRaw {
  transaction_id: string;
  user_id: number;
  payment_method: string;
  price: number;
  service_fee: number;
  delivery_fee: number;
  total_price: number;
  status: string;
}

// Transaction / Order (API response with expanded relations)
export interface OrderMenuItem {
  menuId: number;
  menuName: string;
  price: number;
  image?: string;
  quantity: number;
  itemTotal: number;
}

export interface OrderRestaurant {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: OrderMenuItem[];
  subtotal: number;
}

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  transactionId: string;
  status: string;
  paymentMethod: string;
  pricing: OrderPricing;
  deliveryAddress?: string;
  phone?: string;
  restaurants?: OrderRestaurant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
  filter: {
    status: string;
  };
}

export interface CheckoutPayload {
  restaurants: {
    restaurantId: number;
    items: {
      menuId: number;
      quantity: number;
    }[];
  }[];
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
  notes?: string;
}

export interface CheckoutResponse {
  transaction: Order;
}

// Review (Raw schema)
export interface ReviewRaw {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number; // 1-5
  comment: string;
}

// Review (API response with expanded relations)
export interface ReviewMenu {
  menuId: number;
  menuName: string;
  price: number;
  type: "food" | "drink";
  image: string;
  quantity: number;
}

export interface Review {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  comment: string;
  createdAt?: string;
  restaurant?: {
    id: number;
    name: string;
    logo?: string;
  };
  menus?: ReviewMenu[];
}

// Response from POST review
export interface CreatedReview {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  comment: string;
  createdAt?: string;
}

// Response from PUT review
export interface UpdatedReview {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  comment: string;
  updatedAt?: string;
}

export interface ReviewDetail {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  comment: string;
  createdAt?: string;
  user?: {
    id: number;
    name: string;
    avatar: string;
  };
}

export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment: string;
  menuIds?: number[];
}

export interface UpdateReviewPayload {
  star?: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
}

// Review with user info (for restaurant reviews endpoint)
export interface RestaurantReview {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  comment: string;
  createdAt?: string;
  user?: {
    id: number;
    name: string;
    avatar: string;
  };
  menus?: ReviewMenu[];
}

export interface RestaurantReviewsResponse {
  reviews: RestaurantReview[];
  pagination: Pagination;
}

// Restaurant Filters
export interface RestaurantFilters {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}
