"use client";

import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        fetch(`http://localhost:5000/api/search?q=${query}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions([
              ...data.products.map((p: any) => ({
                label: p.title,
                url: `/products/${p.id}`, // dummyjson products use `id`
              })),
              ...data.blogs.map((b: any) => ({
                label: b.title,
                url: `/Blog/${b._id}`,
              })),
              ...data.pages.map((pg: any) => ({
                label: pg.name,
                url: pg.url,
              })),
            ]);
          });
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/${query}`;
  };

  return (
    <div className="relative w-[500px]">
      <PlaceholdersAndVanishInput
        placeholders={[
          "Search Products...",
          "Search Blogs...",
          "How to contact us...",
          "About",
          "Terms and Conditions",
        ]}
        onChange={handleChange}
        onSubmit={onSubmit}
        className="bg-white md:w-full w-35 h-10"
        inputClassName="text-gray-800"
        buttonClassName="bg-blue-500 hover:bg-blue-700"
        placeholderClassName="text-gray-400"
        canvasClassName="opacity-50"
      />

      {/* Suggestion dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg border z-50">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer "
              onClick={() => (window.location.href = s.url)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
