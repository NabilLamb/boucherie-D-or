import * as yup from 'yup';

export const addressSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  phone: yup.string()
    .required('Phone number is required')
    .test('phone', 'Invalid French phone number', value => {
      const cleanValue = value.replace(/\s/g, '');
      return /^(?:\+33|0)[1-9]\d{8}$/.test(cleanValue);
    }),
  postalCode: yup.string()
    .required('Postal code is required')
    .matches(/^[0-9]{5}$/, 'Invalid French postal code'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  additionalInfo: yup.string()
});