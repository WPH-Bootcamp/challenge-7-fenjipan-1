"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import { Button } from "@/ui/button";
import { MenuItemCard } from "./MenuItemCard";
import type { Menu, CartRestaurant } from "@/types/api";

interface MenuSectionProps {
  menus: Menu[];
  restaurant: CartRestaurant;
}

const INITIAL_DISPLAY_COUNT = 8;

export function MenuSection({ menus, restaurant }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filteredMenus =
    activeTab === "all"
      ? menus
      : menus.filter((menu) => menu.type.toLowerCase() === activeTab);

  const displayedMenus = showAll
    ? filteredMenus
    : filteredMenus.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="mb-6 md:mb-10">
      <h2 className="mb-4 text-lg font-extrabold text-gray-950 md:mb-6 md:text-2xl">
        Menu
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 h-auto w-full justify-start gap-2 rounded-none bg-transparent p-0 md:mb-6">
          <TabsTrigger
            value="all"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-950 data-[state=active]:border-primary-600 data-[state=active]:bg-primary-600 data-[state=active]:text-white md:px-6 md:py-2 md:text-sm md:font-semibold"
          >
            All Menu
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-950 data-[state=active]:border-primary-600 data-[state=active]:bg-primary-600 data-[state=active]:text-white md:px-6 md:py-2 md:text-sm md:font-semibold"
          >
            Food
          </TabsTrigger>
          <TabsTrigger
            value="drink"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-950 data-[state=active]:border-primary-600 data-[state=active]:bg-primary-600 data-[state=active]:text-white md:px-6 md:py-2 md:text-sm md:font-semibold"
          >
            Drink
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {displayedMenus.map((menu) => (
              <MenuItemCard key={menu.id} menu={menu} restaurant={restaurant} />
            ))}
          </div>

          {/* Show More Button */}
          {filteredMenus.length > INITIAL_DISPLAY_COUNT && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="h-10 rounded-full border-gray-300 px-8 text-sm font-semibold text-gray-950 hover:bg-gray-50"
              >
                {showAll ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredMenus.length === 0 && (
        <p className="py-10 text-center text-gray-500">
          No menu items available
        </p>
      )}
    </div>
  );
}
