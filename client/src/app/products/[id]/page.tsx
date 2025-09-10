"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Loader from "../../../components/Loader2";
import { useCart } from "@/app/context/cartContext";
import BuyNowModal from "@/components/BuynowModal";


const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart,addBuyNow, clearBuyNow } = useCart();
  const [showModal, setShowModal] = useState(false);

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
    ((product.price * product.discountPercentage) / 100) + 10
  ).toFixed(2);

  // ✅ Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first!");
        return;
      }

      await addToCart(userId, {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.images[0],
        discountPercentage: product.discountPercentage,
      });

      toast.success(`${quantity} item(s) added to cart`);
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Handle Buy Now
  const handleBuyNow = () => {
    setShowModal(true);
  };

  const handleConfirmOrder = (address: any, paymentMethod: string) => {
  if (!address) {
    toast.error("Please select an address");
    return;
  }
  if (!paymentMethod) {
    toast.error("Please select a payment method");
    return;
  }

  const orderData = {
    productId: product.id,
    title: product.title,
    price: Number(discountPrice), // ✅ use discounted price if available
    quantity,
    image: product.images[0],
    address,
    paymentMethod,
  };

  // ✅ store in context (Buy Now item)
  addBuyNow(orderData);

  // (optional) still keep localStorage for fallback
  localStorage.setItem("order", JSON.stringify(orderData));
  localStorage.setItem("checkoutMode", "buyNow");
  localStorage.setItem("subtotal", JSON.stringify((Number(discountPrice) * quantity).toFixed(2)));
  localStorage.setItem("total", JSON.stringify((Number(discountPrice) * quantity).toFixed(2)));
  localStorage.setItem("selectedAddress", JSON.stringify(address));
  localStorage.setItem("selectedPaymentMethod", JSON.stringify(paymentMethod));

  if (paymentMethod === "Cash on Delivery") {
    localStorage.setItem("paymentStatus", "Pending");
    router.push("/order/confirmation");
  } else {
    localStorage.setItem("selectedPaymentMethod", "Online");
    localStorage.setItem("paymentStatus", "Pending");
    router.push("/order/confirmation");
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
          <h2 className="text-2xl font-semibold text-black">
            ${(Number((discountPrice) * quantity)-10).toFixed(2)}
          </h2>
          <p className="line-through text-gray-500">
            ${(product.price * quantity).toFixed(2)}
          </p>
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
        {product.brand && (
          <p className="text-sm text-gray-600">
            Brand: <span className="font-medium">{product.brand}</span>
          </p>
        )}

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="font-medium">{quantity}</span>
          <button
            onClick={() =>
              setQuantity((prev) => Math.min(product.stock, prev + 1))
            }
            className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
            disabled={quantity >= product.stock}
          >
            +
          </button>
          <p className="text-sm text-gray-600">(Available: {product.stock})</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-gray-800 text-white shadow-md rounded-md px-6 py-3 text-sm cursor-pointer hover:text-white hover:bg-gray-900 transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="size-4" />
            Add To Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center gap-2 bg-orange-500 text-white shadow-md rounded-md px-6 py-3 text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300 hover:scale-110"
          >
            Buy Now
          </button>
        </div>
      </div>

      {showModal && (
        <BuyNowModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
};

export default ProductPage;
