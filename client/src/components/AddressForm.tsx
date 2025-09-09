"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

type Country = { country: string };
type State = { name: string };
type City = string;

type SavedAddress = {
  _id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
};

interface AddressFormProps {
  onAddressAdded?: () => void;
  onCancel?: () => void;
  width?: string;
  onSuccess?: (savedAddress: SavedAddress) => void; // 👈 pass saved address back
  addressId?: string | null; // 👈 Pass this when editing
}

const AddressForm: React.FC<AddressFormProps> = ({
  onAddressAdded,
  onCancel,
  width = "w-[60vw]",
  onSuccess,
  addressId,
}) => {
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const BASE_URL = "https://countriesnow.space/api/v0.1";
  const isEdit = Boolean(addressId);

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/countries/`);
        const data = await res.json();
        setCountries(data.data || []);
      } catch (err) {
        console.error("Error fetching countries", err);
      }
    };
    fetchCountries();
  }, []);

  // ✅ Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchStates = async () => {
      try {
        const res = await fetch(`${BASE_URL}/countries/states`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedCountry }),
        });
        const data = await res.json();
        setStates(data.data.states || []);

        if (!isEdit) {
          setCities([]);
          setSelectedState("");
          setSelectedCity("");
        }
      } catch (err) {
        console.error("Error fetching states", err);
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // ✅ Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    const fetchCities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/countries/state/cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: selectedCountry,
            state: selectedState,
          }),
        });
        const data = await res.json();
        setCities(data.data || []);
        if (!isEdit) setSelectedCity("");
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    fetchCities();
  }, [selectedState]);

  // ✅ Prefill data when editing
  useEffect(() => {
    const fetchAddress = async () => {
      if (!addressId) return;
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(
          `http://localhost:5000/api/users/address/${addressId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch address");
        const data = await res.json();

        // Prefill form
        setAddress(data.address || "");
        setZipCode(data.zipCode || "");
        setLandmark(data.landmark || "");
        setSelectedCountry(data.country || "");
        setSelectedState(data.state || "");
        setSelectedCity(data.city || "");
      } catch (err) {
        console.error("Error fetching address for edit:", err);
        toast.error("Failed to load address");
      }
    };

    fetchAddress();
  }, [addressId]);

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    const payload: SavedAddress = {
      address,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      zipCode,
      landmark,
    };

    try {
      const url = isEdit
        ? `http://localhost:5000/api/users/address/${addressId}`
        : "http://localhost:5000/api/users/address";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save address");
        return;
      }

      // 🔸 Determine the saved address object from API response (supports multiple shapes)
      const savedAddress: SavedAddress =
        data?.address ??
        (Array.isArray(data?.addresses) ? data.addresses[data.addresses.length - 1] : undefined) ??
        (data?._id ? data : undefined) ??
        payload; // fallback to payload if API doesn't return a single item

      toast.success(isEdit ? "Address updated successfully!" : "Address added successfully!");
      onAddressAdded?.();

      // 🔸 IMPORTANT: pass the saved address back to parent so it can store it in localStorage
      onSuccess?.(savedAddress);
    } catch (err) {
      console.error(err);
      toast.error("Error saving address");
    }
  };

  // ✅ Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: "0.75rem",
      borderColor: "#d1d5db",
      padding: "2px",
      boxShadow: "none",
      "&:hover": { borderColor: "#9333ea" },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f3e8ff" : "white",
      color: "black",
      cursor: "pointer",
    }),
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${width} mx-auto md:p-6 p-4 bg-white shadow-md rounded-2xl space-y-4 text-xs md:text-sm`}
    >
      {/* Address Field */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Address</h2>
        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 border-gray-300 rounded-xl focus:ring-1 focus:ring-purple-600 focus:outline-none"
          required
        />
      </div>

      {/* Country + State */}
      <div className="flex gap-2 flex-1">
        <div className="flex flex-col gap-2 w-1/2">
          <h2 className="font-semibold">Country</h2>
          <Select
            value={selectedCountry ? { label: selectedCountry, value: selectedCountry } : null}
            onChange={(option) => setSelectedCountry(option?.value || "")}
            options={countries.map((c) => ({ label: c.country, value: c.country }))}
            placeholder="Select Country"
            styles={selectStyles}
            isSearchable
          />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <h2 className="font-semibold">States</h2>
          <Select
            value={selectedState ? { label: selectedState, value: selectedState } : null}
            onChange={(option) => setSelectedState(option?.value || "")}
            options={states.map((s) => ({ label: s.name, value: s.name }))}
            placeholder="Select State"
            styles={selectStyles}
            isSearchable
            isDisabled={!selectedCountry}
          />
        </div>
      </div>

      {/* City + Zip */}
      <div className="flex gap-2 flex-1">
        <div className="flex flex-col gap-2 w-1/2">
          <h2 className="font-semibold">City</h2>
          <Select
            value={selectedCity ? { label: selectedCity, value: selectedCity } : null}
            onChange={(option) => setSelectedCity(option?.value || "")}
            options={cities.map((city) => ({ label: city, value: city }))}
            placeholder="Select City"
            styles={selectStyles}
            isSearchable
            isDisabled={!selectedState}
          />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <h2 className="font-semibold">Zip Code</h2>
          <input
            type="text"
            placeholder="Enter Zipcode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-1 focus:ring-purple-600 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Landmark */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Nearest Landmark</h2>
        <input
          type="text"
          placeholder="Enter Nearest Landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          className="w-full border px-3 py-2 border-gray-300 rounded-xl focus:ring-1 focus:ring-purple-600 focus:outline-none"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-xl hover:bg-purple-900 transition duration-300 mt-2"
        >
          {isEdit ? "Update Address" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-900 transition duration-300 mt-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
