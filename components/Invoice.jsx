"use client";
import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { getImageSource } from "@/utils/images";

const COMPANY_INFO = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Boucherie D'or",
  logo: process.env.NEXT_PUBLIC_COMPANY_LOGO || "/logo.png",
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    "ZA Jonquier Morelle, Lavoisier Avenue, 84850 Camaret-sur-Aigues",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+33 4 90 62 49 06",
  email:
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contact@boucheriedor.com",
};

const Invoice = ({ order }) => {
  const componentRef = useRef();
  const printTriggerRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => {
      if (componentRef.current) {
        return componentRef.current;
      } else {
        console.error("Print content not found");
        return null; // Or handle the error as needed
      }
    },
    onBeforeGetContent: () => {
        if (!componentRef.current) {
            console.error("Print content not found");
            return Promise.reject();
          }
          return Promise.resolve();
    },
    removeAfterPrint: true,
  });

  // Ensure focus stays on trigger element
  useEffect(() => {
    if (printTriggerRef.current) {
      printTriggerRef.current.focus();
    }
  }, []);

  return (
    <div className="p-6">
      <div ref={componentRef} className="print-content">
        {order ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <div className="relative w-40 h-40">
                  <Image
                    src={getImageSource(COMPANY_INFO.logo)}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {COMPANY_INFO.address}
                </p>
              </div>
              
              <div className="text-right">
                <h1 className="text-3xl font-bold">Invoice</h1>
                <p className="mt-2 text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-gray-600">
                  Invoice #: {order._id.toString().slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Company and Customer Info */}
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold">{COMPANY_INFO.name}</h2>
                <p className="text-gray-600">{COMPANY_INFO.phone}</p>
                <p className="text-gray-600">{COMPANY_INFO.email}</p>
              </div>
              
              <div className="text-right">
                <h3 className="text-lg font-semibold">Billed To</h3>
                <p className="text-gray-600">{order.address.fullName}</p>
                <p className="text-gray-600">{order.address.address}</p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.postalCode}
                </p>
                <p className="text-gray-600">{order.address.phone}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => {
                  const price = item.productSnapshot?.offerPrice || 
                              item.productSnapshot?.price || 0;
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">
                        {item.productSnapshot?.name || "Product Name"}
                        <p className="text-sm text-gray-500">
                          {item.productSnapshot?.category}
                        </p>
                      </td>
                      <td className="text-right py-3 px-4">
                        {order.currency}
                        {price.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4">{item.quantity}</td>
                      <td className="text-right py-3 px-4">
                        {order.currency}
                        {(price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="ml-auto w-64">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Subtotal:</span>
                <span>
                  {order.currency}
                  {order.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Shipping:</span>
                <span>{order.currency}0.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Grand Total:</span>
                <span className="font-semibold">
                  {order.currency}
                  {order.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              <p>{COMPANY_INFO.name} - Thank you for your business!</p>
              <p>If you have any questions, contact us at {COMPANY_INFO.email}</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 p-8">
            Loading invoice data...
          </div>
        )}
      </div>

      {order && (
        <button
          ref={printTriggerRef}
          onClick={() => handlePrint()} 
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 print:hidden"
        >
          Print Invoice
        </button>
      )}
    </div>
  );
};

Invoice.displayName = "Invoice";

export default Invoice;