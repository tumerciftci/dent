import express from 'express'
import Appointment from '../models/Appointment.js'
import { auth, authorize } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all appointments
router.get('/', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query
    let filter = {}
    
    if (status) filter.status = status
    if (startDate || endDate) {
      filter.appointmentDate = {}
      if (startDate) filter.appointmentDate.$gte = new Date(startDate)
      if (endDate) filter.appointmentDate.$lte = new Date(endDate)
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId')
      .populate('technicianId')
      .populate('serviceId')
      .sort({ appointmentDate: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('technicianId')
      .populate('serviceId')
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create appointment
router.post('/', auth, authorize(['admin', 'manager', 'staff']), [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('technicianId').notEmpty().withMessage('Technician ID is required'),
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('appointmentDate').notEmpty().withMessage('Appointment date is required'),
  body('startTime').notEmpty().withMessage('Start time is required')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const appointment = new Appointment(req.body)
    await appointment.save()
    await appointment.populate('patientId technicianId serviceId')
    res.status(201).json(appointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update appointment
router.put('/:id', auth, authorize(['admin', 'manager', 'staff']), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('patientId technicianId serviceId')
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete appointment
router.delete('/:id', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }
    res.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
