'use client'

import React, { useEffect, useState } from 'react'
import { ShippingFormInputs, shippingFormSchema } from '@/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import AddressForm from './AddressForm'

function ShippingForm({ setShippingForm }: { setShippingForm: (data: ShippingFormInputs) => void }) {
  const [addresses, setAddresses] = useState<ShippingFormInputs[]>([]) 
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false) // toggle for showing address form

  const router = useRouter()
console.log("🚀 ShippingForm component rendered")

  // Fetch existing addresses
  useEffect(() => {
    console.log("ShippingForm mounted ✅")
    const fetchAddresses = async () => {
      try {
        const token = sessionStorage.getItem("accessToken")
        const res = await fetch("http://localhost:5000/api/users/address", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) setAddresses(data)
      } catch (err) {
        console.error("Error fetching addresses", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  // Add new address handler
  const handleAddressAdded = (newAddr: ShippingFormInputs) => {
    setAddresses([...addresses, newAddr])
    setShowForm(false) // hide form after save
    setShippingForm(newAddr)
    router.push("/cart?step=3", { scroll: false })
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {addresses.length === 0 || showForm ? (
        <AddressForm 
          width="w-[30vw]" 
          onSuccess={handleAddressAdded} // pass handler
        />
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Choose an Address</h2>
          {addresses.map((addr, i) => (
            <div key={i} className="border p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{addr.name}</p>
                <p>{addr.address}, {addr.city}, {addr.country}</p>
                <p>{addr.phone}</p>
              </div>
              <button
                className="bg-gray-800 text-white px-4 py-1 rounded-lg hover:bg-gray-900"
                onClick={() => {
                  setShippingForm(addr)
                  localStorage.setItem("selectedAddress", JSON.stringify(addr))
                  router.push("/cart?step=3", { scroll: false })
                }}
              >
                Deliver Here
              </button>
            </div>
          ))}

          {/* Button to add new */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            onClick={() => setShowForm(true)}
          >
            + Add New Address
          </button>
        </div>
      )}
    </div>
  )
}

export default ShippingForm
