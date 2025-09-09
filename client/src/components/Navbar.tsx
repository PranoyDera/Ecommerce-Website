'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { SearchBar } from './SearchBar'
import { Home } from 'lucide-react'
import ShoppingCartIcon from './ShoppingCartIcon'
import { useRouter } from 'next/navigation'
import OrderIcon from './OrderIcon'

function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    fetchUser()
  }, [])

  return (
    <nav className="w-[95%] flex justify-center border border-gray-200 mx-auto items-center mt-2 rounded-4xl md:px-4 px-2 h-15">
      {/* Left */}
      <Link href="/">
        <Image
          src="/PRO-CART.png"
          alt="Pro-cart"
          width={200}
          height={36}
          className="w-30 h-10 md:w-50 md:h-15"
        />
      </Link>

      {/* Search bar hidden on small screens */}
      <div className="hidden md:block flex-1 px-4">
        <SearchBar />
      </div>

      {/* Right */}
      <div className="flex items-center justify-center gap-6">
        <Link href="/">
          <Home className="w-4 h-4 text-gray-500" />
        </Link>
        <OrderIcon />
        <ShoppingCartIcon />

        <Link href="/Profile" className="flex items-center">
          <Image
            src={user?.image || "/userImage.png"} 
            alt="user"
            width={40}
            height={40}
            className="rounded-full border object-cover cursor-pointer"
          />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
