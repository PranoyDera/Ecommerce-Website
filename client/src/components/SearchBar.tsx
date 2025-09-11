"use client";

import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { apiGet } from "@/app/utils/api";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        const fetchSuggestions = async () => {
          try {
            setLoading(true);
            const data = await apiGet<{
              products: any[];
              blogs: any[];
              pages: any[];
            }>(`/api/search?q=${encodeURIComponent(query)}`);

            setSuggestions([
              ...data.products.map((p: any) => ({
                label: p.title,
                url: `/products/${p.id}`,
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
          } catch (err) {
            console.error("Error fetching search results:", err);
            setSuggestions([]);
          } finally {
            setLoading(false);
          }
        };

        fetchSuggestions();
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
        className="bg-white w-full h-10 text-black rounded-lg"
        inputClassName="bg-blue-50"
        buttonClassName=""
        placeholderClassName="text-gray-400"
        canvasClassName="opacity-50"
      />

      {/* Loader */}
      {loading && (
        <div className="absolute top-full mt-2 w-full bg-white text-center text-gray-600 py-2 rounded-lg shadow-md z-50">
          Fetching search results...
        </div>
      )}

      {/* Suggestion dropdown */}
      {!loading && suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg z-50">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
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
