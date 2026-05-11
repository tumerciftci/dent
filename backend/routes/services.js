import express from 'express'
import Service from '../models/Service.js'
import { auth, authorize } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive } = req.query
    let filter = {}
    
    if (category) filter.category = category
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const services = await Service.find(filter).populate('assignedTechnicians')
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single service
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('assignedTechnicians')
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    res.json(service)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create service
router.post('/', auth, authorize(['admin', 'manager']), [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const service = new Service(req.body)
    await service.save()
    res.status(201).json(service)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update service
router.put('/:id', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    res.json(service)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete service
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }
    res.json({ message: 'Service deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
