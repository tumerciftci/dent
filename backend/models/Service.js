import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Crown & Bridge', 'Dentures', 'Implants', 'Orthodontics', 'Repair', 'Other'],
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedTechnicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
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

export default mongoose.model('Service', serviceSchema)
