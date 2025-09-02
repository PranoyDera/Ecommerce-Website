"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import useCartStore from "@/app/Stores/cartStore";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // ✅ Fetch single product from DummyJSON
  useEffect(() => {
    if (params?.id) {
      fetch(`https://dummyjson.com/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="mx-auto my-4 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  // ✅ Discounted Price (DummyJSON has `discountPercentage`)
  const discountPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  // ✅ Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first!");
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          quantity,
          image: product.images[0],
        }),
      });
  
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
  
      const data = await response.json();
      console.log("Cart updated:", data);
      toast.success(`${quantity} item(s) added to cart`);
  
      // ✅ Notify other components (like ShoppingCartIcon)
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Handle Buy Now
const handleBuyNow = () => {
  try {
    const orderData = {
      productId: product.id,
      title: product.title,
      price: product.price,
      discountPrice,
      quantity,
      image: product.images[0],
    };

    // Save order in localStorage
    localStorage.setItem("order", JSON.stringify(orderData));
    localStorage.setItem("checkoutMode","buyNow")

    // Redirect to confirmation page
    router.push("/order/confirmation");
  } catch (err) {
    console.error("Buy Now failed:", err);
  }
};

  return (
    <div className="flex flex-col gap-8 lg:flex-row md:gap-12 my-12 w-[85%] mx-auto bg-gray-200 p-4 rounded-3xl">
      {/* LEFT SIDE IMAGES */}
      <div className="w-full lg:w-5/12">
        <div className="relative h-[500px] w-full shadow-lg rounded-2xl p-4 bg-white">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain rounded-xl"
          />
        </div>
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {product.images.map((img: string, index: number) => (
            <Image
              key={index}
              src={img}
              alt={`${product.title} ${index}`}
              width={100}
              height={100}
              className="rounded-md border cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE DETAILS */}
      <div className="w-full lg:w-[7/12] flex flex-col gap-4">
        {/* Title */}
        <h1 className="text-2xl font-serif font-bold">{product.title}</h1>

        {/* Price & Discount */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-black">₹{discountPrice}</h2>
          <p className="line-through text-gray-500">₹{product.price}</p>
          <span className="text-green-600 font-semibold">
            {product.discountPercentage}% off
          </span>
        </div>

        {/* Rating */}
        <p className="text-sm">
          ⭐ {product.rating} / 5 ({product.stock} reviews)
        </p>

        {/* Stock */}
        <p className="text-sm text-gray-500">
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {/* Category & Brand */}
        <p className="text-sm text-gray-600">
          Category: <span className="font-medium">{product.category}</span>
        </p>
        <p className="text-sm text-gray-600">
          Brand: <span className="font-medium">{product.brand}</span>
        </p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-gray-800 text-white border borde-white shadow-md rounded-md px-6 py-3 text-sm cursor-pointer hover:text-black hover:bg-white transition-all duration-300"
          >
            <ShoppingCart className="size-4" />
            Add To Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center gap-2 bg-orange-500 text-white shadow-md rounded-md px-6 py-3 text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
