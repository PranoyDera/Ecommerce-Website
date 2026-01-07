'use client';

import React, { useEffect, useState, useRef } from 'react';

type CarouselProps = {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
};

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (autoSlide) {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, autoSlideInterval);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset the auto slide on interaction
 useEffect(() => {
  resetAutoSlide();
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, [currentIndex]);

  return (
   <div className="relative w-full overflow-hidden rounded-xl shadow-md h-[200px] md:h-[400px] mt-4">

      {/* Slide container */}
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className="w-full flex-shrink-0 object-cover h-66 md:h-100"
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          goToPrevious();
        }}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
      >
        ❮
      </button>
      <button
        onClick={() => {
          goToNext();
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white p-2 rounded-full z-10"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToIndex(idx)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === idx ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
