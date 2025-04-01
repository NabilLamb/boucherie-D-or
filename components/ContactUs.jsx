import Image from "next/image";
import { useForm } from "react-hook-form";
import { assets } from "@/assets/assets";
import { useState } from "react";
import axios from "axios";

const ContactSection = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/email/send", data);
      if (response.data.success) {
        setSuccessMessage("Message sent successfully!");
        setErrorMessage("");
        reset();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to send message");
      setSuccessMessage("");
    }
  };

  return (
    <section id="contactUs" className="relative bg-white mt-10">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Us
        </h2>
        <div className="w-32 h-1.5 bg-amber-600 mx-auto rounded-full mt-4" />
      </div>

      {/* Hero Header */}
      <div className="relative h-64 sm:h-96 bg-gray-900">
        <Image
          src={assets.ContactHero}
          alt="Contact us background"
          fill
          className="object-cover opacity-90"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/50">
          <div className="text-center px-4">
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl drop-shadow-2xl">
              Let's Connect
            </h1>
            <p className="mt-3 text-lg text-gray-200 sm:text-xl md:text-2xl">
              We're ready to serve you better
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:pr-8 xl:pr-12">
            <div className="relative rounded-2xl bg-gray-50 p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Send Your Message
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
                noValidate
              >
                <div className="space-y-6">
                  {/* Name Input */}
                  <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-red-700">
                      <span className="text-gray-400 ml-3">
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                        </svg>
                      </span>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        id="name"
                        className="block w-full py-3 px-4 bg-transparent outline-none placeholder-gray-400"
                        placeholder="Full Name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-red-700">
                      <span className="text-gray-400 ml-3">
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                        </svg>
                      </span>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        id="email"
                        className="block w-full py-3 px-4 bg-transparent outline-none placeholder-gray-400"
                        placeholder="Email Address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div className="relative">
                    <div className="flex items-start border-b-2 border-gray-200 focus-within:border-red-700">
                      <span className="text-gray-400 mt-3 ml-3">
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                        </svg>
                      </span>
                      <textarea
                        {...register("message", {
                          required: "Message is required",
                        })}
                        id="message"
                        rows={4}
                        className="block w-full py-3 px-4 bg-transparent outline-none placeholder-gray-400 resize-none"
                        placeholder="Your Message"
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {successMessage && (
                  <div className="p-3 text-green-800 bg-green-50 rounded-lg border border-green-200">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-3 text-red-800 bg-red-50 rounded-lg border border-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:pl-8 xl:pl-12">
            <div className="space-y-8">
              {/* Address Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Visit Our Store
                </h2>
                
                <div className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-red-700 p-4 rounded-lg">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Our Address
                      </h3>
                      <div className="mt-2 text-gray-600 space-y-1">
                        {process.env.NEXT_PUBLIC_COMPANY_ADDRESS?.split(",").map(
                          (line, index) => (
                            <p key={index} className="break-words">
                              {line.trim()}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid gap-6 mt-8 sm:grid-cols-2">
                  {/* Phone Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-red-700 p-3 rounded-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Call Us
                        </h3>
                        <p className="mt-1 text-gray-600">
                          {process.env.NEXT_PUBLIC_COMPANY_PHONE}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Mon-Sat: 8AM - 7PM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-red-700 p-3 rounded-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Email Us
                        </h3>
                        <p className="mt-1 text-gray-600 break-all">
                          {process.env.NEXT_PUBLIC_COMPANY_EMAIL}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          24h Response Time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-8 rounded-xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92423.55032243805!2d4.8607425!3d44.1607017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b599ffd3ed3369%3A0x4a976d91d4b4323c!2sBoucherie%20D&#39;or!5e0!3m2!1sen!2sfr!4v1718877416915!5m2!1sen!2sfr"
                    width="100%"
                    height="300"
                    className="border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="bg-gray-50 p-4 text-center">
                    <p className="text-sm text-gray-600">
                      Can't see the map?{" "}
                      <a
                        href="https://www.google.com/maps/place/Boucherie+D'or/@44.1606125,4.8606095,110m/data=!3m1!1e3!4m14!1m7!3m6!1s0x12b599ffd3ed3369:0x4a976d91d4b4323c!2sBoucherie+D'or!8m2!3d44.1607017!4d4.8607425!16s%2Fg%2F11ghpp6xkv!3m5!1s0x12b599ffd3ed3369:0x4a976d91d4b4323c!8m2!3d44.1607017!4d4.8607425!16s%2Fg%2F11ghpp6xkv?entry=ttu&g_ep=EgoyMDI1MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 hover:text-red-800 font-medium"
                      >
                        Open in Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;