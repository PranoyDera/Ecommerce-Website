"use client";

import React from "react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-3 bg-[url('/background4.jpg')] bg-cover bg-center w-[95%] mx-auto rounded-2xl my-2">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-40  rounded-2xl  overflow-hidden">
        {/* Left Side - Info */}
        <div className="p-10 flex flex-col justify-between bg-white/0">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">
              You Have Questions, <br /> We Have Answers
            </h2>
            <p className="text-white mb-8">
              Discover experiences you won't find anywhere else — thoughtfully
              designed to immerse you in the heart of the destination. Soulful
              stories waiting to be lived.
            </p>
          </div>

          <div className="space-y-6 text-white">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>
                Anantara OceanFront Resort <br />
                123 Serenity Bay Road <br />
                Koh Samui, Thailand 84320 <br />
                Mon–Sun | 08:00 – 22:00 (local time)
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Social Media</h3>
              <p>Instagram | LinkedIn | Facebook | TikTok</p>
            </div>

            <div>
              <h3 className="font-semibold">Email</h3>
              <p>stay@anantararesort.com</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>+66 77 123 456</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-5  flex items-center bg-white w-[500px] rounded-2xl">
          <form className="w-full space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Tell Us What You Need
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is ready to assist you with every detail, big or small.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                 className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Country"
                 className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Phone Number"
                 className="w-full border border-gray-300 rounded-3xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
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
                      className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="offers" className="h-4 w-4" />
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
