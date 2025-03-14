import Image from "next/image";
import { assets } from "@/assets/assets";

const AboutUs = () => {
  return (
    <div id="aboutUs" className="min-h-screen bg-gray-50">
      {/* Title Section */}
      <div className="text-center py-16 space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          About Us
        </h2>
        <div className="w-32 h-1.5 bg-orange-600 rounded-full mx-auto animate-fade-in" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        <Image
          src={assets.ShopFront}
          alt="Boucherie D'or Storefront"
          fill
          className="object-cover opacity-90 brightness-75 contrast-125"
          priority
          sizes="(max-width: 768px) 100vw, 75vw"
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl tracking-tight drop-shadow-2xl animate-fade-in-up">
              Boucherie D'or
            </h1>
            <p className="text-xl md:text-2xl font-medium text-orange-200 drop-shadow-lg mt-4">
              Crafting Meat Excellence Since 2006
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
              <Image
                src={assets.FamilyButchers}
                alt="Boucherie D'or Team"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <div className="space-y-6 md:pl-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Heritage
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">
                Established in 2006 by Master Butcher Abdelmomin El Ahmar, 
                Boucherie D'or has redefined quality meat craftsmanship in 
                Provence-Alpes-Côte d'Azur. We maintain an uncompromising 
                commitment to traditional methods while innovating for 
                modern palates.
              </p>
              <div className="space-y-4 border-l-4 border-orange-600 pl-6">
                <blockquote className="text-xl italic text-gray-700">
                  "True quality is in the details - from pasture to plate."
                </blockquote>
                <p className="font-medium text-gray-900">- Abdelmomin El Ahmar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
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
            ].map((item, index) => (
              <div 
                key={item.title}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative h-80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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

      {/* Our Butchers */}
      <section className="py-16 bg-red-50">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Masters
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Certified experts dedicated to quality and service
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 justify-center">
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
                className="bg-white rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={butcher.image}
                    alt={butcher.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {butcher.name}
                  </h3>
                  <p className="text-red-700 font-medium mt-2">{butcher.role}</p>
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p>{butcher.experience}</p>
                    <p className="font-semibold text-orange-600">
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