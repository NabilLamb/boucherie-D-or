// components/PaymentModal.jsx
"use client";

import { useState, useEffect } from "react";
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
  const [step, setStep] = useState("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardBrand, setCardBrand] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    await new Promise((r) => setTimeout(r, 2200));
    setStep("success");
    await new Promise((r) => setTimeout(r, 1800));
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div
      className="top-14 fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:items-center sm:p-4 sm:pt-0"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal container – compact spacing */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Processing overlay */}
        {step === "processing" && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-gray-100 border-t-orange-500 animate-spin" />
            <p className="text-gray-600 font-medium">Processing...</p>
            <p className="text-xs text-gray-400">Please wait</p>
          </div>
        )}

        {/* Success overlay */}
        {step === "success" && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <FiCheck className="w-8 h-8 text-green-600 stroke-[3]" />
            </div>
            <p className="text-lg font-bold text-gray-900">Success!</p>
            <p className="text-xs text-gray-500">Placing order...</p>
          </div>
        )}

        {/* Header – compact */}
        <div className="sticky top-0 bg-white z-20 flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <FiLock className="w-3.5 h-3.5 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">Secure Checkout</span>
          </div>
          <button
            onClick={handleClose}
            disabled={step === "processing"}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Amount summary – compact */}
        <div className="mx-4 mt-3 mb-4 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 flex justify-between items-center">
          <span className="text-xs text-gray-600">Total to pay</span>
          <span className="text-lg font-bold text-orange-600">
            {currency}
            {amount.toFixed(2)}
          </span>
        </div>

        {/* Form – compact fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 space-y-3">
          {/* Card number */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
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
                className={`w-full px-3 py-2.5 pr-14 border rounded-lg outline-none transition-colors text-gray-900 text-sm tracking-widest ${
                  errors.cardNumber
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
              />
              <input
                type="hidden"
                {...register("cardNumber", {
                  validate: () =>
                    cardNumber.replace(/\s/g, "").length === 16 ||
                    "Must be 16 digits",
                })}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                {cardBrand ? (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: cardBrand.color }}
                  >
                    {cardBrand.name}
                  </span>
                ) : (
                  <FiCreditCard className="w-4 h-4 text-gray-300" />
                )}
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-[10px] mt-1">{errors.cardNumber.message}</p>
            )}
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Jean Dupont"
              className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors text-gray-900 text-sm ${
                errors.cardName
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-orange-400"
              }`}
              {...register("cardName", {
                required: "Required",
                minLength: { value: 3, message: "Too short" },
              })}
            />
            {errors.cardName && (
              <p className="text-red-500 text-[10px] mt-1">{errors.cardName.message}</p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Expiry
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                maxLength={5}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors text-gray-900 text-sm ${
                  errors.expiry
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
              />
              <input
                type="hidden"
                {...register("expiry", {
                  validate: () => {
                    const [mm, yy] = expiry.split("/");
                    const month = parseInt(mm);
                    const year = parseInt("20" + yy);
                    const now = new Date();
                    if (!mm || !yy || expiry.length < 5) return "Invalid";
                    if (month < 1 || month > 12) return "Invalid month";
                    if (
                      year < now.getFullYear() ||
                      (year === now.getFullYear() && month < now.getMonth() + 1)
                    )
                      return "Expired";
                    return true;
                  },
                })}
              />
              {errors.expiry && (
                <p className="text-red-500 text-[10px] mt-1">{errors.expiry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-colors text-gray-900 text-sm ${
                  errors.cvv
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-400"
                }`}
                {...register("cvv", {
                  required: "Required",
                  minLength: { value: 3, message: "Min 3 digits" },
                  pattern: { value: /^\d+$/, message: "Digits only" },
                })}
              />
              {errors.cvv && (
                <p className="text-red-500 text-[10px] mt-1">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          {/* Test card hint – compact */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-[10px] text-blue-700 leading-tight">
            <span className="font-semibold">💳 Demo:</span> Use{" "}
            <span className="font-mono font-bold">4242 4242 4242 4242</span>, any future date, any CVV.
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={step !== "form"}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <FiLock className="w-3.5 h-3.5" />
            Pay {currency}
            {amount.toFixed(2)}
          </button>

          <p className="text-center text-[10px] text-gray-400">
            Demo – no real payment
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;