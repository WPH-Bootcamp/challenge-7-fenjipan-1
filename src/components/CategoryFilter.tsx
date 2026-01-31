"use client";

import Image from "next/image";
import { useFilters } from "@/features/filters";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Restaurant", icon: "/images/category-allfood.png" },
  { id: "nearby", name: "Nearby", icon: "/images/category-nearby.png" },
  { id: "discount", name: "Discount", icon: "/images/category-discount.png" },
  { id: "bestseller", name: "Best Seller", icon: "/images/category-bestseller.png" },
  { id: "delivery", name: "Delivery", icon: "/images/category-delivery.png" },
  { id: "lunch", name: "Lunch", icon: "/images/category-lunch.png" },
];

export function CategoryFilter() {
  const { selectedCategory, selectCategory } = useFilters();

  return (
    <section className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-between gap-4 px-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() =>
            selectCategory(
              selectedCategory === category.id ? null : category.id
            )
          }
          className="group flex w-11xl flex-col items-center gap-[6px] lg:w-40.25"
        >
          <div
            className={cn(
              "flex h-[80px] w-full items-center justify-center rounded-2xl bg-white p-2 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-all lg:h-25",
              selectedCategory === category.id &&
                "ring-2 ring-primary-600 ring-offset-2"
            )}
          >
            <div className="relative h-12.5 w-12.5 lg:h-16.25 lg:w-16.25">
              <Image
                src={category.icon}
                alt={category.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <span
            className={cn(
              "text-center text-sm font-bold leading-8 tracking-[-0.54px] text-gray-950 lg:text-lg",
              selectedCategory === category.id && "text-primary-600"
            )}
          >
            {category.name}
          </span>
        </button>
      ))}
    </section>
  );
}
