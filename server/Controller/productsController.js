import Products from "../Models/Products.js";
import cloudinary from "../utils/cloudinary.js";

const uploadToCloudinary = (buffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const sort = req.query.sort;

    const filter = {};

    if (
      category &&
      category !== "all" &&
      category !== "" &&
      category !== "undefined"
    ) {
      filter.category = category;
    }

    let sortQuery = {};
    if (sort === "asc") sortQuery.price = 1;
    if (sort === "desc") sortQuery.price = -1;
    if (sort === "newest") sortQuery.createdAt = -1;
    if (sort === "oldest") sortQuery.createdAt = 1;

    const products = await Products.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category,
      source,
    } = req.body;

    if (!title || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Title, price, category and stock are required",
      });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    let thumbnailUrl = "";
    let imageUrls = [];

    if (thumbnailFile) {
      const uploadedThumb = await uploadToCloudinary(
        thumbnailFile.buffer,
        "products/thumbnails"
      );
      thumbnailUrl = uploadedThumb.secure_url;
    }

    if (imageFiles.length > 0) {
      const uploads = await Promise.all(
        imageFiles.map((file) =>
          uploadToCloudinary(file.buffer, "products/images")
        )
      );
      imageUrls = uploads.map((u) => u.secure_url);
    }

    const product = await Products.create({
      title,
      description,
      price: Number(price),
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
      rating: rating ? Number(rating) : 0,
      stock: Number(stock),
      brand,
      category,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      source: source || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category,
      source,
    } = req.body;

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    if (thumbnailFile) {
      const uploadedThumb = await uploadToCloudinary(
        thumbnailFile.buffer,
        "products/thumbnails"
      );
      product.thumbnail = uploadedThumb.secure_url;
    }

    if (imageFiles.length > 0) {
      const uploads = await Promise.all(
        imageFiles.map((file) =>
          uploadToCloudinary(file.buffer, "products/images")
        )
      );
      product.images = uploads.map((u) => u.secure_url);
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPercentage !== undefined)
      product.discountPercentage = Number(discountPercentage);
    if (rating !== undefined) product.rating = Number(rating);
    if (stock !== undefined) product.stock = Number(stock);
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (source !== undefined) product.source = source;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product IDs are required",
      });
    }

    const result = await Products.deleteMany({
      _id: { $in: ids },
    });

    res.json({
      success: true,
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete products",
    });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const userId = req.user?.id || req.body.userId;
    const userName = req.user?.userName || req.body.userName;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "User name is required",
      });
    }

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔁 Check using userId (safer than name)
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId?.toString() === userId?.toString()
    );

    let message = "Review added";

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment || alreadyReviewed.comment;
      message = "Review updated";
    } else {
      product.reviews.push({
        userId: userId,      // keep internally
        user: userName,      // show name
        rating: Number(rating),
        comment,
      });
    }

    // update counts
    product.numReviews = product.reviews.length;

    const avg =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    product.avgRating = avg;

    await product.save();

    res.json({
      success: true,
      message,
      avgRating: product.avgRating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

export const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const userId = req.user?.id || req.body.userId;

    if (!productId || !reviewId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Review ID are required",
      });
    }

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviewIndex = product.reviews.findIndex(
      (r) => r._id.toString() === reviewId.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // ✅ Optional: Check ownership
    if (
      product.reviews[reviewIndex].userId?.toString() !== userId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    // 🗑 Remove review
    product.reviews.splice(reviewIndex, 1);

    // 🔄 Update counts
    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      const avg =
        product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;
      product.avgRating = avg;
    } else {
      product.avgRating = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: "Review deleted successfully",
      avgRating: product.avgRating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};
