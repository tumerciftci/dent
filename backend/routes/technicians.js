import express from 'express'
import Technician from '../models/Technician.js'
import { auth, authorize } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all technicians
router.get('/', auth, async (req, res) => {
  try {
    const { status, specialty } = req.query
    let filter = {}
    
    if (status) filter.status = status
    if (specialty) filter.specialties = specialty

    const technicians = await Technician.find(filter).sort({ createdAt: -1 })
    res.json(technicians)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single technician
router.get('/:id', auth, async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' })
    }
    res.json(technician)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create technician
router.post('/', auth, authorize(['admin', 'manager']), [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const technician = new Technician(req.body)
    await technician.save()
    res.status(201).json(technician)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update technician
router.put('/:id', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' })
    }
    res.json(technician)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete technician
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id)
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' })
    }
    res.json({ message: 'Technician deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
