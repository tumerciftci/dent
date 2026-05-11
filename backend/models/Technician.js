import mongoose from 'mongoose'

const technicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  specialties: [{
    type: String,
    enum: ['Crown & Bridge', 'Dentures', 'Implants', 'Orthodontics', 'Pediatric', 'Other']
  }],
  experience: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  qualifications: [String],
  joinDate: {
    type: Date,
    default: Date.now
  },
  salary: Number,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  licenseNumber: String,
  licenseExpiry: Date,
  photo: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Technician', technicianSchema)
