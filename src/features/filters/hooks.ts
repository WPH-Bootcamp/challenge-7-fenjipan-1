import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  setSearchQuery,
  setCategory,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
} from "./filtersSlice";
import type { SortOption, MenuItem } from "../../types/menu";
import type { Restaurant } from "../../types/api";
import { useMemo } from "react";

export const useFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  return {
    ...filters,

    search: (query: string) => dispatch(setSearchQuery(query)),

    selectCategory: (category: string | null) => dispatch(setCategory(category)),

    sort: (sortBy: SortOption) => dispatch(setSortBy(sortBy)),

    setPrice: (min: number | null, max: number | null) =>
      dispatch(setPriceRange({ min, max })),

    setRating: (rating: number | null) => dispatch(setMinRating(rating)),

    reset: () => dispatch(resetFilters()),
  };
};

export const useFilteredMenu = (menuItems: MenuItem[]) => {
  const { searchQuery, selectedCategory, sortBy, priceRange, minRating } =
    useSelector((state: RootState) => state.filters);

  return useMemo(() => {
    let filtered = [...menuItems];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange.min !== null) {
      filtered = filtered.filter((item) => item.price >= priceRange.min!);
    }
    if (priceRange.max !== null) {
      filtered = filtered.filter((item) => item.price <= priceRange.max!);
    }

    // Filter by rating
    if (minRating !== null) {
      filtered = filtered.filter((item) => item.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [menuItems, searchQuery, selectedCategory, sortBy, priceRange, minRating]);
};

export const useFilteredRestaurants = (restaurants: Restaurant[]) => {
  const { searchQuery, sortBy, minRating } = useSelector(
    (state: RootState) => state.filters
  );

  return useMemo(() => {
    let filtered = [...restaurants];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.place.toLowerCase().includes(query)
      );
    }

    // Filter by rating
    if (minRating !== null) {
      filtered = filtered.filter((item) => item.star >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.star - a.star);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [restaurants, searchQuery, sortBy, minRating]);
};
