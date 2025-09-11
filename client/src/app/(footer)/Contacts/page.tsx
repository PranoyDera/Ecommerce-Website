"use client";

import { apiPost } from "@/app/utils/api";
import React, { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("General");
  const [message, setMessage] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      country,
      phone,
      email,
      inquiryType,
      message,
      offersOptIn,
    };

    try {
      const res = await apiPost("/api/feedback",formData);
      toast.success("Feedback Submitted!");
       setFirstName("");
        setLastName("");
        setCountry("");
        setPhone("");
        setEmail("");
        setInquiryType("General");
        setMessage("");
        setOffersOptIn(false);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12 lg:px-20 bg-[url('/background4.jpg')] bg-cover bg-center w-[95%] mx-auto rounded-2xl my-2">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 rounded-2xl overflow-hidden">
        {/* Left Side - Info */}
        <div className="p-6 md:p-10 flex flex-col justify-between bg-white/0">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              You Have Questions, <br /> We Have Answers
            </h2>
            <p className="text-white mb-8 text-sm md:text-base">
              Discover experiences you won't find anywhere else — thoughtfully
              designed to immerse you in the heart of the destination. Soulful
              stories waiting to be lived.
            </p>
          </div>

          <div className="space-y-6 text-white text-sm md:text-base">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>
                Ecospace Building 2B <br />
                Street Number 372 <br />
                Eco-space business park, New Town, 5532 <br />
                Mon–Fri | 09:00 – 20:00 (local time)
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Social Media</h3>
              <p>Instagram | LinkedIn | Facebook </p>
            </div>

            <div>
              <h3 className="font-semibold">Email</h3>
              <p>pranoydera@gmail.com</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>+91 8240514868</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-6 md:p-10 flex items-center justify-center bg-white rounded-2xl">
          <form
            className="w-full max-w-md md:max-w-full space-y-6"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Tell Us What You Need
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Our team is ready to assist you with every detail, big or small.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Type of Inquiry
              </label>
              <div className="flex flex-wrap gap-2">
                {["Purchase", "General", "Sell", "Order", "Others"].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setInquiryType(item)}
                      className={`px-4 py-2 border rounded-full text-sm sm:text-base ${
                        inquiryType === item
                          ? "bg-black text-white border-black"
                          : "border-gray-300 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <textarea
              placeholder="Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="offers"
                checked={offersOptIn}
                onChange={(e) => setOffersOptIn(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="offers" className="text-gray-600 text-sm">
                I'd like to receive exclusive offers and updates
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white border cursor-pointer border-black text-black py-3 rounded-3xl font-medium hover:bg-gray-800 hover:text-white transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
