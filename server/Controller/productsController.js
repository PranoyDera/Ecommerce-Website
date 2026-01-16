import Products from "../Models/Products.js";

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
      thumbnail,
      images,
      source,
    } = req.body;

    if (!title || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Title, price, category and stock are required",
      });
    }

    const formattedPrice = Number(price);
    const formattedStock = Number(stock);
    const formattedDiscount = discountPercentage
      ? Number(discountPercentage)
      : 0;
    const formattedRating = rating ? Number(rating) : 0;

    if (isNaN(formattedPrice) || isNaN(formattedStock)) {
      return res.status(400).json({
        success: false,
        message: "Price and stock must be valid numbers",
      });
    }

    const product = await Products.create({
      title,
      description,
      price: formattedPrice,
      discountPercentage: formattedDiscount,
      rating: formattedRating,
      stock: formattedStock,
      brand,
      category,
      thumbnail,
      images: Array.isArray(images) ? images : [],
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
      thumbnail,
      images,
      source,
    } = req.body;

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
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
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (images !== undefined)
      product.images = Array.isArray(images) ? images : product.images;
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
