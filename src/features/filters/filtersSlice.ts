import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SortOption } from "../../types/menu";

interface FiltersState {
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: SortOption;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  minRating: number | null;
}

const initialState: FiltersState = {
  searchQuery: "",
  selectedCategory: null,
  sortBy: "default",
  priceRange: {
    min: null,
    max: null,
  },
  minRating: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },

    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },

    setPriceRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.priceRange = action.payload;
    },

    setMinRating: (state, action: PayloadAction<number | null>) => {
      state.minRating = action.payload;
    },

    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = null;
      state.sortBy = "default";
      state.priceRange = { min: null, max: null };
      state.minRating = null;
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
