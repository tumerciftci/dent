import React from 'react'
import { Bell, Lock, Palette, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your admin panel settings</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-gray-700">Email notifications for new appointments</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-gray-700">SMS reminders for technicians</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-gray-700">Daily summary reports</span>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Change Password</button>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Enable Two-Factor Authentication</button>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700"><strong>Last Login:</strong> Today at 2:45 PM</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Clinic Name</label>
              <input type="text" defaultValue="Dental Clinic" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Clinic Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Clinic Address</label>
              <input type="text" defaultValue="123 Dental Street, City, State" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
