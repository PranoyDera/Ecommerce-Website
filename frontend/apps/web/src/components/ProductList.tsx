"use client";

import { useEffect, useState } from "react";
import { ProductType } from "../type";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import Loader from "./Loader2";
import { GridSmallBackground } from "../components/ui/GridSmall";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../components/pagination";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/app/utils/api";

// Local type for DummyJSON API response
type DummyJSONProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  discountPercentage: number;
  rating: number;
};



// Transform DummyJSON -> ProductType
const transformProducts = (apiProducts: DummyJSONProduct[]): ProductType[] => {
  return apiProducts.map((p) => {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      sizes: ["s", "m", "l", "xl"], // fake sizes
      colors: ["black", "white", "blue"], // fake colors
      images: p.images ?? [p.thumbnail], // array of images
      thumbnail: p.thumbnail,
      rating: p.rating,
      discountPercentage: p.discountPercentage,
    } as ProductType;
  });
};

const ProductList = ({
  category,
  params,
}: {
  category: string;
  params: "homepage" | "products";
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState<any[]>([]);
  const limit = 30;

  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest"; // ✅ read query param

  const fetchProducts = async (page: number) => {
    const skip = (page - 1) * limit;

    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (category && category !== "all") {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(page);
        let sortedProducts = transformProducts(data.products);

        // ✅ Sorting logic
        if (sort === "asc") {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sort === "desc") {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sort === "newest") {
          sortedProducts.sort((a, b) => Number(b.id) - Number(a.id));
        } else if (sort === "oldest") {
          sortedProducts.sort((a, b) => Number(a.id) - Number(b.id));
        }

        setProducts(sortedProducts);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, category, sort]); // ✅ depend on `sort`

const fetchAddresses = async () => {
  const token = sessionStorage.getItem("accessToken");

  try {
    const data = await apiGet<any[]>("/api/users/address", token || undefined);

    setAddresses(data || []);
    localStorage.setItem("addresses", JSON.stringify(data || []));
  } catch (err) {
    console.error("Error fetching addresses:", err);
    setAddresses([]); // fallback to empty list
  }
};

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl h-screen mx-auto my-4 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <GridSmallBackground>
      <div className="p-4 my-4">
        <Categories />
        {params === "products" && <Filter />}
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link
          href={
            category && category == "all"
              ? `/products/?category=${category}`
              : "/products"
          }
          className="flex justify-end mt-4 underline text-sm text-gray-500"
        >
          View All Products
        </Link>

        <Pagination className="mt-6 flex justify-center w-10 md:w-full">
          <PaginationContent className="flex items-center md:gap-2 gap-0 justify-center">
            {/* Prev Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => prev - 1)}
                className="cursor-pointer hover:bg-gray-200 text-gray-900 text-xs md:text-sm"
                aria-disabled={page === 1}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`cursor-pointer hover:bg-gray-200 text-xs md:text-sm ${
                      page === pageNumber ? `border border-gray-400` : ``
                    } text-gray-900`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => prev + 1)}
                className="cursor-pointer hover:bg-gray-200 text-gray-900 text-xs md:text-sm"
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </GridSmallBackground>
  );
};

export default ProductList;
