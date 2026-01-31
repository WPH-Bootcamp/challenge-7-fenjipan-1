// UI-specific types for menu features
// API types are in @/types/api.ts

export type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Categories for the filter UI
export const categories: Category[] = [
  { id: "all", name: "All Restaurant" },
  { id: "nearby", name: "Nearby" },
  { id: "recommended", name: "Recommended" },
  { id: "bestseller", name: "Best Seller" },
];

// Local cart types (for Redux state)
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}
