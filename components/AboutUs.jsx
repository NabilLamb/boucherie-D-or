// components/AboutUs.jsx

import Image from "next/image";
import { assets } from "@/assets/assets";

const AboutUs = () => {
  return (
    <div id="aboutUs" className="bg-gray-50">

      {/* Title */}
      <div className="text-center pt-12 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          About Us
        </h2>
        <div className="w-32 h-1.5 bg-amber-600 mx-auto rounded-full mt-3" />
      </div>

      {/* Hero */}
      <section className="relative h-[30vh] sm:h-[480px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10" />
        <Image
          src={assets.ShopFront}
          alt="The Boucherie D'or team in front of their shop"
          fill
          className="object-cover object-center brightness-90"
          priority
          sizes="100vw"
        />
      </section>

      {/* Gradient divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-8 opacity-40" />

      {/* Our Story */}
      <section className="px-6 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">

            {/* Image — hidden on mobile, visible on desktop */}
            <div className="hidden md:block relative h-[500px] overflow-hidden rounded-2xl shadow-2xl group bg-gray-100">
              <Image
                src={assets.FamilyButchers}
                alt="Boucherie D'or Team"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Text */}
            <div className="space-y-6 md:pl-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Since 2006
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  Our Story
                </h2>
                <div className="w-10 h-1 bg-amber-600 rounded-full mt-3" />
              </div>

              <p className="text-lg leading-relaxed text-gray-600">
                In 2006, Abdelmomin El Ahmar left everything he knew to follow
                one obsession — finding the perfect cut. What started as a small
                family counter in Provence has grown into one of the region&apos;s
                most trusted Halal butcheries, built entirely on word of mouth
                and an uncompromising standard that has never changed.
              </p>

              <p className="text-base leading-relaxed text-gray-500">
                Every morning we select. Every cut is deliberate. Every customer
                leaves knowing exactly what they brought home — and why it matters.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-600 rounded-r-xl px-6 py-5">
                <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                  &quot;I don&apos;t sell meat. I sell the result of everything
                  I&apos;ve learned — and everything I still care about.&quot;
                </blockquote>
                <p className="mt-3 text-sm font-semibold text-amber-700">
                  — Abdelmomin El Ahmar, Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Art of Butchery
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Honoring centuries-old traditions with modern precision
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: assets.ArtisanButchery,
                title: "Artisan Techniques",
                text: "Generational knowledge in every cut",
              },
              {
                image: assets.PremiumSelection,
                title: "Sustainable Sourcing",
                text: "Partnering with local ethical farms",
              },
              {
                image: assets.ExpertGuidance,
                title: "Culinary Partnership",
                text: "Tailored solutions for chefs & home cooks",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative h-64 sm:h-72 md:h-80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-200">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Meet Our Masters
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Certified experts dedicated to quality and service
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            {[
              {
                image: assets.abdel_meal,
                name: "Abdelmomin El Ahmar",
                role: "Founder & Master Butcher",
                experience: "15+ years expertise",
                certification: "MOF Certified",
              },
              {
                image: assets.annais_meal,
                name: "Anais Stephany",
                role: "Head Charcutier",
                experience: "Traditional Recipe Specialist",
                certification: "INBAC Certified",
              },
            ].map((butcher) => (
              <div
                key={butcher.name}
                className="bg-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={butcher.image}
                    alt={butcher.name}
                    fill
                    // Removed grayscale and group-hover:grayscale-0 — full color always
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 40vw, 30vw"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-white">
                    {butcher.name}
                  </h3>
                  <p className="text-amber-500 font-medium mt-2">{butcher.role}</p>
                  <div className="mt-4 space-y-1 text-sm text-gray-400">
                    <p>{butcher.experience}</p>
                    <p className="font-semibold text-amber-600">
                      {butcher.certification}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
