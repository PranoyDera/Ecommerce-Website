"use client";

import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          Understanding Our
        </p>
        <h1 className="text-4xl md:text-6xl font-bold">Terms and Conditions</h1>
      </div>

      {/* Intro */}
      <p className="text-lg font-medium mb-6">
        In using this website you are deemed to have read and agreed to the
        following terms and conditions:
      </p>

      {/* Description */}
      <p className="mb-8 text-gray-600 leading-relaxed">
        The following terminology applies to these Terms and Conditions, Privacy
        Statement and Disclaimer Notice and any or all Agreements: “customer”,
        “You” and “Your” refers to you, the person accessing this website and
        accepting the Company's terms and conditions. “The Company”, “Ourselves”,
        “We” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”,
        refers to both the customer and ourselves, or either the customer or
        ourselves. All terms refer to the offer, acceptance and consideration of
        payment necessary to undertake the process of our assistance to the
        customer in the most appropriate manner, whether by formal meetings of a
        fixed duration, or any other means, for the express purpose of meeting
        the customer's needs in respect of provision of the Company's stated
        services/products, in accordance with and subject to, prevailing English
        Law. Any use of the above terminology or other words in the singular,
        plural, capitalization and/or he/she or they, are taken as
        interchangeable and therefore as referring to same.
      </p>

      {/* Section 1 */}
      <h2 className="text-2xl font-semibold mb-4">Order Shipments (store)</h2>
      <p className="mb-6 text-gray-600 leading-relaxed">
        All standard orders will be shipped within three days of a purchase. If
        a product is back-ordered it will take additional time for delivery.
        Customers will be notified via email of the estimated delivery date.
      </p>

      {/* Section 2 */}
      <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
      <p className="mb-6 text-gray-600 leading-relaxed">
        We are committed to protecting your privacy. Authorized employees within
        the company, on a need-to-know basis only, use information collected
        from individual customers. We constantly review our systems and data to
        ensure the best possible service to our customers.
      </p>

      {/* Section 3 */}
      <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
      <p className="mb-6 text-gray-600 leading-relaxed">
        The information on this website is provided “as is”. To the fullest
        extent permitted by law, this Company excludes all representations and
        warranties relating to this website and its contents or which is or may
        be provided by any affiliates or any other third party.
      </p>

      {/* Footer */}
      <div className="mt-12 text-sm text-gray-500 text-center">
        <p>
          © {new Date().getFullYear()} Pro Cart. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
