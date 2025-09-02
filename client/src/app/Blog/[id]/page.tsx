"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (!blog) {
    return <p className="text-center py-10">Loading blog...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12 w-[95%] mx-auto rounded-3xl my-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Blog Image */}
        <div className="w-full h-72 relative rounded-lg overflow-hidden">
          <Image
            src={blog.image || "/contactsBG.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl font-bold text-gray-900 mt-6">
          {blog.title}
        </h1>

        {/* Blog Content */}
        <p className="text-lg text-gray-700 mt-4 whitespace-pre-line">
          {blog.content}
        </p>

        {/* Author & Date (if available) */}
        <div className="mt-6 text-sm text-gray-500">
          <p>By {blog.author || "Unknown Author"}</p>
          <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
