import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Blog from "../Models/Blog.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// Multer setup → store uploads temporarily
const upload = multer({ dest: "uploads/" });

// Cloudinary setup
cloudinary.config({
  cloud_name: "dkopmalbo",
  api_key: "825335975796362",
  api_secret: "JptvvIEtvQSbXCWhhGsPXV5APgU",
});

// CREATE Blog (with image upload to Cloudinary)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!req.user?.username) {
      return res.status(400).json({ message: "User info missing in token" });
    }

    let imageUrl = "";

    // ✅ Upload image to Cloudinary only on backend
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.user.username,
      image: imageUrl,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
});

// GET all blogs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs", error: err.message });
  }
});

// GET single blog
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog", error: err.message });
  }
});

// DELETE blog
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author !== req.user.username) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog", error: err.message });
  }
});

export default router;
