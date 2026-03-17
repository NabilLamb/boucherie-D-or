// components/PaymentModal.jsx

"use client";

import { useState } from "react";
import { FiX, FiLock, FiCreditCard, FiCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";

// Format card number with spaces every 4 digits
const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

// Format expiry as MM/YY
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
};

const CARD_BRANDS = {
  "4": { name: "Visa", color: "#1A1F71" },
  "5": { name: "Mastercard", color: "#EB001B" },
  "3": { name: "Amex", color: "#007BC1" },
};

const PaymentModal = ({ isOpen, onClose, amount, currency, onSuccess }) => {
  const [step, setStep] = useState("form"); // "form" | "processing" | "success"
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardBrand, setCardBrand] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleClose = () => {
    if (step === "processing") return; 
    reset();
    setCardNumber("");
    setExpiry("");
    setCardBrand(null);
    setStep("form");
    onClose();
  };

  const onSubmit = async (data) => {
    setStep("processing");

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2200));

    setStep("success");

    // Wait for success animation then trigger order creation
    await new Promise((r) => setTimeout(r, 1800));

    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Processing overlay */}
        {step === "processing" && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-orange-500 animate-spin" />
            <p className="text-gray-600 font-medium">Processing payment...</p>
            <p className="text-sm text-gray-400">Please do not close this window</p>
          </div>
        )}

        {/* Success overlay */}
        {step === "success" && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <FiCheck className="w-10 h-10 text-green-600 stroke-[3]" />
            </div>
            <p className="text-xl font-bold text-gray-900">Payment Successful!</p>
            <p className="text-gray-500 text-sm">Placing your order...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiLock className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-900">Secure Checkout</span>
          </div>
          <button
            onClick={handleClose}
            disabled={step === "processing"}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Amount summary */}
        <div className="mx-6 mt-4 mb-5 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total to pay</span>
          <span className="text-xl font-bold text-orange-600">
            {currency}{amount.toFixed(2)}
          </span>
        </div>

        {/* Card form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
          
          {/* Card number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Card Number
            </label>
            <div className="relative">
              {/* Visible controlled input */}
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                maxLength={19}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setCardNumber(formatted);
                  const firstDigit = formatted.replace(/\s/g, "")[0];
                  setCardBrand(CARD_BRANDS[firstDigit] || null);
                }}
                className={`w-full px-4 py-3 pr-16 border rounded-xl outline-none transition-colors text-gray-900 tracking-widest ${
                  errors.cardNumber
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
              />
              {/* Hidden input for React Hook Form validation */}
              <input
                type="hidden"
                {...register("cardNumber", {
                  validate: () =>
                    cardNumber.replace(/\s/g, "").length === 16 ||
                    "Card number must be 16 digits",
                })}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {cardBrand ? (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: cardBrand.color }}
                  >
                    {cardBrand.name}
                  </span>
                ) : (
                  <FiCreditCard className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Jean Dupont"
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors text-gray-900 ${
                errors.cardName
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-orange-400"
              }`}
              {...register("cardName", {
                required: "Cardholder name is required",
                minLength: { value: 3, message: "Name is too short" },
              })}
            />
            {errors.cardName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardName.message}</p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expiry Date
              </label>
              {/* Visible controlled input */}
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                maxLength={5}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors text-gray-900 ${
                  errors.expiry
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
              />
              {/* Hidden input for validation */}
              <input
                type="hidden"
                {...register("expiry", {
                  validate: () => {
                    const [mm, yy] = expiry.split("/");
                    const month = parseInt(mm);
                    const year = parseInt("20" + yy);
                    const now = new Date();
                    if (!mm || !yy || expiry.length < 5) return "Invalid date";
                    if (month < 1 || month > 12) return "Invalid month";
                    if (
                      year < now.getFullYear() ||
                      (year === now.getFullYear() &&
                        month < now.getMonth() + 1)
                    )
                      return "Card expired";
                    return true;
                  },
                })}
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1">{errors.expiry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CVV
              </label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors text-gray-900 ${
                  errors.cvv
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
                {...register("cvv", {
                  required: "CVV required",
                  minLength: { value: 3, message: "Min 3 digits" },
                  pattern: { value: /^\d+$/, message: "Digits only" },
                })}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          {/* Test card hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-600">
            <span className="font-semibold">Demo:</span> Use card{" "}
            <span className="font-mono font-semibold">4242 4242 4242 4242</span>,
            any future date, any CVV.
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <FiLock className="w-4 h-4" />
            Pay {currency}{amount.toFixed(2)}
          </button>

          <p className="text-center text-xs text-gray-400">
            This is a demo. No real payment is processed.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;