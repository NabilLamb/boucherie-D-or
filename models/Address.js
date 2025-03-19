import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^(\+33|0)[1-9](\d{2}){4}$/.test(v);
      },
      message: props => `${props.value} is not a valid French phone number!`
    }
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    validate: {
      validator: function(v) {
        return /^[0-9]{5}$/.test(v);
      },
      message: props => `${props.value} is not a valid French postal code!`
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  additionalInfo: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// In your address model file
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;