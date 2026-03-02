    import mongoose from "mongoose";

    const reviewSchema = new mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
      },
      { timestamps: true },
    );

    const productSchema = new mongoose.Schema(
      {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        rating: {
          type: Number,
          default: 0,
        },
        avgRating: {
          type: Number,
          default: 0,
        },
        numReviews: {
          type: Number,
          default: 0,
        },
        reviews: [reviewSchema],
        stock: Number,
        brand: String,
        category: String,
        thumbnail: String,
        images: [String],
        source: {
          type: String,
          default: "dummy",
        },
      },
      { timestamps: true },
    );

    export default mongoose.model("Product", productSchema);
