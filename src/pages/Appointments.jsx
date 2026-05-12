import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import client from '../utils/client'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ patientId: '', technicianId: '', serviceId: '', appointmentDate: '', startTime: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [appRes, patRes, techRes, servRes] = await Promise.all([
        client.get('/appointments'),
        client.get('/patients'),
        client.get('/technicians'),
        client.get('/services')
      ])
      setAppointments(appRes.data)
      setPatients(patRes.data)
      setTechnicians(techRes.data)
      setServices(servRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (e) => {
    e.preventDefault()
    try {
      await client.post('/appointments', formData)
      fetchData()
      setShowForm(false)
      setFormData({ patientId: '', technicianId: '', serviceId: '', appointmentDate: '', startTime: '' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) {
      try {
        await client.delete(`/appointments/${id}`)
        fetchData()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const getPatientName = (id) => {
    const p = patients.find(pat => pat._id === id)
    return p ? `${p.firstName} ${p.lastName}` : ''
  }
  const getTechnicianName = (id) => technicians.find(t => t._id === id)?.name || ''
  const getServiceName = (id) => services.find(s => s._id === id)?.name || ''

  const filteredAppointments = appointments.filter(a =>
    getPatientName(a.patientId).toLowerCase().includes(search.toLowerCase()) &&
    (!status || a.status === status)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600">Schedule and manage appointments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> Schedule Appointment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Schedule New Appointment</h2>
          <form onSubmit={handleAddAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Patient *</label>
                <select value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Technician *</label>
                <select value={formData.technicianId} onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Select Technician</option>
                  {technicians.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Service *</label>
                <select value={formData.serviceId} onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Select Service</option>
                  {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date *</label>
                <input type="date" value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Time *</label>
                <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Schedule</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? <div className="text-center py-8 text-gray-500">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Patient</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Technician</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Service</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{getPatientName(apt.patientId)}</td>
                    <td className="px-4 py-3 text-gray-800">{getTechnicianName(apt.technicianId)}</td>
                    <td className="px-4 py-3 text-gray-800">{getServiceName(apt.serviceId)}</td>
                    <td className="px-4 py-3 text-gray-800">{new Date(apt.appointmentDate).toLocaleDateString()} @ {apt.startTime}</td>
                    <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'Completed' ? 'bg-green-100 text-green-800' : apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{apt.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => handleDelete(apt._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
