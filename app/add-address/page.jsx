'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";

const AddAddress = () => {
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        postalCode: '',
        streetNumber: '',
        streetName: '',
        apartment: '',
        city: '',
        region: '',
    });

    const frenchRegions = [
        "Auvergne-Rhône-Alpes",
        "Bourgogne-Franche-Comté",
        "Bretagne",
        "Centre-Val de Loire",
        "Corse",
        "Grand Est",
        "Hauts-de-France",
        "Île-de-France",
        "Normandie",
        "Nouvelle-Aquitaine",
        "Occitanie",
        "Pays de la Loire",
        "Provence-Alpes-Côte d'Azur",
        "Guadeloupe",
        "Martinique",
        "Guyane",
        "La Réunion",
        "Mayotte"
    ];

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(address);
    };

    return (
        <>
            <Navbar />
            <div className="pt-20 px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full max-w-2xl">
                    <h1 className="text-2xl md:text-3xl text-gray-500 mb-8">
                        Add an <span className="font-semibold text-orange-600">address</span>
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">Full Name *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                required
                                placeholder="John Doe"
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                value={address.fullName}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">Phone Number *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="tel"
                                required
                                pattern="^(\+33|0)[1-9]\d{8}$"
                                placeholder="+33 6 12 34 56 78"
                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                value={address.phone}
                            />
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label className="block text-gray-700 mb-2">Postal Code *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                required
                                pattern="[0-9]{5}"
                                placeholder="75000"
                                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                value={address.postalCode}
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-gray-700 mb-2">City *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                required
                                placeholder="Paris"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                            />
                        </div>

                        {/* Street Number */}
                        <div>
                            <label className="block text-gray-700 mb-2">Street Number *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                required
                                placeholder="15B"
                                onChange={(e) => setAddress({ ...address, streetNumber: e.target.value })}
                                value={address.streetNumber}
                            />
                        </div>

                        {/* Street Name */}
                        <div>
                            <label className="block text-gray-700 mb-2">Street Name *</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                required
                                placeholder="Rue de la Paix"
                                onChange={(e) => setAddress({ ...address, streetName: e.target.value })}
                                value={address.streetName}
                            />
                        </div>

                        {/* Apartment */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">Apartment/Building</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                type="text"
                                placeholder="Apartment 12, Building C"
                                onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                                value={address.apartment}
                            />
                        </div>

                        {/* Region */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">Region *</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-orange-500 outline-none"
                                required
                                value={address.region}
                                onChange={(e) => setAddress({ ...address, region: e.target.value })}
                            >
                                <option value="">Select your region</option>
                                {frenchRegions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="mt-8 w-full bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase transition-colors"
                    >
                        Save Address
                    </button>
                </form>

                <div className="hidden md:block ml-16">
                    <Image
                        src={assets.my_location_image}
                        alt="Location map"
                        width={500}
                        height={500}
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;