import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import TechniciansPage from './pages/Technicians'
import ServicesPage from './pages/Services'
import AppointmentsPage from './pages/Appointments'
import PatientsPage from './pages/Patients'
import SettingsPage from './pages/Settings'
import './index.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/technicians" element={<TechniciansPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}
