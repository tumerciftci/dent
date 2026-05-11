import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: String,
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  insuranceProvider: String,
  insuranceId: String,
  emergencyContact: String,
  emergencyPhone: String,
  medicalHistory: String,
  allergies: [String],
  photo: String,
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastAppointment: Date,
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Patient', patientSchema)
