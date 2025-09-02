"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/stateful-button";

const CreateBlog = () => {
  const [blogName, setBlogName] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // cleanup previous object URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Submit blog
  async function submitBlog() {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      if (!blogName || !content || !categoryList) {
        toast.error("Please fill all fields before publishing.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("title", blogName);
      formData.append("content", content);
      formData.append("category", categoryList);

      if (imageFile) {
        formData.append("image", imageFile); // this goes to multer → cloudinary
      }

      const response = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // don't set Content-Type → browser auto sets
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Blog Published Successfully");
        router.push("/Blog"); // redirect to blogs page
      } else {
        throw new Error(data.message || "Failed to create blog");
      }
    } catch (error: any) {
      console.error("Error submitting blog:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-100 flex flex-col items-center py-8 px-4 w-[95%] mx-auto rounded-3xl my-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-150 bg-gray-200 flex items-center justify-center">
          {preview ? (
            <label className="w-full h-full cursor-pointer">
              <img
                src={preview}
                alt="Blog Banner"
                className="w-full h-full object-cover object-center"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center text-gray-600">
              <span className="mb-2 text-sm">Click to upload a banner image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                Upload Image
              </div>
            </label>
          )}
        </div>

        {/* Rest of your code unchanged */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Enter blog title..."
            value={blogName}
            onChange={(e) => setBlogName(e.target.value)}
            className="w-full text-2xl font-semibold border-b border-gray-300 focus:border-gray-800 focus:ring-0 outline-none pb-2"
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={categoryList}
              onChange={(e) => setCategoryList(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-800 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Product Review">Product Review</option>
              <option value="User Feedback">User Feedback</option>
            </select>
          </div>

          {/* Blog Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your blog here..."
              rows={15}
              className="w-full h-[400px] resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
            />
          </div>

          {/* Publish Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={uploading}
              className="bg-green-800 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                submitBlog();
              }}
            >
              {uploading ? "Publishing..." : "Publish Blog"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
