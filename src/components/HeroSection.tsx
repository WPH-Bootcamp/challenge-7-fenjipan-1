"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useFilters } from "@/features/filters";

export function HeroSection() {
  const { searchQuery, search } = useFilters();

  return (
    <section className="relative h-206.75 w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-food.png"
          alt="Delicious food background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-60% to-black/80" />
      </div>

      {/* Content */}
      <div className="absolute left-1/2 top-81.5 flex w-full max-w-178 -translate-x-1/2 flex-col items-center gap-10 px-4">
        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl md:leading-15">
            Explore Culinary Experiences
          </h1>
          <p className="text-lg font-bold leading-9 md:text-2xl">
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex h-14 w-full max-w-151 items-center gap-[6px] rounded-full bg-white px-6 py-2 shadow-lg">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            placeholder="Search restaurants, food and drink"
            className="flex-1 bg-transparent text-base font-normal tracking-[-0.32px] text-gray-950 placeholder:text-gray-600 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}
