"use client";

import React from "react";
import Image from "next/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center px-6 py-12 w-[95%] mx-auto my-4 rounded-2xl">
      {/* Section Header */}
      <div className="text-center max-w-3xl mb-8">
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          Hasstle free platform <br /> for easy shopping
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-8">
      <BackgroundGradient className="rounded-[22px] p-0 sm:p-10 bg-white dark:bg-zinc-900 grid md:grid-cols-2">
      {/* <div className="mt-12 bg-white rounded-2xl shadow-md p-8 md:p-12 max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center"> */}
        {/* Right Image */}
        
        <div className="flex justify-center">
          <Image
            src="/aboutIMG.jpg" // replace with your image path
            alt="Technology Illustration"
            width={400}
            height={300}
            className="rounded-lg object-contain"
          />
        </div>
        
        {/* Left Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About us</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            At PRO-CART, we believe shopping should be more than just a
            transaction — it should be an experience. Our mission is to bring
            you high-quality products at affordable prices while providing a
            smooth, reliable, and enjoyable online shopping journey.
          </p>
        </div>
      {/* </div> */}
      </BackgroundGradient>
      {/* Content Section 2*/}
      <BackgroundGradient className="rounded-[20px] p-0 sm:p-10 bg-white dark:bg-zinc-900 grid md:grid-cols-2">
        {/* Left Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            We’re a passionate team of innovators, creators, and problem-solvers
            committed to making online shopping easier, safer, and more
            personalized. From carefully curating our product collections to
            offering seamless delivery and customer support, we put you, the
            customer, at the heart of everything we do.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <Image
            src="/aboutIMG2.jpg" // replace with your image path
            alt="Technology Illustration"
            width={400}
            height={300}
            className="rounded-lg object-contain"
          />
        </div>
      </BackgroundGradient>
      <BackgroundGradient className="rounded-[20px] p-0 sm:p-10 bg-white dark:bg-zinc-900 grid md:grid-cols-2">
        {/* Right Image */}
        <div className="flex justify-center">
          <Image
            src="/headphone.jpg" // replace with your image path
            alt="Technology Illustration"
            width={400}
            height={300}
            className="rounded-lg object-contain"
          />
        </div>
        {/* Left Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>

            <ul className="text-gray-600 mb-4 leading-relaxed">
                <li><span className="font-bold">Wide Range of Products</span> - From fashion and lifestyle to electronics and home essentials, we’ve got it all</li>
                <li><span className="font-bold">Customer First Approach</span> - Fast delivery, hassle-free returns, and 24/7 support</li>
                <li><span className="font-bold">Secure Shopping</span> - Safe payment methods with full buyer protection.</li>
                <li><span className="font-bold">Sustainable Choices</span> - We're committed to reducing waste and</li>
            </ul>
        </div>
      </BackgroundGradient>
      </div>
    </div>
  );
};

export default AboutPage;
