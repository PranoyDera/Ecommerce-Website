"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedCategory = searchParams.get("category") || "all";
  const [categories, setCategories] = useState<string[]>([]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // ✅ Fetch categories once
  useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
      .then((res) => res.json())
      .then((data) => {
        setCategories(["all", ...data]); // prepend "all"
      });
  }, []);

  // ✅ Handle category change in URL
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ✅ Scroll buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ✅ Auto scroll to selected category (always center)
  useEffect(() => {
    if (selectedCategory && categoryRefs.current[selectedCategory]) {
      categoryRefs.current[selectedCategory]?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // 🔥 ensures centering horizontally
        block: "nearest",
      });
    }
  }, [selectedCategory]);

  return (
    <div className="relative flex items-center w-full mb-6">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Categories Slider */}
      <div
        ref={scrollRef}
        className="rounded-3xl flex gap-4 overflow-x-auto px-12 scroll-smooth whitespace-nowrap w-full bg-gradient-to-r from-[#fceabb] to-[#f8b500] scrollbar-hide h-[50px] items-center shadow-inner"
      >
        {categories.map((category) => (
          <div
            key={category}
            ref={(el) => (categoryRefs.current[category] = el)}
            onClick={() => handleChange(category)}
            className={`flex justify-center items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium uppercase transition-all duration-200 shadow-sm ${
              category === selectedCategory
                ? "bg-white text-red-700 font-semibold shadow-md scale-105"
                : "bg-white/70 text-gray-800 hover:bg-white hover:scale-105"
            }`}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Categories;
