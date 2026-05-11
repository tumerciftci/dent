import express from 'express'
import Patient from '../models/Patient.js'
import { auth, authorize } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all patients
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query
    let filter = {}
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single patient
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('appointments')
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create patient
router.post('/', auth, authorize(['admin', 'manager', 'staff']), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').notEmpty().withMessage('Phone is required')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const patient = new Patient(req.body)
    await patient.save()
    res.status(201).json(patient)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update patient
router.put('/:id', auth, authorize(['admin', 'manager', 'staff']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json(patient)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete patient
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
