"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Footer } from "@/components/Footer";
import { useRestaurants } from "@/services/queries";
import { useFilteredRestaurants } from "@/features/filters";
import { Skeleton } from "@/ui/skeleton";
import { Button } from "@/ui/button";

const ITEMS_PER_PAGE = 12;

export default function MenuPage() {
  const { data: restaurantsResponse, isLoading } = useRestaurants();
  const restaurants = restaurantsResponse?.data?.restaurants || [];
  const filteredItems = useFilteredRestaurants(restaurants);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navbar - overlays hero */}
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10 -mt-11xl pb-20">
        {/* Categories */}
        <div className="mb-12">
          <CategoryFilter />
        </div>

        {/* Recommended Section */}
        <section className="mx-auto w-full max-w-300 px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold leading-10.5 text-gray-950 md:text-[32px]">
              Recommended
            </h2>
            <button className="text-lg font-extrabold leading-8 tracking-[-0.36px] text-primary-600">
              See All
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]"
                >
                  <Skeleton className="h-30 w-30 rounded-xl" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl font-semibold text-gray-600">
                No restaurants found
              </p>
              <p className="mt-2 font-(--font-nunito) text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => {
                      window.location.href = `/restaurant/${restaurant.id}`;
                    }}
                  />
                ))}
              </div>

              {/* Show More Button */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleShowMore}
                    className="h-12 w-40 rounded-full border-gray-300 text-base font-bold tracking-[-0.32px] text-gray-950"
                  >
                    Show More
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
