import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import technicianRoutes from './routes/technicians.js'
import serviceRoutes from './routes/services.js'
import appointmentRoutes from './routes/appointments.js'
import patientRoutes from './routes/patients.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dent-admin'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/technicians', technicianRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patients', patientRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})
