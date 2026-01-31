// Route paths for the application
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  MENU: "/menu",
  RESTAURANTS: "/restaurants",
  RESTAURANT_DETAIL: (id: number | string) => `/restaurant/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  PROFILE: "/profile",
} as const;

// Route names for display
export const ROUTE_NAMES: Record<string, string> = {
  "/": "Home",
  "/login": "Login",
  "/menu": "Menu",
  "/restaurants": "Restaurants",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/orders": "Orders",
  "/profile": "Profile",
};
