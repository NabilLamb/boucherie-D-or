'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useFormik } from 'formik';
import { addressSchema } from '@/utils/addressSchema';
import { formStyles } from '@/utils/formPatterns';
import axios from "axios";
import { toast } from "react-hot-toast";

const AddAddress = () => {
    const { getToken, router } = useAppContext();

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phone: '',
            postalCode: '',
            city: '',
            address: '',
            additionalInfo: '',
        },
        validationSchema: addressSchema,
        onSubmit: async (values) => {
            try {
                const token = await getToken();
                const formattedValues = {
                    ...values,
                    phone: values.phone.replace(/\s/g, '')
                };

                const { data } = await axios.post('/api/user/add-address', 
                    { address: formattedValues },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (data.success) {
                    toast.success(data.message);
                    router.push('/cart');
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    });

    const formatPhoneNumber = (value) => {
        // Allow backspace deletion
        if (value === '') return '';
        
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;
        
        if (numbers.startsWith('33')) {
            formatted = `+${numbers.slice(0, 2)} ${numbers.slice(2)}`
                .replace(/(\+\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
                .slice(0, 17);
        } else if (numbers.startsWith('0')) {
            formatted = numbers
                .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
                .slice(0, 14);
        } else if (numbers.startsWith('+')) {
            formatted = numbers
                .replace(/(\+\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
                .slice(0, 17);
        }
        
        return formatted.trim();
    };

    return (
        <>
            <Navbar />
            <div className="pt-20 px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl">
                    <h1 className="text-2xl md:text-3xl text-gray-500 mb-8">
                        Add <span className="font-semibold text-orange-600">Address</span>
                    </h1>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {/* Full Name */}
                        <div>
                            <label className={formStyles.label}>Full Name *</label>
                            <input
                                className={formStyles.input}
                                type="text"
                                name="fullName"
                                placeholder="Jean Dupont"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.fullName}
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={formStyles.label}>Phone Number *</label>
                            <input
                                className={formStyles.input}
                                type="tel"
                                name="phone"
                                placeholder="+33 6 12 34 56 78"
                                value={formik.values.phone}
                                onChange={(e) => {
                                    const formatted = formatPhoneNumber(e.target.value);
                                    formik.setFieldValue('phone', formatted);
                                }}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
                            )}
                        </div>

                        {/* Postal Code & City */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={formStyles.label}>Postal Code *</label>
                                <input
                                    className={formStyles.input}
                                    type="text"
                                    name="postalCode"
                                    placeholder="75000"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.postalCode}
                                />
                                {formik.touched.postalCode && formik.errors.postalCode && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.postalCode}</div>
                                )}
                            </div>

                            <div>
                                <label className={formStyles.label}>City *</label>
                                <input
                                    className={formStyles.input}
                                    type="text"
                                    name="city"
                                    placeholder="Paris"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.city}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className={formStyles.label}>Address *</label>
                            <input
                                className={formStyles.input}
                                type="text"
                                name="address"
                                placeholder="15B Rue de la Paix"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div>
                            <label className={formStyles.label}>
                                Additional Information
                                <span className="text-gray-400 ml-1">(optional)</span>
                            </label>
                            <input
                                className={formStyles.input}
                                type="text"
                                name="additionalInfo"
                                placeholder="Apartment 12, Building C"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.additionalInfo}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={formStyles.button}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Saving...' : 'Save Address'}
                    </button>
                </form>

                <div className="hidden md:block ml-16">
                    <Image
                        src={assets.my_location_image}
                        alt="Location map"
                        width={500}
                        height={500}
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