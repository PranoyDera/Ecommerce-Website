'use client'
import { ProductType } from '@/type'
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import useCartStore from '../Stores/cartStore';
import { toast } from 'react-toastify';


function ProductInteraction({product,selectedColor,selectedSize}:{product:ProductType,selectedSize:string,selectedColor:string}) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
  const handleTypeChange = (type:string,value:string)=>{
     const params = new URLSearchParams(searchParams.toString())
     params.set(type,value);
     router.push(`${pathname}?${params.toString()}`,{scroll:false})
  }
  const [quantity,setQuantity]=useState(1);

  const handleQuantityChange = (type:"decrement"|"increment") =>{
     if(type=="increment"){
        setQuantity(prev=>prev+1)
     }
     else{
        if(quantity>1){
            setQuantity(prev=>prev-1)
        }
     }
  }
  const {addToCart} = useCartStore()
  const handleAddtoCart = ()=>{
    addToCart({
        ...product,
      quantity,
      selectedColor,
      selectedSize
    })
    toast.success("Product Added To Cart")
  }

    return (
    <div className='flex flex-col gap-4 mt-4'>
        {/* SIZE */}
       <div className='flex flex-col gap-2 text-sm'>
        <span className="text-gray-500">Size</span>
       <div className="flex items-center gap-2">
         {product.sizes.map(size=>(
            <div className={`cursor-pointer border-1 p-[2px] ${
              selectedSize == size
              ? "border-gray-600":"border-gray-300"
            }`} key={size}
            onClick={()=>{handleTypeChange("size",size)}}
            >
                <div className={`w-6 h-6 text-center flex items-center justify-center ${
                    selectedSize == size 
                    ?"bg-black text-white":"bg-white text-black"
                    }`}>
                    {size.toUpperCase()}
                </div>
            </div>
        ))}
       </div>
       </div>
       {/* COLOR */}
       <div className='flex flex-col gap-2 text-sm'>
        <span className="text-gray-500">Color</span>
       <div className="flex items-center gap-2">
         {product.colors.map(color=>(
            <div className={`cursor-pointer border-1 p-[2px] ${
              selectedColor == color
              ? "border-gray-600":"border-gray-300"
            }`} key={color}
            onClick={()=>{handleTypeChange("color",color)}}
            >
                <div className={`w-6 h-6 `}
                style={{backgroundColor:color}}>

                </div>
            </div>
        ))}
       </div>
       </div>
       {/* QUANTITY */}
        <div className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center gap-2'>
                <button className='cursor-pointer border-1 border-gray-300 p-1' onClick={()=>handleQuantityChange("decrement")}>
                  <Minus className='w-4 h-4'/>
                </button>
                <span>{quantity}</span>
                <button className='cursor-pointer border-1 border-gray-300 p-1' onClick={()=>handleQuantityChange("increment")}>
                  <Plus className='w-4 h-4'/>
                </button>
            </div>
       </div>
       {/* BUTTONS */}
       <button className='bg-gray-800 text-white flex cursor-pointer px-2 py-2 justify-center items-center rounded-md gap-2'
       onClick={()=>{handleAddtoCart()}}
       >
        <Plus className='h-5 w-5'/>
        Add to cart
       </button>
       <button className='bg-gray-300 text-black flex cursor-pointer px-2 py-2 justify-center items-center rounded-md gap-2'>
        <ShoppingCart className='h-5 w-5'/>
        Buy This Item
       </button>
    </div>
  )
}

export default ProductInteraction