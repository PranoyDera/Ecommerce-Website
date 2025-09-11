"use client";

import React, { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 👇 Import the reusable BlogCard
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader2";
import { apiDelete, apiGet } from "../utils/api";

// ✅ Blog interface (replace fields with your backend schema)
interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author?: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = sessionStorage.getItem("accessToken") || undefined;
        const data = await apiGet<Blog[]>("/api/blogs", token);
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem("accessToken") || undefined;
      await apiDelete(`/api/blogs/${id}`, token);
      toast.success("Blog deleted successfully");
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12 w-[95%] mx-auto rounded-3xl my-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Our Recent Articles
        </h2>
        <p className="text-gray-600 mb-6">
          Stay informed with our latest insights
        </p>

        {/* Blog Cards */}
        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <p className="text-gray-500 text-center">No blogs available.</p>
        ) : (
          <div className="min-h-[300px] grid items-center gap-4 grid-cols-1 md:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                image={blog.image ?? "/userImage.png"}
                title={blog.title}
                description={blog.content}
                author={blog.author || "Unknown"}
                authorImage="/userImage.png"
                readMoreLink={`/Blog/${blog._id}`}
                onDelete={(id) => {
                  setSelectedBlog(id);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Blog */}
      <div className="max-w-6xl mx-auto my-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 my-2">
          Write Your Own Blog...
        </h2>
        <button
          onClick={() => router.push("/Blog/Create-Blog")}
          className="p-[2px] relative w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl" />
          <div className="px-8 py-2 bg-black rounded-2xl relative group transition duration-200 text-white hover:bg-transparent">
            Create Blog
          </div>
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (selectedBlog) handleDelete(selectedBlog);
        }}
        title="Are you sure?"
        message="Your Blog will be permanently deleted."
      />
    </div>
  );
};

export default BlogPage;
