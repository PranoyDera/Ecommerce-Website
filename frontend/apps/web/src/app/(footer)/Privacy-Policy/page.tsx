"use client";

import React from "react";
import { Building2 } from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      description:
        "PRO-CART is a ecommerce platform to made shopping easy.This platform is designed for buying and selling of products in a efficient way.",
      color: "text-blue-500",
    },
    {
      title: "Information We Collect",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Personal Information:</span> Name,
            email address, phone number, and other contact details.
          </li>
          <li>
            <span className="font-medium">Non-Personal Information:</span> IP
            address Browser type and version Device information Cookies and
            usage data
          </li>
        </ul>
      ),
      color: "text-purple-500",
    },
    {
      title: "How We Use Your Information",
      description: (
        <ul className="list-disc">
          <span className="font-semibold">
            We use the collected information to:
          </span>
          <li>Process and fulfill your orders</li>
          <li>Provide customer support</li>
          <li>Send you order updates, invoices, and receipts</li>
          <li>Personalize your shopping experience</li>
          <li>Improve our website, services, and products</li>
          <li>
            Send promotional offers, newsletters, and updates (with your
            consent)
          </li>
        </ul>
      ),
      color: "text-green-500",
    },
    {
      title: "Your Rights",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Depending on your location, you may have the right to:</span> 
            Access, correct, or delete your personal information
          </li>
          <li>
            Opt-out of marketing communications
          </li>
          <li>
            Request data portability
          </li>
          <li>
            Restrict or object to certain data processing
          </li>
        </ul>
      ),
      color: "text-pink-500",
    },
    {
      title: "Data Security",
      description:
        "We implement industry-standard measures (encryption, firewalls, secure servers) to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
      color: "text-orange-500",
    },
    {
      title: "How We Share Your Information",
      description: (
        <ul className="list-disc pl-5 space-y-2">
          <span className="font-medium">
            We do not sell your personal information. However, we may share your
            information with::
          </span>{" "}
          Name,
          <li>
            Service Providers (e.g., payment gateways, shipping companies, IT
            support)
          </li>
          <li>Business Partners (for promotions, with your consent)</li>
          <li>
            Legal Authorities (when required by law, to prevent fraud, or
            protect our rights)
          </li>
        </ul>
      ),
      color: "text-teal-500",
    },
  ];

  return (
    <div className="w-[95%] mx-auto px-6 py-12 bg-[url('/privacyBG.jpg')] object-cover my-4 rounded-3xl">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-12 text-white/80">
        Privacy Policy
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/10 text-white/80 rounded-2xl shadow p-6 "
          >
            <div className="flex items-center gap-3 mb-4">
              <Building2 className={`w-8 h-8 ${section.color}`} />
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <div className="text-white/80 leading-relaxed">
              {section.description}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto mt-4 text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white/80 mb-4">
          Want to know more about it?
        </h2>

        {/* Description */}
        <p className="text-white/80 mb-6">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen.
        </p>

        {/* Button */}
        <Link href="/Contacts">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/80 transition cursor-pointer">
            Contact us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
