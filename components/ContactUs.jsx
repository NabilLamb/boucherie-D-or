import Image from "next/image";
import { useForm } from "react-hook-form";
import { assets } from "@/assets/assets";

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <section id="contactUs" className="relative bg-white">
      {/* Title Section */}
      <div className="text-center py-16 space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          Contact Us
        </h2>
        <div className="w-32 h-1.5 bg-orange-600 rounded-full mx-auto animate-fade-in" />
      </div>
      {/* Hero Header */}
      <div className="relative h-96 bg-gray-900">
        <Image
          src={assets.ContactHero}
          alt="Contact us background"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl drop-shadow-2xl">
              Let's Connect
            </h1>
            <p className="mt-4 text-xl text-gray-200 md:text-2xl">
              We're ready to serve you better
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Contact Form */}
          <div className="lg:py-8">
            <div className="relative rounded-2xl bg-gray-50 px-6 py-12 shadow-2xl sm:px-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Send Your Message
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-10 space-y-8"
                noValidate
              >
                <div className="space-y-10">
                  <div className="relative">
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      id="name"
                      autoComplete="name"
                      className="peer block w-full rounded-lg border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-red-600"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="pointer-events-none absolute left-12 top-3 origin-[0] -translate-y-8 scale-90 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90"
                    >
                      Full Name
                    </label>
                    <span className="absolute left-4 top-4 text-gray-400">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                      </svg>
                    </span>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$i/,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      id="email"
                      autoComplete="email"
                      className="peer block w-full rounded-lg border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-red-600"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="pointer-events-none absolute left-12 top-3 origin-[0] -translate-y-8 scale-90 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90"
                    >
                      Email Address
                    </label>
                    <span className="absolute left-4 top-4 text-gray-400">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                      </svg>
                    </span>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                      })}
                      id="message"
                      rows={8}
                      className="peer block w-full rounded-lg border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-red-600"
                      placeholder=" "
                    />
                    <label
                      htmlFor="message"
                      className="pointer-events-none absolute left-12 top-3 origin-[0] -translate-y-8 scale-90 transform text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-90"
                    >
                      Your Message
                    </label>
                    <span className="absolute left-4 top-4 text-gray-400">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                      </svg>
                    </span>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-red-800 hover:shadow-xl disabled:opacity-50"
                >
                  <svg
                    className="h-6 w-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="flex flex-col justify-between lg:py-8">
            <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white p-12 shadow-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Visit Our Store
              </h2>
              <div className="mt-8 space-y-8">
                {/* Address Card */}
                <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start space-x-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white">
                      <svg
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Our Address
                      </h3>
                      <p className="mt-2 text-gray-600">ZA Jonquier Morelle</p>
                      <p className="text-gray-600">Lavoisier Avenue</p>
                      <p className="text-gray-600">84850 Camaret-sur-Aigues</p>
                    </div>
                  </div>
                </div>

                {/* Contact Cards */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white">
                        <svg
                          className="h-8 w-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Call Us
                        </h3>
                        <p className="mt-2 text-gray-600">+33 4 90 62 49 06</p>
                        <p className="mt-2 text-sm text-gray-500">
                          Mon-Sat: 8AM - 7PM
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white">
                        <svg
                          className="h-8 w-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Email Us
                        </h3>
                        <p className="mt-2 text-gray-600">
                          contact@boucheriedor.fr
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          24h Response Time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-xl shadow-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92423.55032243805!2d4.8607425!3d44.1607017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b599ffd3ed3369%3A0x4a976d91d4b4323c!2sBoucherie%20D&#39;or!5e0!3m2!1sen!2sfr!4v1718877416915!5m2!1sen!2sfr"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
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
