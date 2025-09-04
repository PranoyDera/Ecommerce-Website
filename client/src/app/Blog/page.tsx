"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 👇 Import the reusable BlogCard
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader2";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const router = useRouter();
  const [loading,setLoading] = useState<boolean>(true);

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
        setLoading(false);
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

        {/* Blog Cards */}
  {blogs.length === 0 ? (
    // Show Loader if no blogs
    <Loader />
  ) : (
    <div className="min-h-[300px] flex items-center gap-4">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          id={blog._id}
          image={blog.image}
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
