"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

type BlogCardProps = {
  id: string; // blog id
  image: string;
  title: string;
  description: string;
  author: string;
  authorImage?: string;
  readTime?: string;
  className?: string;

  // 🔹 Actions
  onDelete?: (id: string) => void;
  readMoreLink?: string; // for routing
};

export default function BlogCard({
  id,
  image,
  title,
  description,
  author,
  authorImage = "/default-avatar.png",
  readTime = "2 min read",
  className,
  onDelete,
  readMoreLink,
}: BlogCardProps) {
  return (
    <div className={cn("max-w-xs w-full group/card", className)}>
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 bg-cover bg-center"
        )}
        style={{ backgroundImage: `url(${image})` }} // ✅ dynamic image
      >
        {/* Overlay */}
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

        {/* Author Section */}
        <div className="flex flex-row items-center space-x-4 z-10">
          <img
            src={authorImage}
            alt={author}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {author}
            </p>
            <p className="text-sm text-gray-400">{readTime}</p>
          </div>
        </div>

        {/* Blog Content */}
        <div className="text content z-10">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50">
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-50 my-4 line-clamp-3">
            {description}
          </p>

          {/* 🔹 Action Buttons */}
          <div className="flex justify-between items-center mt-2">
            {readMoreLink && (
              <Link href={readMoreLink}>
                <button className="px-3 py-1 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                  Read More
                </button>
              </Link>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="px-3 py-1 text-sm font-medium bg-red-700 text-white rounded-lg hover:bg-red-500 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
