// Routes/searchRoutes.js
import express from "express";
import fetch from "node-fetch"; // On Node 18+ you can use global fetch

import Blog from "../Models/Blog.js"; // Blogs from DB

const router = express.Router();

// ✅ Static pages list
const staticPages = [
  { name: "About", key: "about", url: "/About" },
  { name: "Contact", key: "contacts", url: "/Contacts" },
  { name: "Terms and Conditions", key: "terms", url: "/Terms" },
  { name: "Privacy Policy", key: "privacy", url: "/Privacy-Policy" },
];

// GET /api/search?q=...
router.get("/", async (req, res) => {
  try {
    const query = (req.query.q || "").toLowerCase();
    if (!query) {
      return res.json({ products: [], blogs: [], pages: [], suggestions: [] });
    }

    // 🔎 Search products from DummyJSON
    const productRes = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
    );
    const productData = await productRes.json();
    const products = productData.products || [];

    // 🔎 Search blogs from your MongoDB
    const blogs = await Blog.find({
      title: { $regex: query, $options: "i" },
    }).limit(5);

    // 🔎 Static pages (case-insensitive match)
    const pages = staticPages.filter((page) =>
      page.key.toLowerCase().includes(query)
    );

    // ✅ Unified suggestions list (merge all but keep original structure too)
    const suggestions = [
      ...products.map((p) => ({
        type: "product",
        name: p.title,
        url: `/product/${p.id}`,
      })),
      ...blogs.map((b) => ({
        type: "blog",
        name: b.title,
        url: `/blog/${b._id}`,
      })),
      ...pages.map((pg) => ({
        type: "page",
        name: pg.name,
        url: pg.url,
      })),
    ];

    res.json({ products, blogs, pages, suggestions });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
