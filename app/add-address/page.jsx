// app/add-address/page.jsx

"use client";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none transition-colors";
const labelClass = "block text-gray-700 mb-1 text-sm font-medium";
const errorClass = "text-red-500 text-xs mt-1";

const AddAddress = () => {
  const { getToken, router } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      postalCode: "",
      city: "",
      address: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        {
          address: {
            ...values,
            // Strip whitespace from phone before saving
            phone: values.phone.replace(/\s/g, ""),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between gap-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full max-w-2xl"
        >
          <h1 className="text-2xl md:text-3xl text-gray-500 mb-8">
            Add <span className="font-semibold text-orange-600">Address</span>
          </h1>

          <div className="grid grid-cols-1 gap-5">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                className={inputClass}
                type="text"
                placeholder="Jean Dupont"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name is too short" },
                })}
              />
              {errors.fullName && (
                <p className={errorClass}>{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                className={inputClass}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                {...register("phone", {
                  required: "Phone number is required",
                  validate: (value) => {
                    const clean = value.replace(/\s/g, "");
                    return (
                      /^(?:\+33|0)[1-9]\d{8}$/.test(clean) ||
                      "Invalid French phone number"
                    );
                  },
                })}
              />
              {errors.phone && (
                <p className={errorClass}>{errors.phone.message}</p>
              )}
            </div>

            {/* Postal Code + City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Postal Code *</label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="75000"
                  {...register("postalCode", {
                    required: "Postal code is required",
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "Invalid French postal code",
                    },
                  })}
                />
                {errors.postalCode && (
                  <p className={errorClass}>{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Paris"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && (
                  <p className={errorClass}>{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Address *</label>
              <input
                className={inputClass}
                type="text"
                placeholder="15B Rue de la Paix"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className={errorClass}>{errors.address.message}</p>
              )}
            </div>

            {/* Additional info */}
            <div>
              <label className={labelClass}>
                Additional Information{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                className={inputClass}
                type="text"
                placeholder="Apartment 12, Building C"
                {...register("additionalInfo")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </form>

        <div className="hidden md:flex items-center justify-center">
          <Image
            src={assets.my_location_image}
            alt="Location map"
            width={460}
            height={460}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;
