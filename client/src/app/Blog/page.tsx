"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CometCard } from "../../components/ui/comet-card"; // ⬅️ import your CometCard
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/moving-border";
import { useRouter } from "next/navigation";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/blogs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast("Blog deleted successfully");
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        setOpen(false);
      } else {
        alert(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Something went wrong");
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

        {/* Use CometCard instead of FocusCards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <CometCard
              key={blog._id}
              className="bg-white rounded-2xl overflow-hidden"
            >
              <div className="h-48 w-full relative">
                <Image
                  src={blog.image || "/contactsBG.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {blog.content || "No preview available..."}
                </p>
                <div className="flex justify-between items-center w-full">
                  <Link href={`/Blog/${blog._id}`}>
                    <button className="mt-4 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                      Read More
                    </button>
                  </Link>
                  <button
                    className="mt-4 px-4 py-2 text-sm font-medium bg-red-700 text-white rounded-lg hover:bg-red-500 transition"
                    onClick={() => {
                      setSelectedBlog(blog._id);
                      setOpen(true);
                    }}
                  >
                    Delete Blog
                  </button>
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>

      {/* Create Blog */}
      <div className="max-w-6xl mx-auto my-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 my-2">
          Write Your Own Blog...
        </h2>
        <button className="p-[2px] relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl" />
          <div className="px-8 py-2  bg-black rounded-2xl  relative group transition duration-200 text-white hover:bg-transparent">
            Create Blog
          </div>
        </button>
      </div>

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
