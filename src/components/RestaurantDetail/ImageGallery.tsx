"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="mb-4 flex h-60 w-full items-center justify-center rounded-2xl bg-gray-100 md:mb-6 md:h-100 md:rounded-3xl">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const mainImage = images[selectedImage] || images[0];
  const thumbnails = images.slice(0, 4);

  return (
    <div className="mb-4 md:mb-6">
      {/* Mobile: Single image with dots */}
      <div className="md:hidden">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl">
          <Image
            src={mainImage}
            alt="Restaurant main"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {images.slice(0, 4).map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === selectedImage ? "bg-primary-600" : "bg-gray-300"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden gap-4 md:grid md:grid-cols-[2fr_1fr]">
        {/* Main Image */}
        <div className="relative h-100 w-full overflow-hidden rounded-[30px] lg:h-130">
          <Image
            src={mainImage}
            alt="Restaurant main"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-1 gap-4">
          {thumbnails.slice(0, 3).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1 < images.length ? index + 1 : index)}
              className="relative h-30 w-full overflow-hidden rounded-4xl transition-opacity hover:opacity-80 lg:h-40"
            >
              <Image
                src={image}
                alt={`Restaurant ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
